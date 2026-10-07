from PySide6.QtWidgets import (
    QMainWindow, QWidget, QApplication, QVBoxLayout, QHBoxLayout, QGridLayout, QListWidget, 
    QGroupBox, QLabel, QPushButton, QLineEdit, QComboBox, QLayout, QScrollArea, QTabWidget, 
    QSlider, QFileDialog, QProgressBar, QFrame, QCheckBox,  QHBoxLayout, QSizePolicy
)
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QFont, QImage, QPixmap, QPainter, QColor, QFontMetrics, QFont
import config, requests
from manual_manager import ManualManager

# =================================================================
# 🎨 FOLHA DE ESTILO PADRÃO GLOBAL
# =================================================================
ESTILO_PADRAO_ABAS = """
    QWidget { 
        background-color: #ffffff; 
        color: #000000; 
    }
    QGroupBox {
        border: 2px solid #1d4ed8;
        border-radius: 6px;
        margin-top: 12px;
        font-weight: bold;
    }
    QGroupBox::title {
        subcontrol-origin: margin;
        subcontrol-position: top left;
        padding: 0 5px;
    }
    /* 📝 Todas as Caixas de Texto (inputs) */
    QLineEdit {
        background-color: #B0E0E6;
        color: #000000; 
        border: 1.5px solid #B0E0E6;
        border-radius: 4px;
        padding: 5px;
    }
    QLineEdit:focus {
        border: 1px solid #1d4ed8;   
    }
    /* 🔽 Correção das Caixas de Seleção (Combos) */
    QComboBox {
        background-color: #ffffff;
        color: #000000;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        padding: 4px;
    }
    QComboBox::drop-down {
        border: none;
    }
    /* 📋 Correção das Listas de Regras e Destinos */
    QListWidget {
        background-color: #ffffff;
        color: #000000;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
    }
    
    /* 🎛️ BARRA DE ROLAGEM VERTICAL */
    QScrollBar:vertical {
        width: 16px; /* Deixa a barra mais grossa e fácil de clicar */
        background-color: #f1f5f9; /* Cor de fundo sutil para a barra */
    }

    /* 🤚 Indicador de rolagem (Scroller) */
    QScrollBar::handle:vertical {
        background-color: #cbd5e1; /* Cor padrão do indicador */
        min-height: 20px;
        border-radius: 4px;
    }

    /* ✨ Efeito ao passar o mouse por cima (Hover) */
    QScrollBar::handle:vertical:hover {
        background-color: #94a3b8; /* Escurece o indicador dando feedback */
    }

    /* 👆 Efeito ao clicar e segurar (Active/Pressed) */
    QScrollBar::handle:vertical:pressed {
        background-color: #64748b; /* Fica ainda mais escuro enquanto arrasta */
    }


    /* 🎛️ BARRA DE ROLAGEM HORIZONTAL */
    QScrollBar:horizontal {
        height: 16px; /* Deixa a barra mais grossa horizontalmente */
        background-color: #f1f5f9;
    }

    /* 🤚 Indicador de rolagem horizontal */
    QScrollBar::handle:horizontal {
        background-color: #cbd5e1;
        min-width: 20px;
        border-radius: 4px;
    }

    /* ✨ Efeito ao passar o mouse (Hover) */
    QScrollBar::handle:horizontal:hover {
        background-color: #94a3b8;
    }

    /* 👆 Efeito ao clicar e segurar (Active/Pressed) */
    QScrollBar::handle:horizontal:pressed {
        background-color: #64748b;
    }
"""

# =================================================================
# 🚀 CLASSES DA INTERFACE
# =================================================================
class SplashWindow(QWidget):
    """Splash Screen customizada com Frameless Mode (Sem prender no topo)"""
    def __init__(self):
        super().__init__()
        # 🛡️ Mantemos apenas o Frameless para não ter bordas, mas removemos o StaysOnTop
        self.setWindowFlags(Qt.WindowType.FramelessWindowHint)
        self.resize(500, 240)
        
        layout = QVBoxLayout(self)
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.lbl_title = QLabel("CENTRAL HUB", self)
        self.lbl_title.setFont(QFont("Segoe UI", 24, QFont.Weight.Bold))
        self.lbl_title.setStyleSheet(f"color: {config.COLOR_PRIMARY};")
        self.lbl_title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(self.lbl_title)

        self.lbl_sub = QLabel("SISTEMA DE TRANSMISSÃO AUTOMATIZADA", self)
        self.lbl_sub.setFont(QFont("Segoe UI", 9))
        self.lbl_sub.setStyleSheet(f"color: {config.COLOR_SECONDARY};")
        self.lbl_sub.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(self.lbl_sub)

        self.lbl_status = QLabel("Inicializando componentes...", self)
        font_status = QFont("Segoe UI", 9, QFont.Weight.Thin)
        self.lbl_status.setFont(font_status)                 
        self.lbl_status.setStyleSheet(f"color: {config.COLOR_SECONDARY}; margin-top: 15px;")
        layout.addWidget(self.lbl_status)

        self.progress_bar = QProgressBar(self)
        self.progress_bar.setFixedWidth(400)
        self.progress_bar.setFixedHeight(6)
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setTextVisible(False)
        self.progress_bar.setStyleSheet(f"""
            QProgressBar {{ background-color: #2d2d2d; border-radius: 3px; }}
            QProgressBar::chunk {{ background-color: {config.COLOR_PRIMARY}; border-radius: 3px; }}
        """)
        layout.addWidget(self.progress_bar)


class PreviewWindow(QWidget):
    """Janela de Preview de Vídeo isolada com suporte nativo a PiP (Sempre no Topo)"""
    def __init__(self, on_close_callback):
        super().__init__()
        self.on_close_callback = on_close_callback
        self.setWindowTitle("👁️ Monitor de Saída Real-Time")
        self.resize(450, 300)
        self.setStyleSheet("background-color: #1e1e1e;")
        
        layout = QVBoxLayout(self)
        layout.setContentsMargins(5, 5, 5, 5)

        self.lbl_video = QLabel("Aguardando dados do OBS Studio...", self)
        self.lbl_video.setStyleSheet("color: #888888;")
        self.lbl_video.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(self.lbl_video)

        # Barra de Controle do Modo PiP
        ctrl_frame = QWidget(self)
        ctrl_frame.setStyleSheet("background-color: #2d2d2d; border-radius: 4px;")
        ctrl_layout = QHBoxLayout(ctrl_frame)
        ctrl_layout.setContentsMargins(10, 4, 10, 4)

        self.btn_pip = QPushButton("📌 Ativar Modo Picture-in-Picture (Sempre no Topo)", self)
        self.btn_pip.setCheckable(True)
        self.btn_pip.setStyleSheet(f"background-color: {config.COLOR_SECONDARY}; color: white; font-size: 11px;")
        self.btn_pip.clicked.connect(self.toggle_modo_pip)
        ctrl_layout.addWidget(self.btn_pip)
        
        layout.addWidget(ctrl_frame)

    def toggle_modo_pip(self, checked):
        if checked:
            self.setWindowFlags(self.windowFlags() | Qt.WindowType.WindowStaysOnTopHint)
            self.btn_pip.setText("📌 Desativar Modo Picture-in-Picture")
            self.btn_pip.setStyleSheet(f"background-color: {config.COLOR_INFO}; color: black; font-size: 11px;")
        else:
            self.setWindowFlags(self.windowFlags() & ~Qt.WindowType.WindowStaysOnTopHint)
            self.btn_pip.setText("📌 Ativar Modo Picture-in-Picture (Sempre no Topo)")
            self.btn_pip.setStyleSheet(f"background-color: {config.COLOR_SECONDARY}; color: white; font-size: 11px;")
        self.show()

    def update_frame(self, img_bytes):
        image = QImage.fromData(img_bytes)
        pixmap = QPixmap.fromImage(image)
        self.lbl_video.setPixmap(pixmap.scaled(self.lbl_video.size(), Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation))

    def closeEvent(self, event):
        self.on_close_callback()
        event.accept()

class PreviewLetreiro(QWidget):
    """Componente customizado com simulação de efeitos (Piscar e Arco-Íris)"""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setFixedHeight(100)
        self.texto = ""
        self.pos_x = self.width()
        
        # --- ESTADOS DOS EFEITOS ---
        self.efeito_piscar = False
        self.efeito_arcoiris = False
        self.piscar_visivel = True
        self.contador_piscar = 0
        self.hue = 0 # Usado para controlar a cor do arco-íris
        
        # Timer de animação (~33 FPS)
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.animar)
        self.timer.start(30)

    def set_texto(self, texto):
        if texto != self.texto:
            self.texto = texto
            self.pos_x = self.width()
        
    def animar(self):
        if not self.texto:
            return
            
        # 1. Movimento padrão de rolagem
        self.pos_x -= 3 
        fm = QFontMetrics(QFont("Segoe UI", 12, QFont.Bold))
        if self.pos_x < -fm.horizontalAdvance(self.texto):
            self.pos_x = self.width()
            
        # 2. Lógica do Efeito Piscar (Inverte a visibilidade a cada 15 frames = ~0.5s)
        if self.efeito_piscar:
            self.contador_piscar += 1
            if self.contador_piscar >= 15:
                self.piscar_visivel = not self.piscar_visivel
                self.contador_piscar = 0
        else:
            self.piscar_visivel = True

        # 3. Lógica do Efeito Arco-Íris (Avança a matriz de cor)
        if self.efeito_arcoiris:
            self.hue = (self.hue + 2) % 360
            
        self.update()

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)
        
        # Fundo do Monitor
        painter.fillRect(self.rect(), QColor("#1e1e1e"))
        
        # Faixa do Letreiro
        altura_barra = 35
        y_barra = self.height() - altura_barra - 10
        painter.fillRect(0, y_barra, self.width(), altura_barra, QColor(0, 0, 0, 180))
        
        # Renderização do Texto com base nos efeitos ativos
        if self.texto and self.piscar_visivel:
            painter.setFont(QFont("Segoe UI", 12, QFont.Bold))
            
            # Se arco-íris ativo, gera a cor dinâmica usando HSV (Matriz, Saturação, Brilho)
            if self.efeito_arcoiris:
                painter.setPen(QColor.fromHsv(self.hue, 255, 255))
            else:
                painter.setPen(QColor("#ffffff")) # Branco padrão
                
            fm = QFontMetrics(painter.font())
            y_texto = y_barra + (altura_barra + fm.ascent() - fm.descent()) // 2
            painter.drawText(self.pos_x, y_texto, self.texto)
        
        painter.end()

