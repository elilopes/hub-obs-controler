from PySide6.QtCore import Qt, QTimer

from PySide6.QtWidgets import (QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
                             QGridLayout, QGroupBox, QLabel, QPushButton, 
                             QLineEdit, QComboBox, QSlider, QFileDialog, QProgressBar, QFrame)

import requests

class VDONinjaManager:
    def __init__(self):
        self.base_url = "https://vdo.ninja/"
        
    def criar_link_sala(self, nome_sala="LiveHub"):
        # API simples: parâmetros na URL definem as configurações
        # &view=1 força modo visualização, &room= define a sala
        return f"{self.base_url}?room={nome_sala}&vd=1&clean=1"

    def enviar_comando_controle(self, comando, id_convidado):
        # Exemplo de comando via API para o VDO.Ninja (requer parâmetro de controle na URL)
        # O VDO.Ninja utiliza sinais via WebRTC ou comandos via URL de controle
        url_api = f"{self.base_url}api/?action={comando}&peer={id_convidado}"
        return requests.get(url_api)
    
    def enviar_mensagem_convidado(self, peer_id, mensagem):
        # Comando de chat via API do VDO.Ninja
        url = f"{self.base_url}api/?action=chat&peer={peer_id}&msg={mensagem}"
        return requests.get(url)