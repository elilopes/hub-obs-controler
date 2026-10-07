import os, shutil

# --- CONFIGURAÇÕES DO OBS ---
HOST = "localhost"
PORT = 4455
PASSWORD = "@viclic2"

# Tenta encontrar o OBS automaticamente no sistema (Funciona no Windows, Linux e Mac!)
CAMINHO_OBS = shutil.which("obs64") or shutil.which("obs")

# Se não achou de forma global, usa o caminho padrão do Windows como "Plano B"
if not CAMINHO_OBS:
    caminho_padrao = r"C:\Program Files\obs-studio\bin\64bit\obs64.exe"
    if os.path.exists(caminho_padrao):
        CAMINHO_OBS = caminho_padrao

# --- CONFIGURAÇÕES DE APIS EXTERNAS, permissão youtube
SCOPES_YOUTUBE = [
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/userinfo.email',
    'openid'  # ✨ Adicionado explicitamente para bater com o retorno do servidor do Google
]

# --- PALETA DE CORES BOOTSTRAP 5 (QSS STYLESHEET) ---
STYLE_SHEET = """
QMainWindow {
    background-color: #f1f5f9;
}
QGroupBox {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    margin-top: 12px;
    font-family: 'Segoe UI';
    font-size: 13px;
    font-weight: bold;
    color: #212529;
    subcontrol-origin: margin;
    subcontrol-position: top left;
    padding-top: 15px;
}
QGroupBox::title {
    background-color: transparent;
    padding: 0 5px;
    left: 10px;
}
QPushButton {
    font-family: 'Segoe UI';
    font-size: 13px;
    font-weight: bold;
    border-radius: 4px;
    padding: 6px 12px;
    color: white;
}
QLineEdit {
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 4px;
    background-color: white;
    color: #212529;
}
QComboBox {
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 4px;
    background-color: white;
}
"""

COLOR_PRIMARY = "#0d6efd"
COLOR_SUCCESS = "#198754"
COLOR_DANGER = "#dc3545"
COLOR_WARNING = "#ef4444"
COLOR_SECONDARY = "#6c757d"
COLOR_DARK = "#212529"
COLOR_INFO = "#0dcaf0"