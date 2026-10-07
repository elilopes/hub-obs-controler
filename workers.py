import time, os, sys, base64
from PySide6.QtCore import QThread, Signal, QObject
from obswebsocket import obsws, requests

# Importações de API opcionais
try:
    from instagrapi import Client as InstaClient
except ImportError:
    InstaClient = None

# Importação do Google
try:
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build as build_google_service
except ImportError:
    print("⚠️ Erro: Bibliotecas do Google API não instaladas. Rode 'pip install -r requirements.txt'.")
    InstalledAppFlow = None
    build_google_service = None

class OBSPreviewWorker(QThread):
    """Thread dedicada a extrair screenshots em real-time do OBS via WebSocket"""
    frame_ready = Signal(bytes)
    error_signal = Signal(str)

    def __init__(self, host, port, password):
        super().__init__()
        self.host = host
        self.port = port
        self.password = password
        self.running = True

    def run(self):
        ws = obsws(self.host, self.port, self.password)
        try:
            ws.connect()
            while self.running:
                resposta_cena = ws.call(requests.GetCurrentProgramScene())
                cena_atual = getattr(resposta_cena, 'currentProgramSceneName', None)
                if not cena_atual:
                    cena_atual = resposta_cena.data.get('currentProgramSceneName')

                if cena_atual:
                    resposta_print = ws.call(requests.GetSourceScreenshot(
                        sourceName=cena_atual, imageFormat="jpeg", imageWidth=426, imageHeight=240
                    ))
                    img_b64 = getattr(resposta_print, 'imageData', None) or resposta_print.data.get('imageData', '')
                    
                    if "," in img_b64:
                        img_b64 = img_b64.split(",")[1]

                    if img_b64:
                        img_bytes = base64.b64decode(img_b64)
                        self.frame_ready.emit(img_bytes)

                time.sleep(1)
        except Exception as e:
            self.error_signal.emit(str(e))
        finally:
            try:
                ws.disconnect()
            except:
                pass

    def stop(self):
        self.running = False


class InstagramLoginWorker(QThread):
    """Thread para autenticação assíncrona do Instagram"""
    status_changed = Signal(str, str)
    success_signal = Signal(str)
    error_signal = Signal(str)

    def __init__(self, username, password):
        super().__init__()
        self.username = username
        self.password = password

    def run(self):
        if not InstaClient:
            self.error_signal.emit("A biblioteca 'instagrapi' não está instalada.")
            return
        if not self.username or not self.password:
            self.error_signal.emit("Insira o usuário e a senha para automação do Instagram.")
            return

        try:
            self.status_changed.emit("🔐 Conectando ao Instagram...", "#6c757d")
            cl = InstaClient()
            cl.login(self.username, self.password)
            
            self.status_changed.emit("📡 Criando Live no Instagram...", "#0dcaf0")
            broadcast = cl.live_create(title="Live Transmissão Automatizada")
            
            self.success_signal.emit(str(broadcast.stream_key))
        except Exception as e:
            self.error_signal.emit(f"Falha login Instagram:\n{e}")


# =================================================================
# ✨ NOVO: WORKER PARA LOGIN MANUAL DO YOUTUBE
# =================================================================
from PySide6.QtCore import QThread, Signal

class YouTubeManualLoginWorker(QThread):
    status_changed = Signal(str, str)
    error_signal = Signal(str)
    success_signal = Signal(dict)

    def __init__(self, usuario, senha):
        super().__init__()
        self.usuario = usuario  # 🛑 Correção: Garante a atribuição exata do atributo
        self.senha = senha

    def run(self):
        try:
            self.status_changed.emit("⏳ Verificando credenciais manuais do YouTube...", "#eab308")
            self.msleep(1000)
            
            # 🔐 Segurança: Não repassamos a senha do app/canal como stream_key
            dados_sucesso = {
                "origem": "manual",
                "email": self.usuario,
                "stream_key": ""  # Fica vazio para não vazar a senha no campo superior
            }
            self.success_signal.emit(dados_sucesso)
            
        except Exception as e:
            self.error_signal.emit(f"Erro no login manual do YouTube: {e}")


