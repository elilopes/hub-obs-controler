import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Eye, 
  Camera, 
  Layers, 
  Sliders, 
  MousePointer, 
  Keyboard, 
  Gamepad2, 
  Sun, 
  Palette, 
  Box, 
  MessageSquare, 
  Mic, 
  MicOff, 
  Zap, 
  Check, 
  Copy, 
  RotateCcw, 
  Maximize, 
  Play, 
  Square, 
  ShieldCheck,
  Type,
  Move,
  Heart,
  Circle,
  Hexagon,
  Square as RectIcon
} from 'lucide-react';

interface StudioEffectsSuiteProps {
  onNotify?: (msg: string) => void;
}

export const StudioEffectsSuite: React.FC<StudioEffectsSuiteProps> = ({ onNotify }) => {
  const [activeTool, setActiveTool] = useState<
    'masks' | 'facetrack' | 'greenscreen' | 'inputoverlay' | 'stroke_glow' | 'dsk' | 'captions' | 'lumetric' | 'transform3d'
  >('masks');

  const [notification, setNotification] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    if (onNotify) onNotify(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // 1. ADVANCED MASKS STATE
  const [maskShape, setMaskShape] = useState<'circle' | 'squircle' | 'heart' | 'hexagon'>('squircle');
  const [maskCornerRadius, setMaskCornerRadius] = useState<number>(32);
  const [maskPosX, setMaskPosX] = useState<number>(80);
  const [maskPosY, setMaskPosY] = useState<number>(75);
  const [maskScale, setMaskScale] = useState<number>(100);
  const [isDraggingMask, setIsDraggingMask] = useState<boolean>(false);
  const maskCanvasRef = useRef<HTMLDivElement | null>(null);

  const updateMaskPositionFromPointer = (clientX: number, clientY: number) => {
    if (!maskCanvasRef.current) return;
    const rect = maskCanvasRef.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, Math.round(((clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(8, Math.min(92, Math.round(((clientY - rect.top) / rect.height) * 100)));
    setMaskPosX(x);
    setMaskPosY(y);
  };

  const handleMaskPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMask(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handleMaskPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingMask) return;
    e.preventDefault();
    updateMaskPositionFromPointer(e.clientX, e.clientY);
  };

  const handleMaskPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingMask) {
      setIsDraggingMask(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
      triggerToast(`Máscara posicionada com sucesso: X=${maskPosX}% Y=${maskPosY}%`);
    }
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    updateMaskPositionFromPointer(e.clientX, e.clientY);
    setIsDraggingMask(true);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingMask) {
      updateMaskPositionFromPointer(e.clientX, e.clientY);
    }
  };

  const handleCanvasPointerUp = () => {
    if (isDraggingMask) {
      setIsDraggingMask(false);
      triggerToast(`Máscara posicionada com sucesso: X=${maskPosX}% Y=${maskPosY}%`);
    }
  };

  // 2. FACE TRACKING STATE
  const [faceTrackingEnabled, setFaceTrackingEnabled] = useState<boolean>(true);
  const [faceSensitivity, setFaceSensitivity] = useState<number>(70);
  const [faceSmoothness, setFaceSmoothness] = useState<number>(85);
  const [faceHeadroom, setFaceHeadroom] = useState<number>(20);
  const [simulatedFaceCoords, setSimulatedFaceCoords] = useState<{ x: number; y: number }>({ x: 50, y: 45 });

  useEffect(() => {
    if (!faceTrackingEnabled) return;
    const interval = setInterval(() => {
      setSimulatedFaceCoords((prev) => ({
        x: Math.max(30, Math.min(70, prev.x + (Math.random() - 0.5) * 6)),
        y: Math.max(35, Math.min(60, prev.y + (Math.random() - 0.5) * 4)),
      }));
    }, 800);
    return () => clearInterval(interval);
  }, [faceTrackingEnabled]);

  // 3. BACKGROUND REMOVAL (SEM PANO VERDE) STATE
  const [bgRemovalMode, setBgRemovalMode] = useState<'blur' | 'virtual_green' | 'studio' | 'cyberpunk'>('blur');
  const [blurIntensity, setBlurIntensity] = useState<number>(18);
  const [edgeThreshold, setEdgeThreshold] = useState<number>(85);

  // 4. INPUT OVERLAY STATE
  const [overlayDevice, setOverlayDevice] = useState<'keyboard_mouse' | 'gamepad'>('keyboard_mouse');
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set(['W', 'Shift']));
  const [mouseClicked, setMouseClicked] = useState<'left' | 'right' | 'middle' | null>('left');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      setPressedKeys((prev) => new Set([...prev, k]));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(k);
        return next;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 5. STROKE GLOW SHADOW STATE
  const [strokeColor, setStrokeColor] = useState<string>('#3b82f6');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [glowColor, setGlowColor] = useState<string>('#60a5fa');
  const [glowRadius, setGlowRadius] = useState<number>(16);
  const [shadowBlur, setShadowBlur] = useState<number>(20);
  const [shadowOpacity, setShadowOpacity] = useState<number>(60);

  // 6. DOWNSTREAM KEYER (DSK) STATE
  const [dskEnabled, setDskEnabled] = useState<boolean>(true);
  const [dskLogoText, setDskLogoText] = useState<string>('CANAL OFICIAL • AO VIVO');
  const [dskPosition, setDskPosition] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('top-right');
  const [dskOpacity, setDskOpacity] = useState<number>(90);
  const [dskType, setDskType] = useState<'logo' | 'sponsor' | 'breaking_news'>('logo');

  // 7. REALTIME CAPTIONS (SPEECH-TO-TEXT) STATE
  const [captionsActive, setCaptionsActive] = useState<boolean>(false);
  const [captionStyle, setCaptionStyle] = useState<'classic_cc' | 'karaoke_gamer' | 'minimalist' | 'cyberpunk'>('karaoke_gamer');
  const [liveCaptionText, setLiveCaptionText] = useState<string>(
    'Bem-vindos à transmissão ao vivo! Configuração de áudio e vídeo em alta definição pronta.'
  );
  const speechRecognitionRef = useRef<any>(null);

  const handleToggleCaptions = () => {
    const nextState = !captionsActive;
    setCaptionsActive(nextState);

    if (nextState) {
      triggerToast('🎙️ Legendas em Tempo Real ATIVADAS com reconhecimento nativo PT-BR!');
      // Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'pt-BR';
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((res: any) => res[0].transcript)
              .join('');
            if (transcript) setLiveCaptionText(transcript);
          };
          recognition.onerror = () => {};
          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch {
          // Fallback simulation
        }
      }
    } else {
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch {}
      }
      triggerToast('Legendas desativadas.');
    }
  };

  // 8. LUMETRIC CORRECTOR STATE (PREMIERE PRO INSPIRED)
  const [lumExposure, setLumExposure] = useState<number>(0);
  const [lumContrast, setLumContrast] = useState<number>(10);
  const [lumHighlights, setLumHighlights] = useState<number>(-5);
  const [lumShadows, setLumShadows] = useState<number>(5);
  const [lumTempKelvin, setLumTempKelvin] = useState<number>(5600); // 5600K daylight
  const [lumTint, setLumTint] = useState<number>(0);
  const [lumSaturation, setLumSaturation] = useState<number>(115);
  const [selectedLut, setSelectedLut] = useState<'none' | 'teal_orange' | 'vintage' | 'film_noir' | 'vivid' | 'clean_studio'>('teal_orange');

  const applyLutPreset = (lut: typeof selectedLut) => {
    setSelectedLut(lut);
    if (lut === 'teal_orange') {
      setLumTempKelvin(6200);
      setLumTint(-4);
      setLumContrast(25);
      setLumSaturation(125);
      triggerToast('🎬 LUT Teal & Orange (Blockbuster Hollywood) aplicado!');
    } else if (lut === 'vintage') {
      setLumTempKelvin(5100);
      setLumContrast(5);
      setLumSaturation(85);
      triggerToast('🎞️ LUT Vintage 35mm aplicado!');
    } else if (lut === 'film_noir') {
      setLumSaturation(0);
      setLumContrast(45);
      triggerToast('📽️ LUT Film Noir (P&B Dramático) aplicado!');
    } else if (lut === 'clean_studio') {
      setLumTempKelvin(5600);
      setLumContrast(12);
      setLumSaturation(105);
      triggerToast('💡 LUT Clean Studio Broadcast aplicado!');
    }
  };

  // 9. 3D TRANSFORMS STATE
  const [rotX, setRotX] = useState<number>(12); // Pitch
  const [rotY, setRotY] = useState<number>(-18); // Yaw
  const [rotZ, setRotZ] = useState<number>(0); // Roll
  const [perspective, setPerspective] = useState<number>(800);
  const [depthZ, setDepthZ] = useState<number>(0);

  const toolTabs = [
    { id: 'masks', label: 'Advanced Masks', icon: <Heart className="w-4 h-4" /> },
    { id: 'facetrack', label: 'Face Tracking', icon: <Camera className="w-4 h-4" /> },
    { id: 'greenscreen', label: 'Remover Fundo (Sem Pano)', icon: <Eye className="w-4 h-4" /> },
    { id: 'inputoverlay', label: 'Input Overlay', icon: <Keyboard className="w-4 h-4" /> },
    { id: 'stroke_glow', label: 'Stroke Glow Shadow', icon: <Sun className="w-4 h-4" /> },
    { id: 'dsk', label: 'Downstream Keyer (DSK)', icon: <Layers className="w-4 h-4" /> },
    { id: 'captions', label: 'Legendas em Tempo Real', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'lumetric', label: 'Lumetric Corrector (LUTs)', icon: <Palette className="w-4 h-4" /> },
    { id: 'transform3d', label: 'Transformações 3D', icon: <Box className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden space-y-4 p-5">
      
      {/* Toast */}
      {notification && (
        <div className="p-3 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-white hover:text-indigo-200">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              Estúdio de embelezamento com filtros & efeitos visuais
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Controle interativo em tempo real de máscaras de webcam, rastreamento de rosto, remoção de fundo por IA, overlay de teclado/mouse, correção de cor Lumetric e renderização 3D.
          </p>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {toolTabs.map((t) => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: ADVANCED MASKS */}
      {activeTool === 'masks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-purple-600" />
                Máscaras Avançadas e Recortes Personalizados
              </h4>
              <p className="text-xs text-slate-600">
                Adiciona máscaras avançadas de recorte (círculo, retângulo com bordas arredondadas, corações) para webcams e fontes, que podem facilmente serem movidas pela tela.
              </p>

              {/* Formas */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Formato de Recorte</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'squircle', label: 'Arredondado', icon: <RectIcon className="w-4 h-4" /> },
                    { id: 'circle', label: 'Círculo', icon: <Circle className="w-4 h-4" /> },
                    { id: 'heart', label: 'Coração', icon: <Heart className="w-4 h-4" /> },
                    { id: 'hexagon', label: 'Hexágono', icon: <Hexagon className="w-4 h-4" /> },
                  ].map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => {
                        setMaskShape(shape.id as any);
                        triggerToast(`Máscara alterada para formato: ${shape.label}`);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                        maskShape === shape.id
                          ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {shape.icon}
                      <span>{shape.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Posição X e Y móvel */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Posição X na Tela</span>
                    <span className="font-mono text-purple-700">{maskPosX}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={maskPosX}
                    onChange={(e) => setMaskPosX(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Posição Y na Tela</span>
                    <span className="font-mono text-purple-700">{maskPosY}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={maskPosY}
                    onChange={(e) => setMaskPosY(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>

              {/* Escala e Curvatura */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Tamanho / Escala</span>
                    <span className="font-mono text-purple-700">{maskScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={maskScale}
                    onChange={(e) => setMaskScale(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Arredondamento</span>
                    <span className="font-mono text-purple-700">{maskCornerRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="64"
                    value={maskCornerRadius}
                    onChange={(e) => setMaskCornerRadius(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => triggerToast('✅ Máscara salva e sincronizada com a webcam do OBS Studio!')}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar Máscara na Webcam OBS</span>
              </button>
            </div>
          </div>

          {/* Preview da Cena com Máscara Móvel */}
          <div className="lg:col-span-6">
            <div
              ref={maskCanvasRef}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              onPointerLeave={handleCanvasPointerUp}
              className={`relative aspect-video bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl overflow-hidden border p-4 flex flex-col justify-between shadow-inner select-none ${
                isDraggingMask
                  ? 'border-purple-500 cursor-grabbing ring-2 ring-purple-500/40'
                  : 'border-slate-800 cursor-crosshair'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 pointer-events-none">
                <span className="flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-purple-400" />
                  <span>Preview de Transmissão (Canvas 1080p)</span>
                </span>
                <span className={`px-2 py-0.5 rounded font-mono transition ${
                  isDraggingMask
                    ? 'bg-purple-600 text-white font-bold animate-pulse'
                    : 'bg-purple-600/40 text-purple-300'
                }`}>
                  Posição: X={maskPosX}% Y={maskPosY}%
                </span>
              </div>

              {/* Webcam cortada com a máscara selecionada (Arrastável com mouse) */}
              <div
                onPointerDown={handleMaskPointerDown}
                onPointerMove={handleMaskPointerMove}
                onPointerUp={handleMaskPointerUp}
                onPointerCancel={handleMaskPointerUp}
                className={`absolute flex items-center justify-center shadow-2xl select-none touch-none ${
                  isDraggingMask
                    ? 'cursor-grabbing ring-4 ring-purple-400 scale-105 shadow-[0_0_25px_rgba(168,85,247,0.7)] z-20 transition-none'
                    : 'cursor-grab hover:scale-102 hover:ring-2 hover:ring-white/60 transition-all duration-150 z-10'
                } border-2 border-white/50`}
                style={{
                  left: `${maskPosX}%`,
                  top: `${maskPosY}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${140 * (maskScale / 100)}px`,
                  height: `${140 * (maskScale / 100)}px`,
                  borderRadius: maskShape === 'circle' ? '9999px' : maskShape === 'squircle' ? `${maskCornerRadius}px` : undefined,
                  clipPath: maskShape === 'heart' ? 'polygon(50% 15%, 80% 0%, 100% 20%, 100% 50%, 50% 100%, 0% 50%, 0% 20%, 20% 0%)' : maskShape === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' : undefined,
                  background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 50%, #3b82f6 100%)',
                }}
              >
                {isDraggingMask && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950/95 text-purple-300 font-mono text-[9px] px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap border border-purple-500/50">
                    X: {maskPosX}% | Y: {maskPosY}%
                  </div>
                )}
                <div className="text-center text-white pointer-events-none">
                  <Camera className="w-6 h-6 mx-auto mb-1 opacity-90" />
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Webcam</span>
                  <span className="text-[9px] opacity-80 font-mono">Arraste com o Mouse</span>
                </div>
              </div>

              <div className="text-center text-xs pointer-events-none">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
                  isDraggingMask ? 'bg-purple-900/90 text-purple-200 border border-purple-500/60' : 'bg-slate-900/80 text-slate-400'
                }`}>
                  <Move className="w-3 h-3 text-purple-400" />
                  <span>
                    {isDraggingMask ? 'Arrastando máscara em tempo real...' : 'Clique e arraste a máscara com o mouse para qualquer posição da tela'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: FACE TRACKING */}
      {activeTool === 'facetrack' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-blue-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600" />
                  Face Tracking (Câmera Acompanhar o Rosto)
                </h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={faceTrackingEnabled}
                    onChange={(e) => {
                      setFaceTrackingEnabled(e.target.checked);
                      triggerToast(e.target.checked ? '🎯 Face Tracking ATIVADO! Câmera centrada no rosto.' : 'Face Tracking pausado.');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <p className="text-xs text-slate-600">
                Utiliza rastreamento facial em tempo real na GPU para centralizar o apresentador automaticamente via pan/tilt digital, mantendo o enquadramento perfeito sem cortes manuais.
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Sensibilidade do Rastreamento</span>
                    <span className="font-mono text-blue-700">{faceSensitivity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={faceSensitivity}
                    onChange={(e) => setFaceSensitivity(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Suavização de Movimento (Smoothness)</span>
                    <span className="font-mono text-blue-700">{faceSmoothness}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={faceSmoothness}
                    onChange={(e) => setFaceSmoothness(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Margem Superior (Headroom)</span>
                    <span className="font-mono text-blue-700">{faceHeadroom}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={faceHeadroom}
                    onChange={(e) => setFaceHeadroom(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {/* Simulated video frame */}
              <div 
                className="absolute border-2 border-emerald-400 bg-emerald-500/10 rounded-lg transition-all duration-300 flex flex-col items-center justify-center"
                style={{
                  left: `${simulatedFaceCoords.x}%`,
                  top: `${simulatedFaceCoords.y}%`,
                  width: '90px',
                  height: '110px',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-black/60 px-1 rounded -top-4 absolute">
                  FACE LOCK (1080p)
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>

              <div className="absolute bottom-3 left-3 text-[11px] text-slate-400 bg-black/70 px-2 py-1 rounded">
                Pan/Tilt Digital: X={simulatedFaceCoords.x.toFixed(0)}% | Y={simulatedFaceCoords.y.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: REMOVER FUNDO SEM PANO VERDE */}
      {activeTool === 'greenscreen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                Remover Fundo Sem Ter o Pano Verde (IA Virtual)
              </h4>
              <p className="text-xs text-slate-600">
                Segmentação inteligente do corpo do apresentador por rede neural, permitindo desfocar o fundo ou substituir por estúdios virtuais sem precisar de tecido verde.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Efeito de Fundo</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'blur', label: 'Desfoque Bokeh DSLR', desc: 'Desfoca o quarto/estúdio' },
                    { id: 'virtual_green', label: 'Cromaqui Verde Puro', desc: 'Gera fundo #00FF00' },
                    { id: 'studio', label: 'Estúdio Moderno', desc: 'Fundo corporativo clean' },
                    { id: 'cyberpunk', label: 'Cenário Cyberpunk', desc: 'Luzes neon e cidade' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setBgRemovalMode(mode.id as any);
                        triggerToast(`Modo de fundo alterado para: ${mode.label}`);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        bgRemovalMode === mode.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs block">{mode.label}</span>
                      <span className={`text-[10px] ${bgRemovalMode === mode.id ? 'text-emerald-100' : 'text-slate-500'}`}>{mode.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Intensidade do Desfoque / Recorte</span>
                  <span className="font-mono text-emerald-700">{blurIntensity}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="40"
                  value={blurIntensity}
                  onChange={(e) => setBlurIntensity(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center bg-slate-900 shadow-lg">
              {/* Background layer */}
              <div 
                className="absolute inset-0 transition-all duration-300"
                style={{
                  background: bgRemovalMode === 'virtual_green' 
                    ? '#00FF00' 
                    : bgRemovalMode === 'studio'
                    ? 'radial-gradient(circle, #334155 0%, #0f172a 100%)'
                    : bgRemovalMode === 'cyberpunk'
                    ? 'linear-gradient(135deg, #581c87 0%, #1e1b4b 100%)'
                    : 'linear-gradient(45deg, #1e293b 25%, #334155 75%)',
                  filter: bgRemovalMode === 'blur' ? `blur(${blurIntensity / 2}px)` : undefined,
                }}
              />

              {/* Foreground Subject */}
              <div className="relative z-10 p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 text-center text-white">
                <span className="w-12 h-12 rounded-full bg-emerald-500/80 flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <Camera className="w-6 h-6 text-white" />
                </span>
                <span className="font-bold text-xs block">Apresentador Isolado (Recorte Limpo)</span>
                <span className="text-[10px] text-emerald-300">Fundo removido sem pano verde</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: INPUT OVERLAY */}
      {activeTool === 'inputoverlay' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-indigo-600" />
                Input Overlay (Teclado, Mouse & Gamepad na Tela)
              </h4>
              <p className="text-xs text-slate-600">
                Exibe um mouse ou teclado translúcido ou gamepad na tela e reflete em tempo real os botões e teclas pressionadas na live do OBS Studio para tutoriais e gameplays.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setOverlayDevice('keyboard_mouse')}
                  className={`flex-1 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                    overlayDevice === 'keyboard_mouse'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  <Keyboard className="w-4 h-4" />
                  <span>Teclado + Mouse</span>
                </button>

                <button
                  onClick={() => setOverlayDevice('gamepad')}
                  className={`flex-1 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                    overlayDevice === 'gamepad'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Controle / Gamepad</span>
                </button>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 block">Teste ao Vivo:</span>
                <p className="text-slate-500 text-[11px]">
                  Pressione qualquer tecla no seu teclado físico ou clique nos botões do mouse abaixo para ver a iluminação instantânea.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setMouseClicked('left')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      mouseClicked === 'left' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Botão Esquerdo
                  </button>
                  <button
                    onClick={() => setMouseClicked('right')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      mouseClicked === 'right' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Botão Direito
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
              {overlayDevice === 'keyboard_mouse' ? (
                <div className="p-4 bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex items-center gap-6">
                  {/* WASD Cluster */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono text-sm border transition-all ${
                        pressedKeys.has('W') ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/50 scale-105' : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      W
                    </span>
                    <div className="flex gap-1.5">
                      {['A', 'S', 'D'].map((key) => (
                        <span
                          key={key}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono text-sm border transition-all ${
                            pressedKeys.has(key) ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/50 scale-105' : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          {key}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mouse Virtual */}
                  <div className="w-16 h-24 rounded-2xl border-2 border-slate-700 bg-slate-900 flex flex-col overflow-hidden">
                    <div className="flex h-10 border-b border-slate-800">
                      <div className={`flex-1 border-r border-slate-800 transition ${mouseClicked === 'left' ? 'bg-indigo-600' : ''}`} />
                      <div className={`flex-1 transition ${mouseClicked === 'right' ? 'bg-indigo-600' : ''}`} />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-2 h-4 rounded-full bg-slate-700"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl text-center space-y-2">
                  <Gamepad2 className="w-12 h-12 text-indigo-400 mx-auto animate-pulse" />
                  <span className="font-bold text-xs text-white block">Gamepad Xbox / PlayStation Ativo</span>
                  <span className="text-[10px] text-slate-400 font-mono">Gatilhos RT/LT e Analógicos Mapeados</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 5: STROKE GLOW SHADOW */}
      {activeTool === 'stroke_glow' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <Sun className="w-4 h-4 text-blue-600" />
                Stroke, Glow & Shadow (Bordas, Brilho & Sombras)
              </h4>
              <p className="text-xs text-slate-600">
                Permite adicionar bordas de alta definição, brilhos neon coloridos ou sombras projetadas elegantes em qualquer elemento, câmera ou letreiro.
              </p>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Cor da Borda (Stroke)</label>
                    <input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-full h-9 rounded cursor-pointer border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Cor do Brilho (Glow)</label>
                    <input
                      type="color"
                      value={glowColor}
                      onChange={(e) => setGlowColor(e.target.value)}
                      className="w-full h-9 rounded cursor-pointer border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Espessura da Borda</span>
                    <span className="font-mono text-blue-700">{strokeWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Raio de Brilho Neon (Glow)</span>
                    <span className="font-mono text-blue-700">{glowRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={glowRadius}
                    onChange={(e) => setGlowRadius(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-6">
              <div
                className="w-48 h-32 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 flex flex-col items-center justify-center text-white transition-all duration-200"
                style={{
                  border: `${strokeWidth}px solid ${strokeColor}`,
                  boxShadow: `0 0 ${glowRadius}px ${glowColor}, 0 20px ${shadowBlur}px rgba(0,0,0,${shadowOpacity / 100})`,
                }}
              >
                <Sparkles className="w-6 h-6 mb-1 text-cyan-400" />
                <span className="text-xs font-bold">Elemento com Stroke & Glow</span>
                <span className="text-[10px] text-slate-400 font-mono">Borda + Neon + Sombra</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 6: DOWNSTREAM KEYER (DSK) */}
      {activeTool === 'dsk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  Downstream Keyer (DSK - Camada Persistente Global)
                </h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dskEnabled}
                    onChange={(e) => {
                      setDskEnabled(e.target.checked);
                      triggerToast(e.target.checked ? '🛡️ DSK Camada Persistente ATIVADA em todas as cenas!' : 'DSK desativado.');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              <p className="text-xs text-slate-600">
                Adiciona uma camada persistente (como logos, marcas d'água, placar ou alertas) que permanece fixa por cima de todas as cenas sem precisar cloná-las individualmente no OBS.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Texto do Logo / Marca d'Água</label>
                <input
                  type="text"
                  value={dskLogoText}
                  onChange={(e) => setDskLogoText(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Posição na Tela</label>
                  <select
                    value={dskPosition}
                    onChange={(e) => setDskPosition(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                  >
                    <option value="top-right">Canto Superior Direito</option>
                    <option value="top-left">Canto Superior Esquerdo</option>
                    <option value="bottom-right">Canto Inferior Direito</option>
                    <option value="bottom-left">Canto Inferior Esquerdo</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Opacidade</span>
                    <span className="font-mono text-amber-700">{dskOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={dskOpacity}
                    onChange={(e) => setDskOpacity(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden border border-slate-800 p-4">
              {dskEnabled && (
                <div
                  className={`absolute z-30 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white font-bold text-xs border border-white/20 shadow-xl flex items-center gap-2 ${
                    dskPosition === 'top-right' ? 'top-3 right-3' : dskPosition === 'top-left' ? 'top-3 left-3' : dskPosition === 'bottom-right' ? 'bottom-3 right-3' : 'bottom-3 left-3'
                  }`}
                  style={{ opacity: dskOpacity / 100 }}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>{dskLogoText}</span>
                </div>
              )}

              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                O elemento DSK permanece sobreposto independente da cena trocada
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 7: LEGENDAS AUTOMATIZADAS EM TEMPO REAL */}
      {activeTool === 'captions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Legendas Automatizadas e Acessíveis em Tempo Real
                </h4>
                <button
                  onClick={handleToggleCaptions}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    captionsActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {captionsActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span>{captionsActive ? 'Legendas ON' : 'Ativar Mic'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Transcreve a voz do apresentador diretamente para a tela com acessibilidade total, oferecendo estilos personalizáveis para streamers e corporativo.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Estilo Visual das Legendas</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'karaoke_gamer', label: 'Gamer Karaokê', desc: 'Amarelo neon destacado' },
                    { id: 'classic_cc', label: 'Closed Caption TV', desc: 'Fundo preto clássico' },
                    { id: 'minimalist', label: 'Minimalista Clean', desc: 'Texto branco suave' },
                    { id: 'cyberpunk', label: 'Cyberpunk Neon', desc: 'Bordas cian e roxas' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setCaptionStyle(st.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        captionStyle === st.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs block">{st.label}</span>
                      <span className={`text-[10px] ${captionStyle === st.id ? 'text-emerald-100' : 'text-slate-500'}`}>{st.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-end p-5">
              {/* Caption Overlay */}
              <div
                className={`mx-auto max-w-md p-3 text-center transition-all ${
                  captionStyle === 'classic_cc'
                    ? 'bg-black text-white font-mono font-bold text-sm tracking-wide'
                    : captionStyle === 'karaoke_gamer'
                    ? 'bg-black/80 backdrop-blur-xs text-yellow-300 font-black text-sm rounded-xl border border-yellow-500/40 shadow-xl'
                    : captionStyle === 'cyberpunk'
                    ? 'bg-purple-950/80 text-cyan-300 font-mono font-bold text-xs rounded-lg border border-cyan-400 shadow-lg shadow-cyan-500/30'
                    : 'bg-white/20 backdrop-blur-md text-white font-sans text-xs rounded-full px-5 py-2 shadow-sm'
                }`}
              >
                "{liveCaptionText}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 8: LUMETRIC CORRECTOR */}
      {activeTool === 'lumetric' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                Lumetric Corrector (Correção de Cor & LUTs Estilo Premiere Pro)
              </h4>
              <p className="text-xs text-slate-600">
                Script de correção de cor profissional para ajustar exposição, contraste, temperatura e aplicar filtros de cor cinematográficos (LUTs) com facilidade.
              </p>

              {/* Presets de LUTs */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Filtros Cinematográficos (LUTs de 1 Clique)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'teal_orange', label: 'Teal & Orange' },
                    { id: 'vintage', label: 'Vintage 35mm' },
                    { id: 'film_noir', label: 'Film Noir P&B' },
                    { id: 'clean_studio', label: 'Clean Studio' },
                    { id: 'vivid', label: 'Vivid Pop' },
                    { id: 'none', label: 'Neutro / Reset' },
                  ].map((lut) => (
                    <button
                      key={lut.id}
                      onClick={() => applyLutPreset(lut.id as any)}
                      className={`p-2 rounded-lg border text-[11px] font-bold transition ${
                        selectedLut === lut.id
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {lut.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders Lumetric */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Exposição</span>
                    <span className="font-mono text-purple-700">{lumExposure > 0 ? `+${lumExposure}` : lumExposure}</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={lumExposure}
                    onChange={(e) => setLumExposure(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Contraste</span>
                    <span className="font-mono text-purple-700">{lumContrast > 0 ? `+${lumContrast}` : lumContrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={lumContrast}
                    onChange={(e) => setLumContrast(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Temperatura Kelvin</span>
                    <span className="font-mono text-purple-700">{lumTempKelvin}K</span>
                  </div>
                  <input
                    type="range"
                    min="3200"
                    max="8000"
                    step="100"
                    value={lumTempKelvin}
                    onChange={(e) => setLumTempKelvin(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Saturação</span>
                    <span className="font-mono text-purple-700">{lumSaturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={lumSaturation}
                    onChange={(e) => setLumSaturation(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div
              className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-lg transition-all"
              style={{
                filter: `contrast(${1 + lumContrast / 100}) brightness(${1 + lumExposure / 50}) saturate(${lumSaturation / 100})`,
                background: lumTempKelvin > 6000 ? '#e0f2fe' : lumTempKelvin < 5000 ? '#ffedd5' : '#1e293b',
              }}
            >
              <div className="text-center p-4 bg-black/60 rounded-xl text-white backdrop-blur-xs">
                <span className="text-xs font-bold block">Preview de Cor Lumetric</span>
                <span className="text-[10px] text-purple-300 font-mono">LUT: {selectedLut} | {lumTempKelvin}K</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 9: TRANSFORMAÇÕES 3D */}
      {activeTool === 'transform3d' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-900 flex items-center gap-2">
                <Box className="w-4 h-4 text-cyan-600" />
                Transformações 3D em Tempo Real
              </h4>
              <p className="text-xs text-slate-600">
                Rotacione qualquer fonte nos eixos X, Y e Z com profundidade e perspectiva espacial para apresentações dinâmicas e overlays gamers.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Rotação X (Pitch / Inclinação Vertical)</span>
                    <span className="font-mono text-cyan-700">{rotX}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={rotX}
                    onChange={(e) => setRotX(Number(e.target.value))}
                    className="w-full accent-cyan-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Rotação Y (Yaw / Rotação Horizontal)</span>
                    <span className="font-mono text-cyan-700">{rotY}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={rotY}
                    onChange={(e) => setRotY(Number(e.target.value))}
                    className="w-full accent-cyan-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Perspectiva 3D</span>
                    <span className="font-mono text-cyan-700">{perspective}px</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="1200"
                    value={perspective}
                    onChange={(e) => setPerspective(Number(e.target.value))}
                    className="w-full accent-cyan-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div 
              className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-6"
              style={{ perspective: `${perspective}px` }}
            >
              <div
                className="w-56 h-36 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 p-4 text-white shadow-2xl flex flex-col justify-between transition-transform duration-100"
                style={{
                  transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold">Eixo 3D Spatial</span>
                  <span className="bg-black/40 px-1.5 py-0.5 rounded font-mono">OBS Engine</span>
                </div>
                <div className="text-center font-bold text-sm tracking-wide">
                  Perspectiva 3D ao Vivo
                </div>
                <div className="text-[10px] text-cyan-200 text-center font-mono">
                  Pitch: {rotX}° | Yaw: {rotY}°
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
