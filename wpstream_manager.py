# wpstream_manager.py, faz requisições autenticadas para um site WordPress buscando os dados da conexão RTMP atual do canal ativo
import requests

class WpStreamManager:
    def __init__(self, site_url):
        self.base_url = site_url.split('/wp-admin')[0] # Extrai a raiz do site da FASEPA
        self.api_url = f"{self.base_url}/wp-json/wpstream/v1"
        self.token = None

    def autenticar_admin(self, usuario, senha):
        # Autenticação via JWT ou Application Passwords nativo do WordPress
        payload = {"username": usuario, "password": senha}
        try:
            # Rota padrão para obter token no WordPress com WPStream ativo
            response = requests.post(f"{self.base_url}/wp-json/jwt-auth/v1/token", json=payload, timeout=5)
            if response.status_code == 200:
                self.token = response.json().get("token")
                return True
        except:
            return False
        return False

    def obter_credenciais_rtmp(self, canal_id):
        if not self.token:
            return None
            
        headers = {"Authorization": f"Bearer {self.token}"}
        try:
            # Busca os detalhes de conexão RTMP do canal selecionado no WPStream
            response = requests.get(f"{self.api_url}/channel/{canal_id}/rtmp", headers=headers, timeout=5)
            if response.status_code == 200:
                dados = response.json()
                return {
                    "server": dados.get("rtmp_url"),      # Ex: rtmp://live.wpstream.net/show
                    "key": dados.get("rtmp_key")          # Chave dinâmica gerada pelo plugin
                }
        except:
            return None
        return None