import ctypes
import os

class DLLManager:
    def __init__(self):
        self.dll_carregada = None
        self.caminho_dll = ""

    def carregar_dll(self, caminho):
        if not os.path.exists(caminho):
            raise FileNotFoundError("O arquivo DLL não foi encontrado no caminho especificado.")
        
        # Carrega a DLL na memória do sistema operativo
        self.dll_carregada = ctypes.CDLL(caminho)
        self.caminho_dll = caminho
        return os.path.basename(caminho)

    def executar_funcao(self, nome_funcao):
        if not self.dll_carregada:
            raise RuntimeError("Nenhum plugin DLL carregado na memória.")
        
        try:
            funcao_alvo = getattr(self.dll_carregada, nome_funcao)
            resultado = funcao_alvo()
            return resultado
        except AttributeError:
            raise AttributeError(f"A função '{nome_funcao}' não existe ou não foi exportada nesta DLL.")
        except Exception as e:
            raise RuntimeError(f"Erro interno de execução na DLL:\n{e}")