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
    'masks' | 'facetrack' | 'greenscreen' | 'inputoverlay' | 'stroke_glow' | 'dsk' | 'captions' | 'lumetric' | 'transform3d' | 'livefx'
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
      e.preventDefault();
      updateMaskPositionFromPointer(e.clientX, e.clientY);
    }
  };

  const handleCanvasPointerUp = () => {
    if (isDraggingMask) {
      setIsDraggingMask(false);
    }
  };

  // 2. FACE TRACKING
  const [faceTrackingEnabled, setFaceTrackingEnabled] = useState<boolean>(true);
  const [faceSensitivity, setFaceSensitivity] = useState<number>(75);
  const [faceZoom, setFaceZoom] = useState<number>(1.25);
  const [faceCenterX, setFaceCenterX] = useState<number>(50);
  const [faceCenterY, setFaceCenterY] = useState<number>(45);

  // 3. GREEN SCREEN AI
  const [greenScreenEnabled, setGreenScreenEnabled] = useState<boolean>(true);
  const [spillReduction, setSpillReduction] = useState<number>(65);
  const [smoothEdges, setSmoothEdges] = useState<number>(15);
  const [bgMode, setBgMode] = useState<'transparent' | 'blur' | 'office' | 'cyber'>('blur');

  // 4. INPUT OVERLAY
  const [showKeys, setShowKeys] = useState<boolean>(true);
  const [showMouse, setShowMouse] = useState<boolean>(true);
  const [showGamepad, setShowGamepad] = useState<boolean>(true);
  const [inputStyle, setInputStyle] = useState<'neon' | 'minimal' | 'arcade'>('neon');

  // 5. STROKE GLOW SHADOW
  const [glowColor, setGlowColor] = useState<string>('#a855f7');
  const [glowIntensity, setGlowIntensity] = useState<number>(18);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);

  // 6. DOWNSTREAM KEYER (DSK)
  const [dskEnabled, setDskEnabled] = useState<boolean>(true);
  const [dskAlpha, setDskAlpha] = useState<number>(95);
  const [dskLayerOrder, setDskLayerOrder] = useState<number>(10);

  // 7. REAL-TIME CAPTIONS
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
  const [captionLang, setCaptionLang] = useState<string>('pt-BR');
  const [captionFontSz, setCaptionFontSz] = useState<number>(22);
  const [captionBgOpacity, setCaptionBgOpacity] = useState<number>(80);

  // 8. LUMETRIC CORRECTOR (LUTs)
  const [lutPreset, setLutPreset] = useState<'none' | 'cinematic' | 'warm_sunset' | 'cyberpunk' | 'bw_noir'>('cinematic');
  const [exposure, setExposure] = useState<number>(10);
  const [contrast, setContrast] = useState<number>(15);
  const [saturation, setSaturation] = useState<number>(20);

  // 9. 3D TRANSFORM
  const [rotX, setRotX] = useState<number>(12); // Pitch
  const [rotY, setRotY] = useState<number>(-18); // Yaw
  const [rotZ, setRotZ] = useState<number>(0); // Roll
  const [perspective, setPerspective] = useState<number>(800);
  const [depthZ, setDepthZ] = useState<number>(0);

  // 10. LIVE SPECIAL EFFECTS (Confetti, Snow, Fireworks, Disco, Applause)
  const [activeLiveFx, setActiveLiveFx] = useState<{
    confetti: boolean;
    snow: boolean;
    fireworks: boolean;
    disco: boolean;
    applause: boolean;
  }>({
    confetti: false,
    snow: false,
    fireworks: false,
    disco: false,
    applause: false,
  });

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
    { id: 'livefx', label: 'Efeitos Especiais Live', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
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
          <button onClick={() => setNotification(null)} className="text-white hover:text-indigo-200 cursor-pointer">✕</button>
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
            Controle interativo em tempo real de máscaras de webcam, rastreamento de rosto, remoção de fundo por IA, overlay de teclado/mouse, correção de cor Lumetric e efeitos especiais para live.
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
                Máscaras WebCam Avançadas com Drag-and-Drop
              </h4>
              <p className="text-xs text-slate-600">
                Arraste a webcam diretamente na tela de pré-visualização abaixo ou ajuste o formato, raio e zoom interativamente.
              </p>

              {/* Mask Shapes */}
              <div className="space-y-2">
                <label className="block font-bold text-xs text-slate-700">Formato da Máscara</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'squircle', label: 'Squircle', icon: <RectIcon className="w-3.5 h-3.5" /> },
                    { id: 'circle', label: 'Círculo', icon: <Circle className="w-3.5 h-3.5" /> },
                    { id: 'heart', label: 'Coração', icon: <Heart className="w-3.5 h-3.5" /> },
                    { id: 'hexagon', label: 'Hexágono', icon: <Hexagon className="w-3.5 h-3.5" /> },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setMaskShape(s.id as any);
                        triggerToast(`Formato de máscara alterado para: ${s.label}`);
                      }}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        maskShape === s.id
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {s.icon}
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Arredondamento das Bordas (Corner Radius)</span>
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

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Zoom / Escala da Webcam</span>
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
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div 
              ref={maskCanvasRef}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border-2 border-dashed border-purple-500/40 flex items-center justify-center cursor-crosshair select-none shadow-xl"
            >
              {/* Background preview grid */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="absolute top-3 left-3 text-[10px] bg-slate-900/90 text-purple-300 px-2 py-1 rounded border border-purple-500/30 font-mono pointer-events-none">
                Posição: X={maskPosX}% | Y={maskPosY}%
              </div>

              {/* Draggable Webcam Box */}
              <div
                onPointerDown={handleMaskPointerDown}
                onPointerMove={handleMaskPointerMove}
                onPointerUp={handleMaskPointerUp}
                className={`absolute w-44 h-28 bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 p-3 text-white shadow-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing border-2 transition-shadow duration-150 ${
                  isDraggingMask ? 'border-amber-400 shadow-[0_0_25px_rgba(250,204,21,0.5)] scale-105' : 'border-purple-400 hover:border-purple-300'
                }`}
                style={{
                  left: `${maskPosX}%`,
                  top: `${maskPosY}%`,
                  transform: `translate(-50%, -50%) scale(${maskScale / 100})`,
                  borderRadius: maskShape === 'circle' ? '50%' : maskShape === 'heart' ? '40% 40% 50% 50%' : maskShape === 'hexagon' ? '20%' : `${maskCornerRadius}px`,
                }}
              >
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <Camera className="w-6 h-6 mb-1 opacity-90 text-purple-200" />
                <span className="text-[11px] font-bold tracking-wider">Webcam (Arraste aqui)</span>
                <span className="text-[9px] opacity-70 font-mono">Mouse / Toque</span>
              </div>

              <div className="absolute bottom-2 text-center text-xs pointer-events-none">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
                  isDraggingMask ? 'bg-purple-900/90 text-purple-200 border border-purple-500/60' : 'bg-slate-900/80 text-slate-300'
                }`}>
                  <Move className="w-3 h-3 text-purple-400" />
                  <span>
                    {isDraggingMask ? 'Movendo máscara em tempo real...' : 'Clique e arraste a webcam para qualquer lugar do preview'}
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
                    <span>Zoom Automático no Rosto</span>
                    <span className="font-mono text-blue-700">{faceZoom}x</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.0"
                    step="0.05"
                    value={faceZoom}
                    onChange={(e) => setFaceZoom(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-radial from-blue-900/30 via-slate-950 to-slate-950" />
              {/* Simulated Face Tracking Box */}
              <div 
                className="absolute w-32 h-32 border-2 border-blue-400 rounded-lg flex flex-col items-center justify-between p-2 shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300"
                style={{
                  left: `${faceCenterX}%`,
                  top: `${faceCenterY}%`,
                  transform: `translate(-50%, -50%) scale(${faceZoom})`,
                }}
              >
                <div className="absolute -top-3 bg-blue-600 text-white text-[9px] font-mono px-2 py-0.5 rounded shadow">
                  FACE DETECTADA (99.8%)
                </div>
                <div className="w-full h-full border border-blue-300/40 rounded flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                </div>
              </div>
              <div className="absolute bottom-3 text-xs text-blue-200 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-500/40">
                Status: {faceTrackingEnabled ? '🟢 Rastreando em Tempo Real' : '⚪ Pausado'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: GREEN SCREEN AI */}
      {activeTool === 'greenscreen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                Remoção de Fundo por IA (Sem Pano Verde)
              </h4>
              <p className="text-xs text-slate-600">
                Segmentação em tempo real baseada em Deep Learning para isolar o apresentador sem necessidade de chroma key físico.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-xs text-slate-700 mb-1">Substituição de Fundo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'transparent', label: 'Transparente' },
                      { id: 'blur', label: 'Desfoque Bokeh' },
                      { id: 'office', label: 'Escritório Moderno' },
                      { id: 'cyber', label: 'Cyberpunk Studio' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setBgMode(m.id as any);
                          triggerToast(`Fundo alterado para: ${m.label}`);
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          bgMode === m.id
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Redução de Spill (Contaminação de Cor)</span>
                    <span className="font-mono text-emerald-700">{spillReduction}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={spillReduction}
                    onChange={(e) => setSpillReduction(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-emerald-950/40 to-slate-900" />
              <div className="text-center space-y-2 z-10">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center shadow-lg">
                  <Camera className="w-8 h-8 text-emerald-300" />
                </div>
                <div className="text-xs font-bold text-emerald-200">IA Segmentation Ativa</div>
                <div className="text-[10px] text-slate-400">Modo de Fundo: <span className="text-white uppercase font-mono">{bgMode}</span></div>
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
                Input Overlay (Teclado, Mouse & Gamepad na Live)
              </h4>
              <p className="text-xs text-slate-600">
                Exiba em tempo real as teclas pressionadas, cliques do mouse e movimentos do controle para tutoriais e gameplays.
              </p>

              <div className="space-y-2.5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showKeys}
                    onChange={(e) => setShowKeys(e.target.checked)}
                    className="rounded accent-indigo-600 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-700">Exibir Teclas do Teclado (WASD / Atalhos)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMouse}
                    onChange={(e) => setShowMouse(e.target.checked)}
                    className="rounded accent-indigo-600 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-700">Exibir Cliques e Movimento do Mouse</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showGamepad}
                    onChange={(e) => setShowGamepad(e.target.checked)}
                    className="rounded accent-indigo-600 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-700">Exibir Gamepad / Joystick (Xbox / PS)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-6 gap-4">
              <div className="flex gap-2">
                <div className="px-3 py-2 bg-indigo-600 text-white font-mono font-bold rounded shadow text-xs">W</div>
                <div className="px-3 py-2 bg-slate-800 text-slate-300 font-mono font-bold rounded shadow text-xs">A</div>
                <div className="px-3 py-2 bg-slate-800 text-slate-300 font-mono font-bold rounded shadow text-xs">S</div>
                <div className="px-3 py-2 bg-slate-800 text-slate-300 font-mono font-bold rounded shadow text-xs">D</div>
                <div className="px-6 py-2 bg-slate-800 text-slate-300 font-mono font-bold rounded shadow text-xs">ESPAÇO</div>
              </div>
              <div className="flex gap-4 text-xs font-mono text-indigo-300">
                <span>🖱️ Click L</span>
                <span>🖱️ Click R</span>
                <span>🎮 Joy 1.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 5: STROKE GLOW SHADOW */}
      {activeTool === 'stroke_glow' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-600" />
                Stroke, Glow & Shadow Shader (Efeitos Visuais de Borda)
              </h4>
              <p className="text-xs text-slate-600">
                Adicione contornos luminosos, sombras dinâmicas e efeito neon em qualquer fonte ou webcam.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-xs text-slate-700 mb-1">Cor do Brilho (Glow)</label>
                  <div className="flex items-center gap-3">
                    {['#a855f7', '#38bdf8', '#facc15', '#f43f5e', '#10b981'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setGlowColor(c)}
                        className={`w-7 h-7 rounded-full transition cursor-pointer ${glowColor === c ? 'ring-2 ring-slate-900 scale-110' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Intensidade do Brilho (Glow Radius)</span>
                    <span className="font-mono text-amber-700">{glowIntensity}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={glowIntensity}
                    onChange={(e) => setGlowIntensity(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-6">
              <div 
                className="px-8 py-4 rounded-xl bg-slate-900 text-white font-black text-lg tracking-wider"
                style={{
                  boxShadow: `0 0 ${glowIntensity}px ${glowColor}, 0 0 ${glowIntensity * 2}px ${glowColor}`,
                  border: `2px solid ${glowColor}`,
                }}
              >
                PREVIEW COM GLOW
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 6: DOWNSTREAM KEYER (DSK) */}
      {activeTool === 'dsk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-teal-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                Downstream Keyer (DSK - Sobreposição Automática)
              </h4>
              <p className="text-xs text-slate-600">
                Insira logos, lower thirds e alertas no topo de qualquer cena sem interromper a transmissão principal.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Status do DSK</span>
                  <button
                    onClick={() => {
                      setDskEnabled(!dskEnabled);
                      triggerToast(dskEnabled ? 'DSK desativado.' : '🟢 DSK Ativado na camada superior!');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      dskEnabled ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {dskEnabled ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-6">
              <div className="absolute top-4 right-4 bg-teal-600/90 text-white px-3 py-1 rounded-md text-xs font-bold shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> DSK OVERLAY ATIVO
              </div>
              <div className="text-slate-400 text-xs">Camada Principal + Canal DSK (Alpha 95%)</div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 7: REAL-TIME CAPTIONS */}
      {activeTool === 'captions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-rose-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-rose-600" />
                Legendas em Tempo Real (Speech-to-Text na Live)
              </h4>
              <p className="text-xs text-slate-600">
                Transcreve a fala do microfone automaticamente em legendas legendadas na parte inferior da tela.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Gerador de Legendas</span>
                  <button
                    onClick={() => {
                      setCaptionsEnabled(!captionsEnabled);
                      triggerToast(captionsEnabled ? 'Legendas pausadas.' : '🎙️ Legendas automáticas ATIVAS!');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      captionsEnabled ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {captionsEnabled ? 'Ativo' : 'Pausado'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-end p-6">
              <div className="bg-black/80 border border-rose-500/50 p-3 rounded-lg text-center text-white text-sm font-semibold tracking-wide shadow-xl">
                "Olá pessoal! Sejam muito bem-vindos à nossa transmissão ao vivo de hoje!"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 8: LUMETRIC CORRECTOR */}
      {activeTool === 'lumetric' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-orange-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-orange-600" />
                Lumetric Corrector & LUTs de Cinema
              </h4>
              <p className="text-xs text-slate-600">
                Aplica tabelas de consulta de cor (LUTs) profissionais e correção de exposição e contraste na GPU.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-xs text-slate-700 mb-1">Preset de Cor</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'cinematic', label: 'Cinematic Teal & Orange' },
                      { id: 'warm_sunset', label: 'Warm Sunset' },
                      { id: 'cyberpunk', label: 'Cyberpunk Neon' },
                      { id: 'bw_noir', label: 'Black & White Noir' },
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          setLutPreset(l.id as any);
                          triggerToast(`LUT aplicado: ${l.label}`);
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          lutPreset === l.id
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-6">
              <div className="text-center space-y-2">
                <div className="text-sm font-bold text-orange-300">LUT Ativa: <span className="uppercase font-mono">{lutPreset}</span></div>
                <div className="text-xs text-slate-400">Correção de cor Lumetric acelerada por Hardware</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 9: 3D TRANSFORM */}
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
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div 
              className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-6 shadow-xl"
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

      {/* TOOL 10: LIVE SPECIAL EFFECTS (Confetti, Snow, Fireworks, Disco, Applause) */}
      {activeTool === 'livefx' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Efeitos Especiais para Transmissão Ao Vivo
              </h4>
              <p className="text-xs text-slate-600">
                Ative efeitos visuais dinâmicos em tempo real na tela do OBS/Stream para engajar seu público com confetes, neve, fogos de artifício, luzes de boate e aplausos.
              </p>
              
              <div className="space-y-2.5 pt-1">
                {/* Confetti */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🎉</span>
                    <div>
                      <div className="font-bold text-xs text-slate-800">Chuva de Confetes</div>
                      <div className="text-[10px] text-slate-500">Confetes coloridos caindo pela tela</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !activeLiveFx.confetti;
                      setActiveLiveFx(prev => ({ ...prev, confetti: next }));
                      triggerToast(next ? "🎉 Chuva de confetes ATIVADA!" : "Chuva de confetes desativada.");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeLiveFx.confetti ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {activeLiveFx.confetti ? 'Desativar' : 'Exibir'}
                  </button>
                </div>

                {/* Snow */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">❄️</span>
                    <div>
                      <div className="font-bold text-xs text-slate-800">Neve Caindo</div>
                      <div className="text-[10px] text-slate-500">Efeito de flocos de neve suaves</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !activeLiveFx.snow;
                      setActiveLiveFx(prev => ({ ...prev, snow: next }));
                      triggerToast(next ? "❄️ Neve caindo ATIVADA!" : "Neve desativada.");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeLiveFx.snow ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {activeLiveFx.snow ? 'Desativar' : 'Exibir'}
                  </button>
                </div>

                {/* Fireworks */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🎆</span>
                    <div>
                      <div className="font-bold text-xs text-slate-800">Fogos de Artifício Explodindo</div>
                      <div className="text-[10px] text-slate-500">Explosões luminosas de comemoração</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !activeLiveFx.fireworks;
                      setActiveLiveFx(prev => ({ ...prev, fireworks: next }));
                      triggerToast(next ? "🎆 Fogos de artifício ATIVADOS!" : "Fogos desativados.");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeLiveFx.fireworks ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {activeLiveFx.fireworks ? 'Desativar' : 'Exibir'}
                  </button>
                </div>

                {/* Disco Lights */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🪩</span>
                    <div>
                      <div className="font-bold text-xs text-slate-800">Luzes Boates Piscando</div>
                      <div className="text-[10px] text-slate-500">Iluminação estilo balada psicodélica</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !activeLiveFx.disco;
                      setActiveLiveFx(prev => ({ ...prev, disco: next }));
                      triggerToast(next ? "🪩 Luzes boates ATIVADAS!" : "Luzes boates desativadas.");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeLiveFx.disco ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {activeLiveFx.disco ? 'Desativar' : 'Exibir'}
                  </button>
                </div>

                {/* Applause */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">👏</span>
                    <div>
                      <div className="font-bold text-xs text-slate-800">Mãos Aplaudindo na Base</div>
                      <div className="text-[10px] text-slate-500">Várias mãos aplaudindo na parte inferior</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !activeLiveFx.applause;
                      setActiveLiveFx(prev => ({ ...prev, applause: next }));
                      triggerToast(next ? "👏 Aplausos na base ATIVADOS!" : "Aplausos desativados.");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeLiveFx.applause ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {activeLiveFx.applause ? 'Desativar' : 'Exibir'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-6 shadow-xl">
              {/* Simulator Preview of Live FX */}
              
              {/* Confetti Overlay Simulation */}
              {activeLiveFx.confetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-3.5 rounded-xs"
                      style={{
                        left: `${(i * 4) + 2}%`,
                        top: `-20px`,
                        backgroundColor: ['#f43f5e', '#38bdf8', '#facc15', '#a855f7', '#10b981', '#fb923c'][i % 6],
                        animation: `confetti-fall ${1.5 + (i % 3) * 0.7}s linear infinite`,
                        animationDelay: `${(i * 0.15)}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Snow Overlay Simulation */}
              {activeLiveFx.snow && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-white opacity-80"
                      style={{
                        width: `${(i % 3) + 2}px`,
                        height: `${(i % 3) + 2}px`,
                        left: `${(i * 3.3)}%`,
                        top: `-10px`,
                        animation: `snow-fall ${2.5 + (i % 4) * 0.8}s linear infinite`,
                        animationDelay: `${(i * 0.2)}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Fireworks Overlay Simulation */}
              {activeLiveFx.fireworks && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 m-auto rounded-full border-2 border-amber-400 opacity-80"
                        style={{
                          animation: `firework-burst 1.2s ease-out infinite`,
                          animationDelay: `${i * 0.25}s`,
                        }}
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-amber-300 bg-black/50 px-2 py-1 rounded-md">
                      🎆 FOGOS ATIVOS
                    </div>
                  </div>
                </div>
              )}

              {/* Disco Lights Simulation */}
              {activeLiveFx.disco && (
                <div 
                  className="absolute inset-0 pointer-events-none z-20 mix-blend-color-dodge"
                  style={{
                    background: 'radial-gradient(circle at 50% 30%, rgba(244,63,94,0.6) 0%, rgba(56,189,248,0.5) 40%, rgba(168,85,247,0.6) 70%, transparent 100%)',
                    animation: 'disco-flash 1.2s ease-in-out infinite',
                  }}
                />
              )}

              {/* Applause Hands at Bottom */}
              {activeLiveFx.applause && (
                <div className="absolute bottom-2 inset-x-2 flex justify-around items-end pointer-events-none z-20 px-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="text-2xl sm:text-3xl filter drop-shadow-md"
                      style={{
                        animation: `applaud-bounce 0.6s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    >
                      👏
                    </div>
                  ))}
                </div>
              )}

              {/* Central Simulator Screen View */}
              <div className="w-56 h-36 rounded-xl bg-gradient-to-tr from-purple-900 via-slate-900 to-indigo-950 p-4 text-white shadow-2xl flex flex-col justify-between border border-purple-500/30">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Live FX Master
                  </span>
                  <span className="bg-red-600 px-1.5 py-0.5 rounded font-mono text-[9px] animate-pulse">LIVE</span>
                </div>
                <div className="text-center font-bold text-xs tracking-wide text-white">
                  Pré-visualização da Transmissão
                </div>
                <div className="text-[10px] text-slate-300 text-center font-mono flex items-center justify-center gap-2">
                  <span>Confetes: {activeLiveFx.confetti ? '🟢' : '⚪'}</span>
                  <span>Neve: {activeLiveFx.snow ? '🟢' : '⚪'}</span>
                  <span>Fogos: {activeLiveFx.fireworks ? '🟢' : '⚪'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
