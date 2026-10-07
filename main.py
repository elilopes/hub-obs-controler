import sys, os, ctypes, traceback
from PySide6.QtWidgets import QApplication
from PySide6.QtCore import QTimer

# 🛠️ Força o Python a olhar para a pasta do main.py ao buscar módulos (Garante o import do controller)
DIRETORIO_ATUAL = os.path.dirname(os.path.abspath(__file__))
if DIRETORIO_ATUAL not in sys.path:
    sys.path.insert(0, DIRETORIO_ATUAL)

# 📌 1. Redirecionamento de Logs (Crucial para o modo --noconsole)
sys.stdout = open(os.path.join(DIRETORIO_ATUAL, "debug_log.txt"), "w", encoding="utf-8")
sys.stderr = sys.stdout

def capturar_erro_fatal(erro_str):
    """Função auxiliar para capturar quebras inesperadas no meio do timer da Splash"""
    print(erro_str)
    ctypes.windll.user32.MessageBoxW(
        0, 
        f"Ocorreu um erro durante a inicialização dos submódulos:\n\n{erro_str}", 
        "Erro na Splash - Central Hub OBS", 
        0x10
    )
    sys.exit(1)

def rodar_aplicacao():
    global passo_atual, controller
    
    app = QApplication(sys.argv)
    
    # Inicializa e exibe a tela de Splash
    splash = SplashWindow()
    splash.show()
    
    passos = [
        "Carregando bibliotecas gráficas...",
        "Injetando subsistema ctypes para DLLs...",
        "Mapeando comunicação OBS WebSocket...",
        "Carregando submódulos OAuth Google e Instagram...",
        "Renderizando interface Central Hub...",
        "Iniciando..."
    ]
    
    def avancar_splash():
        global passo_atual, controller
        try:
            if passo_atual < len(passos):
                splash.lbl_status.setText(passos[passo_atual])
                percentual = int(((passo_atual + 1) / len(passos)) * 100)
                splash.progress_bar.setValue(percentual)
                passo_atual += 1
            else:
                timer_splash.stop()
                # O controller é instanciado e assume o app!
                controller = CentralHubController()
                controller.view.showMaximized()
                splash.close()
        except Exception as e:
            timer_splash.stop()
            capturar_erro_fatal(traceback.format_exc())

    timer_splash = QTimer()
    timer_splash.timeout.connect(avancar_splash)
    timer_splash.start(300)

    sys.exit(app.exec())


if __name__ == "__main__":
    # O Bloco try/except agora envolve o momento da importação e da execução com segurança
    try:
        # Variáveis de controle globais da inicialização
        controller = None
        passo_atual = 0

        # Importações do seu projeto feitas dentro do ambiente seguro
        from views import SplashWindow
        from controller import CentralHubController

        # Executa a aplicação protegida pelo try/except global
        rodar_aplicacao()

    except Exception as e:
        # Captura erros pesados que acontecem ANTES ou DURANTE o loop (erros de importação)
        erro_inicializacao = traceback.format_exc()
        print(erro_inicializacao) # Grava no arquivo debug_log.txt
        
        # Exibe uma caixa de mensagem nativa do Windows
        ctypes.windll.user32.MessageBoxW(
            0, 
            f"Erro Crítico de Importação/Ambiente:\n\n{erro_inicializacao}\n"
            f"Verifique o arquivo 'debug_log.txt' para mais detalhes.",
            "Erro Fatal - Hub OBS Controll", 
            0x10  # Ícone de Erro/Parada Crítica
        )
        sys.exit(1)