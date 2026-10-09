import React, { useState, useEffect } from 'react';
import { 
  Keyboard, 
  X, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Play, 
  Square, 
  Radio, 
  Film, 
  Mic, 
  Video, 
  Layers, 
  AlertCircle 
} from 'lucide-react';

export interface HotkeyMapping {
  toggleStream: string;
  toggleRecord: string;
  toggleVirtualCam: string;
  toggleMute: string;
  saveReplay: string;
  openScreenRecorder: string;
  scene1: string;
  scene2: string;
  scene3: string;
}

export const DEFAULT_HOTKEYS: HotkeyMapping = {
  toggleStream: 'F9',
  toggleRecord: 'F10',
  toggleVirtualCam: 'F8',
  toggleMute: 'M',
  saveReplay: 'F11',
  openScreenRecorder: 'R',
  scene1: '1',
  scene2: '2',
  scene3: '3',
};

interface HotkeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotkeys: HotkeyMapping;
  onSaveHotkeys: (updated: HotkeyMapping) => void;
}

export const HotkeysModal: React.FC<HotkeysModalProps> = ({
  isOpen,
  onClose,
  hotkeys,
  onSaveHotkeys,
}) => {
  const [currentMap, setCurrentMap] = useState<HotkeyMapping>(hotkeys);
  const [editingAction, setEditingAction] = useState<keyof HotkeyMapping | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    setCurrentMap(hotkeys);
  }, [hotkeys]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editingAction) return;

      e.preventDefault();
      e.stopPropagation();

      // Avoid solitary modifier keys
      if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
        return;
      }

      let keyStr = e.key.toUpperCase();
      if (e.key === ' ') keyStr = 'Space';

      const modifiers: string[] = [];
      if (e.ctrlKey) modifiers.push('Ctrl');
      if (e.shiftKey) modifiers.push('Shift');
      if (e.altKey) modifiers.push('Alt');

      const fullKey = modifiers.length > 0 ? `${modifiers.join('+')}+${keyStr}` : keyStr;

      setCurrentMap((prev) => ({
        ...prev,
        [editingAction]: fullKey,
      }));
      setEditingAction(null);
    };

    if (editingAction) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingAction]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveHotkeys(currentMap);
    try {
      localStorage.setItem('central_hub_hotkeys', JSON.stringify(currentMap));
    } catch {}
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setCurrentMap(DEFAULT_HOTKEYS);
  };

  const hotkeyItems: Array<{ key: keyof HotkeyMapping; label: string; desc: string; icon: React.ReactNode }> = [
    { key: 'toggleStream', label: 'Iniciar / Parar Live (Transmissão)', desc: 'Alterna status de transmissão ao vivo no OBS', icon: <Radio className="w-4 h-4 text-red-500" /> },
    { key: 'toggleRecord', label: 'Iniciar / Parar Gravação Local', desc: 'Alterna gravação no disco', icon: <Film className="w-4 h-4 text-amber-500" /> },
    { key: 'toggleVirtualCam', label: 'Câmera Virtual OBS (ON / OFF)', desc: 'Habilita webcam para Zoom, Teams e Meet', icon: <Video className="w-4 h-4 text-blue-500" /> },
    { key: 'toggleMute', label: 'Mudo / Ativar Microfone', desc: 'Mutar ou restaurar volume do microfone', icon: <Mic className="w-4 h-4 text-emerald-500" /> },
    { key: 'saveReplay', label: 'Salvar Replay Instantâneo (Buffer)', desc: 'Salva os últimos 30s da jogada ou transmissão', icon: <Play className="w-4 h-4 text-indigo-500" /> },
    { key: 'openScreenRecorder', label: 'Abrir Gravador de Tela & Editor', desc: 'Abre a aba de gravação de tela e corte WebM', icon: <Layers className="w-4 h-4 text-cyan-500" /> },
    { key: 'scene1', label: 'Mudar para Cena 1 (Cena_Principal)', desc: 'Corta instantaneamente para a cena principal', icon: <Square className="w-4 h-4 text-slate-500" /> },
    { key: 'scene2', label: 'Mudar para Cena 2 (Apresentacao)', desc: 'Corta para a cena de apresentação de slides', icon: <Square className="w-4 h-4 text-slate-500" /> },
    { key: 'scene3', label: 'Mudar para Cena 3 (Gameplay / Câmera)', desc: 'Corta para cena de gameplay ou webcam', icon: <Square className="w-4 h-4 text-slate-500" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Keyboard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg">Programar Teclas de Atalho (Hotkeys)</h3>
              <p className="text-xs text-slate-400">
                Pressione atalhos no teclado para comandar lives e gravações instantaneamente.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {editingAction && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 font-bold flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Pressione a tecla ou combinação desejada no teclado agora...</span>
              </div>
              <button
                onClick={() => setEditingAction(null)}
                className="text-amber-800 underline hover:text-amber-950 text-xs cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-2.5">
            {hotkeyItems.map((item) => {
              const isBeingEdited = editingAction === item.key;
              const currentVal = currentMap[item.key];
              return (
                <div
                  key={item.key}
                  className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                    isBeingEdited
                      ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-white rounded-lg border border-slate-200 shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{item.label}</span>
                      <span className="text-[11px] text-slate-500">{item.desc}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingAction(item.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shadow-2xs border cursor-pointer ${
                        isBeingEdited
                          ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                      title="Clique para reprogramar este atalho"
                    >
                      {isBeingEdited ? 'Pressione tecla...' : currentVal}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-100 rounded-xl text-slate-600 text-[11px] space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-blue-600" /> Dica de Uso Global:
            </span>
            <p>
              Os atalhos funcionam enquanto você estiver em qualquer aba da aplicação. Ao digitar em caixas de texto ou formulários de URL/senhas, as teclas normais são liberadas automaticamente.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              {successToast ? <Check className="w-4 h-4 text-emerald-300" /> : <Check className="w-4 h-4" />}
              <span>{successToast ? 'Salvo!' : 'Salvar Teclas de Atalho'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
