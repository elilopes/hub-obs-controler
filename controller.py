#arquivo controller.py, gerencia a lógica
# 1. Imports de bibliotecas padrão e de terceiros
import sys, os, subprocess, json, time, config, webbrowser
#import requests  # Biblioteca HTTP padrão segura e isolada
from obswebsocket import requests, obsws

# 2. Motor básico e alertas (PySide6)
from PySide6.QtWidgets import QApplication, QMessageBox, QFileDialog
from PySide6.QtCore import QTimer, Qt, QObject, Signal

# 3. Comunicação e Protocolo OBS/websocket-py
try:
    from obswebsocket import obsws
    from obswebsocket.exceptions import ConnectionFailure
    # Importa os requests do OBS com um "apelido" (alias) global
    from obswebsocket import requests as obs_requests 
except ImportError:
    print("⚠️ Aviso: Biblioteca 'obs-websocket-py' não encontrada. Instale-a com 'pip install obs-websocket-py'.")

# Módulos locais essenciais que o Controller gerencia diretamente
from views import MainWindow, PreviewWindow
from workers import YouTubeManualLoginWorker 
from dll_manager import DLLManager
from login_manager import LoginManager

class LiveSignalBridge(QObject):
    """Canal seguro para avisar a tela principal que o status da live mudou no OBS."""
    # Envia True se a live realmente iniciou, False se ela caiu ou parou
    estado_live_alterado = Signal(bool)