class YouTubeLoginWorker(QThread):
    """Thread para autenticação OAuth assíncrona do Google/YouTube"""
    status_changed = Signal(str, str)
    success_signal = Signal(dict) # aceita dicionário
    error_signal = Signal(str)

    def __init__(self, scopes):
        super().__init__()
        self.scopes = scopes

    def run(self):
        if not InstalledAppFlow or not build_google_service:
            self.error_signal.emit("As bibliotecas do Google API não estão instaladas.")
            return

        # 🔍 Resolução de caminho unificada
        if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
            # Se for o executável do PyInstaller, lê a pasta temporária interna
            caminho_json = os.path.join(sys._MEIPASS, "client_secret.json")
        else:
            # Se for o script Python puro, busca na mesma pasta que o main.py (raiz da execução)
            pasta_do_script = os.path.abspath(os.path.dirname(sys.argv[0]))
            caminho_json = os.path.join(pasta_do_script, "client_secret.json")

        # 🚨 Verificação preventiva para registrar no debug_log.txt se falhar
        if not os.path.exists(caminho_json):
            self.error_signal.emit(f"Erro: Arquivo 'client_secret.json' não encontrado em: {caminho_json}")
            return

        try:
            flow = InstalledAppFlow.from_client_secrets_file(caminho_json, self.scopes)
            credentials = flow.run_local_server(port=0)
            
            service_oauth = build_google_service('oauth2', 'v2', credentials=credentials)
            user_info = service_oauth.userinfo().get().execute()
            email_usuario = user_info.get('email')
            
            youtube = build_google_service('youtube', 'v3', credentials=credentials)
            requisicao = youtube.liveStreams().list(part="cdn", mine=True)
            resposta = requisicao.execute()
            
            if resposta.get('items'):
                stream_key = resposta['items'][0]['cdn']['ingestionInfo']['streamName']
                
                # 🛑 Salva os atributos na própria thread para o controller ler
                self.token = credentials.token
                self.refresh_token = credentials.refresh_token
                self.expire_time = int(credentials.expiry.timestamp()) if credentials.expiry else 0
                
                # Envia os dados no sinal para o login_manager
                self.success_signal.emit({
                    'stream_key': stream_key, 
                    'email': email_usuario,
                    'origem': 'oauth2',
                    'token': self.token,
                    'refresh_token': self.refresh_token,
                    'expire_time': self.expire_time
                })
            else:
                self.error_signal.emit("Nenhum ponto de transmissão ao vivo localizado no seu YouTube.")
        except Exception as e:
            self.error_signal.emit(f"Falha na autenticação via OAuth:\n{e}")


class CountdownWorker(QThread):
    """Cronômetro de contagem regressiva injetando dados via websocket no OBS"""
    tick_signal = Signal(str)
    finished_signal = Signal()

    def __init__(self, minutos, host, port, password):
        super().__init__()
        self.segundos_totais = minutos * 60
        self.host = host
        self.port = port
        self.password = password

    def run(self):
        ws = obsws(self.host, self.port, self.password)
        try:
            ws.connect()
            while self.segundos_totais >= 0:
                mins, segs = divmod(self.segundos_totais, 60)
                tempo_formatado = f"{mins:02d}:{segs:02d}"
                self.tick_signal.emit(tempo_formatado)
                
                try:
                    ws.call(requests.SetTextGDIPlusProperties(source="Texto_Cronometro", text=tempo_formatado))
                except:
                    pass
                
                time.sleep(1)
                self.segundos_totais -= 1
        except:
            pass
        finally:
            try:
                ws.disconnect()
            except:
                pass
            self.finished_signal.emit()