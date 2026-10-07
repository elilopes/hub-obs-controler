from PySide6.QtWidgets import QMessageBox

# 3. Comunicação e Protocolo OBS/websocket-py
try:
    from obswebsocket import obsws
    from obswebsocket.exceptions import ConnectionFailure
    # Importa os requests do OBS com um "apelido" (alias) global
    from obswebsocket import requests as obs_requests 
except ImportError:
    print("⚠️ Aviso: Biblioteca 'obs-websocket-py' não encontrada. Instale-a com 'pip install obs-websocket-py'.")

class OBSManager:
    def __init__(self, host, port=4455, password=""):
        # Removeu-se o default "localhost" para garantir o uso do IP dinâmico do Hub Control
        self.host = host
        self.port = port
        self.password = password
        self.client = None

    def verificar_cameras_sistema(self):
        """
        Checa diretamente no hardware do computador (via OpenCV) se há webcams conectadas.
        Retorna uma lista com os índices das câmeras encontradas.
        """
        import cv2  # Importado apenas quando a função for chamada
        cameras_encontradas = []
        # Testa os primeiros 5 índices de barramento de vídeo do Windows
        for index in range(5):
            cap = cv2.VideoCapture(index, cv2.CAP_DSHOW)
            if cap.isOpened():
                is_reading, _ = cap.read()
                if is_reading:
                    cameras_encontradas.append(index)
                cap.release()
        return cameras_encontradas

    def verificar_cameras_no_obs(self):
        """
        Conecta ao OBS Studio via Websocket de forma persistente e verifica as fontes de captura.
        """
        from obswebsocket import obsws
        if not self.host:
            print(f"❌ [verificar_cameras_no_obs] Erro: nenhum IP de destino foi fornecido ao OBSManager.", flush=True)
            return None

        try:
            # 🚨 Se já existir um cliente conectado, reaproveita ou reconecta de forma limpa
            if self.client is not None:
                try:
                    # Tenta uma chamada simples para ver se já está conectado
                    resposta = self.client.call(obs_requests.GetInputList())
                    webcams_no_obs = []
                    if resposta and hasattr(resposta, 'getInputs'):
                        for input_item in resposta.getInputs():
                            kind = input_item.get('inputKind')
                            # ✨ Aceita dshow_input (Webcam) e browser_source (VDO.Ninja)
                            if kind in ['dshow_input', 'browser_source']:
                                webcams_no_obs.append(input_item.get('inputName'))
                    return webcams_no_obs
                except:
                    # Se deu erro, a conexão antiga caiu, limpa para criar uma nova
                    print(f"⚠️[verificar_cameras_no_ob] Conexão antiga caiu, limpa para criar uma nova", flush=True)
                    self.client = None

            # Conecta usando o IP fornecido na interface
            self.client = obsws(self.host, self.port, self.password)
            self.client.connect()
            
            # Verifica se a conexão com o WebSocket foi estabelecida
            if self.client.ws and self.client.ws.connected:
                print(f"[verificar_cameras_no_obs] Conectado com sucesso ao OBS! websocket em host '{self.host}' e porta '{self.port}'", flush=True)
            else:
                print(f"❌ [verificar_cameras_no_obs] Não conectado websocket.", flush=True)
            
            # Solicita ao OBS a lista de todas as fontes de entrada
            resposta = self.client.call(obs_requests.GetInputList())
            
            webcams_no_obs = []
            if resposta and hasattr(resposta, 'getInputs'):
                for input_item in resposta.getInputs():
                    kind = input_item.get('inputKind')
                    # ✨Aceita dshow_input e browser_source na primeira conexão também
                    if kind in ['dshow_input', 'browser_source']:
                        webcams_no_obs.append(input_item.get('inputName'))
            
            return webcams_no_obs
            
        except Exception as e:
            print(f"❌ [verificar_cameras_no_obs] Falha de Conexão Websocket em host '{self.host}' eporta '{self.port}' -> Motivo: {e}", flush=True)
            self.client = None
            return None

    def disparar_alerta_checagem(self, parent_view):
        """
        Executa a varredura híbrida e exibe o QMessageBox na tela informando o status ao usuário.
        """
        # 1. Tenta checar pelo OBS Studio ativo
        fontes_obs = self.verificar_cameras_no_obs()
        
        if fontes_obs is not None:
            # 🟢 SE CONECTOU AO OBS: Pinta o LED de verde!
            if hasattr(parent_view, 'atualizar_status_obs_conectado'):
                parent_view.atualizar_status_obs_conectado()

            if fontes_obs:
                lista_cams = "\n".join([f"• {cam}" for cam in fontes_obs])
                QMessageBox.information(
                    parent_view,
                    "Câmeras Detectadas no OBS",
                    f"O Hub se conectou ao OBS Studio e localizou as seguintes fontes de câmera ativas:\n\n{lista_cams}"
                )
            else:
                QMessageBox.warning(
                    parent_view,
                    "Nenhuma Câmera no OBS",
                    "O hub-obs-control conectou-se ao OBS-Studio, mas não encontrou nenhum 'dispositivo de captura de vídeo' nas suas cenas existentes."
                )
            return

        # 🔴 SE FALHOU A CONEXÃO COM O OBS: Pinta o LED de vermelho
        if hasattr(parent_view, 'atualizar_status_obs_desconectado'):
            parent_view.atualizar_status_obs_desconectado()
            
        # 2. Plano B (Hardware físico), se o OBS falhou/fechado, checa o Hardware físico do PC
        físico_cams = self.verificar_cameras_sistema()
        if físico_cams:
            # Ajustado o texto para esclarecer a presença de drivers como PRISM e OBS Virtual Cam
            QMessageBox.information(
                parent_view,
                "Câmeras no Sistema (OBS Fechado)",
                f"Não foi possível conectar ao OBS Studio, mas detectamos {len(físico_cams)} conexões de vídeo ativas "
                f"(Índices: {físico_cams}).\n\nNota: Isso inclui sua webcam integrada e drivers virtuais ativos (ex: PRISM Lens / OBS Virtual Cam).\n\nAbra o OBS Studio para sincronizar."
            )
        else:
            QMessageBox.critical(
                parent_view,
                "Alerta sobre o hardware",
                "ALERTA: Nenhuma câmera/webcam foi detectada no OBS Studio e nem nas conexões físicas USB do seu computador!"
            )
            
    #criar peril e cena no OBS
    def garantir_perfil_e_colecao(self, nome_perfil, nome_colecao):
        """
        Verifica se o perfil e a coleção de cenas existem no OBS. 
        Se não existirem, eles são criados e ativados via WebSocket.
        """
        if not self.client:
            print("⚠️ Sem conexão ativa com o WebSocket para verificar perfis/coleções.", flush=True)
            return

        # --- GERENCIAMENTO DE PERFIL ---
        if nome_perfil and "Nenhum" not in nome_perfil:
            try:
                # Obtém a lista de perfis do OBS
                resposta = self.client.call(obs_requests.GetProfileList())
                perfis_existentes = resposta.getProfiles() if hasattr(resposta, 'getProfiles') else []
                
                if nome_perfil not in perfis_existentes:
                    print(f"📁 [garantir_perfil_e_colecao] Perfil '{nome_perfil}' não existe no OBS. Criando no obs..", flush=True)
                    # Cria e define automaticamente como ativo
                    self.client.call(obs_requests.CreateProfile(profileName=nome_perfil))
                else:
                    # Se já existe, apenas garante que ele seja o ativo
                    print(f"📁 [garantir_perfil_e_colecao] Ativando no OBS perfil existente: '{nome_perfil}'", flush=True)
                    self.client.call(obs_requests.SetCurrentProfile(profileName=nome_perfil))
            except Exception as e:
                print(f"⚠️ [garantir_perfil_e_colecao] Erro ao configurar perfil via WebSocket -> Motivo: {e}", flush=True)

        # --- GERENCIAMENTO DE COLEÇÃO DE CENAS ---
        if nome_colecao and "Nenhum" not in nome_colecao:
            try:
                # Obtém a lista de coleções do OBS
                resposta = self.client.call(obs_requests.GetSceneCollectionList())
                colecoes_existentes = resposta.getSceneCollections() if hasattr(resposta, 'getSceneCollections') else []
                
                if nome_colecao not in colecoes_existentes:
                    print(f"🎬 [garantir_perfil_e_colecao] Coleção '{nome_colecao}' não existe no OBS. Criando no OBS...", flush=True)
                    # Cria e define automaticamente como ativa
                    self.client.call(obs_requests.CreateSceneCollection(sceneCollectionName=nome_colecao))
                else:
                    # Se já existe, apenas garante que ela seja a ativa
                    print(f"🎬 [garantir_perfil_e_colecao] Ativando no OBS coleção/cena existente: '{nome_colecao}'", flush=True)
                    self.client.call(obs_requests.SetCurrentSceneCollection(sceneCollectionName=nome_colecao))
            except Exception as e:
                print(f"⚠️ [garantir_perfil_e_colecao] Erro ao configurar coleção de cenas via WebSocket -> Motivo: {e}", flush=True)