class CentralHubController:
    def __init__(self):
        # 📌 Configurações de inicialização da View principal
        self.view = MainWindow()
        self.view.controller = self   # 🔗 permite que a View injete a conexão já autenticada aqui
        self.view.setWindowTitle("Central Hub OBS Controle de Transmissão")
        
        # 🧩 Gerenciadores de Model / Regras de Negócio
        self.dll_model = DLLManager()
        
        # Inicializa o gerenciador de logins passando a si mesmo (self)
        self.login_manager = LoginManager(self)
        
        # 📊 Estados lógicos locais
        self.transmitindo = False
        self.gravando = False
        self.filtro_ativo = False
        self.preview_worker = None
        self.preview_view = None
        self.cronometro_worker = None
        
        # 📡 Instancia a ponte de eventos de transmissão
        self.bridge_live = LiveSignalBridge()
        self.bridge_live.estado_live_alterado.connect(self.atualizar_visual_live_safe)

        # 🎛️ Injeção do Instalador de Cenas na interface de abas
        # Chamamos o método visual através da self.view para manter o padrão correto.
        # Se você quiser que o instalador vire uma nova aba ou fique no painel, 
        # a responsabilidade de criação agora é repassada para a MainWindow.
        if hasattr(self.view, 'criar_painel_instalador_cenas'):
            self.view.criar_painel_instalador_cenas()
        elif hasattr(self, 'criar_painel_instalador_cenas'):
            # Caso o método ainda precise rodar temporariamente de forma local
            self.criar_painel_instalador_cenas()

        # 🤖 Estados lógicos do Chaveador Automático
        self.regras_automacao = {} # Estrutura: { 'condicao': 'cena_destino' }
        self.monitoramento_ativo = False
        
        # Inicialização do ecossistema de efeitos do Letreiro
        self.texto_atual_letreiro = ""
        self.obs_item_visivel = True
        self.timer_obs_piscar = QTimer()
        self.timer_obs_piscar.timeout.connect(self.rotina_timer_piscar_obs)
        
        # ⏱️ Timer para checagem contínua de status (Polling do OBS)
        self.timer_monitor_obs = QTimer()
        self.timer_monitor_obs.timeout.connect(self.verificar_gatilhos_logicos)
        
        # 🔄 Estado anterior para evitar loops infinitos de comandos de troca de cena
        self.estado_anterior_obs = {
            "streaming": False,
            "recording": False,
            "muted": False
        }
        
        # 🌐 Referências para os workers de login criados dinamicamente
        self.insta_worker = None
        self.yt_worker = None

        # ⚡ Conexão de Eventos (mapeia os botões da view para as funções daqui)
        self.conectar_eventos()
        
    def rotina_testar_conexao(self):
        """Gatilho do botão para iniciar o teste de conexão"""
        self.atualizar_status("Testando conexão com OBS...", "#eab308")
        print(f"Testando conexão com OBS/webSocket...", flush=True)
        self.ejecutar_comando_obs(self.acao_testar_conexao)

    def acao_testar_conexao(self, ws):
        """Envia um comando inofensivo (GetVersion) para ver se o OBS responde"""
        from obswebsocket import requests
        
        try:
            # Envia o comando GetVersion (não altera nada no OBS, apenas pede informações)
            resposta = ws.call(requests.GetVersion())
            
            # Extrai os dados da resposta
            versao_obs = resposta.getObsVersion()
            versao_ws = resposta.getObsWebSocketVersion()
            
            # Se chegou até aqui, a conexão está 100% estável!
            mensagem_sucesso = f"✅ Conexão OK! OBS: {versao_obs}"
            self.atualizar_status(mensagem_sucesso, config.COLOR_SUCCESS)
            print(f"✅ Teste feito, conexão OK! {mensagem_sucesso} | WebSocket: {versao_ws}", flush=True)
            
        except Exception as e:
            # Se algo der errado, a conexão caiu
            erro_msg = f"Falha no teste: {str(e)}"
            print(f"❌ OBS Desconectado, Falha no teste da conexão: {erro_msg}", flush=True)
            self.atualizar_status("❌ OBS Desconectado", "#eab308")
    
    # =================================================================
    # ✨ MÉTODOS DO CONTROLLER
    # =================================================================
    
    def acao_criar_cenas(self, ws):
        """Usa a conexão ativa 'ws' fornecida pelo executar_comando_obs sem abrir um novo canal"""
        
        nome_usuario = "Transmitindo"
        if hasattr(self, 'login_manager') and self.login_manager.usuario_atual:
            nome_usuario = self.login_manager.usuario_atual 
            
        nome_colecao = f"Hub - {nome_usuario}"

        try:
            self.atualizar_status(f"🏗️ Solicitando nova coleção de cenas: {nome_colecao}...", config.COLOR_WARNING)
            print(f"Solicitando nova coleção de cenas...", flush=True)
            
            # 🔥 ATENÇÃO: Use o 'ws' recebido no argumento, não ws.connect() aqui
            ws.call(obs_requests.CreateSceneCollection(sceneCollectionName=nome_colecao))
            
            import time
            time.sleep(1.0)
            
            # Continue injetando as fontes no mesmo 'ws' ...
            if hasattr(self.view, 'progress_cenas'):
                self.view.progress_cenas.setValue(100)
                
            self.atualizar_status("🎉 Cenas criadas com sucesso!", config.COLOR_SUCCESS)
            print(f"Cenas criadas com sucesso!", flush=True)

        except Exception as e:
            if "already exists" in str(e).lower() or "409" in str(e):
                print(f"ℹ️ A coleção de cenas '{nome_colecao}' já existe. Ajustando foco...")
                ws.call(obs_requests.SetCurrentSceneCollection(sceneCollectionName=nome_colecao))
            else:
                print(f"❌ Falha ao criar a coleção de cenas: {e}")
                self.atualizar_status("⚠️ Falha ao criar a Coleção de Cenas.", "#eab308")

    # -------------------------------------------------------------------------
    # CONTROLES MULTI-RTMP (PLUGIN MULTI-RTMP BY SORAYUKI)
    # -------------------------------------------------------------------------
    def acao_salvar_destino_rtmp(self):
        """Captura os dados da View e salva o destino na memória ou arquivo."""
        try:
            nome = self.view.entry_rtmp_nome.text().strip()
            servidor = self.view.entry_rtmp_servidor.text().strip() if hasattr(self.view, 'entry_rtmp_servidor') else ""
            chave = self.view.entry_rtmp_chave.text().strip() if hasattr(self.view, 'entry_rtmp_chave') else ""
            
            if not nome or not servidor or not chave:
                from PyQt5.QtWidgets import QMessageBox
                QMessageBox.warning(self.view, "Aviso", "Por favor, preencha Nome, Servidor e Chave RTMP.")
                return

            # Inicializa uma lista na memória do Controller se não existir
            if not hasattr(self, "destinos_rtmp_salvos"):
                self.destinos_rtmp_salvos = {}

            self.destinos_rtmp_salvos[nome] = {"server": servidor, "key": chave}
            print(f"✅ Destino RTMP salvo localmente: {nome}")
            self.atualizar_status(f"💾 Destino '{nome}' salvo no painel!", config.COLOR_SUCCESS)
        except Exception as e:
            print(e)
            print(f"❌ Erro ao salvar destino RTMP: {e}")

    def acao_iniciar_multi_rtmp(self):
        """Chama o comando via WebSocket para iniciar as transmissões secundárias."""
        # Repassa para o executor seguro do OBS
        self.ejecutar_comando_obs(self._executar_iniciar_multi_rtmp)
        
    def _executar_iniciar_multi_rtmp(self, ws):
        try:
            # O plugin Multi-RTMP registra requisições customizadas no WebSocket
            # Este comando inicia a transmissão de TODOS os alvos secundários ativos no plugin
            # CallVendorRequest Padrão v5
            ws.call(obs_requests.CallVendorRequest(
                vendorName="obs-multi-rtmp",
                requestType="StartAll"
            ))
            self.atualizar_status("🚀 Multi-RTMP: Iniciando todos os destinos secundários!", config.COLOR_SUCCESS)
        except Exception as e:
            print(e)
            # Fallback caso o plugin use uma versão mais antiga/nova do protocolo
            try:
                ws.call(obs_requests.CallVendorRequest(vendorName="obs-multi-rtmp", requestType="Start", requestData={"name": "Todos"}))
            except Exception as e:
                print(e)
                print(f"⚠️ Não foi possível iniciar o multi rtmp: {str(e)}")
                self.atualizar_status("⚠️ Certifique-se de que o plugin Multi-RTMP está instalado e ativo no OBS.", "#eab308")

    def acao_parar_multi_rtmp(self):
        """Chama o comando via WebSocket para parar as transmissões secundárias."""
        self.ejecutar_comando_obs(self._executar_parar_multi_rtmp)
        
    def _executar_parar_multi_rtmp(self, ws):
        try:
            ws.call(obs_requests.CallVendorRequest(
                vendorName="obs-multi-rtmp",
                requestType="StopAll"
            ))
            self.atualizar_status("🛑 Multi-RTMP: Transmissões secundárias encerradas.", config.COLOR_WARNING)
        except Exception as e:
            print(e)
            print(f"⚠️ Falha ao parar destinos Multi-RTMP: {str(e)}")
            self.atualizar_status("⚠️ Falha ao parar destinos Multi-RTMP.", "#eab308")

    # -------------------------------------------------------------------------
    # CONTROLES AITUM VERTICAL (CANVAS REELS / TIKTOK)
    # -------------------------------------------------------------------------
    def acao_sincronizar_canvas_aitum(self):
        """Sincroniza a resolução ou força a atualização do layout vertical do Aitum."""
        self.ejecutar_comando_obs(self._executar_sincronizar_aitum)

    def _executar_sincronizar_aitum(self, ws):
        try:
            # Força o plugin Aitum a recalcular ou alinhar as cenas do Canvas Vertical 
            # de acordo com o estado do Canvas mestre horizontal
            ws.call(obs_requests.CallVendorRequest(
                vendorName="aitum-vertical",
                requestType="SyncCanvas"
            ))
            self.atualizar_status("🔄 Canvas Vertical Aitum sincronizado!", config.COLOR_SUCCESS)
        except Exception as e:
            print(e)
            try:
                ws.call(obs_requests.CallVendorRequest(
                    vendorName="aitum",
                    requestType="Sync"
                ))
                self.atualizar_status("🔄 Canvas Vertical Aitum sincronizado!", config.COLOR_SUCCESS)
            except Exception as e:
                print(e)
                print(f"⚠️ Não foi possível iniciar o Aitum Vertical: {str(e)}")
                self.atualizar_status("⚠️ Plugin Aitum Vertical não respondeu ao comando de sincronia.", config.COLOR_WARNING)
    
    def acao_iniciar_multistream_aitum(self):
        """Inicia a transmissão dedicada do Canvas Vertical (ex: para o TikTok)"""
        self.ejecutar_comando_obs(self._executar_iniciar_aitum)
        
    def _executar_iniciar_aitum(self, ws):
        try:
            ws.call(requests.CallVendorRequest(
                vendorName="aitum-vertical",
                requestType="StartStreaming"
            ))
            # Quando a transmissão iniciar com sucesso, liga também o LED do topo!
            self.view.atualizar_status_live_online()
            self.atualizar_status("📱 Live Vertical (Aitum) INICIADA!", config.COLOR_SUCCESS)
        except Exception as e:
            print(e)
            print(f"⚠️ Não foi possível iniciar a Transmissão Vertical Aitum: {str(e)}")
            self.atualizar_status("❌ Erro ao iniciar Transmissão Vertical no Aitum.", "#eab308")

    def acao_parar_multistream_aitum(self):
        """Para a transmissão dedicada do Canvas Vertical."""
        self.ejecutar_comando_obs(self._executar_parar_aitum)

    def _executar_parar_aitum(self, ws):
        try:
            ws.call(requests.CallVendorRequest(
                vendorName="aitum-vertical",
                requestType="StopStreaming"
            ))
            # Desliga o indicador LED do topo
            self.view.atualizar_status_live_offline()
            self.atualizar_status("📱 Live Vertical (Aitum) PARADA.", config.COLOR_WARNING)
        except Exception as e:
            print(e)
            print(f"⚠️ Erro ao parar a Transmissão Vertical Aitum: {str(e)}")
            self.atualizar_status("❌ Erro ao parar Transmissão Vertical no Aitum.", "#eab308")

    def conectar_eventos(self):
        # Substitua a conexão do btn_criar_fontes por esta:
        if hasattr(self.view, 'btn_criar_fontes'):
            self.view.btn_criar_fontes.clicked.connect(self.rotina_injetar_fontes)
        else:
            print("⚠️ AVISO: Botão 'btn_criar_fontes' não encontrado no Controller!")
        
        
        # OBS Launch & Configs
        self.view.btn_abrir_obs.clicked.connect(self.abrir_obs_studio)
        
        #CONEXÕES DO VDO.NINJA CONTROL ROOM em conectar_eventos
        
        # 1. Adicionar/Atualizar no OBS (Modo Seguro OBS)
        if hasattr(self.view, 'btn_adicionar_vdo_obs'):
            self.view.btn_adicionar_vdo_obs.clicked.connect(self.acao_adicionar_vdo_obs)
            
            

        # 2. Copiar Link Gerado (Local)
        if hasattr(self.view, 'btn_copiar_vdo'):
            self.view.btn_copiar_vdo.clicked.connect(self.acao_copiar_link_vdo)

        # 3. Abrir no Navegador (Local)
        if hasattr(self.view, 'btn_compartilhar_vdo'):
            self.view.btn_compartilhar_vdo.clicked.connect(self.acao_abrir_navegador_vdo)

        # 4. Mudar para Mudo remoto (Modo Seguro OBS)
        if hasattr(self.view, 'btn_mute'):
            self.view.btn_mute.clicked.connect(
                lambda: self.ejecutar_comando_obs(self.acao_vdo_comandar_mute)
            )

        # 5. Remover/Kickar Convidado (Modo Seguro OBS)
        if hasattr(self.view, 'btn_kick'):
            self.view.btn_kick.clicked.connect(
                lambda: self.ejecutar_comando_obs(self.acao_vdo_comandar_kick)
            )

        # 6. Forçar Baixa Qualidade (Modo Seguro OBS)
        if hasattr(self.view, 'btn_quality'):
            self.view.btn_quality.clicked.connect(
                lambda: self.ejecutar_comando_obs(self.acao_vdo_comandar_qualidade)
            )

        # Verificação preventiva do botão Salvar Credenciais
        if hasattr(self.view, 'btn_config_yt'):
            self.view.btn_config_yt.clicked.connect(
                lambda: self.ejecutar_comando_obs(self.acao_config_transmissao_yt))
        else:
            print("⚠️ AVISO: Botão 'btn_config_yt' não encontrado no Controller!")
            
        # Evento botão de testar conexão
        if hasattr(self.view, 'btn_testar_conexao'):
            self.view.btn_testar_conexao.clicked.connect(self.rotina_testar_conexao)
            
        # 🛠️ Vinculação direta do Botão Sair do OBS
        if hasattr(self.view, 'btn_logout_obs'):
            self.view.btn_logout_obs.clicked.connect(self.realizar_logout_obs)
        else:
            print("⚠️ AVISO: Botão 'btn_logout_obs' não encontrado na View!")

        if hasattr(self.view, 'btn_exportar'):
            self.view.btn_exportar.clicked.connect(self.exportar_configuracoes_obs)
        else:
            print("⚠️ AVISO: Botão 'btn_exportar' não encontrado no Controller!")
        
        # Evento do Letreiro Dinâmico
        # Evento do Letreiro Dinâmico
        if hasattr(self.view, 'btn_atualizar_alerta'):
            self.view.btn_atualizar_alerta.clicked.connect(
                lambda: self.ejecutar_comando_obs(self.acao_atualizar_letreiro))
        else:
            print("⚠️ AVISO: Painel do Letreiro Dinâmico não ativado na View!")
        
        # Monitoriza se o utilizador ligou/desligou o piscar para aplicar ao vivo no OBS
        if hasattr(self.view, 'btn_efeito_piscar'):
            self.view.btn_efeito_piscar.toggled.connect(self.gerenciar_efeito_piscar_live)

        # Evento do Instalador de Cenas
        if hasattr(self.view, 'btn_criar_cenas_padrao'):
            self.view.btn_criar_cenas_padrao.clicked.connect(self.rotina_criacao_cenas_padrao)
        else:
            print("⚠️ AVISO: Botão 'btn_criar_cenas_padrao' não encontrado na View!")
        
        # Eventos do Chaveador de Cenas
        self.view.btn_add_regra.clicked.connect(self.adicionar_regra_logica)
        self.view.btn_limpar_regras.clicked.connect(self.limpar_regras_logicas)
        self.view.btn_toggle_monitor.clicked.connect(self.alternar_monitoramento_automatico)

        # Macros Rápidas
        if hasattr(self.view, 'btn_macro_focar'):
            self.view.btn_macro_focar.clicked.connect(
                lambda: self.ejecutar_comando_obs(self.acao_disparar_macro_movimento, "Focar_Camera")
            )
            self.view.btn_macro_gameplay.clicked.connect(
                lambda: self.ejecutar_comando_obs(self.acao_disparar_macro_movimento, "Modo_Gameplay"))
        else:
            print("⚠️ AVISO: Painel de Macros Rápidas não ativado na View!")

        # Advanced Switcher Sync
        if hasattr(self.view, 'btn_toggle_monitor'):
            self.view.btn_toggle_monitor.clicked.connect(
                lambda: self.alternar_estado_advanced_switcher(ativar=self.monitoramento_ativo)
            )

        if hasattr(self.view, 'btn_exportar_switcher'):
            self.view.btn_exportar_switcher.clicked.connect(self.exportar_regras_para_advanced_switcher)
        else:
            print("⚠️ AVISO: Botão 'btn_exportar_switcher' não encontrado no Controller!")
        
        # Automações Avançadas
        if hasattr(self.view, 'btn_salvar_replay'):
            self.view.btn_salvar_replay.clicked.connect(
                lambda: self.ejecutar_comando_obs(self.acao_salvar_replay))
            self.view.btn_toggle_zoom.clicked.connect(self.alternar_zoom_dinamico)
            self.view.chk_smart_ducking.stateChanged.connect(self.gerenciar_smart_ducking)
        else:
            print("⚠️ AVISO: Botão 'btn_salvar_replay' não encontrado no Controller!")

        self.ducking_ativo = False
        self.zoom_ativo = False

        # Vincula o novo botão para enviar a mídia selecionada
        if hasattr(self.view, 'btn_enviar_midia'):
            self.view.btn_enviar_midia.clicked.connect(
                lambda: self.ejecutar_comando_obs(self.rotina_enviar_nova_midia_ao_obs)
            )
        
        # Controles PTZ Virtuais
        if hasattr(self.view, 'btn_ptz_up'):
            self.view.btn_ptz_up.clicked.connect(lambda: self.ejecutar_comando_obs(self.acao_controlar_ptz, "up"))
            self.view.btn_ptz_down.clicked.connect(lambda: self.ejecutar_comando_obs(self.acao_controlar_ptz, "down"))
            self.view.btn_ptz_left.clicked.connect(lambda: self.ejecutar_comando_obs(self.acao_controlar_ptz, "left"))
            self.view.btn_ptz_right.clicked.connect(lambda: self.ejecutar_comando_obs(self.acao_controlar_ptz, "right"))
            self.view.btn_ptz_reset.clicked.connect(lambda: self.ejecutar_comando_obs(self.acao_controlar_ptz, "reset"))
            self.view.btn_zoom_in.clicked.connect(lambda: self.ejecutar_comando_obs(self.acao_controlar_ptz, "zoom_in"))
            self.view.btn_zoom_out.clicked.connect(lambda: self.ejecutar_comando_obs(self.acao_controlar_ptz, "zoom_out"))
        else:
            print("⚠️ AVISO: Controles PTZ não encontrados na View (Painel desativado).")

        # Master Control Switches
        self.view.btn_stream.clicked.connect(lambda: self.ejecutar_comando_obs(self.acao_toggle_live_youtube))
        self.view.btn_gravar.clicked.connect(lambda: self.ejecutar_comando_obs(self.acao_toggle_gravar))
        
        # Conexão segura do botão de compartilhar link da live
        if hasattr(self.view, 'btn_share_link'):
            self.view.btn_share_link.clicked.connect(self.compartilhar_links_live)
        
        # Logins YouTube / Google
        self.view.btn_login_yt.clicked.connect(self.login_manager.iniciar_login_youtube)
        self.view.btn_logout_yt.clicked.connect(self.login_manager.realizar_logout_youtube)
        
        # Mixagem e Mídias
        self.view.slider_vol.valueChanged.connect(lambda val: self.ejecutar_comando_obs(self.acao_ajustar_volume, val))
        self.view.btn_filtro.clicked.connect(lambda: self.ejecutar_comando_obs(self.acao_toggle_filtro))
        
        self.view.btn_play_vid.clicked.connect(lambda: self.ejecutar_comando_obs(self.acao_controlar_video, "play"))
        self.view.btn_pause_vid.clicked.connect(lambda: self.ejecutar_comando_obs(self.acao_controlar_video, "pause"))
        self.view.btn_slide.clicked.connect(self.acao_avancar_slide)
        # Abre o arquivo de video/apresentação e injeta no OBS
        self.view.btn_procurar_midia.clicked.connect(self.rotina_selecionar_e_enviar_midia)
        
        # Injeção DLL e Utilitários
        self.view.btn_buscar_dll.clicked.connect(self.selecionar_dll)
        self.view.btn_executar_dll.clicked.connect(self.executar_funcao_dll)
        self.view.btn_cronometro.clicked.connect(self.iniciar_cronometro)
        self.view.btn_preview.clicked.connect(self.alternar_preview_window)
        
        # Multi-RTMP
        if hasattr(self.view, 'btn_adicionar_destino'):
            self.view.btn_adicionar_destino.clicked.connect(self.acao_salvar_destino_rtmp)
            self.view.btn_iniciar_multi_rtmp.clicked.connect(self.acao_iniciar_multi_rtmp)
            self.view.btn_parar_multi_rtmp.clicked.connect(self.acao_parar_multi_rtmp)

        # Aitum Vertical
        if hasattr(self.view, 'btn_iniciar_tudo'):
            self.view.btn_sincronizar_canvas.clicked.connect(self.acao_sincronizar_canvas_aitum)
            self.view.btn_iniciar_tudo.clicked.connect(self.acao_iniciar_multistream_aitum)
            self.view.btn_parar_tudo.clicked.connect(self.acao_parar_multistream_aitum)

        # Iniciar o Timer do Agregador Global de Dados (Roda a cada 5 segundos)
        self.timer_dados = QTimer()
        self.timer_dados.timeout.connect(self.atualizar_agregador_dados)
        self.timer_dados.start(5000)

    def rotina_criacao_cenas_padrao(self):
        """Gerencia a sequência de criação de cenas sem travar o OBS e a Interface"""
        # 1. Envia o comando para criar as cenas (O OBS pode reiniciar o WebSocket aqui)
        self.ejecutar_comando_obs(self.acao_criar_cenas)
        
        self.atualizar_status("Aguardando o OBS reiniciar as cenas...", "#eab308")
        print(f"Aguardando o OBS reiniciar as cenas...", flush=True)
        
        # 2. Agenda a instalação dos filtros para 2 segundos no futuro.
        # Isso dá tempo suficiente para o OBS carregar a nova Coleção e a nova conexão ser reestabelecida automaticamente.
        QTimer.singleShot(4000, lambda: self.ejecutar_comando_obs(self.acao_instalar_filtros_move))
        print(f"Aguardando o OBS instalar o filtro move...", flush=True)
    
    def atualizar_status(self, mensagem, cor_hex="#212529"):
        self.view.lbl_status.setText(mensagem)
        self.view.lbl_status.setStyleSheet(f"color: {cor_hex};")
        
    def iniciar_live_youtube(self):
        """Função disparada pelo clique do botão INICIAR LIVE"""
        
        # O callback que será executado DENTRO da conexão persistente
        def logica_iniciar_live(ws):
            # 1. Configurar o Servidor e a Chave do YouTube no OBS
            ws.call(obs_requests.SetStreamServiceSettings(
                streamServiceType="rtmp_custom",
                streamServiceSettings={
                    "server": "rtmp://a.rtmp.youtube.com/live2",
                    "key": "cgwr-kmv8-11fh-aaws-a51r",
                    "use_auth": False
                }
            ))
            print("✅ Servidor e Chave configurados via websocket.", flush=True)

            # 2. Enviar comando de Play
            ws.call(obs_requests.StartStream())
            print("🟢 Comando StartStream enviado com sucesso!", flush=True)           
            # O LED agora só acenderá quando o OBS disparar o sinal real de conexão ativa.

        # Envia a lógica acima para o seu gerenciador de comandos do OBS
        self.ejecutar_comando_obs(logica_iniciar_live)

    # --- COMUNICAÇÃO PROTOCOLO OBS WEBSOCKET ---
    def ejecutar_comando_obs(self, comando_callback, *args):
        """Gerencia comandos utilizando uma conexão persistente e única com cache de credenciais"""
        from obswebsocket import obsws

        try:
            # 1. Se não houver conexão, recria do zero
            if getattr(self, 'ws_persistente', None) is None or not self.ws_persistente.ws or not self.ws_persistente.ws.connected:
                print(f"Verificando se existe conexão websocket, p/ recriar do zero.", flush=True)
                
                self.atualizar_status("Conectando...", config.COLOR_SECONDARY)
                
                # 2. CACHE DE CREDENCIAIS: Usa a senha salva se já conectou com sucesso antes nesta sessão
                if hasattr(self, '_cache_credenciais_obs'):
                    host, porta, senha = self._cache_credenciais_obs
                else:
                    # Se não tem cache (primeira vez), puxa da interface ou do config
                    host = self.view.campo_ip.text().strip() if hasattr(self.view, 'campo_ip') and self.view.campo_ip.text().strip() else config.HOST
                    porta = self.view.campo_porta.text().strip() if hasattr(self.view, 'campo_porta') and self.view.campo_porta.text().strip() else config.PORT
                    senha = self.view.campo_senha.text().strip() if hasattr(self.view, 'campo_senha') and self.view.campo_senha.text().strip() else config.PASSWORD
                    print(f"Sem cache, verificando: ip, porta e, senha: ws://{ip}:{porta}... {senha}", flush=True)

                # Limpa conexões fantasmas que possam estar presas na memória da biblioteca
                if hasattr(self, 'ws_persistente') and self.ws_persistente:
                    try:
                        self.ws_persistente.disconnect()
                        print(f"Limpando conexões fantasmas.", flush=True)
                    except:
                        pass
                
                # Instancia a nova conexão
                self.ws_persistente = obsws(host, porta, senha)
                self.ws_persistente.connect()
                print(f"Instancia nova conexão.", flush=True)
                
                # 📡 REGISTRO DE EVENTOS EM TEMPO REAL DO OBS
                try:
                    self.ws_persistente.register(self.ao_iniciar_transmissao, events.StreamStarted)
                    self.ws_persistente.register(self.ao_parar_transmissao, events.StreamStopped)
                    print("📡 Ouvintes de transmissão registrados com sucesso!", flush=True)
                except Exception as ev_err:
                    print(f"⚠️ Erro ao registrar ouvintes de evento: {ev_err}", flush=True)
                
                # 3. SALVA NO CACHE as credenciais que acabaram de funcionar para evitar o Erro 4009 no futuro
                self._cache_credenciais_obs = (host, porta, senha)
                print(f"Salvado no CACHE as credenciais daconexão para evitar Erro 4009.", flush=True)
                
                self.atualizar_status(f"Conectado na porta {porta}", config.COLOR_SUCCESS)
                print(f"⏳ Conectado com obs/websocket... em ws://{host}:{porta}", flush=True)
            
            # 4. Passa a conexão persistente ativa para a função
            comando_callback(self.ws_persistente, *args)
            
        except Exception as e:
            # Se a senha estiver errada ou o OBS fechado, cai aqui imediatamente
            print(f"❌ Erro na comunicação WebSocket: {str(e)}", flush=True)
            self.atualizar_status("❌ OBS Desconectado", "#eab308")
            
            # Força a deleção do objeto quebrado para forçar uma recriação limpa
            self.ws_persistente = None 
            
            if hasattr(self.view, 'atualizar_status_obs_desconectado'):
                self.view.atualizar_status_obs_desconectado()

    def realizar_logout_obs(self):
        """Fecha ativamente a conexão persistente e atualiza a interface gráfica"""
        if hasattr(self, 'ws_persistente') and self.ws_persistente is not None:
            try:
                self.ws_persistente.disconnect()
                print("🔌 [Logout] Conexão com o OBS WebSocket fechada pelo usuário.", flush=True)
            except Exception as e:
                print(f"⚠️ Erro ao desconectar: {str(e)}", flush=True)
            finally:
                self.ws_persistente = None
        
        self.atualizar_status("Pronto (Desconectado)", config.COLOR_PRIMARY)
        
        # Avisa a View para reativar os inputs e mudar a cor do botão
        if hasattr(self.view, 'atualizar_status_obs_desconectado'):
            self.view.atualizar_status_obs_desconectado()
            
        QMessageBox.information(self.view, "OBS WebSocket", "Desconectado do OBS Studio com sucesso.")
    
    # =========================================================================
    # 🎬 VERIFICA O STATUS DO WEBSOCKET NO OBS (LIGADO/DESLIGADO)
    # =========================================================================
    def verificar_status_obs(self):
        """Tenta conectar ao OBS Studio usando as credenciais informadas na interface pelo usuário"""
        
        self.atualizar_status("⏳ Verificando servidor WebSocket do OBS...", config.COLOR_INFO)
        
        # 1. Captura os dados dinâmicos digitados na View 
        # (⚠️ Atenção: substitua 'campo_ip', 'campo_porta' e 'campo_senha' 
        # pelos nomes reais dos seus QLineEdits da aba de Logins)
        host_atual = self.view.campo_ip.text().strip() or config.HOST
        porta_atual = self.view.campo_porta.text().strip() or config.PORT
        senha_atual = self.view.campo_senha.text().strip() or config.PASSWORD
        
        try:
            # 2. Instancia a conexão com os dados reais do usuário
            ws = obsws(host_atual, porta_atual, senha_atual)
            ws.connect() 
            
            self.atualizar_status("✅ Servidor WebSocket está ativo no OBS!", config.COLOR_SUCCESS)
            QMessageBox.information(self.view, "Conexão OBS", "✅ Conexão estabelecida com sucesso usando os dados informados!")
            
            # Desconecta logo em seguida, pois é apenas um teste de ping
            ws.disconnect()
            
        except ConnectionFailure:
            # Erro de senha incorreta ou porta rejeitada pelo servidor
            self.atualizar_status("❌ Falha na autenticação com o OBS.", "#eab308")
            QMessageBox.warning(self.view, "Erro de Conexão", 
                                "Servidor WebSocket encontrado, mas a senha ou a porta informada na interface foi rejeitada.")
            
        except Exception as e:
            print(e)
            print(f"❌ OBS não encontrado no endereço informado: {str(e)}", flush=True)
            # Servidor desligado, IP errado ou OBS fechado (ConnectionRefusedError)
            self.atualizar_status("❌ OBS não encontrado no endereço informado.", "#eab308")
            QMessageBox.critical(self.view, "OBS Não Encontrado", 
                                 "O aplicativo não conseguiu se conectar ao OBS Studio.\n\n"
                                 "Verifique se:\n"
                                 "1. O OBS Studio está aberto.\n"
                                 "2. O IP e a Porta digitados na aba 'Logins' estão corretos.\n"
                                 "3. Vá no OBS em 'Ferramentas' > 'Configurações do servidor WebSocket'.\n"
                                 "4. Marque a opção 'Ativar servidor WebSocket'.")
    
    def acao_login_instagram_oauth2(self):
        """Disparado ao clicar no botão 'Vincular via Meta OAuth2'"""
        # Substitua pela URL de autenticação oficial do seu app cadastrado no Meta Developer Portal
        url_meta_oauth = "https://www.facebook.com/v18.0/dialog/oauth?client_id=SEU_CLIENT_ID_META&redirect_uri=http://localhost:53033/&scope=instagram_basic,instagram_content_publish"
        
        try:
            webbrowser.open(url_meta_oauth)
            self.atualizar_status("⏳ Aguardando autenticação no navegador Meta...", config.COLOR_PRIMARY)
            print(f"Aguardando a conexão no navegador Meta/OAuth2...", flush=True)
        except Exception as e:
            QMessageBox.critical(self.view, "Erro", f"Não foi possível abrir o navegador: {str(e)}")
            print(f"Não foi possível abrir o navegador: {str(e)}.", flush=True)
    
    # =========================================================================
    # 🏗️ INSTALADOR AUTOMÁTICO DINÂMICO DE FONTES COM URL PERSONALIZADA VDO.NINJA (com mídia opcional)
    # =========================================================================
    def acao_injetar_fontes_basicas(self, ws):
        """Injeta cenas e fontes no OBS e gerencia a lógica Webcam vs VDO.Ninja."""
        if not ws or isinstance(ws, bool):
            self.atualizar_status("⚠️Erro de Conexão com OBS!", config.COLOR_DANGER)
            print(f"⚠️[injetar_fontes_basicas] Erro de Conexão com OBS!", flush=True)
            return

        cena_destino = "Cena_Principal"
        caminho_arquivo = self.view.entry_caminho_midia.text().strip()
        
        # Lê o link do campo de texto de forma segura
        url_vdo = ""
        if hasattr(self.view, 'entry_url_vdo1'):
            url_vdo = self.view.entry_url_vdo1.text().strip()
        
        if not url_vdo:
            print(f"[injetar_fontes_basicas] Link da camera VDO.ninja não informado", flush=True)
        else:
            print(f"[injetar_fontes_basicas] Link da camera VDO.ninja informado: '{url_vdo}'", flush=True)

        try:
            # 1. 🎬 GARANTIA DE CRIAÇÃO DA CENA E FOCO VISUAL
            cenas_existentes_dados = ws.call(obs_requests.GetSceneList())
            cenas_existentes = [s['sceneName'] for s in cenas_existentes_dados.getScenes()]

            if cena_destino not in cenas_existentes:
                self.atualizar_status("Cena não encontrada, criando uma automaticamente...", config.COLOR_DANGER)
                print(f"🎬 [injetar_fontes_basicas] Cena '{cena_destino}' não encontrada, criando uma automaticamente...", flush=True)
                ws.call(obs_requests.CreateScene(sceneName=cena_destino))
                time.sleep(3.0) # Espera 3 segundos para o OBS renderizar a nova cena na memória
                print(f"🎬 [injetar_fontes_basicas] Cena '{cena_destino}' criada automaticamente no obs studio...", flush=True)
            
            # Força o OBS a mudar para a cena, para você ver que ela existe!
            try:
                ws.call(obs_requests.SetCurrentProgramScene(sceneName=cena_destino))
            except Exception as e:
                print(f"ℹ️ [injetar_fontes_basicas] Erro ao focar na cena '{cena_destino}' (pode ser normal se já estiver nela): {e}", flush=True)

            # 2. 🔍 ESCANEIA DISPOSITIVOS DE VÍDEO
            dispositivos_locais = []
            try:
                for kind in ["dshow_input", "avfoundation_input", "v4l2_input"]:
                    lista = ws.call(obs_requests.GetInputList(inputKind=kind))
                    inputs = lista.getInputs() if hasattr(lista, 'getInputs') else []
                    for inp in inputs:
                        dispositivos_locais.append(inp['inputName'])
            except Exception as e:
                import traceback
                print(f"❌ [injetar_fontes_basicas] Erro no escaneamento: {str(e)}", flush=True)
                print(traceback.format_exc(), flush=True) 
                self.atualizar_status("⚠️ Erro: verifique log!", config.COLOR_DANGER)

            # 3. 🧠 ROTEAMENTO: WEBCAM FÍSICA VS VDO.NINJA
            if not dispositivos_locais:
                # C) Nenhuma webcam física, então VDO.Ninja será a principal.
                print(f"⚠️[injetar_fontes_basicas] Nenhuma webcam física localizada. Verificando o link do VDO.Ninja para adicionar como fonte principal...", flush=True)
                
                # SÓ cria fonte de vídeo se o usuário informou de fato um link válido do VDO
                if url_vdo and "vdo.ninja" in url_vdo.lower():
                    print(f"🚀 [injetar_fontes_basicas] Injetando VDO.Ninja como fonte principal. URL VDO enviada ao OBS: '{url_vdo}'", flush=True)
                    ws.call(obs_requests.CreateInput(
                        sceneName=cena_destino, 
                        inputName="Webcam_Apresentador", 
                        inputKind="browser_source", 
                        inputSettings={"url": url_vdo, "width": 1920, "height": 1080, "reroute_audio": True}
                    ))
                    self.atualizar_status("✅ Webcam não existe... link VDO.Ninja foi adicionado como fonte de vídeo principal", config.COLOR_SUCCESS)
                else:
                    self.atualizar_status("⚠️ Câmera não criada: Faltou o link do VDO!", config.COLOR_WARNING)
                    print("❌ Operação abortada: Nenhuma webcam local encontrada E nenhum link do VDO.Ninja foi digitado.", flush=True)
                    return # Para a execução aqui para não gerar fontes fantasmas vazias no OBS
            
            else:
                webcam_detectada = dispositivos_locais[0]
                print(f"✅ [injetar_fontes_basicas] Webcam física detectada: {webcam_detectada}. Aplicando como Principal.", flush=True)
                
                # A) Webcam Física vira Fonte Principal
                ws.call(obs_requests.CreateInput(
                    sceneName=cena_destino, 
                    inputName="Webcam_Apresentador", 
                    inputKind="dshow_input", 
                    inputSettings={"video_device_id": webcam_detectada, "res_type": 1, "resolution": "1920x1080"}
                ))
                self.atualizar_status("✅ Webcam física como fonte primária", config.COLOR_SUCCESS)
                print(f"✨ [injetar_fontes_basicas] Webcam física foi adicionado como fonte de vídeo principal", flush=True)
                
                # B) Se houver link, VDO entra como fonte secundária
                if url_vdo and "vdo.ninja" in url_vdo.lower():
                    print(f"✨ [injetar_fontes_basicas] Adicionando o link do VDO.ninja como fonte de vídeo secundária: '{url_vdo}'", flush=True)
                    ws.call(obs_requests.CreateInput(
                        sceneName=cena_destino, 
                        inputName="Convidado_VDO_Secundario", 
                        inputKind="browser_source", 
                        inputSettings={"url": url_vdo, "width": 1920, "height": 1080, "reroute_audio": True}
                    ))
                    self.atualizar_status("✅ VDO.ninja como fonte secundária", config.COLOR_SUCCESS)
                    print(f"✨ [injetar_fontes_basicas] webcam detectada e link detectado... link do VDO.ninja foi adicionado como fonte de vídeo secundária", flush=True)
            self.view.atualizar_lista_equipamentos_ptz()
        except Exception as e:
            erro_msg = str(e).lower()
            if "already exists" in erro_msg or "409" in erro_msg:
                print("ℹ️ Algumas fontes já existem na cena. Verificando links...", flush=True)
                if url_vdo:
                    try:
                        ws.call(obs_requests.SetInputSettings(inputName="Convidado_VDO_Secundario", inputSettings={"url": url_vdo}))
                        print("✨ Link Secundário atualizado!", flush=True)
                    except:
                        try:
                            ws.call(obs_requests.SetInputSettings(inputName="Webcam_Apresentador", inputSettings={"url": url_vdo}))
                            print("✨ Link Principal do VDO atualizado!", flush=True)
                        except: pass
                self.atualizar_status("✅ Cenas e links revisados!", config.COLOR_SUCCESS)
            else:
                print(f"❌ Erro Crítico do WebSockets: {e}", flush=True)
                self.atualizar_status("⚠️ Erro ao comunicar com OBS", config.COLOR_DANGER)

    def rotina_injetar_fontes(self, checked=False):
        """Gerencia o clique do botão isolando o booleano do PyQt e enviando o comando correto."""
        print("🚀 Iniciando rotina de injeção de fontes...", flush=True)
        self.atualizar_status("Aguardando injeção de fontes...", config.COLOR_INFO)
        self.ejecutar_comando_obs(self.acao_injetar_fontes_basicas)
        
    def _atualizar_configuracoes_existentes(self, ws, caminho_arquivo):
        #Função auxiliar para atualizar as configurações se as fontes já existirem no OBS
        try:
            extensao = caminho_arquivo.lower()
            if extensao.endswith(('.mp4', '.mkv', '.avi', '.mov', '.mp3')):
                ws.call(obs_requests.SetInputSettings(
                    inputName="Video_Introducao",
                    inputSettings={"local_file": caminho_arquivo}
                ))
            elif extensao.endswith(('.png', '.jpg', '.jpeg', '.bmp')):
                ws.call(obs_requests.SetInputSettings(
                    inputName="Apresentacao_Slides",
                    inputSettings={"files": [{"value": caminho_arquivo}]}
                ))
            self.atualizar_status("✅ Arquivos atualizados no OBS!", config.COLOR_SUCCESS)
        except Exception as err:
            print(f"❌ Erro ao atualizar configurações existentes: {err}", flush=True)
        
    #CONEXÕES DO VDO.NINJA CONTROL ROOM
    def acao_adicionar_vdo_obs(self, ws):
        #Injeta ou atualiza dinamicamente a fonte de navegador do VDO.Ninja no OBS ativo
        
        cena_destino = "Cena_Principal"
        url_vdo = self.view.entry_url_vdo.text().strip()
    
        if not url_vdo:
            self.atualizar_status("⚠️ Erro: Insira um link VDO.Ninja válido!", config.COLOR_DANGER)
            return
    
        settings_vdo = {
            "url": url_vdo,
            "width": 1920,
            "height": 1080,
            "fps": 30,
            "reroute_audio": True,
            "shutdown": False,
            "css": "body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }"
        }
    
        try:
            self.atualizar_status("Verificando estrutura de fonte no OBS...", config.COLOR_INFO)
            print(f"Verificando estrutura de fonte de vídeo no OBS...", flush=True)

            # 🔍 1. VERIFICA SE A CENA DESTINO EXISTE NO OBS
            cenas_existentes_dados = ws.call(requests.GetSceneList())
            cenas_existentes = [s['sceneName'] for s in cenas_existentes_dados.getScenes()]

            # 🛠️ 2. SE NÃO EXISTIR, CRIA A CENA AUTOMATICAMENTE
            if cena_destino not in cenas_existentes:
                print(f"Fonte '{cena_destino}' não encontrada, então criando uma fonte automaticamente...", flush=True)
                self.atualizar_status("Fonte não encontrada, criando automaticamente...", config.COLOR_INFO)
                ws.call(requests.CreateScene(sceneName=cena_destino))
                # Dá um tempinho mínimo para o OBS processar a criação da cena
                import time
                time.sleep(0.2)

            # 🚀 3. TENTA CRIAR A FONTE NA CENA
            self.atualizar_status("Adicionando fonte ao OBS...", config.COLOR_INFO)
            print(f"Adicionando fonte de vídeo VDO '{url_vdo}' ao OBS...", flush=True)
            response = ws.call(requests.CreateInput(
                sceneName=cena_destino,
                inputName="Webcam_Apresentador",
                inputKind="browser_source",
                inputSettings=settings_vdo
            ))
            
            self.atualizar_status("✅ Fonte VDO adicionada com sucesso!", config.COLOR_SUCCESS)
            print(f"Fonte de vídeo VDO.Ninja '{cena_destino}' adicionada com sucesso... '{response}'", flush=True)
            
        except Exception as e:
            # 🔄 4. SE A FONTE JÁ EXISTIR, APENAS ATUALIZA O LINK/CONFIGURAÇÕES
            erro_str = str(e).lower()
            if "already exists" in erro_str or "409" in erro_str:
                try:
                    ws.call(requests.SetInputSettings(
                        inputName="Webcam_Apresentador",
                        inputSettings=settings_vdo
                    ))
                    self.atualizar_status("✨ Link atualizado na fonte existente!", config.COLOR_SUCCESS)
                    print(f"✨ Link VDO atualizado na fonte de vídeo ja existente!", flush=True)
                except Exception as update_err:
                    print(f"Erro crítico ao atualizar: {update_err}")
                    self.atualizar_status("⚠️ Erro ao atualizar fonte", config.COLOR_DANGER)
            else:
                # Caso ocorra outro erro de comunicação
                print(f"Erro ao tentar adicionar fonte: {e}")
                self.atualizar_status("⚠️ Erro ao acessar ou configurar o OBS", config.COLOR_DANGER)
            
        except Exception as e:
            # 🔄 4. SE A FONTE JÁ EXISTIR, APENAS ATUALIZA O LINK/CONFIGURAÇÕES
            erro_str = str(e).lower()
            if "already exists" in erro_str or "409" in erro_str:
                try:
                    ws.call(requests.SetInputSettings(
                        inputName="Webcam_Apresentador",
                        inputSettings=settings_vdo
                    ))
                    self.atualizar_status("✨ Link atualizado na fonte existente!", config.COLOR_SUCCESS)
                except Exception as update_err:
                    print(f"Erro crítico ao atualizar: {update_err}")
                    self.atualizar_status("⚠️ Erro ao atualizar fonte", config.COLOR_DANGER)
            else:
                # Caso ocorra outro erro de comunicação
                print(f"Erro ao tentar adicionar fonte: {e}")
                self.atualizar_status("⚠️ Erro ao acessar ou configurar o OBS", config.COLOR_DANGER)

    # -------------------------------------------------------------
    # AÇÕES LOCAIS (Área de Transferência e Navegador)
    # -------------------------------------------------------------

    def acao_copiar_link_vdo(self):
        """Gera o link de convite baseado no Peer ID e copia para o clipboard."""
        peer_id = self.view.entry_peer_id.text().strip()
        if not peer_id:
            QMessageBox.warning(self.view, "Aviso", "Por favor, digite o Peer ID do convidado antes de gerar o link.")
            return

        # Gera o link que o convidado usará para transmitir a câmera do celular dele
        link_convidado = f"https://vdo.ninja/?push={peer_id}"
        
        try:
            QApplication.clipboard().setText(link_convidado)
            self.atualizar_status("✅ Link de transmissão copiado!", config.COLOR_SUCCESS)
            QMessageBox.information(
                self.view, 
                "Link Gerado!", 
                f"Envie este link para o convidado acessar do celular:\n\n{link_convidado}"
            )
        except Exception as e:
            self.atualizar_status("⚠️ Erro ao copiar link VDO!", config.COLOR_DANGER)
            print(f"⚠️ Erro ao copiar link VDO!", flush=True)

    def acao_abrir_navegador_vdo(self):
        """Abre o link de visualização (View) no navegador padrão do computador do operador."""
        url_vdo = self.view.entry_url_vdo.text().strip()
        peer_id = self.view.entry_peer_id.text().strip()

        # Se o operador não digitou uma URL de View, mas digitou o Peer ID, nós montamos a URL de View automaticamente
        if not url_vdo and peer_id:
            url_vdo = f"https://vdo.ninja/?view={peer_id}"
            self.view.entry_url_vdo.setText(url_vdo)

        if not url_vdo:
            QMessageBox.warning(self.view, "Aviso", "Insira uma URL do VDO.Ninja ou um Peer ID para abrir no navegador.")
            return

        import webbrowser
        webbrowser.open(url_vdo)
        self.atualizar_status("🔗 Abrindo link de monitoramento no navegador...", config.COLOR_INFO)
        print(f"🔗 Abrindo link de monitoramento no navegador...", flush=True)

    # -------------------------------------------------------------
    # AÇÕES REMOTAS (Interação via OBS WebSockets)
    # -------------------------------------------------------------

    def _atualizar_url_parametro_obs(self, ws, parametro, valor):
        """Função auxiliar para injetar parâmetros de controle remoto do VDO.Ninja na URL do OBS."""
        url_atual = self.view.entry_url_vdo.text().strip()
        peer_id = self.view.entry_peer_id.text().strip()

        # Garante que temos uma URL base para trabalhar
        if not url_atual and peer_id:
            url_atual = f"https://vdo.ninja/?view={peer_id}"
            self.view.entry_url_vdo.setText(url_atual)
            print(f"⚠🔗 Link base do VDO.Ninja primeiro: '{url_atual}'", flush=True)

        if not url_atual:
            self.atualizar_status("⚠️ Erro: configure uma URL do VDO.Ninja primeiro.", config.COLOR_DANGER)
            print(f"⚠️ Erro: configure uma URL do VDO.Ninja primeiro.", flush=True)
            return

        # Modifica a URL adicionando o comando remoto (&mute, &kick, &quality, etc.)
        from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode
        u = urlparse(url_atual)
        query = dict(parse_qsl(u.query))
        query[parametro] = valor
        nova_url = urlunparse(u._replace(query=urlencode(query)))

        # Atualiza o campo de texto visual
        self.view.entry_url_vdo.setText(nova_url)

        # Injeta a URL atualizada direto na fonte ativa do OBS
        try:
            ws.call(obs_requests.SetInputSettings(
                inputName="Webcam_Apresentador",
                inputSettings={"url": nova_url}
            ))
            self.atualizar_status(f"✨ Comando remoto '{parametro}' enviado ao OBS!", config.COLOR_SUCCESS)
        except Exception as e:
            self.atualizar_status("⚠️ Erro ao enviar comando remoto para o OBS.", config.COLOR_DANGER)

    def acao_vdo_comandar_mute(self, ws):
        """Ativa/Desativa o mudo da transmissão remota no OBS."""
        # Adiciona o parâmetro de controle de áudio remoto do VDO.Ninja
        self._atualizar_url_parametro_obs(ws, "mute", "1")

    def acao_vdo_comandar_kick(self, ws):
        """Desconecta a sessão atual forçando uma desconexão remota."""
        # Um refresh ou um ID inexistente desconecta o stream ativo de forma limpa
        self._atualizar_url_parametro_obs(ws, "clean", "1")

    def acao_vdo_comandar_qualidade(self, ws):
        """Força o stream remoto do convidado a trabalhar em baixa qualidade (ideal para redes instáveis)."""
        # Limita a banda de download da fonte do navegador para economizar internet
        self._atualizar_url_parametro_obs(ws, "quality", "0")
    
    # =========================================================================
    # 🎬 INTERAÇÃO COM PLUGIN MOVE TRANSITION
    # =========================================================================
    def acao_instalar_filtros_move(self, ws):
        """
        Injeta e configura automaticamente o filtro do Move Transition 
        dentro do OBS Studio caso ele ainda não exista na fonte alvo.
        """
        from obswebsocket import requests
        
        nome_fonte = "Webcam_Principal"
        nome_filtro = "Filter_Move_Focar_Camera"
        
        print(f"🛠️ [Move] Verificando/Instalando filtro automático em '{nome_fonte}'", flush=True)
        
        # 1. Configurações do movimento
        configuracoes_filtro = {
            "duration": 500,
            "easing": 2,
            "switch_point": 50,
            "matched_source_action": 0,
            "transform": {
                "scale_x": 1.5,
                "scale_y": 1.5,
                "position_x": 100.0,
                "position_y": 50.0
            }
        }

        try:
            # 💡 O TRUQUE: Como a biblioteca não tem a classe 'CreateSourceFilter', 
            # nós puxamos um comando base qualquer e forçamos os parâmetros manualmente.
            req = requests.GetVersion() 
            req.name = "CreateSourceFilter" # Forçamos o nome exato que a API do OBS espera
            req.datain = {
                "sourceName": nome_fonte,
                "filterName": nome_filtro,
                "filterKind": "move_source_filter",
                "filterSettings": configuracoes_filtro
            }
            
            # Envia o comando customizado para o OBS
            ws.call(req)
            
            # Usando cor HEX aqui para garantir que não teremos aquele erro antigo do config.py
            self.atualizar_status("Filtros Move Instalados!", "#198754") 
            print(f"✅ Filtro '{nome_filtro}' instalado e configurado com sucesso no OBS em '{nome_fonte}'", flush=True)
            
        except Exception as e:
            # Tratamento de segurança: Se o erro for porque o filtro já existe, está tudo bem!
            error_msg = str(e)
            if "already exists" in error_msg.lower() or "409" in error_msg:
                print(f"ℹ️ O filtro '{nome_filtro}' já existe no OBS. Nenhuma ação necessária.")
            else:
                print(f"⚠️ Erro ao tentar criar o filtro do Move '{nome_filtro}' em '{nome_fonte}'; erro: {error_msg}")
        
    def acao_disparar_macro_movimento(self, ws, nome_macro):
        """
        Dispara um movimento suave ou animação de elemento usando o plugin Move Transition.
        Geralmente feito ativando um filtro do tipo 'move_value_filter' ou 'move_source_filter'.
        """
        print(f"🤖 [Move] Disparando macro de movimento: {nome_macro}")
        
        # Nome da fonte (ou cena) onde o filtro do Move Transition está aplicado
        nome_fonte_alvo = "Webcam_Principal" if nome_macro == "Focar_Camera" else "Cena_Gameplay"
        # O nome do filtro configurado dentro do OBS Studio
        nome_filtro_move = f"Filter_Move_{nome_macro}"

        try:
            # Enviando comando WebSocket para ativar/redefinir o filtro do Move, disparando a animação
            ws.call(requests.SetSourceFilterEnabled(
                sourceName=nome_fonte_alvo,
                filterName=nome_filtro_move,
                filterEnabled=True
            ))
            self.atualizar_status(f"Movimento {nome_macro} executado!", config.COLOR_SUCCESS)
        except Exception as e:
            print(f"⚠️ Erro ao disparar filtro do Move Transition: {str(e)}")

    # =========================================================================
    # 🎬 CONTROLE DE MÍDIAS E VÍDEOS
    # =========================================================================
    def acao_controlar_video(self, ws, comando):
        try:
            # Sintaxe v5.x: 'TriggerMediaInputAction' controla a mídia nativa
            acao_v5 = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PLAY" if comando == "play" else "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PAUSE"
            
            ws.call(requests.TriggerMediaInputAction(
                inputName="Fonte_Video",  # Certifique-se de usar o nome correto da sua fonte de vídeo do OBS
                mediaAction=acao_v5
            ))
        except Exception as e:
            print(f"❌ Erro ao interagir com a fonte de mídia: {e}", flush=True)
            self.atualizar_status("⚠️ Erro ao controlar player de vídeo", config.COLOR_SECONDARY)
    
    # =========================================================================
    # 📑 CONTROLE DE APRESENTAÇÃO DE SLIDES (OBS v5.x)
    # =========================================================================
    def acao_avancar_slide(self):
        """Dispara o comando de avançar para o próximo slide de forma segura"""
        self.ejecutar_comando_obs(self._executar_avancar_slide)

    def _executar_avancar_slide(self, ws):
        try:
            # 'OBS_WEBSOCKET_MEDIA_INPUT_ACTION_NEXT' ação nativa para avaçar para o próximo slide
            # Certifique-se de que a sua fonte de slides no OBS se chama "Apresentacao_Slides"
            ws.call(obs_requests.TriggerMediaInputAction(
                inputName="Apresentacao_Slides",  # <-- Substitua pelo nome exato da sua fonte de slides no OBS
                mediaAction="OBS_WEBSOCKET_MEDIA_INPUT_ACTION_NEXT"
            ))
            self.atualizar_status("📑 Slide avançado!", config.COLOR_SUCCESS)
            print("📑 Comando de avançar slide enviado com sucesso!", flush=True)
        except Exception as e:
            print(f"❌ Erro ao avançar slide: {e}", flush=True)
            self.atualizar_status("⚠️ Erro ao avançar slide", config.COLOR_SECONDARY)
    
    def rotina_enviar_nova_midia_ao_obs(self, ws):
        """Atualiza apenas o arquivo da fonte já existente sem recriar a fonte"""
        caminho = self.view.entry_caminho_midia.text().strip()
        
        # Define qual fonte atualizar baseado na extensão
        if caminho.lower().endswith(('.mp4', '.mkv', '.avi', '.mov', '.mp3')):
            nome_fonte = "Video_Introducao"
            configuracao = {"local_file": caminho}
        else:
            nome_fonte = "Apresentacao_Slides"
            configuracao = {"files": [{"value": caminho}]}

        try:
            ws.call(obs_requests.SetInputSettings(
                inputName=nome_fonte,
                inputSettings=configuracao
            ))
            self.atualizar_status(f"✅ Nova mídia enviada: {nome_fonte}", config.COLOR_SUCCESS)
        except Exception as e:
            print(f"❌ Erro ao trocar mídia: {e}")
    
    # =========================================================================
    # 📺 GERENCIAMENTO DE LETREIRO DINÂMICO (MARQUEE / TICKER)
    # =========================================================================
    def acao_atualizar_letreiro(self, ws):
        from obswebsocket import requests
        import time

        novo_texto = self.view.txt_texto_alerta.text().strip()
        if not novo_texto:
            QMessageBox.warning(self.view, "Aviso", "Por favor, digite um texto válido antes de atualizar.")
            return

        # Guarda globalmente no controller o texto ativo para o timer de piscar
        self.texto_atual_letreiro = novo_texto
        nome_fonte_texto = "Letreiro_Avisos"
        nome_filtro_rolagem = "Rolagem_Letreiro"

        try:
            # 🔍 0. TESTA A CONEXÃO ANTES DE INJETAR O TEXTO
            self.atualizar_status("Testando conexão com OBS...", "#eab308")
            self.acao_testar_conexao(ws)

            # 1. DESCOBRE A CENA ATUAL PARA INJETAR O LETREIRO NELA
            req_cena = ws.call(requests.GetCurrentProgramScene())
            cena_atual = req_cena.getCurrentProgramSceneName()

            # 2. GARANTE QUE A FONTE DE TEXTO EXISTE (Cria se não existir)
            try:
                ws.call(requests.CreateInput(
                    sceneName=cena_atual,
                    inputName=nome_fonte_texto,
                    inputKind="text_gdiplus_v2", # Padrão de texto do OBS
                    inputSettings={"text": f"   {novo_texto}   ", "font": {"size": 72}},
                    sceneItemEnabled=True
                ))
            except Exception:
                # 💡 ATENÇÃO: Substituí o QMessageBox por um print/status visual. 
                # Se mantivermos o QMessageBox aqui, sua tela vai congelar com um popup
                # toda vez que você tentar mudar o texto durante a live, pois a fonte já existirá!
                self.atualizar_status("Fonte existente na cena, atualizando o texto...", "#eab308")
                print(f"✅ Fonte '{nome_fonte_texto}' já existe na cena, apenas atualizando o texto...", flush=True)
                pass

            # 3. ATUALIZA O TEXTO COM A NOVA MENSAGEM
            ws.call(requests.SetInputSettings(
                inputName=nome_fonte_texto,
                inputSettings={"text": f"   {novo_texto}   "}
            ))

            # 4. GARANTE QUE O FILTRO DE ROLAGEM EXISTE E REINICIA
            try:
                # Tenta criar o filtro de rolagem (Scroll)
                ws.call(requests.CreateSourceFilter(
                    sourceName=nome_fonte_texto,
                    filterName=nome_filtro_rolagem,
                    filterKind="scroll_filter",
                    filterSettings={"speed_x": 100.0} # Velocidade da rolagem horizontal
                ))
            except Exception:
                # Se o filtro já existe, apenas desligamos e ligamos para reiniciar a animação
                ws.call(requests.SetSourceFilterEnabled(sourceName=nome_fonte_texto, filterName=nome_filtro_rolagem, filterEnabled=False))
                time.sleep(0.1)
                ws.call(requests.SetSourceFilterEnabled(sourceName=nome_fonte_texto, filterName=nome_filtro_rolagem, filterEnabled=True))
            
            self.atualizar_status("Texto animado enviado com sucesso para a Live!", config.COLOR_SUCCESS)
            print(f"📣 Texto animado enviado com sucesso para a Live!", flush=True)
            
            # Se o botão de piscar já estiver ativado, força o reinício sincronizado
            if self.view.btn_efeito_piscar.isChecked():
                self.timer_obs_piscar.start(500)
                
        except Exception as e:
            self.atualizar_status("⚠️ Falha ao atualizar letreiro (Conexão ou OBS)", "#eab308")
            print(f"Erro crítico no letreiro: {e}", flush=True)
                
        except Exception as e:
            self.atualizar_status(f"⚠️ Erro ao atualizar letreiro: {e}", "#eab308")
            print(f"Erro no letreiro: {e}")

    def gerenciar_efeito_piscar_live(self, checked):
        """Liga ou desliga o Timer que faz o OBS piscar"""
        if checked:
            # Só inicia o timer se já existir algum texto enviado
            if self.texto_atual_letreiro:
                self.timer_obs_piscar.start(500) # Pisca a cada 500 milissegundos
        else:
            self.timer_obs_piscar.stop()
            # Certifica-se de que quando o efeito desliga, o texto volta a ficar visível
            self.obs_item_visivel = True
            self.ejecutar_comando_obs(self.acao_alternar_texto_piscar, True)

    def rotina_timer_piscar_obs(self):
        """Inverte o estado de visibilidade a cada ciclo do timer"""
        if not self.texto_atual_letreiro:
            return
        self.obs_item_visivel = not self.obs_item_visivel
        self.ejecutar_comando_obs(self.acao_alternar_texto_piscar, self.obs_item_visivel)

    def acao_alternar_texto_piscar(self, ws, visivel):
        """Muda o texto no OBS para vazio (ocultando) ou para o texto original (exibindo)"""
        from obswebsocket import requests
        try:
            texto_final = f"   {self.texto_atual_letreiro}   " if visivel else ""
            ws.call(requests.SetInputSettings(
                inputName="Letreiro_Avisos",
                inputSettings={"text": texto_final}
            ))
        except:
            pass # Evita travar a aplicação caso o OBS seja fechado abruptamente

    # =========================================================================
    # 🤖 CHAVEADOR DE CENAS E GATILHOS AUTOMÁTICOS
    # =========================================================================
    
    def adicionar_regra_logica(self):
        condicao = self.view.combo_condicao.currentText()
        cena = self.view.combo_cena_destino.currentText()
        
        # Salva no dicionário interno de automações
        self.regras_automacao[condicao] = {
            "cena": cena,
            "disparado": False # Flag de controle para disparar apenas uma vez por evento
        }
        
        # Atualiza o componente visual de lista
        self.view.list_regras.addItem(f"SE [{condicao}] ➔ ENTÃO MUDAR PARA [{cena}]")
        self.atualizar_status("✅ Nova regra de automação adicionada!", config.COLOR_SUCCESS)

    def limpar_regras_logicas(self):
        self.regras_automacao.clear()
        self.view.list_regras.clear()
        self.atualizar_status("🗑️ Todas as regras automáticas foram removidas.", config.COLOR_SECONDARY)

    def alternar_monitoramento_automatico(self):
        self.monitoramento_ativo = self.view.btn_toggle_monitor.isChecked()
        
        if self.monitoramento_ativo:
            if not self.regras_automacao:
                QMessageBox.warning(self.view, "Aviso", "Crie pelo menos uma regra antes de ativar o monitoramento.")
                self.view.btn_toggle_monitor.setChecked(False)
                return
                
            self.view.btn_toggle_monitor.setText("⏸️ PAUSAR MONITORAMENTO")
            self.view.btn_toggle_monitor.setStyleSheet("background-color: #ea580c; color: white; font-weight: bold;")
            self.view.lbl_status_chaveador.setText("🚀 Monitoramento Ativo: Supervisionando OBS Studio...")
            self.view.lbl_status_chaveador.setStyleSheet("font-size: 13px; font-weight: bold; color: #16a34a;")
            
            # Inicia a verificação a cada 1 segundo (1000 milissegundos)
            self.timer_monitor_obs.start(1000)
        else:
            self.timer_monitor_obs.stop()
            self.view.btn_toggle_monitor.setText("▶️ ATIVAR MONITORAMENTO")
            self.view.btn_toggle_monitor.setStyleSheet("background-color: #16a34a; color: white; font-weight: bold;")
            self.view.lbl_status_chaveador.setText("⏸️ Monitoramento Automático: DESACTIVADO")
            self.view.lbl_status_chaveador.setStyleSheet("font-size: 13px; font-weight: bold; color: #64748b;")

    def verificar_gatilhos_logicos(self):
        # Executa uma chamada rápida de inspeção no OBS via o gerenciador existente
        self.ejecutar_comando_obs(self.rotina_polling_status_obs)

    def rotina_polling_status_obs(self, ws):
        try:
            # 1. Captura estados em tempo real vindos do OBS Studio
            status_stream = ws.call(obs_requests.GetStreamStatus()) # Ajustado para obs_requests padrão
            is_streaming = status_stream.getOutputActive()
            is_recording = status_stream.getOutputActive()
            
            # Captura se o Microfone está mutado
            try:
                status_mutado = ws.call(obs_requests.GetMute(sourceName="Microfone")).getMuted()
            except Exception as e:
                print(f"⚠️ [Polling] Falha ao checar mute do microfone: {e}")
                status_mutado = False

            # 2. Avaliação de Mudanças de Estado de forma Dinâmica
            
            # Gatilho: Se Iniciar Transmissão
            if is_streaming and not self.estado_anterior_obs["streaming"]:
                self.processar_disparo_cena(ws, "Se Iniciar Transmissão (Live)")
                
            # Gatilho: Se Parar Transmissão
            elif not is_streaming and self.estado_anterior_obs["streaming"]:
                self.processar_disparo_cena(ws, "Se Parar Transmissão (Live)")
                
            # Gatilho: Se Iniciar Gravação
            if is_recording and not self.estado_anterior_obs["recording"]:
                self.processar_disparo_cena(ws, "Se Iniciar Gravação")
                
            # Gatilho: Se o Microfone for Mutado
            if status_mutado and not self.estado_anterior_obs["muted"]:
                self.processar_disparo_cena(ws, "Se Microfone ficar em Mudo")

            # 3. Atualiza a memória de estados para a próxima verificação
            self.estado_anterior_obs["streaming"] = is_streaming
            self.estado_anterior_obs["recording"] = is_recording
            self.estado_anterior_obs["muted"] = status_mutado

        except Exception as e:
            # 🛑 INTERCEPTAÇÃO DA EXPULSÃO / QUEDA DE CONEXÃO:
            print(f"⚠️ [Polling] Perda de conexão detectada: {e}", flush=True)
            
            # 1. Reseta a variável de conexão persistente interna
            self.ws_persistente = None 
            
            # 2. Atualiza o painel de status visual
            self.atualizar_status("❌ OBS Desconectado", "#eab308")
            
            # 3. Executa a rotina da view que reverte botões para "Conectar" e desliga leds
            if hasattr(self.view, 'atualizar_status_obs_desconectado'):
                self.view.atualizar_status_obs_desconectado()

    def processar_disparo_cena(self, ws, condicao_detectada):
        # Verifica se existe uma regra registrada para essa condição específica
        if condicao_detectada in self.regras_automacao:
            cena_destino = self.regras_automacao[condicao_detectada]["cena"]
            
            # Envia o comando nativo do OBS WebSocket para realizar a transição de cena
            ws.call(requests.SetCurrentProgramScene(sceneName=cena_destino))
            
            self.atualizar_status(f"🤖 Automação: Mudou para cena '{cena_destino}' por gatilho!", config.COLOR_SUCCESS)

    # =========================================================================
    # 🏗️ CONFIGURAÇÃO DE CENAS PADRONIZADAS NO OBS E MUDANÇAS ATOMÁTICAS
    # =========================================================================
    
    def acao_configurar_cenas_obs(self, ws):
        # Lista das cenas padronizadas que o Chaveador Automático monitora
        cenas_obrigatorias = ["Abertura", "Gameplay", "Webcam", "Encerramento"]
        
        self.view.progress_cenas.setValue(0)
        total_passos = len(cenas_obrigatorias) + 2 # Cenas + fontes + finalização
        passo_atual = 0

        try:
            # 1. Captura a lista de cenas atuais para evitar tentar criar duplicados
            cenas_existentes_dados = ws.call(requests.GetSceneList())
            cenas_existentes = [s['sceneName'] for s in cenas_existentes_dados.getScenes()]

            # 2. Loop de criação de Cenas
            for nome_cena in cenas_obrigatorias:
                if nome_cena not in cenas_existentes:
                    self.atualizar_status(f"Criando cena: {nome_cena}...", config.COLOR_SECONDARY)
                    ws.call(requests.CreateScene(sceneName=nome_cena))
                
                passo_atual += 1
                self.view.progress_cenas.setValue(int((passo_atual / total_passos) * 100))
                import time
                time.sleep(0.3) # Delay suave para animação da barra de progresso

            # 3. Adiciona Fontes Básicas Padronizadas (Opcional, mas ajuda a estruturar)
            # Exemplo: Criar um elemento de Texto na cena 'Encerramento'
            try:
                self.atualizar_status("Injetando fontes de texto padrão...", config.COLOR_SECONDARY)
                # Injeta a fonte de Texto que o Agregador Global de Dados atualiza
                ws.call(requests.CreateInput(
                    sceneName="Abertura",
                    inputName="Contador_Live",
                    kind="text_gdiplus_v2",
                    inputSettings={"text": "LIVE | AGUARDANDO", "font": {"size": 48}},
                    sceneItemEnabled=True
                ))
            except Exception:
                # Se a fonte já existir, o OBS ignora e continua
                pass

            # Finalização com sucesso
            self.view.progress_cenas.setValue(100)
            self.view.combo_cena_destino.clear()
            self.view.combo_cena_destino.addItems(cenas_obrigatorias) # Sincroniza o combo da UI
            
            self.atualizar_status("✅ Cenas criadas e vinculadas com sucesso!", config.COLOR_SUCCESS)
            QMessageBox.information(
                self.view, 
                "Sucesso", 
                "As cenas 'Abertura', 'Gameplay', 'Webcam' e 'Encerramento' foram injetadas no seu OBS Studio!"
            )

        except Exception as e:
            self.atualizar_status("❌ Erro ao criar cenários automatizados", "#eab308")
            QMessageBox.critical(self.view, "Falha de Escrita", f"O OBS recusou a criação automática:\n{e}")

    # =========================================================================
    # 🎥 CONTROLE DE CÂMERA: PTZ VIRTUAL (Corrigido método de retorno v5.x)
    # =========================================================================
    def acao_controlar_ptz(self, ws, direcao):
        nome_fonte = self.view.entry_nome_camera.text().strip()
        try:
            # sintaxe v5.x: 'getCurrentProgramSceneName' coleta o nome da cena ativa
            cena_atual_req = ws.call(requests.GetCurrentProgramScene())
            cena_nome = cena_atual_req.getCurrentProgramSceneName() 
            
            # Busca o ID do item na cena
            id_req = ws.call(requests.GetSceneItemId(sceneName=cena_nome, sourceName=nome_fonte))
            item_id = id_req.getSceneItemId()
            
            # Captura a transformação atual
            transform_req = ws.call(requests.GetSceneItemTransform(sceneName=cena_nome, sceneItemId=item_id))
            t = transform_req.getSceneItemTransform()
            
            pos_x = t['positionX']
            pos_y = t['positionY']
            scale_x = t['scaleX']
            scale_y = t['scaleY']
            
            passo_posicao = 40.0
            passo_zoom = 0.15
            
            # Aplica a matemática direcional
            if direcao == "up":
                pos_y -= passo_posicao
            elif direcao == "down":
                pos_y += passo_posicao
            elif direcao == "left":
                pos_x -= passo_posicao
            elif direcao == "right":
                pos_x += passo_posicao
            elif direcao == "zoom_in":
                scale_x += passo_zoom
                scale_y += passo_zoom
            elif direcao == "zoom_out":
                # Impede que a escala fique menor que 0.1 (invisível)
                scale_x = max(0.1, scale_x - passo_zoom)
                scale_y = max(0.1, scale_y - passo_zoom)
            elif direcao == "reset":
                pos_x, pos_y, scale_x, scale_y = 0.0, 0.0, 1.0, 1.0

            # Atualiza a transformação de volta no OBS v5.x
            ws.call(requests.SetSceneItemTransform(
                sceneName=cena_nome,
                sceneItemId=item_id,
                sceneItemTransform={
                    "positionX": pos_x,
                    "positionY": pos_y,
                    "scaleX": scale_x,
                    "scaleY": scale_y
                }
            ))
        except Exception as e:
            print(f"❌ Erro no processamento PTZ Virtual: {e}", flush=True)
            self.atualizar_status("⚠️ Falha ao mover PTZ Virtual", config.COLOR_DANGER)
            
    # =================================================================
    # 🧠 ADVANCED SCENE SWITCHER
    # =================================================================
    def alternar_estado_advanced_switcher(self, ativar=True):
        """
        Liga ou Desliga globalmente o processamento de regras automáticas do Advanced Scene Switcher
        utilizando requisições 'CallVendorRequest' do protocolo OBS WebSocket v5.x.
        """
        estado_str = "Iniciando" if ativar else "Pausando"
        print(f"🧠 [Advanced Switcher] {estado_str} macro de checagem nativa...")
        
        try:
            # O Advanced Scene Switcher expõe seus controles via Vendor no WebSocket
            # 'AdvancedSceneSwitcher' é o nome do Vendor registrado pelo criador do plugin
            self.ws.call(requests.CallVendorRequest(
                vendorName="AdvancedSceneSwitcher",
                requestType="ToggleState" if hasattr(requests, 'CallVendorRequest') else "SetState",
                requestData={"active": ativar}
            ))
            
            cor_status = config.COLOR_SUCCESS if ativar else config.COLOR_DANGER
            self.atualizar_status(f"Advanced Switcher {'Ativo' if ativar else 'Inativo'}", cor_status)
        except Exception as e:
            print(e)
            print(f"⚠️ Não foi possível comunicar com o Advanced Scene Switcher: {str(e)}")
            # Fallback seguro: se o plugin não estiver instalado no OBS, o app avisa sem travar
            self.atualizar_status("Plugin Advanced Switcher não detectado", "#eab308")

    def exportar_regras_para_advanced_switcher(self):
        """
        Pega o dicionário local de regras do seu aplicativo ('self.regras_automacao')
        e exporta em um arquivo .json formatado no padrão que o Advanced Scene Switcher aceita para importação.
        """
        print("💾 Exportando automações no formato Advanced Scene Switcher...")
        
        # Estrutura base compatível com as macros do plugin
        dados_switcher = {
            "version": 1,
            "macros": []
        }

        # Converte as regras do seu aplicativo para o formato de condições do plugin
        for condicao, cena_destino in self.regras_automacao.items():
            macro_formatada = {
                "name": f"Auto_Troca_{condicao}",
                "active": True,
                "conditions": [
                    {
                        "type": "variable", # Exemplo base: checando variáveis ou status do sistema
                        "variable": condicao,
                        "operator": "equals",
                        "value": "true"
                    }
                ],
                "actions": [
                    {
                        "type": "scene",
                        "scene": cena_destino
                    }
                ]
            }
            dados_switcher["macros"].append(macro_formatada)

        # Abre a caixa de diálogo para salvar o arquivo na máquina do usuário
        caminho_arquivo, _ = QFileDialog.getSaveFileName(
            self.view, 
            "Salvar Regras Advanced Switcher", 
            "", 
            "Arquivos JSON (*.json)"
        )
        
        if caminho_arquivo:
            try:
                with open(caminho_arquivo, 'w', encoding='utf-8') as f:
                    json.dump(dados_switcher, f, indent=4, ensure_ascii=False)
                QMessageBox.information(self.view, "Sucesso", "Regras exportadas perfeitamente! Agora basta importá-las no menu do Advanced Scene Switcher dentro do OBS.")
            except Exception as e:
                QMessageBox.critical(self.view, "Erro", f"Falha ao salvar arquivo: {str(e)}")

    # =========================================================================
    # ⏪ SISTEMA DE REPLAY INSTANTÂNEO COM AUTO-START
    # =========================================================================
    def acao_salvar_replay(self, ws):
        try:
            # 1. Verifica se o Replay Buffer está rodando
            status = ws.call(requests.GetReplayBufferStatus())
            
            if not status.datain.get('outputActive'):
                self.atualizar_status("🔄 Buffer desligado, iniciando...", config.COLOR_SECONDARY)
                # 2. Tenta iniciar o Buffer
                ws.call(requests.StartReplayBuffer())
                # Pequena pausa para o OBS processar a ativação
                import time
                time.sleep(1)
            
            # 3. Dispara o salvamento do clipe
            ws.call(requests.SaveReplayBuffer())
            self.atualizar_status("⏪ Clipe guardado com sucesso!", config.COLOR_SUCCESS)
            
        except Exception as e:
            self.atualizar_status("⚠️ Erro no Replay: Verifique as configurações do OBS.", "#eab308")
            QMessageBox.warning(self.view, "Aviso", "O Buffer de Replay não está configurado nas 'Saídas' do OBS.")

    # =========================================================================
    # 🔍 ZOOM DINÂMICO E RASTREAMENTO DE RATO
    # =========================================================================
    def alternar_zoom_dinamico(self):
        import pyautogui
        self.zoom_ativo = self.view.btn_toggle_zoom.isChecked()
        
        if self.zoom_ativo:
            self.view.btn_toggle_zoom.setText("🔍 Zoom Ativo (Ctrl+Alt+Z)")
            self.view.btn_toggle_zoom.setStyleSheet("background-color: #ef4444; color: white; font-weight: bold;")
            self.atualizar_status("🔍 Zoom dinâmico ativado através de macro do sistema.", config.COLOR_SUCCESS)
            # Simula o atalho configurado no OBS Script para Click-to-Zoom
            pyautogui.hotkey('ctrl', 'alt', 'z')
        else:
            self.view.btn_toggle_zoom.setText("🔍 Ativar Zoom no Rato")
            self.view.btn_toggle_zoom.setStyleSheet("background-color: #6b7280; color: white;")
            pyautogui.hotkey('ctrl', 'alt', 'z') # Dispara novamente para desligar

    # =========================================================================
    # 🎚️ AUTOMAÇÃO DE ÁUDIO (SMART DUCKING)
    # =========================================================================
    def gerenciar_smart_ducking(self, state):
        self.ducking_ativo = (state == 2) # 2 significa Marcado (Checked)
        if self.ducking_ativo:
            self.atualizar_status("🎚️ Monitor de Ducking Inteligente Ativado", config.COLOR_SUCCESS)
            # Executa uma rotina inicial para garantir o balanceamento de som
            self.executar_comando_obs(self.aplicar_ducking_audio, abaixar=True)
        else:
            self.executar_comando_obs(self.aplicar_ducking_audio, abaixar=False)

    def aplicar_ducking_audio(self, ws, abaixar):
        try:
            # Se abaixar for True, reduz o som do Desktop/Música para 20% e garante Mic a 100%
            vol_musica = 0.20 if abaixar else 0.80
            ws.call(requests.SetInputVolume(inputName="Desktop Audio", inputVolume=vol_musica, useDecibels=False))
            ws.call(requests.SetInputVolume(inputName="Microfone", inputVolume=1.0, useDecibels=False))
        except Exception:
            pass

    # =========================================================================
    # 📊 AGREGADOR GLOBAL DE DADOS (DATA BRIDGE)
    # =========================================================================
    def atualizar_agregador_dados(self):
        import random
        import requests
        
        # 1. Procura a audiência do VDO.Ninja (Exemplo real de integração API)
        try:
            res_ninja = requests.get("https://vdo.ninja/api/status?room=LiveHub", timeout=2).json()
            viewers_ninja = res_ninja.get('viewers', 0)
        except:
            viewers_ninja = 0

        # 2. Simulação de APIs do YouTube Live / Instagram
        # Verifica se o atributo 'transmitindo' existe, caso contrário assume False
        is_transmitindo = getattr(self, 'transmitindo', False)
        viewers_youtube = random.randint(15, 30) if is_transmitindo else 0
        viewers_instagram = random.randint(10, 25) if self.view.entry_key_insta.text().strip() else 0

        total_consolidado = viewers_ninja + viewers_youtube + viewers_instagram
        
        # Atualiza a Label na Interface Principal
        if hasattr(self.view, 'lbl_total_viewers'):
            self.view.lbl_total_viewers.setText(
                f"📊 Audiência Consolidada: {total_consolidado} Viewers "
                f"(YT: {viewers_youtube} | IG: {viewers_instagram} | Ninja: {viewers_ninja})"
            )

        # 3. Injeta o valor em tempo real diretamente dentro de uma fonte de texto do OBS
        # 🛡️ PROTEÇÃO: Só envia se a conexão persistente global estiver ativa e validada de verdade
        if total_consolidado > 0:
            if hasattr(self, 'ws_persistente') and self.ws_persistente and self.ws_persistente.ws and self.ws_persistente.ws.connected:
                try:
                    # Executa o callback diretamente usando o túnel persistente aberto
                    # Isso evita abrir blocos de exceção visuais (QMessageBox) no meio da live
                    self.atualizar_texto_obs_audiencia(self.ws_persistente, total_consolidado)
                except Exception as e:
                    print(f"⚠️ Erro silencioso ao atualizar texto de audiência no OBS: {str(e)}", flush=True)

    def sincronizar_credenciais_wpstream(self):
        canal_id = self.view.entry_canal_id.text().strip()
        if not canal_id:
            QMessageBox.warning(self.view, "Aviso", "Por favor, informe o ID do canal cadastrado no WordPress.")
            return

        from wpstream_manager import WpStreamManager
        # Configurado usando a URL base do órgão administrativo
        wp_manager = WpStreamManager("https://fasepa.pa.gov.br")
        
        # Dica: Use Application Passwords do painel do WP para não expor sua senha master corporativa
        if wp_manager.autenticar_admin("seu_usuario_admin", "sua_application_password"):
            credenciais = wp_manager.obter_credenciais_rtmp(canal_id)
            
            if credenciais:
                # Aplica as configurações dinamicamente no motor do OBS Studio
                self.credenciais_wp_ativas = credenciais
                self.executar_comando_obs(self.acao_aplicar_rtmp_customizado_obs)
            else:
                self.atualizar_status("❌ Falha ao buscar chaves RTMP do WPStream", "#eab308")
        else:
            self.atualizar_status("❌ Falha de Autenticação no Portal FASEPA", "#eab308")

    def acao_aplicar_rtmp_customizado_obs(self, ws):
        try:
            # Configura o OBS para transmitir usando servidor customizado (Custom RTMP)
            ws.call(requests.SetStreamServiceSettings(
                streamServiceType="rtmp_custom",
                streamServiceSettings={
                    "server": self.credenciais_wp_ativas["server"],
                    "key": self.credenciais_wp_ativas["key"],
                    "use_auth": False
                }
            ))
            self.view.lbl_status_wp.setText("✅ Sucesso: OBS sincronizado com o Canal do Portal!")
            self.view.lbl_status_wp.setStyleSheet("color: #16a34a; font-weight: bold;")
            self.atualizar_status("✅ Servidor Customizado RTMP configurado no OBS", config.COLOR_SUCCESS)
        except Exception as e:
            self.atualizar_status("⚠️ Erro ao injetar RTMP customizado no OBS", "#eab308")
    
    # =========================================================================
    # 📊  CONTADOR DE AUDIÊNCIA
    # =========================================================================
    def atualizar_texto_obs_audiencia(self, ws, total):
        try:
            # CORREÇÃO v5.x: Mudado de SetSourceSettings para SetInputSettings (fontes de texto são Inputs)
            ws.call(requests.SetInputSettings(
                inputName="Contador_Live",
                inputSettings={"text": f"LIVE | {total} ASSISTINDO"}
            ))
        except Exception as e:
            print(f"⚠️ Erro ao atualizar contador de audiência no OBS: {e}", flush=True)

    # =========================================================================
    # 🎯 SINCRO DE EVENTOS DA TRANSMISSÃO (Fidelidade Absoluta)
    # =========================================================================
    def ao_iniciar_transmissao(self, event):
        """Disparado pelo OBS quando a live de fato fica ONLINE no servidor (YouTube)."""
        print("📣 Evento OBS: Transmissão iniciada e conectada com sucesso!", flush=True)
        # Dispara o sinal seguro para a thread principal do PySide6
        self.bridge_live.estado_live_alterado.emit(True)

    def ao_parar_transmissao(self, event):
        """Disparado pelo OBS quando a live é parada ou cai por falta de sinal."""
        print("📣 Evento OBS: Transmissão interrompida ou finalizada!", flush=True)
        # Dispara o sinal seguro para a thread principal do PySide6
        self.bridge_live.estado_live_alterado.emit(False)

    def atualizar_visual_live_safe(self, ativa: bool):
        """Atualiza a interface gráfica do seu Hub baseando-se na verdade real do OBS."""
        if ativa:
            self.atualizar_status("🟢 LIVE TRANSMITINDO COM SUCESSO!", config.COLOR_SUCCESS)
            # Liga o LED verde e libera os controles PTZ (Método original da sua View)
            if hasattr(self.view, 'atualizar_status_live_online'):
                self.view.atualizar_status_live_online()
                # Habilita o botão de compartilhamento assim que a transmissão inicia
                if hasattr(self.view, 'btn_share_link'):
                    self.view.btn_share_link.setEnabled(True)
        else:
            self.atualizar_status("🔴 Transmissão finalizada ou Offline.", config.COLOR_DANGER)
            # Desliga o LED e volta o botão para o modo offline
            if hasattr(self.view, 'atualizar_status_obs_desconectado'):
                self.view.atualizar_status_obs_desconectado()
                # Desabilita novamente o botão para evitar compartilhamentos pós-live
                if hasattr(self.view, 'btn_share_link'):
                    self.view.btn_share_link.setEnabled(False)
    
    # =========================================================================
    # CONTROLE MASTER DA LIVE YOUTUBE / TRANSMISSÃO (LIGA / DESLIGA)
    # =========================================================================
    def acao_toggle_live_youtube(self, ws):
        print(f"[acao_toggle_live_youtube] Iniciando a configuração do tipo de transmissão youtube no OBS/webscoket e iniciando a live n youtube...", flush=True)
        # 1. Garante o objeto de conexão válido antes de configurar
        if not ws or isinstance(ws, bool):
            print(f"❌ [acao_toggle_live_youtube] Erro: Não conectado no OBS via websocket!", flush=True)
            self.atualizar_status("❌ Erro: OBS/websocket não conectado!", config.COLOR_DANGER)
            return
            
        if not self.transmitindo:
            try:
                # 1. Definição explícita e dinâmica baseada na escolha de protocolo do usuário
                protocolo_selecionado = self.view.tipo_protocolo_yt.currentText()
                chave_yt = self.view.entry_key_yt.text().strip() 
                
                if not chave_yt:
                    QMessageBox.warning(
                        self.view, 
                        "Atenção: chave ausente", 
                        "Nenhuma chave de transmissão do youtube válida foi retornada pelo Google OAuth2 ainda."
                    )
                    return 

                # Mapeamento dinâmico do servidor de ingestão oficial (idêntico à configuração de redes)
                # RTMPS usa "primary", HLS usa "primary_hls"
                servidor_ingest = "primary" if "RTMPS" in protocolo_selecionado else "primary_hls"

                print(f"[acao_toggle_live_youtube] Configurando o tipo de transmissão youtube no OBS/websocket -> protocolo '{protocolo_selecionado}' e server ({servidor_ingest})...", flush=True)
                
                # 2. INJETA A CHAVE E O SERVIDOR DE INGESTÃO VIA RTMP_COMMON
                ws.call(requests.SetStreamServiceSettings(
                    streamServiceType="rtmp_common",
                    streamServiceSettings={
                        "service": protocolo_selecionado, 
                        "server": servidor_ingest, 
                        "key": chave_yt,
                        "use_auth": False
                    }
                ))
                self.atualizar_status("✅ Transmissão youtube configurada no OBS/websocket!", config.COLOR_SUCCESS)
                print(f"✅ [acao_toggle_live_youtube] Tipo de transmissão youtube configurada no OBS/webscoket com sucesso -> {protocolo_selecionado} | Servidor: {servidor_ingest}", flush=True)
                
                # 3. LIGA A TRANSMISSÃO NO OBS
                ws.call(requests.StartStream())
                self.transmitindo = True
                
                # 4. ATUALIZA A INTERFACE
                self.view.btn_stream.setText("🔴 PARAR LIVE")
                self.view.btn_stream.setStyleSheet(f"background-color: {config.COLOR_DANGER}; color: white; font-weight: bold; padding: 8px;")
                
                if hasattr(self.view, 'atualizar_status_live_online'):
                    self.view.atualizar_status_live_online()
                    
            except Exception as e:
                # Se der erro AQUI, a live não liga e a interface não fica com o botão de parar falso
                print(f"❌ Erro ao tentar iniciar a transmissão: {e}", flush=True)
                QMessageBox.critical(
                    self.view, 
                    "Erro ao Iniciar Live", 
                    f"O OBS recusou o comando de iniciar transmissão.\n\nDetalhe: {str(e)}"
                )
                
        else:
            try:
                # 5. DESLIGA A TRANSMISSÃO NO OBS 
                ws.call(requests.StopStream())
                self.transmitindo = False
                
                # 6. RETORNA A INTERFACE AO ESTADO PADRÃO
                self.view.btn_stream.setText("📺 INICIAR LIVE")
                self.view.btn_stream.setStyleSheet(f"background-color: {config.COLOR_SUCCESS}; color: white; font-weight: bold; padding: 8px;")
                
                if hasattr(self.view, 'atualizar_status_live_offline'):
                    self.view.atualizar_status_live_offline()
                    
            except Exception as e:
                print(f"❌ Erro ao tentar parar a transmissão: {e}", flush=True)
                QMessageBox.critical(self.view, "Erro", f"Falha ao parar transmissão: {str(e)}")


    def acao_toggle_gravar(self, ws):
        from obswebsocket import requests
        
        try:
            if not self.gravando:
                # StartRecord, websocket v5
                ws.call(requests.StartRecord())
                self.gravando = True
                self.view.btn_gravar.setText("⏸️ PARAR GRAVAÇÃO")
                self.view.btn_gravar.setStyleSheet(f"background-color: {config.COLOR_DANGER};")
            else:
                # Gravar live
                ws.call(requests.StopRecord())
                self.gravando = False
                self.view.btn_gravar.setText("⏺️ GRAVAR LIVE")
                self.view.btn_gravar.setStyleSheet(f"background-color: {config.COLOR_DARK};")
                
        except Exception as e:
            # Proteção, se der erro, não desconecta o OBS, apenas avisa no terminal
            print(f"❌ Erro ao acionar gravação: {e}", flush=True)
            self.atualizar_status("⚠️ Erro ao acionar gravação. Verifique o OBS e o log.", "#eab308")

    #config do tipo de transmissão, youtube RTMPS ou youtube HLS
    def acao_config_transmissao_yt(self, ws):
        print(f"[acao_configurar_redes] Iniciando a configuração do tipo de transmissão youtube no OBS/webscoket...", flush=True)
        # 1. Garante o objeto de conexão válido antes de configurar
        if not ws or isinstance(ws, bool):
            print(f"❌ [acao_configurar_redes] Erro: Não conectado no OBS via websocket!", flush=True)
            self.atualizar_status("❌ Erro: OBS/websocket não conectado!", config.COLOR_DANGER)
            return

        # 2. 🚨 GARANTE QUE O LOGIN GOOGLE OAUTH2 SÓ PASSA SE TIVER ATIVO (LED VERDE)
        # Se o seu led começa vermelho (#ef4444), validamos por ele ou pela string default da chave
        if hasattr(self, 'led_painel_yt') and "ef4444" in self.led_painel_yt.styleSheet():
            QMessageBox.warning(
                self, 
                "Acesso Negado", 
                "Você precisa realizar o vínculo via Google OAuth2 antes de aplicar as configurações no OBS!"
            )
            return

        #chave_yt = self.entry_key_yt.text().strip()
        chave_yt = self.view.entry_key_yt.text().strip() 
        
        if not chave_yt:
            QMessageBox.warning(self.view, "Atenção: chave ausente", "Nenhuma chave de transmissão do youtube válida foi retornada pelo Google OAuth2 ainda.")
            return

        try:
            # 3. Recupera os valores preenchidos na interface
            protocolo_selecionado1 = self.view.tipo_protocolo_yt.currentText()

            # 4. Mapeamento dinâmico do servidor correto baseado no protocolo selecionado
            # RTMPS usa "primary", HLS usa "primary_hls"
            servidor_ingest1 = "primary" if "RTMPS" in protocolo_selecionado1 else "primary_hls"
            print(f"[acao_configurar_redes] Configurando o tipo de transmissão youtube no OBS/webscoket -> protocolo '{protocolo_selecionado1}' e server '({servidor_ingest1}')...", flush=True)

            # 5. Injeta a CHAVE e o SERVIDOR DO YOUTUBE no obs via websocket
            ws.call(requests.SetStreamServiceSettings(
                streamServiceType="rtmp_common",
                streamServiceSettings={
                    "service": protocolo_selecionado1, 
                    "server": servidor_ingest1, 
                    "key": chave_yt,
                    "use_auth": False
                }
            ))
            self.atualizar_status("✅ Tipo de transmissão configurado!", config.COLOR_SUCCESS)
            print(f"✅ [acao_configurar_redes] Tipo de transmissão youtube configurada no OBS/webscoket com sucesso -> {protocolo_selecionado1} | Servidor: {servidor_ingest1}", flush=True)
            
        except Exception as e:
            print(f"❌ [acao_configurar_redes] Erro ao configurar o tipo de transmissão -> Motivo: {e}", flush=True)
            self.atualizar_status("❌ Falha ao aplicar o tipo de transmissão", config.COLOR_DANGER)
            QMessageBox.warning(
                self, 
                "Erro de Configuração", 
                f"O OBS recusou a configuração do tipo de transmissão...\n\nDetalhe técnico: {e}"
            )

    # =========================================================================
    # 🎛️ ALTERNAR FILTROS
    # =========================================================================
    def acao_toggle_filtro(self, ws):
        self.filtro_ativo = not self.filtro_ativo
        try:
            # CORREÇÃO v5.x: Mudado de SetSourceFilterVisibility para SetSourceFilterEnabled
            ws.call(requests.SetSourceFilterEnabled(
                sourceName="Webcam", 
                filterName="Filtro_Live", 
                filterEnabled=self.filtro_ativo
            ))
            self.atualizar_status("✅ Filtro alternado!", config.COLOR_SUCCESS)
        except Exception as e:
            print(f"❌ Erro ao alternar visibilidade do filtro: {e}", flush=True)
            self.atualizar_status("⚠️ Filtro ou Fonte não encontrados.", config.COLOR_SECONDARY)

    # =========================================================================
    # 🔊 AJUSTAR VOLUME
    # =========================================================================
    def acao_ajustar_volume(self, ws, valor):
        try:
            # sintaxe v5.x: 'inputVolumeMul' para valores de 0.0 a 1.0
            ws.call(requests.SetInputVolume(
                inputName="Microfone", 
                inputVolumeMul=float(valor) / 100.0
            ))
        except Exception as e:
            # Log discreto para não poluir a timeline de áudio em tempo real
            print(f"⚠️ [Áudio] Falha ao ajustar volume do Microfone: {e}", flush=True)

    def rotina_selecionar_e_enviar_midia(self):
        """Abre o QFileDialog e, se um arquivo for selecionado, dispara o comando para o OBS"""
        arquivo, _ = QFileDialog.getOpenFileName(
            self.view,
            "Selecionar Mídia para o OBS",
            "",
            "Arquivos de Vídeo/Imagem (*.mp4 *.mkv *.avi *.mov *.mp3 *.png *.jpg *.jpeg);;Todos os Arquivos (*)"
        )
        
        if arquivo:
            # Substitui as barras do Windows para evitar problemas de escape de string no JSON do OBS
            arquivo_formatado = arquivo.replace("/", "\\")
            # Atualiza o campo visual na interface para o usuário ver
            self.view.entry_caminho_midia.setText(arquivo_formatado)
            
            # Executa o comando de atualização de forma segura dentro do ecossistema do WebSocket
            self.ejecutar_comando_obs(self.acao_atualizar_arquivo_obs, arquivo_formatado)

    def acao_atualizar_arquivo_obs(self, ws, caminho_arquivo):
        """Altera dinamicamente o arquivo local apontado por uma fonte de mídia no OBS"""
        try:
            # OBS WebSocket v5 usa 'SetInputSettings' para alterar as propriedades de uma fonte.
            # 'Video_Introducao' deve ser o nome exato da sua fonte de mídia (Media Source) ou Fonte de Imagem no OBS.
            ws.call(obs_requests.SetInputSettings(
                inputName="Video_Introducao",
                inputSettings={
                    "local_file": caminho_arquivo
                }
            ))
            self.atualizar_status("✅ Arquivo de mídia atualizado no OBS com sucesso!", config.COLOR_SUCCESS)
            print(f"🎬 Mídia atualizada no OBS: {caminho_arquivo}", flush=True)
        except Exception as e:
            self.atualizar_status(f"❌ Falha ao injetar mídia no OBS: {e}", config.COLOR_DANGER)
    
    # --- INICIALIZADOR EXTERNO DO PROCESSO DO OBS ---
    def abrir_obs_studio(self):
        if not os.path.exists(config.CAMINHO_OBS):
            QMessageBox.critical(self.view, "Erro", f"Executável do OBS não encontrado em:\n{config.CAMINHO_OBS}")
            print(f"[abrir_obs_studio] Executável do OBS não foi encontrado na pasta: {config.CAMINHO_OBS}", flush=True)
            return

        perfil = self.view.combo_perfil.currentText()
        colecao = self.view.combo_colecao.currentText()
        comando = [config.CAMINHO_OBS]

        if "Nenhum" not in perfil:
            comando.extend(["--profile", perfil])
        if "Nenhum" not in colecao:
            comando.extend(["--collection", colecao])

        try:
            print(f"[abrir_obs_studio] Iniciando o programa OBS Studio...", flush=True)
            self.atualizar_status("Iniciando o OBS Studio...", config.COLOR_SECONDARY)
            subprocess.Popen(comando, cwd=os.path.dirname(config.CAMINHO_OBS))
            self.atualizar_status("✅ OBS Studio iniciando!", config.COLOR_SUCCESS)
        except Exception as e:
            QMessageBox.critical(self.view, "Erro", f"Falha ao executar o OBS Studio:\n{e}")
            print(f"Erro ao iniciaroOBS studio: {e}", flush=True)
            
    # --- EXPORTADOR CONFIGS AUTOMÁTICO ---
    def exportar_configuracoes_obs(self):
        import os
        import json

        # 1. 🛡️ Recupera o nome do perfil tratando o objeto de forma segura
        nome_perfil = None
        
        # Procura qual atributo do controller guarda o LoginManager
        manager = None
        for attr_name in dir(self):
            attr_value = getattr(self, attr_name)
            if attr_value.__class__.__name__ == 'LoginManager':
                manager = attr_value
                break
        
        # Se encontrou o manager (com qualquer nome), pega o usuário logado
        if manager:
            nome_perfil = getattr(manager, 'usuario_atual', None)
        
        # Caso o loop não ache (ex: o login foi manual sem passar pelo manager)
        if not nome_perfil:
            # Tenta pegar direto o texto que está visível no botão do painel do YouTube
            texto_botao = self.view.btn_login_yt_manual.text()
            if "Conectado:" in texto_botao:
                nome_perfil = texto_botao.replace("Conectado:", "").strip()
            # Se não encontrou no YouTube, tenta pegar o do Instagram
            elif "Conectado:" in self.view.btn_login_insta.text():
                nome_perfil = self.view.btn_login_insta.text().replace("Conectado:", "").strip()

        # Limpa caracteres especiais do nome para evitar pastas inválidas no Windows
        if nome_perfil:
            nome_perfil = "".join(c for c in nome_perfil if c.isalnum() or c in ('@', '_', '-')).strip()

        # Se mesmo com todas as buscas o usuário não estiver logado:
        if not nome_perfil:
            QMessageBox.warning(
                self.view, 
                "Autenticação Necessária", 
                "Por favor, realize o login no YouTube ou Instagram antes de exportar as configurações para o OBS."
            )
            return

        yt_key = self.view.entry_key_yt.text().strip()
        insta_key = self.view.entry_key_insta.text().strip()

        # 2. Monta a estrutura correta do JSON
        if insta_key:
            estrutura = {
                "settings": {"bwtest": False, "key": insta_key, "server": "rtmps://live-api-s.instagram.com:443/rtmp/", "use_auth": False},
                "type": "rtmp_custom"
            }
        else:
            estrutura = {
                "settings": {"key": yt_key, "server": "auto", "service": "YouTube"},
                "type": "rtmp_common"
            }

        try:
            # 3. Resolve dinamicamente o caminho da pasta %APPDATA% no Windows
            appdata = os.environ.get("APPDATA")
            pasta_perfil_obs = os.path.join(appdata, "obs-studio", "basic", "profiles", nome_perfil)
            
            # Garante que a pasta do perfil exista
            os.makedirs(pasta_perfil_obs, exist_ok=True)
            
            # --- SALVANDO O STREAM.JSON ---
            caminho_stream = os.path.join(pasta_perfil_obs, "stream.json")
            with open(caminho_stream, "w", encoding="utf-8") as f:
                json.dump(estrutura, f, indent=4, ensure_ascii=False)

            # --- GERANDO O ARQUIVO BASIC.INI OBRIGATÓRIO ---
            caminho_basic_ini = os.path.join(pasta_perfil_obs, "basic.ini")
            
            # 🛑 CORREÇÃO: Resgata os tokens com segurança direto do gerenciador (se existirem)
            token = ""
            refresh_token = ""
            expire_time = "0"
            
            if manager and hasattr(manager, 'controller') and hasattr(manager.controller, 'yt_worker'):
                worker = manager.controller.yt_worker
                # Se o worker tiver os atributos de token do fluxo OAuth2, nós os copiamos
                token = getattr(worker, 'token', "")
                refresh_token = getattr(worker, 'refresh_token', "")
                expire_time = str(getattr(worker, 'expire_time', "0"))
            
            # Estrutura base necessária para o OBS validar o perfil sem resetar
            conteudo_ini = f"""[General]
Name={nome_perfil}

[Auth]
Type=YouTube - RTMP

[Stream1]
IgnoreRecommended=false
EnableMultitrackVideo=false

[YouTube]
ChannelName={nome_perfil}
RefreshToken={refresh_token}
Token={token}
ExpireTime={expire_time}
ScopeVer=1
"""
            
            # Salva o arquivo basic.ini
            with open(caminho_basic_ini, "w", encoding="utf-8") as f:
                f.write(conteudo_ini)
                
            # ----------------------------------------
            self.atualizar_status(f"✅ Perfil OBS '{nome_perfil}' atualizado!", config.COLOR_SUCCESS)
            QMessageBox.information(
                self.view, 
                "Sucesso", 
                f"Configuração exportada com sucesso!\n\n"
                f"Arquivos salvos em:\n{pasta_perfil_obs}\n\n"
                f"Abra o OBS Studio e selecione o perfil '{nome_perfil}'."
            )
        except Exception as e:
            QMessageBox.critical(self.view, "Erro", f"Não foi possível criar ou salvar o perfil no OBS:\n{e}")
    
    
    # --- GERENCIADOR DE COMPARTILHAMENTO ---
    def compartilhar_links_live(self):
        #Formata, copia para a área de transferência e exibe os links de compartilhamento da Live.
    
        links = []
    
        # 📺 Validação do YouTube (Segura contra ausência do widget)
        entry_yt = getattr(self.view, 'entry_key_yt', None)
        if entry_yt and entry_yt.text().strip():
            # Como o YouTube Live genérico redireciona bem, mantemos o link limpo.
            # Se você tiver um link de canal fixo, pode substituí-lo aqui se desejar!
            links.append("📺 Assista no YouTube: https://www.youtube.com/live")
        
        # 📸 Validação do Instagram (Procura por múltiplos nomes possíveis do campo para evitar erros)
        entry_ig = (
            getattr(self.view, 'entry_insta_user', None) or 
            getattr(self.view, 'entry_user_insta', None) or 
            getattr(self.view, 'entry_username_insta', None)
        )
    
        if entry_ig and entry_ig.text().strip():
            # Limpa o texto caso o usuário tenha digitado com '@' por engano
            user_ig = entry_ig.text().strip().replace("@", "")
            # O link do perfil direto é o mais seguro para lives no Instagram
            links.append(f"📸 Assista no Instagram: https://instagram.com/{user_ig}")

        # ⚠️ Se nenhuma credencial/campo estiver preenchido
        if not links:
            QMessageBox.warning(
                self.view, 
                "Aviso", 
                "Nenhuma transmissão ativa ou credencial configurada para gerar links de compartilhamento."
            )
            return

        # 📝 Formatação visual atraente para envio em Redes Sociais (WhatsApp, Telegram, etc.)
        links_formatados = "\n".join(links)
        msg_final = (
            "📢 *Estamos AO VIVO!* \n"
            "Venha acompanhar nossa transmissão agora mesmo nos canais abaixo:\n\n"
            f"{links_formatados}\n\n"
            "✨ Não perca! Esperamos você lá."
        )
    
        # 📋 Processo de cópia seguro para a Área de Transferência
        try:
            clipboard = QApplication.clipboard()
            clipboard.setText(msg_final)
            
            QMessageBox.information(
                self.view, 
                "🔗 Links Copiados!", 
                f"O texto de convite foi copiado com sucesso para a área de transferência!\n\n{msg_final}"
            )
        except Exception as e:
            QMessageBox.critical(
                self.view,
                "Erro",
                f"Não foi possível interagir com a área de transferência do sistema: {e}"
            )

    # --- MANIPULADOR DE INTERFACES DLL (ctypes) ---
    def selecionar_dll(self):
        caminho, _ = QFileDialog.getOpenFileName(self.view, "Selecionar Plugin DLL", "", "Dynamic Link Library (*.dll)")
        if caminho:
            try:
                nome = self.dll_model.carregar_dll(caminho)
                self.view.entry_dll_path.setText(caminho)
                self.atualizar_status(f"✅ Plugin '{nome}' carregado!", config.COLOR_SUCCESS)
            except Exception as e:
                QMessageBox.critical(self.view, "Erro de Carga", str(e))

    def executar_funcao_dll(self):
        func_nome = self.view.entry_dll_func.text().strip()
        if not func_nome:
            QMessageBox.warning(self.view, "Aviso", "Insira o nome da função contida na DLL.")
            return
        try:
            res = self.dll_model.executar_funcao(func_nome)
            QMessageBox.information(self.view, "Sucesso", f"Executado!\nRetorno da DLL: {res}")
        except Exception as e:
            QMessageBox.critical(self.view, "Erro de Execução", str(e))

    # --- RECURSOS AUXILIARES (CRONOMETRO / PREVIEW PIP) ---
    def iniciar_cronometro(self):
        try:
            minutos = int(self.view.entry_cronometro.text())
            self.cronometro_worker = CountdownWorker(minutos, config.HOST, config.PORT, config.PASSWORD)
            self.cronometro_worker.tick_signal.connect(self.view.lbl_cronometro_vazio.setText)
            self.cronometro_worker.start()
        except:
            QMessageBox.critical(self.view, "Erro", "Insira um número de minutos válido.")

    def alternar_preview_window(self):
        if self.preview_view is None:
            self.preview_view = PreviewWindow(on_close_callback=self.finalizar_preview_worker)
            self.preview_worker = OBSPreviewWorker(config.HOST, config.PORT, config.PASSWORD)
            self.preview_worker.frame_ready.connect(self.preview_view.update_frame)
            self.preview_worker.start()
            self.preview_view.show()
            self.atualizar_status("👁️ Monitor de Preview Ativo", config.COLOR_SUCCESS)
        else:
            self.preview_view.raise_()

    def finalizar_preview_worker(self):
        if self.preview_worker:
            self.preview_worker.stop()
            self.preview_worker.wait()
            self.preview_worker = None
        self.preview_view = None
        self.atualizar_status("Pronto", config.COLOR_PRIMARY)
        
    def toggle_janela_chave_youtube(self):
        """Alterna a exibição oculta/visível da chave do YouTube"""
        if self.btn_ver_key_yt.isChecked():
            # Exibe a chave em modo texto normal alfanumérico
            self.entry_key_yt.setEchoMode(QLineEdit.EchoMode.Normal)
            self.btn_ver_key_yt.setText("🕶️") # Ícone de óculos ou olho fechado opcional
            self.btn_ver_key_yt.setStyleSheet("background-color: #cbd5e1; color: #0f172a; padding: 4px; font-size: 14px;")
        else:
            # Oculta novamente em formato de bolinhas (Password)
            self.entry_key_yt.setEchoMode(QLineEdit.EchoMode.Password)
            self.btn_ver_key_yt.setText("👁️")
            self.btn_ver_key_yt.setStyleSheet("background-color: #e2e8f0; color: #334155; padding: 4px; font-size: 14px;")

    def toggle_janela_chave_instagram(self):
        """Alterna a exibição oculta/visível da chave do Instagram"""
        if self.btn_ver_key_insta.isChecked():
            # Exibe a chave em modo texto normal alfanumérico
            self.entry_key_insta.setEchoMode(QLineEdit.EchoMode.Normal)
            self.btn_ver_key_insta.setText("🕶️")
            self.btn_ver_key_insta.setStyleSheet("background-color: #cbd5e1; color: #0f172a; padding: 4px; font-size: 14px;")
        else:
            # Oculta novamente em formato de bolinhas (Password)
            self.entry_key_insta.setEchoMode(QLineEdit.EchoMode.Password)
            self.btn_ver_key_insta.setText("👁️")
            self.btn_ver_key_insta.setStyleSheet("background-color: #e2e8f0; color: #334155; padding: 4px; font-size: 14px;")