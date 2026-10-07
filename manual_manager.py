from PySide6.QtWidgets import QWidget, QVBoxLayout, QLabel, QScrollArea, QGroupBox
from PySide6.QtCore import Qt

class ManualManager:
    @staticmethod
    def renderizar_aba_manual(parent_view, aba_manual):
        """
        Monta e renderiza a aba de documentação técnica bilingue sem poluir a View principal.
        """
        # 📌 Layout vertical principal da aba Manual
        layout_aba = QVBoxLayout(aba_manual)
        layout_aba.setContentsMargins(20, 20, 20, 20)
        layout_aba.setSpacing(15)

        # Título da Aba (Bilingue)
        lbl_titulo = QLabel("Guia de Referência / Reference Guide")
        lbl_titulo.setStyleSheet("font-size: 16px; font-weight: bold; color: #1e293b;")
        layout_aba.addWidget(lbl_titulo)

        # Container com Scroll para o conteúdo fluir perfeitamente
        scroll = QScrollArea(parent_view)
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("border: none; background-color: transparent;")
        
        conteudo_scroll = QWidget()
        layout_conteudo = QVBoxLayout(conteudo_scroll)
        layout_conteudo.setSpacing(12)
        layout_conteudo.setAlignment(Qt.AlignmentFlag.AlignTop)

        # Lista Mapeada de Funções Atualizadas (Sem simulações/logins falsos)
        funcoes_doc = [
            (
                "acao_criar_cenas", 
                "Gera e monta automaticamente no OBS Studio a estrutura inicial de cenas padrões necessárias para a transmissão.",
                "Automatically generates and builds the initial standard scene structure required for broadcasting within OBS Studio."
            ),
            (
                "acao_salvar_destino_rtmp", 
                "Captura o nome do servidor personalizado inserido na aba Multi-Destinos e valida o endpoint de streaming.",
                "Captures the custom server name entered in the Multi-Destinations tab and validates the streaming endpoint."
            ),
            (
                "acao_iniciar_multi_rtmp / acao_parar_multi_rtmp", 
                "Controla o disparo simultâneo do fluxo de dados para múltiplos servidores RTMP independentes.",
                "Controls the simultaneous streaming data output to multiple independent RTMP servers."
            ),
            (
                "acao_sincronizar_canvas_aitum", 
                "Força o alinhamento de proporção e posicionamento entre o Canvas mestre (16:9) e o painel vertical do plugin Aitum (9:16).",
                "Forces the aspect ratio and positioning alignment between the master Canvas (16:9) and the Aitum plugin vertical panel (9:16)."
            ),
            (
                "acao_iniciar_multistream_aitum", 
                "Dispara as transmissões secundárias focadas em plataformas verticais (TikTok/Instagram) e liga o indicador LED visual de Live Online.",
                "Triggers secondary broadcasts focused on vertical platforms (TikTok/Instagram) and turns on the visual Live Online LED indicator."
            ),
            (
                "acao_parar_multistream_aitum", 
                "Encerra o envio de dados para o ecossistema Aitum Vertical e desliga o indicador LED visual de status no topo.",
                "Terminates data streaming to the Aitum Vertical ecosystem and turns off the top visual status LED indicator."
            ),
            (
                "iniciar_login_youtube", 
                "Inicia a autenticação oficial e segura via Google OAuth2 abrindo o navegador do sistema para capturar o canal e Stream Key.",
                "Initiates the official and secure Google OAuth2 authentication by opening the system browser to capture channel and Stream Key."
            ),
            (
                "acao_disparar_macro_movimento", 
                "Interage com o plugin Move Transition para acionar filtros de animação e movimentação suave de elementos visuais na cena.",
                "Interacts with the Move Transition plugin to trigger animation and smooth motion filters for visual elements in the scene."
            ),
            (
                "acao_controlar_ptz", 
                "Gerencia o PTZ Virtual (Pan, Tilt, Zoom) recalculando e aplicando em tempo real as coordenadas de Crop de forma suave na webcam.",
                "Manages Virtual PTZ (Pan, Tilt, Zoom) by recalculating and applying smooth webcam Crop coordinates in real time."
            ),
            (
                "alternar_estado_advanced_switcher", 
                "Comunica-se via protocolo Vendor com o plugin Advanced Scene Switcher para ligar ou pausar as rotinas nativas de automação do OBS.",
                "Communicates via Vendor protocol with the Advanced Scene Switcher plugin to start or pause native OBS automation routines."
            ),
            (
                "exportar_regras_para_advanced_switcher", 
                "Converte o dicionário local de automações do aplicativo em um arquivo estruturado no formato JSON legível para importação no OBS.",
                "Converts the application's local automation dictionary into a structured JSON file readable for import into OBS."
            ),
            (
                "criar_monitor_fluxo",
                "Renderiza no topo o display dinâmico de monitoramento, exibindo taxas de bitrate, consumo de CPU, FPS e cronometragem da transmissão.",
                "Renders the dynamic monitoring display at the top, showing bitrate, CPU usage, FPS, and live stream timers."
            ),
            (
                "criar_inicializador_obs",
                "Constrói o bloco de controle inicial que permite definir o diretório do OBS Studio e disparar o executável do programa.",
                "Builds the initial control block used to set the OBS Studio path and launch the program's executable file."
            ),
            (
                "criar_master_switches",
                "Cria os interruptores mestres globais para Iniciar/Parar Transmissão, Iniciar/Parar Gravação e o botão de compartilhar links rápidos.",
                "Creates the global master switches to Start/Stop Streaming, Start/Stop Recording, and the quick link sharing button."
            ),
            (
                "criar_audio_filtros",
                "Gera o slider de volume master em tempo real e o botão de alternância para ligar ou desligar filtros e compressores de áudio.",
                "Generates the real-time master volume slider and the toggle button to turn audio filters and compressors on or off."
            ),
            (
                "criar_midias_slides",
                "Estrutura o painel multimídia contendo os botões de Play/Pause para vídeos e o acionador para avançar slides de apresentação.",
                "Structures the multimedia panel featuring Play/Pause buttons for video tracks and the remote trigger to advance presentation slides."
            ),
            (
                "criar_painel_chaveador_automatico",
                "Desenha a interface lógica de automação onde o usuário pode cadastrar, listar e limpar regras condicionais para a troca de cenas.",
                "Designs the automation logical interface where users can register, view, and clear conditional rules for scene switching."
            ),
            (
                "criar_painel_wpstream",
                "Injeta o painel de integração dedicado à plataforma WPStream para gerenciamento de chaves privadas e transmissão via WordPress.",
                "Injects the integration panel dedicated to the WPStream platform for private key management and WordPress live broadcasting."
            ),
            (
                "criar_painel_central_logins",
                "Centraliza o gerenciamento de chaves e os botões oficiais de conexão com APIs externas de transmissão.",
                "Centralizes key management and official connection buttons for external broadcasting APIs."
            )
        ]

        # Renderização dinâmica dos blocos de texto
        for nome_func, desc_pt, desc_en in funcoes_doc:
            box_func = QGroupBox()
            box_func.setStyleSheet("background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px;")
            layout_box = QVBoxLayout(box_func)
            layout_box.setSpacing(4)

            # Identificador Técnico da Função
            lbl_nome = QLabel(f"⚙️ {nome_func}")
            lbl_nome.setStyleSheet("font-weight: bold; color: #0f172a; font-family: 'Consolas', monospace; font-size: 12px;")
            layout_box.addWidget(lbl_nome)
            
            # Descrição em Português
            lbl_desc_pt = QLabel(f"<b style='color: #0284c7;'>[PT]</b> {desc_pt}")
            lbl_desc_pt.setWordWrap(True)
            lbl_desc_pt.setStyleSheet("color: #334155; font-size: 11px;")
            layout_box.addWidget(lbl_desc_pt)

            # Descrição em Inglês
            lbl_desc_en = QLabel(f"<b style='color: #64748b;'>[EN]</b> {desc_en}")
            lbl_desc_en.setWordWrap(True)
            lbl_desc_en.setStyleSheet("color: #475569; font-size: 11px; font-style: italic;")
            layout_box.addWidget(lbl_desc_en)

            layout_conteudo.addWidget(box_func)

        scroll.setWidget(conteudo_scroll)
        layout_aba.addWidget(scroll)

        # --- ASSINATURA ---
        lbl_assinatura = QLabel("by Elias Lopes")
        lbl_assinatura.setAlignment(Qt.AlignmentFlag.AlignRight)
        lbl_assinatura.setStyleSheet("font-size: 13px; font-weight: bold; color: #64748b; font-style: italic; padding-top: 5px; margin-right: 5px;")
        layout_aba.addWidget(lbl_assinatura)