class MainWindow(QMainWindow):
    """Janela Principal do Painel"""
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Central Hub - Controle de Transmissão")
        self.resize(580, 850)
        self.setStyleSheet(ESTILO_PADRAO_ABAS)
        
        # INSTANCIAÇÃO DAS ABAS 
        self.aba_ptz = QWidget()  # Criado  no topo para evitar o erro AttributeError!
        self.aba_ptz.setAutoFillBackground(True)
        self.aba_ptz.setStyleSheet(ESTILO_PADRAO_ABAS)
        self.aba_multi_rtmp = QWidget() # Instanciação segura da aba rtmp (Real-Time Messaging Protocol) 
        self.aba_multi_rtmp.setAutoFillBackground(True)
        self.aba_multi_rtmp.setStyleSheet(ESTILO_PADRAO_ABAS)
        self.aba_aitum_vertical = QWidget()  # Instanciação segura da aba aitum
        self.aba_aitum_vertical.setAutoFillBackground(True)
        self.aba_aitum_vertical.setStyleSheet(ESTILO_PADRAO_ABAS)
        self.aba_logins = QWidget() # Instanciação segura da aba de Logins
        self.aba_logins.setAutoFillBackground(True)
        self.aba_logins.setStyleSheet(ESTILO_PADRAO_ABAS)
        self.aba_manual = QWidget() # Instanciação segura da aba manual
        self.aba_manual.setAutoFillBackground(True)
        self.aba_manual.setStyleSheet(ESTILO_PADRAO_ABAS)
        

        # Widget Central Obrigatório do QMainWindow
        central_widget = QWidget(self)
        self.setCentralWidget(central_widget)
        base_layout = QVBoxLayout(central_widget)
        base_layout.setContentsMargins(5, 5, 5, 5)
        
        
        # =================================================================
        # 🟢🔴 MainWindow: criação do espaço dos LEDS DE STATUS (CANTO SUPERIOR DIREITO)
        # =================================================================
        layout_topo_status = QHBoxLayout()
        layout_topo_status.setContentsMargins(10, 5, 10, 2)
        layout_topo_status.setSpacing(15) # Espaçamento horizontal entre os blocos de LED
        # Criamos um espaçador para empurrar o texto e a bola para a extrema direita
        layout_topo_status.addStretch()
        
        # Botão de Teste de Conexão
        self.btn_testar_conexao = QPushButton("🔌 Testar Conexão")
        self.btn_testar_conexao.setCursor(Qt.PointingHandCursor)
        self.btn_testar_conexao.setStyleSheet("""
            QPushButton { 
                background-color: #f8fafc; 
                border: 1px solid #cbd5e1; 
                border-radius: 4px; 
                padding: 4px 8px;
                font-size: 10px;
            }
            QPushButton:hover { background-color: #e2e8f0; }
        """)
        # Adiciona o botão no início do layout de status
        layout_topo_status.insertWidget(0, self.btn_testar_conexao)
        
        # Texto indicador do OBS/websocket 
        self.lbl_texto_OBSwebsocket = QLabel("OBS/websocket:")
        self.lbl_texto_OBSwebsocket.setFont(QFont("Segoe UI", 9, QFont.Weight.Bold))
        self.lbl_texto_OBSwebsocket.setStyleSheet("color: #475569; background: transparent;")
        
        # Bola de LED OBS/websocket (inicialmente vermelha/Off)       
        self.led_status_OBSwebsocket = QLabel()
        self.led_status_OBSwebsocket.setFixedSize(12, 12)
        self.led_status_OBSwebsocket.setStyleSheet("""
            background-color: #ef4444; 
            border: 1px solid #b91c1c; 
            border-radius: 6px;
        """)
        # Insere os indicadores OBS/websocket no topo do layout base da janela
        layout_topo_status.addWidget(self.lbl_texto_OBSwebsocket)
        layout_topo_status.addWidget(self.led_status_OBSwebsocket)
        
        # Texto indicador do YOUTUBE
        self.lbl_texto_yt = QLabel("YouTube:")
        self.lbl_texto_yt.setFont(QFont("Segoe UI", 9, QFont.Weight.Bold))
        self.lbl_texto_yt.setStyleSheet("color: #475569; background: transparent;")
        
        # Bola de LED youtube (inicialmente vermelha/Off)
        self.led_topo_yt = QLabel()
        self.led_topo_yt.setFixedSize(12, 12)
        self.led_topo_yt.setStyleSheet("""
            background-color: #ef4444; 
            border: 1px solid #b91c1c; 
            border-radius: 6px;
        """) 
        # Insere os indicadores do youtube no topo do layout base da janela
        layout_topo_status.addWidget(self.lbl_texto_yt)
        layout_topo_status.addWidget(self.led_topo_yt)

        # Texto indicador do INSTAGRAM 
        self.lbl_texto_insta = QLabel("Instagram:")
        self.lbl_texto_insta.setFont(QFont("Segoe UI", 9, QFont.Weight.Bold))
        self.lbl_texto_insta.setStyleSheet("color: #475569; background: transparent;")
        
        # Bola de LED instagram (inicialmente vermelha/Off)
        self.led_status_insta = QLabel()
        self.led_status_insta.setFixedSize(12, 12)
        self.led_status_insta.setStyleSheet("""
            background-color: #ef4444; 
            border: 1px solid #b91c1c; 
            border-radius: 6px;
        """)
        # Insere os indicadores instagram no topo direito da janela base
        layout_topo_status.addWidget(self.lbl_texto_insta)
        layout_topo_status.addWidget(self.led_status_insta)
        
        
        # Texto indicador do OBS/live
        self.lbl_texto_live = QLabel("Live:")
        self.lbl_texto_live.setFont(QFont("Segoe UI", 10, QFont.Weight.Bold))
        self.lbl_texto_live.setStyleSheet("color: #475569; background: transparent;") # Texto cinza escuro
        
        # Bola de LED OBS/live (inicialmente vermelha/Off)
        self.led_status_live = QLabel()
        self.led_status_live.setFixedSize(12, 12)
        # Borda sutil e cantos arredondados em 6px transformam o quadrado em um círculo perfeito
        self.led_status_live.setStyleSheet("""
            background-color: #ef4444; 
            border: 1px solid #b91c1c; 
            border-radius: 6px;
        """) 
        
        # Insere os indicadores OBS/live no topo direito da janela base
        layout_topo_status.addWidget(self.lbl_texto_live)
        layout_topo_status.addWidget(self.led_status_live)
        
        # Insere o layout do indicador no layout base
        base_layout.addLayout(layout_topo_status)
        
        # =================================================================
        # Criando o Gerenciador de Abas Principal do PySide
        # =================================================================
        self.tabs = QTabWidget(self)
        
        # Estilização das abas superiores para garantir que os títulos fiquem visíveis e limpos
        self.tabs.setStyleSheet("""
            QTabWidget::pane { border: 1px solid #cbd5e1; background: #808080; }
            QTabBar::tab { background: #e2e8f0; color: #475569; font-weight: bold; padding: 8px 16px; border-top-left-radius: 4px; border-top-right-radius: 4px; }
            QTabBar::tab:selected { background: #ffffff; color: #1d4ed8; border: 1px solid #cbd5e1; border-bottom-color: #a9a9a9; }
        """)
        base_layout.addWidget(self.tabs)

        # --- ABA 1: PAINEL PRINCIPAL (Com Scroll Area) ---
        aba_principal = QWidget()
        
        # 🎨 Forçando o fundo branco nativo na aba principal
        aba_principal.setAutoFillBackground(True)
        # 🎨 ESTILIZAÇÃO COMPLETA: Inclui a correção das caixas de texto e combos

        
        layout_aba1 = QVBoxLayout(aba_principal)
        layout_aba1.setContentsMargins(0, 0, 0, 0)

        scroll = QScrollArea(self)
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QScrollArea.Shape.NoFrame)
        scroll.setStyleSheet("background-color: #ffffff;") # Garante scroll branco

        conteudo_widget = QWidget()
        conteudo_widget.setStyleSheet("background-color: #ffffff;") # Garante container interno branco
        self.main_layout = QVBoxLayout(conteudo_widget)
        self.main_layout.setContentsMargins(10, 10, 10, 10)
        self.main_layout.setSpacing(8)

        scroll.setWidget(conteudo_widget)
        layout_aba1.addWidget(scroll)
        
        # Adiciona as abas criadas na barra superior ao componente visual do layout
        self.tabs.addTab(aba_principal, "🎛️ Painel de Controle") # Índice 0
        self.tabs.addTab(self.aba_ptz, "🎥 Controle PTZ") # Índice 1
        self.tabs.addTab(self.aba_multi_rtmp, "🌐 Multi-Destinos")
        self.tabs.addTab(self.aba_aitum_vertical, "🎬 Formato Vertical") 
        self.tabs.addTab(self.aba_logins, "🔐 Logins")
        self.tabs.addTab(self.aba_manual, "📖 Manual")
        # 🔒 DESABILITA A ABA PTZ NA INICIALIZAÇÃO (Índice 1)
        self.tabs.setTabEnabled(1, False)

        # -----------------------------------------------------------------
        # INICIALIZAÇÃO DOS CARDS E PAINÉIS
        # -----------------------------------------------------------------
        self.criar_monitor_fluxo()
        self.criar_inicializador_obs()
        self.criar_master_switches()
        self.criar_audio_filtros()
        self.criar_midias_slides()
        self.criar_plugins_dll()
        self.criar_utilidades()
        self.criar_painel_chaveador_automatico()
        self.criar_painel_automacoes_avancadas()
        self.criar_painel_macros_movimento() 
        self.criar_painel_letreiro_dinamico()
        self.criar_painel_wpstream()
        self.criar_painel_multi_rtmp()
        self.criar_painel_ptz_virtual()
        self.criar_aba_vdo_ninja()
        self.criar_painel_aitum_vertical()
        self.criar_painel_central_logins()
        self.criar_painel_manual_funcoes()
        print(f"Programa iniciado com sucesso...", flush=True)
        
    def criar_inicializador_obs(self):
        box = QGroupBox(" 🚀 Inicializador Inteligente do OBS Studio ", self)
        layout = QGridLayout(box)

        # --- LINHA Perfil de Saída ---
        lbl_p = QLabel("Perfil de Saída:", self)
        lbl_p.setStyleSheet("color: #1e293b;")
        layout.addWidget(lbl_p, 0, 0)
        
        self.combo_perfil = QComboBox(self)
        self.combo_perfil.addItems(["Nenhum (Usar Atual)", "Youtube Live", "Instagram Live"])
        self.combo_perfil.setStyleSheet("color: #000000; background-color: #ffffff;")
        layout.addWidget(self.combo_perfil, 0, 1)

        # --- LINHA Coleção de Cenas ---
        lbl_c = QLabel("Coleção de Cenas:", self)
        lbl_c.setStyleSheet("color: #1e293b;")
        layout.addWidget(lbl_c, 1, 0)
        
        self.combo_colecao = QComboBox(self)
        self.combo_colecao.addItems(["Nenhum (Usar Atual)", "Cenas Youtube", "Cenas Instagram"])
        self.combo_colecao.setStyleSheet("color: #000000; background-color: #ffffff;")
        layout.addWidget(self.combo_colecao, 1, 1)

        # --- LINHA Campo do Link VDO.Ninja ---
        lbl_vdo = QLabel("Link VDO.Ninja:", self)
        lbl_vdo.setStyleSheet("color: #1e293b;")
        layout.addWidget(lbl_vdo, 2, 0)

        self.entry_url_vdo1 = QLineEdit(self)
        self.entry_url_vdo1.setPlaceholderText("https://vdo.ninja/?view=SEU_ID")
        self.entry_url_vdo1.setStyleSheet("""
            QLineEdit {
                color: #000000; 
                background-color: #ffffff; 
                padding: 4px; 
                border: 1px solid #cbd5e1; 
                border-radius: 4px;
            }
        """)
        layout.addWidget(self.entry_url_vdo1, 2, 1)

        # --- LINHA Botão de Inicialização (DESLOCADO) ---
        self.btn_abrir_obs = QPushButton("Abrir e Configurar OBS Studio", self)
        self.btn_abrir_obs.setStyleSheet(f"background-color: {config.COLOR_PRIMARY}; color: white; font-weight: bold; padding: 8px;")
        layout.addWidget(self.btn_abrir_obs, 3, 0, 1, 2)

        # --- LINHA Botão de Fontes (DESLOCADO) ---
        self.btn_criar_fontes = QPushButton("🏗️ Gerar Fontes Essenciais no OBS", self)
        self.btn_criar_fontes.setStyleSheet("""
            QPushButton {
                background-color: #0284c7; 
                color: white; 
                font-weight: bold; 
                padding: 6px;
                border-radius: 4px;
            }
            QPushButton:hover { background-color: #0369a1; }
        """)
        layout.addWidget(self.btn_criar_fontes, 4, 0, 1, 2)

        self.main_layout.addWidget(box)
    
    def config_transmissao_youtube(self):
        """Gera o painel modular de Gerenciamento e Protocolo de transmissão"""
        # =================================================================
        # ⚙️ SEÇÃO: GERENCIAMENTO DE CONFIGURAÇÕES DE TRANSMISSÃO
        # =================================================================
        box_acoes = QGroupBox(" ⚙️ Gerenciamento de Configurações de transmissão", self)
        layout_acoes = QVBoxLayout(box_acoes)
        layout_acoes.setSpacing(6)

        # Inserção do ComboBox de Protocolo movido para esta seção
        lbl_protocolo = QLabel("Protocolo YouTube:", self)
        lbl_protocolo.setStyleSheet("color: #1e293b; font-weight: bold;")
        layout_acoes.addWidget(lbl_protocolo)

        self.tipo_protocolo_yt = QComboBox(self)
        self.tipo_protocolo_yt.addItems(["YouTube - RTMPS", "YouTube - HLS"])
        self.tipo_protocolo_yt.setStyleSheet("color: #000000; background-color: #ffffff; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px;")
        self.tipo_protocolo_yt.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Fixed)
        layout_acoes.addWidget(self.tipo_protocolo_yt)

        # Botões de ação
        self.btn_config_yt = QPushButton("Aplicar tipo de transmissão no OBS", self)
        self.btn_config_yt.setStyleSheet(f"background-color: {config.COLOR_PRIMARY}; color: white; font-weight: bold; padding: 10px;")
        layout_acoes.addWidget(self.btn_config_yt)

        self.btn_exportar = QPushButton("📥 Exportar Configurações de transmissão (arquivo .JSON p/ OBS)", self)
        self.btn_exportar.setStyleSheet(f"background-color: #f0fdf4; color: {config.COLOR_SUCCESS}; border: 1px solid {config.COLOR_SUCCESS}; font-weight: bold; padding: 8px;")
        layout_acoes.addWidget(self.btn_exportar)
        
        return box_acoes
    
    def criar_painel_automacoes_avancadas(self):
        # Criar o grupo principal (Card de Automações)
        box = QGroupBox(" 🚀 Recursos Avançados de Automação ", self)
        layout = QVBoxLayout(box)

        # --- FUNÇÃO 4: AGREGADOR GLOBAL DE DADOS ---
        self.lbl_total_viewers = QLabel("📊 Audiência Consolidada: 0 Viewers (Multi-stream)", self)
        self.lbl_total_viewers.setStyleSheet("font-size: 14px; font-weight: bold; color: #0284c7; padding: 5px;")
        layout.addWidget(self.lbl_total_viewers)

        # Linha de Botões de Ação
        linha_botoes = QHBoxLayout()

        # --- FUNÇÃO 1: REPLAY INSTANTÂNEO ---
        self.btn_salvar_replay = QPushButton("⏪ SALVAR REPLAY (Últimos 30s)")
        self.btn_salvar_replay.setStyleSheet("background-color: #f59e0b; color: white; font-weight: bold;")
        linha_botoes.addWidget(self.btn_salvar_replay)

        # --- FUNÇÃO 2: ZOOM DINÂMICO DO MOUSE ---
        self.btn_toggle_zoom = QPushButton("🔍 Ativar Zoom no Rato")
        self.btn_toggle_zoom.setCheckable(True)
        self.btn_toggle_zoom.setStyleSheet("background-color: #6b7280; color: white;")
        linha_botoes.addWidget(self.btn_toggle_zoom)

        layout.addLayout(linha_botoes)

        # --- FUNÇÃO 3: SMART MUTE / AUDIO DUCKING ---
        self.chk_smart_ducking = QCheckBox("🎚️ Ativar Ducking Automático (Abaixar Música ao Falar)")
        self.chk_smart_ducking.setStyleSheet("font-weight: bold; color: #374151; margin-top: 10px;")
        layout.addWidget(self.chk_smart_ducking)

        # Adiciona este painel ao layout principal da sua janela
        self.main_layout.addWidget(box)

    def criar_painel_chaveador_automatico(self):
        box = QGroupBox(" 🤖 Chaveador de Cenas Inteligente (Gatilhos Automáticos) ", self)
        layout = QVBoxLayout(box)

        self.lbl_status_chaveador = QLabel("⏸️ Monitoramento Automático: DESACTIVADO", self)
        self.lbl_status_chaveador.setStyleSheet("font-size: 13px; font-weight: bold; color: #475569; padding: 5px;")
        layout.addWidget(self.lbl_status_chaveador)

        regra_layout = QHBoxLayout()
        
        self.combo_condicao = QComboBox(self)
        self.combo_condicao.addItems([
            "Se Iniciar Transmissão (Live)",
            "Se Parar Transmissão (Live)",
            "Se Microfone ficar em Mudo",
            "Se Iniciar Gravação"
        ])
        self.combo_condicao.setStyleSheet("color: #000000; background-color: #ffffff;")
        
        lbl_entao = QLabel("➡️ Mudar para Cena:", self)
        lbl_entao.setStyleSheet("color: #1e293b;")
        
        self.combo_cena_destino = QComboBox(self)
        self.combo_cena_destino.addItems(["Abertura", "Gameplay", "Webcam", "Encerramento"])
        self.combo_cena_destino.setStyleSheet("color: #000000; background-color: #ffffff;")

        self.btn_add_regra = QPushButton("➕ Adicionar Regra", self)
        self.btn_add_regra.setStyleSheet("background-color: #4f46e5; color: white; font-weight: bold;")

        regra_layout.addWidget(self.combo_condicao)
        regra_layout.addWidget(lbl_entao)
        regra_layout.addWidget(self.combo_cena_destino)
        regra_layout.addWidget(self.btn_add_regra)
        layout.addLayout(regra_layout)

        lbl_lista = QLabel("📋 Regras de Automação Ativas:", self)
        lbl_lista.setStyleSheet("color: #1e293b;")
        layout.addWidget(lbl_lista)
        
        self.list_regras = QListWidget(self)
        self.list_regras.setStyleSheet("background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; color: #000000;")
        layout.addWidget(self.list_regras)

        ctrl_layout = QHBoxLayout()
        self.btn_toggle_monitor = QPushButton("▶️ ATIVAR MONITORAMENTO", self)
        self.btn_toggle_monitor.setCheckable(True)
        self.btn_toggle_monitor.setStyleSheet("background-color: #16a34a; color: white; font-weight: bold;")
        
        self.btn_limpar_regras = QPushButton("🗑️ Limpar Regras", self)
        self.btn_limpar_regras.setStyleSheet("background-color: #ef4444; color: white;")
        
        ctrl_layout.addWidget(self.btn_toggle_monitor)
        ctrl_layout.addWidget(self.btn_limpar_regras)
        layout.addLayout(ctrl_layout)

        self.main_layout.addWidget(box)

    def criar_painel_wpstream(self):
        box = QGroupBox(" 🌐 Integração Portal FASEPA (WpStream) ", self)
        layout = QVBoxLayout(box)

        self.lbl_status_wp = QLabel("Status: Aguardando sincronização com o WordPress", self)
        self.lbl_status_wp.setStyleSheet("color: #64748b; font-style: italic;")
        layout.addWidget(self.lbl_status_wp)

        inputs_layout = QHBoxLayout()
        self.entry_canal_id = QLineEdit(self)
        self.entry_canal_id.setPlaceholderText("ID do Canal WPStream (Ex: 1245)")
        
        self.btn_sincronizar_wp = QPushButton("🔄 Vincular Transmissão ao Site")
        self.btn_sincronizar_wp.setStyleSheet("background-color: #0284c7; color: white; font-weight: bold;")
        
        inputs_layout.addWidget(self.entry_canal_id)
        inputs_layout.addWidget(self.btn_sincronizar_wp)
        layout.addLayout(inputs_layout)

        self.main_layout.addWidget(box)

    def criar_painel_instalador_cenas(self):
        # Grupo Principal do Instalador
        box = QGroupBox(" 🛠️ Configuração e Padronização de Cenas OBS ", self)
        layout = QVBoxLayout(box)

        
        lbl_instrucao = QLabel(
            "Esta função configura automaticamente o OBS Studio criando as cenas e fontes "
            "padrão necessárias para o funcionamento correto dos gatilhos lógicos automáticos.",
            self
        )
        lbl_instrucao.setWordWrap(True)
        lbl_instrucao.setStyleSheet("color: #4b5563; font-size: 12px; margin-bottom: 10px;")
        layout.addWidget(lbl_instrucao)

        self.btn_criar_cenas_padrao = QPushButton("🏗️ Criar Cenas Padrão no OBS", self)
        self.btn_criar_cenas_padrao.setStyleSheet("background-color: #0d9488; color: white; font-weight: bold; padding: 10px;")
        layout.addWidget(self.btn_criar_cenas_padrao)

        # Barra de Progresso Visual
        self.progress_cenas = QProgressBar(self)
        self.progress_cenas.setValue(0)
        self.progress_cenas.setTextVisible(True)
        layout.addWidget(self.progress_cenas)

        # Injeta no layout principal da aplicação, add o painel inteiro ao layout principal
        self.main_layout.addWidget(box)

    def criar_painel_efeitos_avancados(self):
        # -------------------------------------------------------------------------
        # CARD 1: MACROS DE MOVIMENTO (MOVE TRANSITION)
        # -------------------------------------------------------------------------
        box_move = QGroupBox(" 🎬 Animações de Câmera (Move Transition) ", self)
        layout_move = QVBoxLayout(box_move)
        
        lbl_move = QLabel("Alterne o tamanho e a posição do feed da sua câmera de forma fluida:", self)
        lbl_move.setStyleSheet("color: #4b5563; font-size: 12px; margin-bottom: 5px;")
        layout_move.addWidget(lbl_move)
        
        layout_botoes = QHBoxLayout()
        self.btn_macro_focar = QPushButton("🔍 Focar Câmera")
        self.btn_macro_focar.setStyleSheet("background-color: #6366f1; color: white; font-weight: bold; padding: 10px; border-radius: 4px;")
        
        self.btn_macro_gameplay = QPushButton("🎮 Modo Gameplay")
        self.btn_macro_gameplay.setStyleSheet("background-color: #1e1b4b; color: white; font-weight: bold; padding: 10px; border-radius: 4px;")
        
        layout_botoes.addWidget(self.btn_macro_focar)
        layout_botoes.addWidget(self.btn_macro_gameplay)
        layout_move.addLayout(layout_botoes)
        self.main_layout.addWidget(box_move)

        # -------------------------------------------------------------------------
        # CARD 2: LETREIRO DINÂMICO (MARQUEE / TICKER)
        # -------------------------------------------------------------------------
        box_ticker = QGroupBox(" 📺 Letreiro de Avisos Dinâmico (Ticker) ", self)
        layout_ticker = QVBoxLayout(box_ticker)
        
        lbl_ticker = QLabel("Gerencie o letreiro de rolagem inferior para patrocinadores ou avisos importantes:", self)
        lbl_ticker.setStyleSheet("color: #4b5563; font-size: 12px; margin-bottom: 5px;")
        layout_ticker.addWidget(lbl_ticker)
        
        self.entry_texto_alerta = QLineEdit(self)
        self.entry_texto_alerta.setPlaceholderText("Digite aqui o novo texto para a barra de rolagem...")
        self.entry_texto_alerta.setStyleSheet("padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;")
        layout_ticker.addWidget(self.entry_texto_alerta)
        
        self.btn_atualizar_alerta = QPushButton("📣 Atualizar Alerta")
        self.btn_atualizar_alerta.setStyleSheet("background-color: #10b981; color: white; font-weight: bold; padding: 10px; border-radius: 4px;")
        layout_ticker.addWidget(self.btn_atualizar_alerta)
        
        self.main_layout.addWidget(box_ticker)
    

    def criar_aba_vdo_ninja(self):    
        box = QGroupBox(" 🥷 VDO.Ninja Control Room ", self)
        layout = QVBoxLayout(box)
    
        # --- Campo de URL do VDO.Ninja ---
        self.lbl_url_vdo = QLabel("🎥 Link de Transmissão VDO.Ninja (Câmera do Celular):", self)
        self.lbl_url_vdo.setStyleSheet("font-weight: bold; color: #1e293b; margin-top: 5px;")
    
        self.entry_url_vdo = QLineEdit(self)
        self.entry_url_vdo.setPlaceholderText("Cole aqui a URL do VDO.Ninja (ex: https://vdo.ninja/?view=...)")
        self.entry_url_vdo.setStyleSheet(
            "background-color: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; padding: 6px; border-radius: 4px;"
        )
    
        # Adicionado diretamente ao layout da caixa 'VDO.Ninja Control Room'
        layout.addWidget(self.lbl_url_vdo)
        layout.addWidget(self.entry_url_vdo)

        # Status e Contador
        self.lbl_viewers = QLabel("👁️ Viewers: 0", self)
        self.lbl_viewers.setStyleSheet("font-size: 16px; font-weight: bold; color: #4f46e5;")
        layout.addWidget(self.lbl_viewers)

        # Gerador de Link
        self.entry_peer_id = QLineEdit(self)
        self.entry_peer_id.setPlaceholderText("Digite o Peer ID do convidado aqui...")
        layout.addWidget(self.entry_peer_id)

        # Botões de Ação
        btn_layout = QHBoxLayout()
        self.btn_copiar_vdo = QPushButton("📋 Copiar Link")
        self.btn_compartilhar_vdo = QPushButton("🔗 Abrir no Navegador")
        self.btn_adicionar_vdo_obs = QPushButton("➕ Adicionar ao OBS")
    
        for btn in [self.btn_copiar_vdo, self.btn_compartilhar_vdo, self.btn_adicionar_vdo_obs]:
            btn.setStyleSheet("padding: 6px; font-weight: bold;")
    
        btn_layout.addWidget(self.btn_copiar_vdo)
        btn_layout.addWidget(self.btn_compartilhar_vdo)
        btn_layout.addWidget(self.btn_adicionar_vdo_obs)
        layout.addLayout(btn_layout)

        # Controles Remotos (Comando)
        ctrl_layout = QHBoxLayout()
        self.btn_mute = QPushButton("🔇 Mudo")
        self.btn_kick = QPushButton("❌ Remover")
        self.btn_quality = QPushButton("📉 Baixa Qualidade")
    
        for btn in [self.btn_mute, self.btn_kick, self.btn_quality]:
            btn.setStyleSheet("padding: 6px;")
        
        ctrl_layout.addWidget(self.btn_mute)
        ctrl_layout.addWidget(self.btn_kick)
        ctrl_layout.addWidget(self.btn_quality)
        layout.addLayout(ctrl_layout)

        # Instrução para o Convidado
        instrucao = QLabel("ℹ️ Instrução: Peça ao convidado para olhar o Peer ID no canto da tela do VDO.Ninja e digite-o acima.", self)
        instrucao.setWordWrap(True)
        instrucao.setStyleSheet("color: #64748b; font-size: 10px; font-style: italic;")
        layout.addWidget(instrucao)

        # Retorna para o scroll principal da primeira aba de controle geral
        self.main_layout.addWidget(box)
    
    def criar_painel_login_instagram(self):
        box = QGroupBox(" 📸 Integração Instagram Live ", self)
        layout = QVBoxLayout(box)

        lbl_info = QLabel(
            "Conecte sua conta para sincronizar comentários e alertas de Live. "
            "Seus dados são processados localmente de forma segura.", 
            self
        )
        lbl_info.setWordWrap(True)
        lbl_info.setStyleSheet("color: #475569; font-size: 11px; margin-bottom: 8px;")
        layout.addWidget(lbl_info)

        form_layout = QGridLayout()
        
        lbl_user = QLabel("Usuário / E-mail:", self)
        lbl_user.setStyleSheet("color: #1e293b;")
        form_layout.addWidget(lbl_user, 0, 0)
        
        self.txt_insta_user = QLineEdit(self)
        self.txt_insta_user.setPlaceholderText("ex: @seu_perfil")
        # self.txt_insta_user.setStyleSheet("padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; color: #000000; background-color: #FF0000;")
        form_layout.addWidget(self.txt_insta_user, 0, 1)

        lbl_pass = QLabel("Senha:", self)
        lbl_pass.setStyleSheet("color: #1e293b;")
        form_layout.addWidget(lbl_pass, 1, 0)
        
        self.txt_insta_pass = QLineEdit(self)
        self.txt_insta_pass.setEchoMode(QLineEdit.EchoMode.Password) 
        self.txt_insta_pass.setPlaceholderText("Sua senha do Instagram")
        form_layout.addWidget(self.txt_insta_pass, 1, 1)

        layout.addLayout(form_layout)

        self.btn_login_insta = QPushButton("🔗 Autenticar e Conectar Conta", self)
        self.btn_login_insta.setStyleSheet(
            "background-color: #e1306c; color: white; font-weight: bold; padding: 8px; margin-top: 5px;"
        )
        layout.addWidget(self.btn_login_insta)
        self.main_layout.addWidget(box)

    def criar_painel_automacoes_avancadas(self):
        box = QGroupBox(" 🚀 Recursos Avançados de Automação ", self)
        layout = QVBoxLayout(box)

        self.lbl_total_viewers = QLabel("📊 Audiência Consolidada: 0 Viewers (Multi-stream)", self)
        self.lbl_total_viewers.setStyleSheet("font-size: 14px; font-weight: bold; color: #0284c7; padding: 5px;")
        layout.addWidget(self.lbl_total_viewers)

        linha_botoes = QHBoxLayout()

        self.btn_salvar_replay = QPushButton("⏪ SALVAR REPLAY (Últimos 30s)")
        self.btn_salvar_replay.setStyleSheet("background-color: #f59e0b; color: white; font-weight: bold; padding: 6px;")
        linha_botoes.addWidget(self.btn_salvar_replay)

        self.btn_toggle_zoom = QPushButton("🔍 Ativar Zoom no Rato")
        self.btn_toggle_zoom.setCheckable(True)
        self.btn_toggle_zoom.setStyleSheet("background-color: #6b7280; color: white; padding: 6px;")
        linha_botoes.addWidget(self.btn_toggle_zoom)

        layout.addLayout(linha_botoes)

        self.chk_smart_ducking = QCheckBox("🎚️ Ativar Ducking Automático (Abaixar Música ao Falar)")
        self.chk_smart_ducking.setStyleSheet("font-weight: bold; color: #374151; margin-top: 10px;")
        layout.addWidget(self.chk_smart_ducking)

        self.main_layout.addWidget(box)

    def criar_painel_macros_movimento(self):
        box = QGroupBox(" 🎬 Macros de Movimento Avançado (Move Transition) ", self)
        layout = QVBoxLayout(box)

        lbl_info = QLabel(
            "Dispare animações dinâmicas de câmera e transformações de fontes em tempo real utilizando filtros.", 
            self
        )
        lbl_info.setWordWrap(True)
        lbl_info.setStyleSheet("color: #475569; font-size: 11px; margin-bottom: 4px;")
        layout.addWidget(lbl_info)

        macro_layout = QHBoxLayout()

        self.btn_macro_focar = QPushButton("🎯 Focar Câmera", self)
        self.btn_macro_focar.setStyleSheet("background-color: #3b82f6; color: white; font-weight: bold; padding: 8px;")
        
        self.btn_macro_gameplay = QPushButton("🎮 Modo Gameplay", self)
        self.btn_macro_gameplay.setStyleSheet("background-color: #1e293b; color: white; font-weight: bold; padding: 8px;")

        macro_layout.addWidget(self.btn_macro_focar)
        macro_layout.addWidget(self.btn_macro_gameplay)
        layout.addLayout(macro_layout)

        self.main_layout.addWidget(box)


    def criar_painel_letreiro_dinamico(self):
        box = QGroupBox(" 📢 Gerenciador de Letreiro Dinâmico e Alertas ", self)
        layout = QVBoxLayout(box)

        # Mini-Preview
        self.preview_letreiro = PreviewLetreiro(self)
        layout.addWidget(self.preview_letreiro)

        lbl_info = QLabel("Digite o texto e selecione os efeitos desejados antes de enviar para a Live:", self)
        lbl_info.setStyleSheet("color: #374151; font-size: 12px;")
        layout.addWidget(lbl_info)

        # Linha de Input e Botão Enviar
        input_layout = QHBoxLayout()
        self.txt_texto_alerta = QLineEdit(self)
        self.txt_texto_alerta.setPlaceholderText("Ex: 🔥 SEJA BEM-VINDO À LIVE! DEIXE SEU LIKE...")
        self.txt_texto_alerta.textChanged.connect(self.preview_letreiro.set_texto)
    
        self.btn_atualizar_alerta = QPushButton("🚀 Enviar Alerta", self)
        self.btn_atualizar_alerta.setStyleSheet("background-color: #ec4899; color: white; font-weight: bold; padding: 6px 12px;")
    
        input_layout.addWidget(self.txt_texto_alerta)
        input_layout.addWidget(self.btn_atualizar_alerta)
        layout.addLayout(input_layout)

        # 🆕 NOVA LINHA: Botões de Efeitos Especiais
        layout_efeitos = QHBoxLayout()
        layout_efeitos.setSpacing(10)

        self.btn_efeito_piscar = QPushButton("✨ Ativar Piscar", self)
        self.btn_efeito_piscar.setCheckable(True) # Transforma o botão num interruptor (On/Off)
        self.btn_efeito_piscar.setStyleSheet("""
            QPushButton { background-color: #f1f5f9; color: #475569; font-weight: bold; padding: 6px; border: 1px solid #cbd5e1; }
            QPushButton:checked { background-color: #a855f7; color: white; border: 1px solid #9333ea; }
        """)
    
        self.btn_efeito_cores = QPushButton("🌈 Ativar Arco-Íris", self)
        self.btn_efeito_cores.setCheckable(True)
        self.btn_efeito_cores.setStyleSheet("""
            QPushButton { background-color: #f1f5f9; color: #475569; font-weight: bold; padding: 6px; border: 1px solid #cbd5e1; }
            QPushButton:checked { background-color: #3b82f6; color: white; border: 1px solid #2563eb; }
        """)

        layout_efeitos.addWidget(self.btn_efeito_piscar)
        layout_efeitos.addWidget(self.btn_efeito_cores)
        layout.addLayout(layout_efeitos)

        # Conexão direta dos botões para atualizar a física do Preview local instantaneamente
        self.btn_efeito_piscar.toggled.connect(lambda checked: setattr(self.preview_letreiro, 'efeito_piscar', checked))
        self.btn_efeito_cores.toggled.connect(lambda checked: setattr(self.preview_letreiro, 'efeito_arcoiris', checked))

        self.main_layout.addWidget(box)

    def criar_painel_wpstream(self):
        box = QGroupBox(" 🌐 Integração site FASEPA (wpstream) ", self)
        layout = QVBoxLayout(box)

        self.lbl_status_wp = QLabel("Status: Aguardando sincronização com o WordPress", self)
        self.lbl_status_wp.setStyleSheet("color: #475569; font-style: italic;")
        layout.addWidget(self.lbl_status_wp)

        inputs_layout = QHBoxLayout()
        self.entry_canal_id = QLineEdit(self)
        self.entry_canal_id.setPlaceholderText("ID do Canal WPStream (Ex: 1245)")
        
        
        self.btn_sincronizar_wp = QPushButton("🔄 Vincular Transmissão ao Site")
        
        
        inputs_layout.addWidget(self.entry_canal_id)
        inputs_layout.addWidget(self.btn_sincronizar_wp)
        layout.addLayout(inputs_layout)

        self.main_layout.addWidget(box)

    # método que usa QGridLayout para criar D-pad como um controle de videogame com botões e zoom
    def criar_painel_ptz_virtual(self):
        # 📌 Configura o layout exclusivo para a aba de Câmera PTZ
        layout_aba = QVBoxLayout(self.aba_ptz)
        layout_aba.setContentsMargins(15, 15, 15, 15)
        layout_aba.setAlignment(Qt.AlignmentFlag.AlignTop)

        box = QGroupBox(" 🎥 Direção de Câmera: PTZ Virtual ", self)
        layout = QVBoxLayout(box)

        instrucao = QLabel("Controle digital de Pan, Tilt e Zoom. Certifique-se de preencher o nome exato da fonte da câmera.", self)
        instrucao.setStyleSheet("color: #64748b; font-size: 11px;")
        layout.addWidget(instrucao)

        # Campo para o usuário definir qual fonte será controlada
        self.entry_nome_camera = QComboBox(self)
        self.entry_nome_camera.setStyleSheet("""
            QComboBox {
                background-color: #B0E0E6;
                color: #000000;
                border: 1.5px solid #B0C4DE;
                border-radius: 4px;
                padding: 6px;
                font-weight: bold;
            }
        """)
        # Opção padrão inicial
        self.entry_nome_camera.addItem("Selecione um equipamento...")
        layout.addWidget(self.entry_nome_camera)
        
        # Botão opcional para atualizar a lista manualmente
        self.btn_atualizar_equipamentos = QPushButton("🔄 Atualizar Lista de Câmeras", self)
        self.btn_atualizar_equipamentos.setStyleSheet("background-color: #e2e8f0; color: #334155; padding: 5px; font-size: 11px;")
        self.btn_atualizar_equipamentos.clicked.connect(self.atualizar_lista_equipamentos_ptz)
        layout.addWidget(self.btn_atualizar_equipamentos)

        # Container principal para os controles
        controles_layout = QHBoxLayout()

        # --- D-PAD (Direcionais) ---
        dpad_layout = QGridLayout()
        
        self.btn_ptz_up = QPushButton("⬆️")
        self.btn_ptz_down = QPushButton("⬇️")
        self.btn_ptz_left = QPushButton("⬅️")
        self.btn_ptz_right = QPushButton("➡️")
        self.btn_ptz_reset = QPushButton("🔄 Centro")
        
        # Estilizando os botões do D-Pad (padrão do sistema)
        estilo_btn = "font-size: 18px; padding: 10px; border-radius: 5px;"
        for btn in [self.btn_ptz_up, self.btn_ptz_down, self.btn_ptz_left, self.btn_ptz_right, self.btn_ptz_reset]:
            btn.setStyleSheet(estilo_btn)

        self.btn_ptz_reset.setStyleSheet("font-size: 12px; font-weight: bold; border-radius: 5px;")

        # Montando a cruz do D-Pad (Linha, Coluna)
        dpad_layout.addWidget(self.btn_ptz_up, 0, 1)
        dpad_layout.addWidget(self.btn_ptz_left, 1, 0)
        dpad_layout.addWidget(self.btn_ptz_reset, 1, 1)
        dpad_layout.addWidget(self.btn_ptz_right, 1, 2)
        dpad_layout.addWidget(self.btn_ptz_down, 2, 1)

        controles_layout.addLayout(dpad_layout)
        
        # Vincula os cliques passando o parâmetro de direção correspondente
        self.btn_ptz_up.clicked.connect(lambda: self.executar_movimento_ptz("cima"))
        self.btn_ptz_down.clicked.connect(lambda: self.executar_movimento_ptz("baixo"))
        self.btn_ptz_left.clicked.connect(lambda: self.executar_movimento_ptz("esquerda"))
        self.btn_ptz_right.clicked.connect(lambda: self.executar_movimento_ptz("direita"))

        # --- CONTROLES DE ZOOM ---
        zoom_layout = QVBoxLayout()
        self.btn_zoom_in = QPushButton("🔍 Zoom +")
        self.btn_zoom_out = QPushButton("🔎 Zoom -")
        
        self.btn_zoom_in.setStyleSheet("background-color: #3b82f6; color: white; font-weight: bold; padding: 15px;")
        self.btn_zoom_out.setStyleSheet("background-color: #64748b; color: white; font-weight: bold; padding: 15px;")
        
        zoom_layout.addWidget(self.btn_zoom_in)
        zoom_layout.addWidget(self.btn_zoom_out)
        
        controles_layout.addLayout(zoom_layout)
        layout.addLayout(controles_layout)

        # Adiciona o card diretamente no layout da aba dedicada
        layout_aba.addWidget(box)

    # Função PTZ do botão Mover camera:
    def executar_movimento_ptz(self, direcao):
        """Função unificada para mover a câmera em qualquer direção (cima, baixo, esquerda, direita)"""
        nome_selecionado = self.entry_nome_camera.currentText()
        if "🎥 OBS: " in nome_selecionado:
            nome_fonte_obs = nome_selecionado.replace("🎥 OBS: ", "")
        else:
            nome_fonte_obs = nome_selecionado

        # Verificação de segurança
        if nome_fonte_obs in ["Selecione um equipamento...", "Nenhum equipamento localizado", ""]:
            QMessageBox.warning(self, "Aviso", "Por favor, selecione uma câmera válida antes de mover!")
            return

        # Envio do comando com Try/Except para evitar crashes na interface
        if hasattr(self, 'obs_manager') and getattr(self.obs_manager, 'client', None):
            try:
                self.obs_manager.mover_camera_virtual(nome_fonte=nome_fonte_obs, direcao=direcao)
            except Exception as e:
                print(f"❌ Erro de execução ao mover a câmera: {e}", flush=True)
                QMessageBox.critical(
                    self, 
                    "Falha no Controle PTZ", 
                    f"Não foi possível mover a câmera no OBS.\n\nDetalhe do erro: {e}"
                )
        else:
            QMessageBox.warning(self, "Erro de Conexão", "O OBS não está conectado via WebSocket!")
    
    def atualizar_lista_equipamentos_ptz(self):
        """Escaneia webcams do sistema e fontes do OBS e atualiza o QComboBox"""
        if not hasattr(self, 'entry_nome_camera'):
            return

        # Limpa os itens antigos, guardando o texto atualmente selecionado se houver
        texto_atual = self.entry_nome_camera.currentText()
        self.entry_nome_camera.clear()
        
        câmeras_adicionadas = 0

        # 1. Tenta buscar fontes de câmera vindas do OBS Studio (via WebSocket)
        if hasattr(self, 'obs_manager') and getattr(self.obs_manager, 'client', None):
            try:
                print("⚠️ [atualizar_lista_equipamentos_ptz] Escaneando câmeras no OBS...", flush=True)
                fontes_obs = self.obs_manager.verificar_cameras_no_obs()
                if fontes_obs:
                    for fonte in fontes_obs:
                        self.entry_nome_camera.addItem(f"🎥 OBS: {fonte}")
                        câmeras_adicionadas += 1
                        print("[atualizar_lista_equipamentos_ptz] Escaneamento de câmeras no OBS concluido... {fonte}", flush=True)
            except Exception as e:
                # O erro agora é capturado corretamente sem travar a interface
                print(f"⚠️ [atualizar_lista_equipamentos_ptz] Erro ao escanear fontes no OBS: {e}", flush=True)

        # 2. Busca webcams físicas conectadas diretamente no computador
        if hasattr(self, 'obs_manager'):
            try:
                webcams_fisicas = self.obs_manager.verificar_cameras_sistema()
                if webcams_fisicas:
                    for idx in webcams_fisicas:
                        self.entry_nome_camera.addItem(f"💻 Webcam física localizada, índice: {idx}")
                        câmeras_adicionadas += 1
                        print(f"💻 [atualizar_lista_equipamentos_ptz] Webcam física localizada, índice: {idx}.", flush=True)
            except Exception as e:
                print(f"⚠️ [atualizar_lista_equipamentos_ptz] Erro ao escanear hardware local: {e}", flush=True)

        # Se nada for encontrado, adiciona um aviso informativo
        if câmeras_adicionadas == 0:
            self.entry_nome_camera.addItem("Nenhum equipamento localizado")
            print(f"⚠️ [atualizar_lista_equipamentos_ptz] Nenhum equipamento de vídeo localizado", flush=True)
        else:
            # Tenta re-selecionar o que o usuário estava usando antes da atualização
            index = self.entry_nome_camera.findText(texto_atual)
            if index >= 0:
                self.entry_nome_camera.setCurrentIndex(index)
    
    def criar_monitor_fluxo(self):
        box = QGroupBox(" Monitor de Fluxo Real-Time ", self)
        layout = QVBoxLayout(box)
        
        self.lbl_status = QLabel("Pronto", self)
        self.lbl_status.setFont(QFont("Segoe UI", 12, QFont.Weight.Bold))
        self.lbl_status.setStyleSheet(f"color: {config.COLOR_PRIMARY};")
        self.lbl_status.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(self.lbl_status)

        self.btn_preview = QPushButton("👁️ Ativar Mini-Preview da Transmissão (Suporta PiP)", self)
        self.btn_preview.setStyleSheet(f"background-color: {config.COLOR_SECONDARY}; color: white; font-weight: bold; padding: 6px;")
        layout.addWidget(self.btn_preview)
        self.main_layout.addWidget(box)

    def criar_master_switches(self):
        layout = QHBoxLayout()
        self.btn_stream = QPushButton("📺 INICIAR LIVE", self)
        self.btn_stream.setStyleSheet(f"background-color: {config.COLOR_SUCCESS}; color: white; font-weight: bold; padding: 8px;")
        
        self.btn_share_link = QPushButton("🔗 COMPARTILHAR LINK", self)
        # Usamos uma folha de estilo que define a cor normal E a cor de quando estiver desativado (:disabled)
        self.btn_share_link.setStyleSheet(f"""
            QPushButton {{
                background-color: {config.COLOR_INFO}; 
                color: #212529; 
                font-weight: bold; 
                padding: 8px;
                border: none;
                border-radius: 4px;
            }}
            QPushButton:disabled {{
                background-color: #e2e8f0; 
                color: #94a3b8;
                border: 1px solid #cbd5e1;
            }}
        """)
        self.btn_share_link.setEnabled(False)  # 🔒 Começa desabilitado por padrão
        
        self.btn_gravar = QPushButton("⏺️ GRAVAR LIVE", self)
        self.btn_gravar.setStyleSheet(f"background-color: {config.COLOR_DARK}; color: white; font-weight: bold; padding: 8px;")

        self.btn_exportar_switcher = QPushButton("⚙️ Exportar Regras (.json p/ Advanced Switcher)", self)
        self.btn_exportar_switcher.setStyleSheet("background-color: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; font-weight: bold; padding: 8px;")

        layout.addWidget(self.btn_stream)
        layout.addWidget(self.btn_share_link)
        layout.addWidget(self.btn_gravar)
        layout.addWidget(self.btn_exportar_switcher) # Adiciona no layout
        
        self.main_layout.addLayout(layout)


    def criar_audio_filtros(self):
        box = QGroupBox(" Mixagem de Áudio & Filtros Dinâmicos ", self)
        layout = QHBoxLayout(box)

        lbl_m = QLabel("Vol. Mic:", self)
        lbl_m.setStyleSheet("color: #1e293b;")
        layout.addWidget(lbl_m)
        
        self.slider_vol = QSlider(Qt.Orientation.Horizontal, self)
        self.slider_vol.setRange(0, 100)
        self.slider_vol.setValue(80)
        layout.addWidget(self.slider_vol)

        self.btn_filtro = QPushButton("✨ Filtro Webcam", self)
        self.btn_filtro.setStyleSheet("background-color: #6f42c1; color: white; font-weight: bold; padding: 6px;")
        layout.addWidget(self.btn_filtro)
        self.main_layout.addWidget(box)

    def criar_midias_slides(self):
        box = QGroupBox(" Gerenciamento de Mídias e Slides ", self)
        # Mudamos para vertical para colocar a linha do arquivo em cima e os botões embaixo
        layout_principal = QVBoxLayout(box)
        layout_principal.setSpacing(8)

        # --- Linha Superior: Seleção de Arquivo ---
        layout_arquivo = QHBoxLayout()
        self.entry_caminho_midia = QLineEdit(self)
        self.entry_caminho_midia.setPlaceholderText("Selecione um arquivo de vídeo ou imagem para o OBS...")
        self.entry_caminho_midia.setReadOnly(True) # Apenas via Explorer
        
        self.btn_procurar_midia = QPushButton("📁 Procurar...", self)
        self.btn_procurar_midia.setStyleSheet("background-color: #e2e8f0; color: #334155; font-weight: bold; padding: 5px;")
        
        layout_arquivo.addWidget(self.entry_caminho_midia)
        layout_arquivo.addWidget(self.btn_procurar_midia)
        layout_principal.addLayout(layout_arquivo)

        # --- Linha Inferior: Botões de Ação ---
        layout_botoes = QHBoxLayout()
        
        self.btn_enviar_midia = QPushButton("📤 Enviar ao OBS", self)
        self.btn_enviar_midia.setStyleSheet(f"background-color: #0ea5e9; color: white; font-weight: bold; padding: 6px;")
        
        self.btn_play_vid = QPushButton("▶️ Play Vídeo", self)
        self.btn_play_vid.setStyleSheet(f"background-color: {config.COLOR_INFO}; color: #212529; font-weight: bold; padding: 6px;")
        
        self.btn_pause_vid = QPushButton("⏸️ Pause Vídeo", self)
        self.btn_pause_vid.setStyleSheet(f"background-color: {config.COLOR_SECONDARY}; color: white; font-weight: bold; padding: 6px;")
        
        self.btn_slide = QPushButton("🖥️ Avançar PPT", self)
        self.btn_slide.setStyleSheet(f"background-color: {config.COLOR_DANGER}; color: white; font-weight: bold; padding: 6px;")
        
        layout_botoes.addWidget(self.btn_enviar_midia)
        layout_botoes.addWidget(self.btn_play_vid)
        layout_botoes.addWidget(self.btn_pause_vid)
        layout_botoes.addWidget(self.btn_slide)
        
        layout_principal.addLayout(layout_botoes)
        self.main_layout.addWidget(box)

    def criar_plugins_dll(self):
        box = QGroupBox(" Gerenciador de Plugins DLL Externos (ctypes) ", self)
        layout = QGridLayout(box)

        lbl_c = QLabel("Caminho DLL:", self)
        lbl_c.setStyleSheet("color: #1e293b;")
        layout.addWidget(lbl_c, 0, 0)
        
        self.entry_dll_path = QLineEdit(self)
        self.entry_dll_path.setReadOnly(True)
        
        layout.addWidget(self.entry_dll_path, 0, 1)

        self.btn_buscar_dll = QPushButton("🔍 Buscar DLL", self)
        self.btn_buscar_dll.setStyleSheet(f"background-color: {config.COLOR_SECONDARY}; color: white; padding: 4px 10px;")
        layout.addWidget(self.btn_buscar_dll, 0, 2)

        lbl_f = QLabel("Função Alvo:", self)
        lbl_f.setStyleSheet("color: #1e293b;")
        layout.addWidget(lbl_f, 1, 0)
        
        self.entry_dll_func = QLineEdit(self)
        self.entry_dll_func.setPlaceholderText("ex: inicializar_filtro")
        
        layout.addWidget(self.entry_dll_func, 1, 1)

        self.btn_executar_dll = QPushButton("⚙️ Invocar", self)
        self.btn_executar_dll.setStyleSheet(f"background-color: {config.COLOR_PRIMARY}; color: white; font-weight: bold; padding: 4px 12px;")
        layout.addWidget(self.btn_executar_dll, 1, 2)
        
        self.main_layout.addWidget(box)

    # =================================================================
    # Cria o bloco de utilidades (cronômetro) dentro da aba especificada
    # =================================================================
    def criar_utilidades(self, layout_da_aba_destino=None):
        box = QGroupBox(" Utilidades de Tela ", self)
        layout = QHBoxLayout(box)

        layout.addWidget(QLabel("Minutos:", self))
        self.entry_cronometro = QLineEdit(self)
        self.entry_cronometro.setFixedWidth(50)
        self.entry_cronometro.setText("5")
        layout.addWidget(self.entry_cronometro)

        self.btn_cronometro = QPushButton("⏱️ Iniciar Countdown", self)
        self.btn_cronometro.setStyleSheet(f"background-color: {config.COLOR_PRIMARY}; color: white; font-weight: bold;")
        layout.addWidget(self.btn_cronometro)

        self.lbl_cronometro_vazio = QLabel("00:00", self)
        self.lbl_cronometro_vazio.setFont(QFont("Segoe UI", 14, QFont.Weight.Bold))
        self.lbl_cronometro_vazio.setStyleSheet(f"color: {config.COLOR_DANGER};")
        layout.addWidget(self.lbl_cronometro_vazio)
        
        # 🟢 CORREÇÃO INTELIGENTE: Se um layout foi passado, coloca na aba. 
        # Se não foi passado (chamada antiga), coloca no layout principal automaticamente.
        if layout_da_aba_destino is not None:
            layout_da_aba_destino.addWidget(box)
        else:
            self.main_layout.addWidget(box)
        
    def criar_painel_multi_rtmp(self):
        # 📌 Define o layout vertical para preencher a aba secundária do Multi-RTMP
        # 🔄 Se a aba já tiver um layout, recupera ele. Se não, cria um novo!
        if self.aba_multi_rtmp.layout() is not None:
            layout_aba = self.aba_multi_rtmp.layout()
        else:
            layout_aba = QVBoxLayout(self.aba_multi_rtmp)
            layout_aba.setContentsMargins(15, 15, 15, 15)
            layout_aba.setAlignment(Qt.AlignmentFlag.AlignTop)

        # ✨ CORREÇÃO: Removeu-se o 'self' para evitar o vazamento na janela principal
        box = QGroupBox(" 🌐 Transmissão Simultânea (Multi-RTMP) ")
        layout = QVBoxLayout(box)

        # ✨ OPCIONAL: Recomendo remover o ', self' dos QLabels e QLineEdits deste bloco também
        instrucao = QLabel(
            "Configure destinos secundários de transmissão. O OBS enviará o sinal principal (ex: YouTube) "
            "e esta central ativará os fluxos adicionais (ex: WPStream Website)."
        )
        instrucao.setWordWrap(True)
        instrucao.setStyleSheet("color: #64748b; font-size: 11px; margin-bottom: 5px;")
        layout.addWidget(instrucao)

        # Formulário de Cadastro de Destino Extra
        form_layout = QGridLayout()
        
        form_layout.addWidget(QLabel("Nome do Destino:", self), 0, 0)
        self.entry_rtmp_nome = QLineEdit(self)
        self.entry_rtmp_nome.setPlaceholderText("Ex: Site WPStream, Twitch...")
        # self.entry_rtmp_nome.setStyleSheet("padding: 4px;")
        form_layout.addLayout(self.criar_layout_campo(self.entry_rtmp_nome), 0, 1)

        form_layout.addWidget(QLabel("Servidor RTMP (URL):", self), 1, 0)
        self.entry_rtmp_url = QLineEdit(self)
        self.entry_rtmp_url.setPlaceholderText("rtmp://instancia.wpstream.tv/live/...")
        self.entry_rtmp_url.setStyleSheet("padding: 4px;")
        form_layout.addLayout(self.criar_layout_campo(self.entry_rtmp_url), 1, 1)

        form_layout.addWidget(QLabel("Chave de Fluxo (Stream Key):", self), 2, 0)
        self.entry_rtmp_key = QLineEdit(self)
        self.entry_rtmp_key.setEchoMode(QLineEdit.EchoMode.Password)
        self.entry_rtmp_key.setPlaceholderText("Cole a chave secreta de transmissão aqui...")
        
        form_layout.addLayout(self.criar_layout_campo(self.entry_rtmp_key), 2, 1)

        layout.addLayout(form_layout)

        # Botões de Controle do Multi-Fluxo
        btn_layout = QHBoxLayout()
        
        self.btn_adicionar_destino = QPushButton("➕ Salvar Destino")
        self.btn_adicionar_destino.setStyleSheet("padding: 6px; font-weight: bold; background-color: #e2e8f0; color: #000000;")
        
        self.btn_iniciar_multi_rtmp = QPushButton("⚡ Iniciar Multi-Transmissão")
        self.btn_iniciar_multi_rtmp.setStyleSheet("background-color: #1d4ed8; color: white; font-weight: bold; padding: 8px;")
        
        self.btn_parar_multi_rtmp = QPushButton("🛑 Parar Multi-Transmissão")
        self.btn_parar_multi_rtmp.setStyleSheet("background-color: #ef4444; color: white; font-weight: bold; padding: 8px;")
        self.btn_parar_multi_rtmp.setEnabled(False)

        btn_layout.addWidget(self.btn_adicionar_destino)
        btn_layout.addWidget(self.btn_iniciar_multi_rtmp)
        btn_layout.addWidget(self.btn_parar_multi_rtmp)
        layout.addLayout(btn_layout)

        # Lista de destinos configurados para monitoramento simples
        self.lbl_status_destinos = QLabel("Status: Múltiplos destinos desconectados.", self)
        self.lbl_status_destinos.setStyleSheet("font-size: 11px; color: #475569; font-style: italic; margin-top: 5px;")
        layout.addWidget(self.lbl_status_destinos)

        # Adiciona o card diretamente no layout interno da aba dedicada de Multi-RTMP
        layout_aba.addWidget(box)

    def criar_layout_campo(self, widget):
        """Auxiliar simples para envelopar campos de texto mantendo layout limpo"""
        wrapper = QHBoxLayout()
        wrapper.addWidget(widget)
        return wrapper
        
    def criar_painel_aitum_vertical(self):
        # 📌 Define o layout vertical exclusivo para preencher a aba do Aitum Vertical
        layout_aba = QVBoxLayout(self.aba_aitum_vertical)
        layout_aba.setContentsMargins(15, 15, 15, 15)
        layout_aba.setAlignment(Qt.AlignmentFlag.AlignTop)

        box = QGroupBox(" 🎬 Ecossistema Aitum Vertical (Canvas 9:16) ")
        layout = QVBoxLayout(box)

        instrucao = QLabel(
            "Gerencie transmissões verticais simultâneas sem interferir no canvas horizontal (16:9). "
            "A central sincroniza os gatilhos através do Aitum Multistream e injeta as credenciais móveis.", self
        )
        instrucao.setWordWrap(True)
        instrucao.setStyleSheet("color: #64748b; font-size: 11px; margin-bottom: 5px;")
        layout.addWidget(instrucao)

        # Seletor de Destino Mobile
        form_layout = QGridLayout()
        
        form_layout.addWidget(QLabel("Destino Vertical:"), 0, 0)
        self.combo_aitum_destino = QComboBox()
        self.combo_aitum_destino.addItems(["TikTok Live", "Instagram Live", "YouTube Shorts (Live)", "Twitch Mobile"])
        form_layout.addWidget(self.combo_aitum_destino, 0, 1)

        form_layout.addWidget(QLabel("URL do Servidor RMTP:"), 1, 0)
        self.entry_aitum_url = QLineEdit()
        self.entry_aitum_url.setPlaceholderText("rtmps://live-api-s.instagram.com:443/rtmp/...")
        form_layout.addLayout(self.criar_layout_campo(self.entry_aitum_url), 1, 1)

        form_layout.addWidget(QLabel("Stream Key Móvel:"), 2, 0)
        self.entry_aitum_key = QLineEdit()
        self.entry_aitum_key.setEchoMode(QLineEdit.EchoMode.Password)
        self.entry_aitum_key.setPlaceholderText("Insira a chave de transmissão 9:16...")
        form_layout.addLayout(self.criar_layout_campo(self.entry_aitum_key), 2, 1)

        layout.addLayout(form_layout)

        # Painel Centralizador: Aitum Multistream
        box_multistream = QGroupBox(" ⚡ Centralizador Aitum Multistream ")
        layout_multi = QVBoxLayout(box_multistream)
        
        lbl_info_multi = QLabel("Controle unificado de transmissão (Horizontal + Vertical):")
        lbl_info_multi.setStyleSheet("font-size: 11px; font-weight: normal; color: #475569;")
        layout_multi.addWidget(lbl_info_multi)

        btn_layout_multi = QHBoxLayout()
        
        self.btn_sincronizar_canvas = QPushButton("🔄 Sincronizar Cenas")
        self.btn_sincronizar_canvas.setStyleSheet("padding: 6px; font-weight: bold; background-color: #e2e8f0; color: #000000;")
        
        self.btn_iniciar_tudo = QPushButton("🚀 Iniciar Ambos (16:9 + 9:16)")
        self.btn_iniciar_tudo.setStyleSheet("background-color: #16a34a; color: white; font-weight: bold; padding: 8px;") # Verde Sucesso
        
        self.btn_parar_tudo = QPushButton("🛑 Parar Ambas")
        self.btn_parar_tudo.setStyleSheet("background-color: #ef4444; color: white; font-weight: bold; padding: 8px;")
        self.btn_parar_tudo.setEnabled(False)

        btn_layout_multi.addWidget(self.btn_sincronizar_canvas)
        btn_layout_multi.addWidget(self.btn_iniciar_tudo)
        btn_layout_multi.addWidget(self.btn_parar_tudo)
        layout_multi.addLayout(btn_layout_multi)
        
        layout.addWidget(box_multistream)

        # Status do Plugin Interno do OBS
        self.lbl_status_aitum = QLabel("Status do Canvas Vertical: Sincronizado, aguardando stream key.")
        self.lbl_status_aitum.setStyleSheet("font-size: 11px; color: #475569; font-style: italic; margin-top: 5px;")
        layout.addWidget(self.lbl_status_aitum)

        # Adiciona o card principal no layout da aba dedicada
        layout_aba.addWidget(box)
        
    #============================
    # Métodos para o mudar os LEDs
    #============================
    def atualizar_status_live_online(self):
        """Muda o LED para Verde quando a transmissão iniciar"""
        self.led_status_live.setStyleSheet("""
            background-color: #22c55e; 
            border: 1px solid #15803d; 
            border-radius: 6px;
        """)
        self.atualizar_status("🟢 LIVE INICIADA COM SUCESSO!", config.COLOR_SUCCESS)
        print(f"🟢 LIVE INICIADA COM SUCESSO!", flush=True)
        
        # 🔓 Habilita a aba Controle PTZ (Índice 1) para uso quando live inicia
        if hasattr(self, 'tabs'):
            self.tabs.setTabEnabled(1, True)

    def atualizar_status_live_offline(self):
        """Retorna o LED para Vermelho quando a transmissão parar"""
        self.led_status_live.setStyleSheet("""
            background-color: #ef4444; 
            border: 1px solid #b91c1c; 
            border-radius: 6px;
        """)
        
        # 🔒 Bloqueia novamente a aba Controle PTZ (Índice 1) se a live cair/fechar
        if hasattr(self, 'tabs'):
            self.tabs.setTabEnabled(1, False)
        
    # Métodos para o LED do YouTube
    def atualizar_status_youtube_conectado(self):
        """Muda os LEDs do YouTube para Verde (Topo e Painel)"""
        estilo_verde = "background-color: #22c55e; border: 1px solid #15803d; border-radius: 6px;"
        
        if hasattr(self, 'led_topo_yt'):
            self.led_topo_yt.setStyleSheet(estilo_verde)
            self.led_topo_yt.repaint()
            
        if hasattr(self, 'led_painel_yt'):
            self.led_painel_yt.setStyleSheet(estilo_verde)
            self.led_painel_yt.repaint()

    def atualizar_status_youtube_desconectado(self):
        """Retorna os LEDs do YouTube para Vermelho (Topo e Painel)"""
        estilo_vermelho = "background-color: #ef4444; border: 1px solid #b91c1c; border-radius: 6px;"
        
        if hasattr(self, 'led_topo_yt'):
            self.led_topo_yt.setStyleSheet(estilo_vermelho)
            self.led_topo_yt.repaint()
            
        if hasattr(self, 'led_painel_yt'):
            self.led_painel_yt.setStyleSheet(estilo_vermelho)
            self.led_painel_yt.repaint()

    # Métodos para o LED do Instagram
    def atualizar_status_instagram_conectado(self):
        """Muda o LED do Instagram para Verde"""
        self.led_status_insta.setStyleSheet("""
            background-color: #22c55e; border: 1px solid #15803d; border-radius: 6px;
        """)

    def atualizar_status_instagram_desconectado(self):
        """Retorna o LED do Instagram para Vermelho"""
        self.led_status_insta.setStyleSheet("""
            background-color: #ef4444; border: 1px solid #b91c1c; border-radius: 6px;
        """)
    
    # Métodos para o LED do OBS websocket/webcam
    def conectar_obs_websocket(self):
        """Coleta as informações das caixas de texto e tenta a conexão persistente"""
        from PySide6.QtWidgets import QMessageBox, QApplication
        
        ip = self.entry_ip_obs.text().strip()
        porta_str = self.entry_porta_obs.text().strip()
        senha = self.entry_senha_obs.text().strip()

        if not ip or not porta_str or not senha:
            QMessageBox.warning(self, "Campos Vazios", "Por favor, preencha o IP, Porta e Senha.")
            return

        try:
            porta = int(porta_str)
        except ValueError:
            QMessageBox.warning(self, "Erro de Porta", "A porta informada precisa ser um número inteiro.")
            return

        if "%40" in senha:
            senha = senha.replace("%40", "@")

        # Estado visual de carregamento
        self.btn_conectar_obs.setText("⏳ Conectando...")
        self.btn_conectar_obs.setStyleSheet("background-color: #fef08a; color: #854d0e; font-weight: bold; padding: 10px; border: 1px solid #eab308;")
        
        if hasattr(self, 'btn_logout_obs'):
            self.btn_logout_obs.setVisible(False)
            
        QApplication.processEvents()

        try:
            from obs_manager import OBSManager
            
            # 🚨 1. SE JÁ EXISTIR CONEXÃO ATIVA E RESPONDENDO, NÃO FAZ NADA!
            if hasattr(self, 'obs_manager') and self.obs_manager is not None:
                try:
                    # Faz um teste rápido para ver se o túnel continua aberto
                    if hasattr(self.obs_manager, 'ws') and self.obs_manager.ws and self.obs_manager.ws.ws.connected:
                        print("✅ Conexão já existente e ATIVA! Ignorando nova tentativa para não desconectar.", flush=True)
                        return # Paramos a execução aqui para manter a conexão intacta!
                except:
                    print("⚠️ Conexão antiga encontrada, mas parecia morta. Criando uma nova...", flush=True)
                    pass

            # 🚨 2. SÓ CRIA A INSTÂNCIA SE NÃO HOUVER OUTRA VIVA
            self.obs_manager = OBSManager(host=ip, port=porta, password=senha)
            print(f"⏳ [conectar_obs_websocket] Gerenciador de conexão OBSManager configurado com sucessso... ws://{ip}:{porta}... {senha}", flush=True)
            
            # Testa se a conexão funciona
            print("✅ [PASSO 4] [conectar_obs_websocket] Testando conexão... (disparar_alerta_checagem)", flush=True)
            self.obs_manager.disparar_alerta_checagem(self)
            
            # 🚨 3. INJETA A MESMA CONEXÃO VIVA NO CONTROLLER (SE ELE EXISTIR)
            if self.obs_manager.client is not None:
                if hasattr(self, 'controller'):
                    print("✅ [PASSO 5] [conectar_obs_websocket] Passando o objeto client conectado para o controller", flush=True)
                    self.controller.ws_persistente = self.obs_manager.client

                # SÓ FICA VERDE SE O OBJETO CLIENT ESTIVER VIVO
                self.atualizar_status_obs_conectado()
                print("✅ [PASSO 6] Interface gráfica atualizada para Conectado.", flush=True)

        except Exception as e:
            print(f"❌ [conectar_obs_websocket] Erro: falha na conexão: {str(e)}", flush=True)
            self.atualizar_status_obs_desconectado()
            QMessageBox.critical(self, "Falha na Conexão", f"Não foi possível conectar.\n\nDetalhes:\n{str(e)}")

    def atualizar_status_obs_conectado(self):
        """Modifica a interface para refletir que a conexão persistente está ativa"""
        self.btn_conectar_obs.setText("✅ OBS/websocket Conectado")
        self.btn_conectar_obs.setStyleSheet("background-color: #22c55e; color: white; font-weight: bold; padding: 10px; border: 1px solid #16a34a;")
        self.btn_conectar_obs.setEnabled(False) # Trava o botão de conectar
        print(f"✅ [atualizar_status_obs_conectado] OBS conectado com sucesso via websocket", flush=True)
        
        # O botão Sair do OBS fica VISÍVEL e habilitado apenas agora
        if hasattr(self, 'btn_logout_obs'):
            self.btn_logout_obs.setVisible(True)
            self.btn_logout_obs.setEnabled(True)
            
        # Pinta p led do topo da tela de VERDE/on
        if hasattr(self, 'led_status_OBSwebsocket'):
            self.led_status_OBSwebsocket.setStyleSheet("""
                background-color: #22c55e; 
                border: 1px solid #15803d; 
                border-radius: 6px;
            """)
            self.led_status_OBSwebsocket.repaint()
            print("✅ [atualizar_status_obs_conectado] [PASSO 7] Conexão websocket ativa, led pintado de verde", flush=True)
            
        # Lê o perfil e cena da interface gráfica
        print("✅ [atualizar_status_obs_conectado] Criando o perfil e a cena que usuário selecionou...", flush=True)
        perfil_selecionado = self.combo_perfil.currentText()
        colecao_selecionada = self.combo_colecao.currentText()
        
        # Garante que o OBS crie/ative o que o usuário selecionou na UI
        if hasattr(self, 'obs_manager'):
            self.obs_manager.garantir_perfil_e_colecao(perfil_selecionado, colecao_selecionada)

    def atualizar_status_obs_desconectado(self):
        """Restaura os botões da interface para o modo padrão de desconectado"""
        self.btn_conectar_obs.setText("🔌 Conectar ao OBS WebSocket")
        self.btn_conectar_obs.setStyleSheet("background-color: #2563eb; color: white; font-weight: bold; padding: 10px;")
        self.btn_conectar_obs.setEnabled(True)
        print("Programa desconectado do obs/websocket.", flush=True)
        
        # O botão Sair do OBS Oculta completamente da tela
        if hasattr(self, 'btn_logout_obs'):
            self.btn_logout_obs.setVisible(False)
            self.btn_logout_obs.setEnabled(False)
            
        # 🔥 Pinta o LED do topo da tela de volta para VERMELHO
        if hasattr(self, 'led_status_OBSwebsocket'):
            self.led_status_OBSwebsocket.setStyleSheet("""
                background-color: #ef4444; 
                border: 1px solid #b91c1c; 
                border-radius: 6px;
            """)
            print("✅ [atualizar_status_obs_desconectado] Conexão websocket foi desativada, led pintado de vermelho", flush=True)
    
    def criar_painel_central_logins(self):
        # 📌 Layout vertical exclusivo para preencher a aba "🔐 Logins"
        layout_aba = QVBoxLayout(self.aba_logins)
        layout_aba.setContentsMargins(15, 15, 15, 15)
        layout_aba.setAlignment(Qt.AlignmentFlag.AlignTop)
        layout_aba.setSpacing(12)

        # =================================================================
        # 🔑 SEÇÃO 1: CHAVES DE TRANSMISSÃO
        # =================================================================
        box_chaves = QGroupBox(" Chaves de Transmissão & Credenciais do OBS ", self)
        layout_chaves = QGridLayout(box_chaves)
        layout_chaves.setSpacing(8)
        
        # --- Linha YouTube Stream Key ---
        lbl_y = QLabel("Chave do YouTube *:", self)
        lbl_y.setStyleSheet("color: #1e293b; font-weight: bold;")
        layout_chaves.addWidget(lbl_y, 0, 0)
        
        self.entry_key_yt = QLineEdit(self)
        self.entry_key_yt.setEchoMode(QLineEdit.EchoMode.Password)
        self.entry_key_yt.setPlaceholderText("Aguardando vinculação via Google OAuth2...")
        self.entry_key_yt.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Fixed)
        layout_chaves.addLayout(self.criar_layout_campo(self.entry_key_yt), 0, 1, 1, 3)
        
        self.btn_ver_key_yt = QPushButton("👁️", self)
        self.btn_ver_key_yt.setFixedWidth(35)
        self.btn_ver_key_yt.setStyleSheet("background-color: #e2e8f0; color: #334155; padding: 4px; font-size: 14px; border: 1px solid #cbd5e1;")
        self.btn_ver_key_yt.setCheckable(True)
        layout_chaves.addWidget(self.btn_ver_key_yt, 0, 4)

        # --- Linha Instagram Stream Key ---
        lbl_i = QLabel("Chave Instagram:", self)
        lbl_i.setStyleSheet("color: #1e293b; font-weight: bold;")
        layout_chaves.addWidget(lbl_i, 1, 0)
        
        self.entry_key_insta = QLineEdit(self)
        self.entry_key_insta.setEchoMode(QLineEdit.EchoMode.Password)
        self.entry_key_insta.setPlaceholderText("Insira ou cole a Chave gerada no seu painel Instagram Live Produtor...")
        self.entry_key_insta.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Fixed)
        layout_chaves.addLayout(self.criar_layout_campo(self.entry_key_insta), 1, 1, 1, 3)
        
        self.btn_ver_key_insta = QPushButton("👁️", self)
        self.btn_ver_key_insta.setFixedWidth(35)
        self.btn_ver_key_insta.setStyleSheet("background-color: #e2e8f0; color: #334155; padding: 4px; font-size: 14px; border: 1px solid #cbd5e1;")
        self.btn_ver_key_insta.setCheckable(True)
        layout_chaves.addWidget(self.btn_ver_key_insta, 1, 4)
        
        self.btn_ver_key_yt.clicked.connect(self.toggle_janela_chave_youtube)
        self.btn_ver_key_insta.clicked.connect(self.toggle_janela_chave_instagram)

        layout_aba.addWidget(box_chaves)

        # =================================================================
        # 📸 SEÇÃO 2: INTEGRAÇÃO INSTAGRAM LIVE
        # =================================================================
        box_insta = QGroupBox(" 📸 Integração Instagram Live (Painel Web) ", self)
        layout_insta = QVBoxLayout(box_insta)

        layout_cabecalho_insta = QHBoxLayout()
        lbl_insta = QLabel("Para o Instagram, cole a chave diretamente na seção superior obtida no 'Instagram Live Producer'.")
        lbl_insta.setStyleSheet("color: #64748b; font-size: 11px; margin-bottom: 6px;")
        
        self.led_insta = QLabel(self)
        self.led_insta.setFixedSize(12, 12)
        self.led_insta.setStyleSheet("background-color: #94a3b8; border-radius: 6px; border: 1px solid #64748b;")
        
        layout_cabecalho_insta.addWidget(self.led_insta)
        layout_cabecalho_insta.addWidget(lbl_insta)
        layout_cabecalho_insta.addStretch()
        layout_insta.addLayout(layout_cabecalho_insta)
        
        layout_aba.addWidget(box_insta)

        # =================================================================
        # 📺 SEÇÃO 3: INTEGRAÇÃO GOOGLE / YOUTUBE STREAM API
        # =================================================================
        box_yt = QGroupBox(" 📺 Integração com API do Youtube ", self)
        layout_yt = QVBoxLayout(box_yt)

        layout_cabecalho_yt = QHBoxLayout()
        lbl_yt = QLabel("Conecte-se com sua Conta Google de forma segura para gerenciar os dados de transmissão:")
        lbl_yt.setStyleSheet("color: #64748b; font-size: 11px; margin-bottom: 6px;")
        
        self.led_painel_yt = QLabel(self)
        self.led_painel_yt.setFixedSize(12, 12)
        self.led_painel_yt.setStyleSheet("background-color: #ef4444; border-radius: 6px; border: 1px solid #b91c1c;")
        
        layout_cabecalho_yt.addWidget(self.led_painel_yt)
        layout_cabecalho_yt.addWidget(lbl_yt)
        layout_cabecalho_yt.addStretch()
        layout_yt.addLayout(layout_cabecalho_yt)

        layout_botoes_yt = QHBoxLayout()
        layout_botoes_yt.setSpacing(8)

        self.btn_login_yt = QPushButton("🛑 Vincular via Google OAuth2", self)
        self.btn_login_yt.setStyleSheet(f"background-color: #fef2f2; color: {config.COLOR_DANGER}; border: 1px solid {config.COLOR_DANGER}; font-weight: bold; padding: 10px;")

        self.btn_logout_yt = QPushButton("🚪 Desconectar Conta", self)
        self.btn_logout_yt.setStyleSheet("background-color: #475569; color: white; font-weight: bold; padding: 10px;")
        self.btn_logout_yt.setVisible(False)
        
        layout_botoes_yt.addWidget(self.btn_login_yt)
        layout_botoes_yt.addWidget(self.btn_logout_yt)
        layout_yt.addLayout(layout_botoes_yt)

        layout_aba.addWidget(box_yt)
        
        # =================================================================
        # 🔌 INTEGRAÇÃO COM OBS VIA WEBSOCKET
        # =================================================================
        box_obs = QGroupBox(" 🔌 Conexão OBS via websocket ", self)
        layout_obs = QVBoxLayout(box_obs)

        layout_cabecalho_obs = QHBoxLayout()
        lbl_obs_info = QLabel("Insira os dados do Servidor WebSocket do seu OBS Studio:")
        lbl_obs_info.setStyleSheet("color: #64748b; font-size: 11px; margin-bottom: 6px;")
        layout_cabecalho_obs.addWidget(lbl_obs_info)
        layout_cabecalho_obs.addStretch()
        layout_obs.addLayout(layout_cabecalho_obs)

        grid_inputs = QGridLayout()
        grid_inputs.setSpacing(8)

        grid_inputs.addWidget(QLabel("IP do Servidor:", self), 0, 0)
        self.entry_ip_obs = QLineEdit(self)
        self.entry_ip_obs.setText("localhost")
        grid_inputs.addWidget(self.entry_ip_obs, 0, 1)

        grid_inputs.addWidget(QLabel("Porta:", self), 1, 0)
        self.entry_porta_obs = QLineEdit(self)
        self.entry_porta_obs.setText("4455")
        grid_inputs.addWidget(self.entry_porta_obs, 1, 1)

        grid_inputs.addWidget(QLabel("Senha OBS:", self), 2, 0)
        self.entry_senha_obs = QLineEdit(self)
        self.entry_senha_obs.setPlaceholderText("Cole a senha do WebSocket aqui...")
        grid_inputs.addWidget(self.entry_senha_obs, 2, 1)

        layout_obs.addLayout(grid_inputs)

        layout_botoes_obs = QHBoxLayout()
        
        self.btn_conectar_obs = QPushButton("⚡ Conectar e Validar OBS/websocket", self)
        self.btn_conectar_obs.setStyleSheet("background-color: #f1f5f9; color: #334155; font-weight: bold; padding: 10px; border: 1px solid #cbd5e1;")
        
        self.btn_logout_obs = QPushButton("🚪 Sair do OBS", self)
        self.btn_logout_obs.setStyleSheet("background-color: #ef4444; color: white; font-weight: bold; padding: 10px;")
        self.btn_logout_obs.setEnabled(False)
        
        layout_botoes_obs.addWidget(self.btn_conectar_obs)
        layout_botoes_obs.addWidget(self.btn_logout_obs)
        layout_obs.addLayout(layout_botoes_obs)

        self.btn_conectar_obs.clicked.connect(self.conectar_obs_websocket)
        layout_aba.addWidget(box_obs)

        # =================================================================
        # 🧪 INJEÇÃO DA NOVA SEÇÃO MODULAR
        # =================================================================
        box_config_transmissao = self.config_transmissao_youtube()
        layout_aba.addWidget(box_config_transmissao)
        
    def toggle_janela_chave_youtube(self):
        """Alterna a visibilidade da chave do YouTube entre oculta e visível"""
        if self.btn_ver_key_yt.isChecked():
            self.entry_key_yt.setEchoMode(QLineEdit.EchoMode.Normal)
            self.btn_ver_key_yt.setText("🙈")
        else:
            self.entry_key_yt.setEchoMode(QLineEdit.EchoMode.Password)
            self.btn_ver_key_yt.setText("👁️")

    def toggle_janela_chave_instagram(self):
        """Alterna a visibilidade da chave do Instagram entre oculta e visível"""
        if self.btn_ver_key_insta.isChecked():
            self.entry_key_insta.setEchoMode(QLineEdit.EchoMode.Normal)
            self.btn_ver_key_insta.setText("🙈")
        else:
            self.entry_key_insta.setEchoMode(QLineEdit.EchoMode.Password)
            self.btn_ver_key_insta.setText("👁️")
        
    def criar_painel_manual_funcoes(self):
            """Chama o renderizador externo para montar a documentação técnica"""
            ManualManager.renderizar_aba_manual(self, self.aba_manual)