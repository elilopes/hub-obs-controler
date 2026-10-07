from PySide6.QtWidgets import QMessageBox
import config
from workers import YouTubeLoginWorker

class LoginManager:
    def __init__(self, controller):
        """
        Recebe a instância do CentralHubController para ter acesso à visualização (view)
        e aos métodos de atualização de status.
        """
        self.controller = controller
        self.view = controller.view
        self.usuario_atual = None  # 📌 Armazena o usuário logado via OAuth2

    def iniciar_login_youtube(self):
        self.controller.atualizar_status("⏳ Aguardando autenticação no navegador Google...", config.COLOR_INFO)
        print(f"⚠️ Aguardando autenticação no navegador Google/Oauth2...", flush=True)
        
        self.controller.yt_worker = YouTubeLoginWorker(config.SCOPES_YOUTUBE)
        self.controller.yt_worker.status_changed.connect(self.controller.atualizar_status)
        self.controller.yt_worker.error_signal.connect(lambda msg: QMessageBox.critical(self.view, "Erro", msg))
        
        self.controller.yt_worker.success_signal.connect(self.sucesso_login_youtube)
        self.controller.yt_worker.start()

    def sucesso_login_youtube(self, dados):
        """Aviso de login oficial executado via OAuth2"""
        if isinstance(dados, str):
            dados = {
                "origem": "oauth2",
                "email": "Conta Google",
                "stream_key": dados
            }

        email = dados.get("email", "Canal Vinculado")
        stream_key = dados.get("stream_key", "")
        
        # 📌 Guarda o e-mail/canal limpando caracteres inválidos para pastas do Windows
        self.usuario_atual = "".join(c for c in email if c.isalnum() or c in ('@', '_', '-')).strip()

        # Preenche a chave real de forma automática no campo oculto
        if stream_key:
            self.view.entry_key_yt.setText(stream_key)
        
        # Altera os estados visuais do botão oficial
        self.view.btn_login_yt.setText(f"✅ Conectado como: {email}")
        self.view.btn_login_yt.setEnabled(False)
        self.view.btn_logout_yt.setVisible(True)
        
        # 🟢 Usa a função criada na sua View para o LED Verde
        if hasattr(self.view, 'atualizar_status_youtube_conectado'):
            self.view.atualizar_status_youtube_conectado()
            if hasattr(self.view, 'led_status_yt'):
                self.view.led_status_yt.repaint()

        QMessageBox.information(
            self.view, 
            "Login Executado", 
            "Autenticação efetuada com sucesso via OAuth2!\n"
            "Sua chave de transmissão foi importada automaticamente."
        )
        
        self.controller.atualizar_status(f"🎉 YouTube conectado via OAUTH2 ({email})", "#22c55e")
        print(f"🎉 YouTube conectado com Google/Oauth2: conta '{email}' e key '{stream_key}'", flush=True)

    def realizar_logout_youtube(self):
        """Restaura para o estado inicial a interface original"""
        self.usuario_atual = None 
        self.view.entry_key_yt.clear()
        
        # Restaura o botão de login oficial
        self.view.btn_login_yt.setEnabled(True)
        self.view.btn_login_yt.setText("🛑 Vincular via Google OAuth2")
        self.view.btn_logout_yt.setVisible(False) 
        
        # 🔴 Retorna o LED para vermelho usando exclusivamente a função da View
        if hasattr(self.view, 'atualizar_status_youtube_desconectado'):
            self.view.atualizar_status_youtube_desconectado()
            if hasattr(self.view, 'led_status_yt'):
                self.view.led_status_yt.repaint()
        
        self.controller.atualizar_status("🚪 Logout efetuado no YouTube.", "#64748b")