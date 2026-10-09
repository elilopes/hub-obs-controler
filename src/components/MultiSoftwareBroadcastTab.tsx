import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Radio, 
  Zap, 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Layers, 
  Monitor, 
  Sliders, 
  Activity, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Flame, 
  Video, 
  Camera, 
  Share2, 
  Bot, 
  Wand2, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Wifi, 
  ExternalLink,
  Laptop,
  CheckCircle2
} from 'lucide-react';
import { 
  multiSoftwareService, 
  BroadcastSoftwareId, 
  SoftwareConnectionConfig,
  VMixInputItem,
  StreamlabsScene,
  WirecastLayerShot,
  StreamerBotAction
} from '../services/multiSoftwareService';

export const MultiSoftwareBroadcastTab: React.FC = () => {
  const [selectedSoftware, setSelectedSoftware] = useState<BroadcastSoftwareId>('vmix');
  const [configs, setConfigs] = useState<Record<BroadcastSoftwareId, SoftwareConnectionConfig>>(
    () => ({ ...multiSoftwareService.configs })
  );
  const [actionLog, setActionLog] = useState<
    Array<{ id: string; software: string; action: string; details: string; timestamp: string }>
  >([]);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Estados de Simulação e Controle Interativo do vMix
  const [vmixPreviewInput, setVmixPreviewInput] = useState<number>(2);
  const [vmixProgramInput, setVmixProgramInput] = useState<number>(1);
  const [vmixOverlays, setVmixOverlays] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false, 4: false });
  const [vmixIsStreaming, setVmixIsStreaming] = useState<boolean>(false);
  const [vmixIsRecording, setVmixIsRecording] = useState<boolean>(false);
  const [vmixFadeToBlack, setVmixFadeToBlack] = useState<boolean>(false);
  const [vmixInputs, setVmixInputs] = useState<VMixInputItem[]>([
    { number: 1, name: 'Câmera 1 - Apresentador Principal', type: 'camera', isAudioMuted: false, isActiveProgram: true, isActivePreview: false },
    { number: 2, name: 'Câmera 2 - Bancada / Visão Geral', type: 'camera', isAudioMuted: false, isActiveProgram: false, isActivePreview: true },
    { number: 3, name: 'Câmera 3 - Convidado Remoto (VDO.Ninja)', type: 'camera', isAudioMuted: false, isActiveProgram: false, isActivePreview: false },
    { number: 4, name: 'Tela do PC / Slides Apresentação', type: 'desktop', isAudioMuted: true, isActiveProgram: false, isActivePreview: false },
    { number: 5, name: 'Vinheta de Abertura / VT Vídeo', type: 'media', isAudioMuted: false, isActiveProgram: false, isActivePreview: false },
    { number: 6, name: 'GC Lower Third / Notícias', type: 'title', isAudioMuted: true, isActiveProgram: false, isActivePreview: false },
    { number: 7, name: 'Câmera Vertical Smartphone 9:16', type: 'camera', isAudioMuted: false, isActiveProgram: false, isActivePreview: false },
    { number: 8, name: 'Multiview 4 Câmeras em Grade', type: 'desktop', isAudioMuted: true, isActiveProgram: false, isActivePreview: false },
  ]);

  // Estados de Streamlabs Desktop
  const [slobsActiveScene, setSlobsActiveScene] = useState<string>('scene-chat');
  const [slobsIsStreaming, setSlobsIsStreaming] = useState<boolean>(false);
  const [slobsIsRecording, setSlobsIsRecording] = useState<boolean>(false);
  const [slobsScenes, setSlobsScenes] = useState<StreamlabsScene[]>([
    {
      id: 'scene-chat',
      name: 'Just Chatting / Conversa',
      active: true,
      sources: [
        { id: 'src-cam', name: 'Sony Alpha Câmera 4K', visible: true, muted: false },
        { id: 'src-mic', name: 'Microfone Shure SM7B', visible: true, muted: false },
        { id: 'src-alert', name: 'Alert Box Streamlabs', visible: true },
        { id: 'src-spotify', name: 'Música de Fundo (Spotify)', visible: true, muted: false },
      ],
    },
    {
      id: 'scene-game',
      name: 'Gameplay / Captura de Tela',
      active: false,
      sources: [
        { id: 'src-game', name: 'Captura de Jogo / Display', visible: true },
        { id: 'src-cam-pip', name: 'Câmera PIP Redonda', visible: true },
        { id: 'src-chat-overlay', name: 'Chat na Tela (Transparente)', visible: true },
      ],
    },
    {
      id: 'scene-brb',
      name: 'Be Right Back (Voltamos Já)',
      active: false,
      sources: [
        { id: 'src-brb-loop', name: 'Animação Loop BRB', visible: true },
        { id: 'src-timer', name: 'Cronômetro 5 Minutos', visible: true },
      ],
    },
    {
      id: 'scene-starting',
      name: 'Iniciando em Breve',
      active: false,
      sources: [
        { id: 'src-start-bg', name: 'Vídeo Abertura 60FPS', visible: true },
        { id: 'src-start-audio', name: 'Trilha Sonora de Abertura', visible: true, muted: false },
      ],
    },
    {
      id: 'scene-ending',
      name: 'Transmissão Encerrada / Créditos',
      active: false,
      sources: [
        { id: 'src-credits', name: 'Rolagem de Créditos & Redes', visible: true },
      ],
    },
  ]);

  // Estados de PRISM Live Studio
  const [prismMode, setPrismMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [prismActiveScene, setPrismActiveScene] = useState<string>('prism-scene-1');
  const [prismBeautyFilter, setPrismBeautyFilter] = useState<boolean>(true);
  const [prismStickers, setPrismStickers] = useState<boolean>(false);
  const [prismIsStreaming, setPrismIsStreaming] = useState<boolean>(false);

  // Estados de Wirecast
  const [wirecastAutoLive, setWirecastAutoLive] = useState<boolean>(false);
  const [wirecastLayers, setWirecastLayers] = useState<WirecastLayerShot[]>([
    { layer: 1, layerName: 'Camada 1: Câmera Principal & Host', shotId: 'shot-1', shotName: 'Câmera 1 (Studio Host)', isActive: true },
    { layer: 1, layerName: 'Camada 1: Câmera Principal & Host', shotId: 'shot-2', shotName: 'Câmera 2 (Wide Angle)', isActive: false },
    { layer: 2, layerName: 'Camada 2: PIP & Apresentador Convidado', shotId: 'shot-3', shotName: 'Convidado PIP Croma Key', isActive: false },
    { layer: 3, layerName: 'Camada 3: Títulos, GC & Letreiros', shotId: 'shot-4', shotName: 'Tarja Notícias Lower Third', isActive: true },
    { layer: 4, layerName: 'Camada 4: Mídia & Playlists', shotId: 'shot-5', shotName: 'Vídeo Institucional VT', isActive: false },
    { layer: 5, layerName: 'Camada 5: Fundo & Cenário Virtual 3D', shotId: 'shot-6', shotName: 'Estúdio Virtual LED Wall', isActive: true },
  ]);

  // Estados de Streamer.bot
  const [streamerBotActions] = useState<StreamerBotAction[]>([
    { id: 'sb-1', name: 'Disparar Anúncio de Live no Chat', group: 'Chat', enabled: true, color: 'bg-purple-600', icon: '📢' },
    { id: 'sb-2', name: 'Efeito Sonoro: Aplausos de Auditório', group: 'Áudio', enabled: true, color: 'bg-emerald-600', icon: '👏' },
    { id: 'sb-3', name: 'Resetar Câmera PTZ para Preset 1', group: 'Câmeras', enabled: true, color: 'bg-blue-600', icon: '🎯' },
    { id: 'sb-4', name: 'Girar Roleta de Recompensas de Pontos', group: 'Engajamento', enabled: true, color: 'bg-amber-600', icon: '🎡' },
    { id: 'sb-5', name: 'Silenciar Trilha Musical (DMCA Safe)', group: 'Segurança', enabled: true, color: 'bg-rose-600', icon: '🔇' },
    { id: 'sb-6', name: 'Mute Geral de Emergência', group: 'Segurança', enabled: true, color: 'bg-red-700', icon: '🚨' },
    { id: 'sb-7', name: 'Trocar Cena no OBS via Streamer.bot', group: 'OBS Integration', enabled: true, color: 'bg-indigo-600', icon: '🎬' },
    { id: 'sb-8', name: 'Enviar Mensagem Automática de Redes', group: 'Chat', enabled: true, color: 'bg-sky-600', icon: '💬' },
  ]);
  const [customActionInput, setCustomActionInput] = useState<string>('');

  // Subscrição aos eventos do serviço
  useEffect(() => {
    const unsubConfig = multiSoftwareService.subscribe('configChange', (newConfig: SoftwareConnectionConfig) => {
      setConfigs((prev) => ({ ...prev, [newConfig.id]: newConfig }));
    });

    const unsubAction = multiSoftwareService.subscribe('actionExecuted', (data: any) => {
      setActionLog((prev) => [
        { id: `log-${Date.now()}-${Math.random()}`, ...data },
        ...prev.slice(0, 19),
      ]);
      setStatusNotification(`[${data.software.toUpperCase()}] ${data.action} executado com sucesso`);
      setTimeout(() => setStatusNotification(null), 3000);
    });

    return () => {
      unsubConfig();
      unsubAction();
    };
  }, []);

  const currentConfig = configs[selectedSoftware];

  // Ações de Conexão
  const handleConnect = async () => {
    const res = await multiSoftwareService.connectSoftware(
      selectedSoftware,
      currentConfig.host,
      currentConfig.port,
      currentConfig.passwordOrToken,
      currentConfig.isSimulated
    );
    setStatusNotification(res.message);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  const handleDisconnect = () => {
    multiSoftwareService.disconnectSoftware(selectedSoftware);
    setStatusNotification(`${currentConfig.name} desconectado`);
    setTimeout(() => setStatusNotification(null), 2500);
  };

  // HANDLERS DO VMIX
  const handleVMixCut = () => {
    const oldProgram = vmixProgramInput;
    setVmixProgramInput(vmixPreviewInput);
    setVmixPreviewInput(oldProgram);
    multiSoftwareService.sendVMixCommand('Cut');
  };

  const handleVMixFade = (durationMs = 1000) => {
    const oldProgram = vmixProgramInput;
    setVmixProgramInput(vmixPreviewInput);
    setVmixPreviewInput(oldProgram);
    multiSoftwareService.sendVMixCommand('Fade', undefined, durationMs);
  };

  const handleVMixQuickPlay = () => {
    const oldProgram = vmixProgramInput;
    setVmixProgramInput(vmixPreviewInput);
    setVmixPreviewInput(oldProgram);
    multiSoftwareService.sendVMixCommand('QuickPlay');
  };

  const handleVMixSelectInput = (num: number, target: 'preview' | 'program') => {
    if (target === 'preview') {
      setVmixPreviewInput(num);
      multiSoftwareService.sendVMixCommand('PreviewInput', num);
    } else {
      setVmixProgramInput(num);
      multiSoftwareService.sendVMixCommand('ActiveInput', num);
    }
  };

  const handleVMixToggleOverlay = (overlayNum: number) => {
    setVmixOverlays((prev) => ({ ...prev, [overlayNum]: !prev[overlayNum] }));
    multiSoftwareService.sendVMixCommand(`OverlayInput${overlayNum}`, 6);
  };

  const handleVMixToggleMuteInput = (num: number) => {
    setVmixInputs((prev) =>
      prev.map((inp) => (inp.number === num ? { ...inp, isAudioMuted: !inp.isAudioMuted } : inp))
    );
    multiSoftwareService.sendVMixCommand('Audio', num);
  };

  // HANDLERS DE STREAMLABS
  const handleSlobsSelectScene = (sceneId: string) => {
    setSlobsActiveScene(sceneId);
    setSlobsScenes((prev) =>
      prev.map((s) => ({ ...s, active: s.id === sceneId }))
    );
    multiSoftwareService.sendStreamlabsRPC('makeSceneActive', 'ScenesService', [sceneId]);
  };

  const handleSlobsToggleSourceVisibility = (sourceId: string) => {
    setSlobsScenes((prev) =>
      prev.map((s) => ({
        ...s,
        sources: s.sources.map((src) =>
          src.id === sourceId ? { ...src, visible: !src.visible } : src
        ),
      }))
    );
    multiSoftwareService.sendStreamlabsRPC('setVisibility', 'SceneItem', [sourceId, true]);
  };

  // HANDLERS DE PRISM
  const handlePrismSelectScene = (sceneId: string, name: string) => {
    setPrismActiveScene(sceneId);
    multiSoftwareService.sendPrismCommand('SetCurrentProgramScene', { sceneName: name });
  };

  // HANDLERS DE WIRECAST
  const handleWirecastSelectShot = (shotId: string, layer: number) => {
    setWirecastLayers((prev) =>
      prev.map((s) => (s.shotId === shotId ? { ...s, isActive: true } : s.layer === layer ? { ...s, isActive: false } : s))
    );
    multiSoftwareService.sendWirecastCommand(`/api/v1/layers/${layer}/shots/${shotId}/go`);
  };

  // HANDLERS DE STREAMER.BOT
  const handleStreamerBotAction = (actionName: string) => {
    multiSoftwareService.sendStreamerBotAction(actionName);
  };

  return (
    <div className="space-y-6">

      {/* FEEDBACK TOAST / NOTIFICAÇÃO GLOBAL */}
      {statusNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusNotification}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">Status OK</span>
        </div>
      )}

      {/* BANNER PRINCIPAL COM SELETOR DE SOFTWARES DE BROADCAST */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-md border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                Multi-Software Broadcast Engine
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Mesa de Controle Multi-Software Broadcast
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Controle em tempo real de estúdios <strong>vMix, Streamlabs Desktop, PRISM Live Studio, Wirecast, Meld Studio e Streamer.bot</strong> via WebSocket e HTTP REST API. Alterna cenas, inputs, áudio e transmissão diretamente pelo Central Hub.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ping: {currentConfig.lastPingMs || 12}ms</span>
            </span>
          </div>
        </div>

        {/* SELETOR EM ABAS DOS SOFTWARES SUPORTADOS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {[
            {
              id: 'vmix' as BroadcastSoftwareId,
              name: 'vMix Live',
              port: 'Porta 8088',
              protocol: 'HTTP / TCP',
              icon: <Tv className="w-4 h-4 text-blue-400" />,
              activeColor: 'from-blue-600 to-indigo-700 text-white border-blue-400 shadow-md shadow-blue-900/40',
            },
            {
              id: 'streamlabs' as BroadcastSoftwareId,
              name: 'Streamlabs',
              port: 'Porta 59650',
              protocol: 'WebSocket RPC',
              icon: <Radio className="w-4 h-4 text-emerald-400" />,
              activeColor: 'from-emerald-600 to-teal-700 text-white border-emerald-400 shadow-md shadow-emerald-900/40',
            },
            {
              id: 'prism' as BroadcastSoftwareId,
              name: 'PRISM Live',
              port: 'Porta 4455',
              protocol: 'OBS-WS v5',
              icon: <Camera className="w-4 h-4 text-amber-400" />,
              activeColor: 'from-amber-600 to-orange-700 text-white border-amber-400 shadow-md shadow-amber-900/40',
            },
            {
              id: 'wirecast' as BroadcastSoftwareId,
              name: 'Wirecast',
              port: 'Porta 8080',
              protocol: 'REST / Shots',
              icon: <Layers className="w-4 h-4 text-purple-400" />,
              activeColor: 'from-purple-600 to-indigo-700 text-white border-purple-400 shadow-md shadow-purple-900/40',
            },
            {
              id: 'meld' as BroadcastSoftwareId,
              name: 'Meld Studio',
              port: 'Porta 8989',
              protocol: 'IPC / Tracks',
              icon: <Sliders className="w-4 h-4 text-rose-400" />,
              activeColor: 'from-rose-600 to-pink-700 text-white border-rose-400 shadow-md shadow-rose-900/40',
            },
            {
              id: 'streamerbot' as BroadcastSoftwareId,
              name: 'Streamer.bot',
              port: 'Porta 8080',
              protocol: 'JSON-RPC WS',
              icon: <Bot className="w-4 h-4 text-cyan-400" />,
              activeColor: 'from-cyan-600 to-blue-700 text-white border-cyan-400 shadow-md shadow-cyan-900/40',
            },
          ].map((soft) => {
            const isSelected = selectedSoftware === soft.id;
            const isConn = configs[soft.id].connected;

            return (
              <button
                key={soft.id}
                type="button"
                onClick={() => setSelectedSoftware(soft.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? `bg-gradient-to-tr ${soft.activeColor} ring-2 ring-white/20`
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {soft.icon}
                    <span className="font-bold text-xs truncate">{soft.name}</span>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-300/80 font-mono">
                  <span>{soft.port}</span>
                  <span className="opacity-75">{soft.protocol}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* BARRA DE CONFIGURAÇÃO DE CONEXÃO DO SOFTWARE ATIVO */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {selectedSoftware === 'vmix' ? 'vM' : selectedSoftware === 'streamlabs' ? 'SL' : selectedSoftware === 'prism' ? 'PR' : selectedSoftware === 'wirecast' ? 'WC' : selectedSoftware === 'meld' ? 'MS' : 'SB'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  {currentConfig.name}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    currentConfig.connected
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {currentConfig.connected ? (currentConfig.isSimulated ? 'Simulação Ativa' : 'Conectado Online') : 'Desconectado'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                  Protocolo: {currentConfig.protocol.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Porta padrão recomendada: <strong>{currentConfig.defaultPort}</strong> | Suporte a chamadas remotas e locais.
              </p>
            </div>
          </div>

          {/* Form de Conexão Rápida */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-[11px] font-semibold text-slate-500">Host:</span>
              <input
                type="text"
                value={currentConfig.host}
                onChange={(e) => {
                  const val = e.target.value;
                  setConfigs((prev) => ({
                    ...prev,
                    [selectedSoftware]: { ...prev[selectedSoftware], host: val },
                  }));
                }}
                className="w-24 px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-800"
                placeholder="localhost"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-[11px] font-semibold text-slate-500">Porta:</span>
              <input
                type="number"
                value={currentConfig.port}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setConfigs((prev) => ({
                    ...prev,
                    [selectedSoftware]: { ...prev[selectedSoftware], port: val },
                  }));
                }}
                className="w-16 px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-800"
              />
            </div>

            {selectedSoftware === 'streamlabs' && (
              <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 text-xs">
                <span className="text-[11px] font-semibold text-slate-500">API Token:</span>
                <input
                  type="password"
                  value={currentConfig.passwordOrToken || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConfigs((prev) => ({
                      ...prev,
                      [selectedSoftware]: { ...prev[selectedSoftware], passwordOrToken: val },
                    }));
                  }}
                  className="w-24 px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-800"
                  placeholder="Token"
                />
              </div>
            )}

            <button
              type="button"
              onClick={currentConfig.connected ? handleDisconnect : handleConnect}
              disabled={currentConfig.connecting}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                currentConfig.connected
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {currentConfig.connecting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Conectando...</span>
                </>
              ) : currentConfig.connected ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Desconectar</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Conectar / Ativar</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setConfigs((prev) => ({
                  ...prev,
                  [selectedSoftware]: { ...prev[selectedSoftware], isSimulated: !prev[selectedSoftware].isSimulated },
                }));
                setStatusNotification(`Modo de Simulação ${!currentConfig.isSimulated ? 'Ativado' : 'Desativado'}`);
                setTimeout(() => setStatusNotification(null), 2000);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                currentConfig.isSimulated
                  ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
              title="Alternar entre envio de comando físico e simulação interativa"
            >
              {currentConfig.isSimulated ? '⚡ Simulação ON' : 'Físico Real'}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MESA DE CONTROLE VMIX (BROADCAST PROGRAM & PREVIEW)                   */}
      {/* ========================================================================= */}
      {selectedSoftware === 'vmix' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Telas de Preview & Program estilo switcher broadcast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Monitor PREVIEW (Verde) */}
            <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 text-white space-y-3 shadow-lg shadow-emerald-950/20">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse"></span>
                  PREVIEW (ENTRADA {vmixPreviewInput})
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {vmixInputs.find((i) => i.number === vmixPreviewInput)?.name}
                </span>
              </div>
              <div className="aspect-video bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-radial from-emerald-900/20 to-transparent"></div>
                <Tv className="w-12 h-12 text-emerald-500/60 mb-2" />
                <span className="font-bold text-sm text-slate-200 z-10">
                  {vmixInputs.find((i) => i.number === vmixPreviewInput)?.name}
                </span>
                <span className="text-[11px] text-emerald-400 font-mono z-10">
                  Pronto para transição Cut / Fade
                </span>
              </div>
            </div>

            {/* Monitor PROGRAM (Vermelho) */}
            <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl p-4 text-white space-y-3 shadow-lg shadow-rose-950/30">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-rose-600 text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  PROGRAM / NO AR (ENTRADA {vmixProgramInput})
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {vmixInputs.find((i) => i.number === vmixProgramInput)?.name}
                </span>
              </div>
              <div className="aspect-video bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-rose-900/30 to-transparent"></div>
                <Flame className="w-12 h-12 text-rose-500/80 mb-2 animate-pulse" />
                <span className="font-bold text-sm text-slate-100 z-10">
                  {vmixInputs.find((i) => i.number === vmixProgramInput)?.name}
                </span>
                <span className="text-[11px] text-rose-400 font-mono font-bold z-10">
                  SINAL TRANSMITIDO AO VIVO
                </span>
              </div>
            </div>

          </div>

          {/* BOTÕES DE TRANSIÇÃO BROADCAST DO VMIX */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Transições Broadcast do vMix (T-Bar & Cut)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <button
                type="button"
                onClick={handleVMixCut}
                className="h-16 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm tracking-wider uppercase shadow-md shadow-rose-600/30 active:scale-95 transition flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <span>CUT</span>
                <span className="text-[9px] font-mono opacity-80">Corte Seco</span>
              </button>

              <button
                type="button"
                onClick={() => handleVMixFade(1000)}
                className="h-16 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase shadow-sm active:scale-95 transition flex flex-col items-center justify-center gap-1 cursor-pointer border border-slate-800"
              >
                <span>FADE 1s</span>
                <span className="text-[9px] font-mono text-slate-400">Suave</span>
              </button>

              <button
                type="button"
                onClick={() => handleVMixFade(2000)}
                className="h-16 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase shadow-sm active:scale-95 transition flex flex-col items-center justify-center gap-1 cursor-pointer border border-slate-800"
              >
                <span>FADE 2s</span>
                <span className="text-[9px] font-mono text-slate-400">Longo</span>
              </button>

              <button
                type="button"
                onClick={handleVMixQuickPlay}
                className="h-16 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase shadow-md shadow-blue-600/30 active:scale-95 transition flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <span>QUICKPLAY</span>
                <span className="text-[9px] font-mono opacity-80">Play & Cut</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVmixFadeToBlack(!vmixFadeToBlack);
                  multiSoftwareService.sendVMixCommand('FadeToBlack');
                }}
                className={`h-16 rounded-xl font-bold text-xs uppercase shadow-sm active:scale-95 transition flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                  vmixFadeToBlack
                    ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                <span>FTB</span>
                <span className="text-[9px] font-mono">Fade to Black</span>
              </button>

              <button
                type="button"
                onClick={() => multiSoftwareService.sendVMixCommand('Merge', undefined, 1200)}
                className="h-16 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs uppercase border border-indigo-200 active:scale-95 transition flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <span>MERGE</span>
                <span className="text-[9px] font-mono text-indigo-600">Animado</span>
              </button>
            </div>
          </div>

          {/* GRADE DE ENTRADAS / INPUTS DO VMIX */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Tv className="w-4 h-4 text-blue-600" />
                <span>Entradas & Câmeras do vMix (Inputs 1 a 8)</span>
              </h4>
              <span className="text-xs text-slate-500">
                Clique em <strong>Preview</strong> para preparar ou <strong>Program</strong> para corte direto
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {vmixInputs.map((input) => {
                const isPreview = vmixPreviewInput === input.number;
                const isProgram = vmixProgramInput === input.number;

                return (
                  <div
                    key={input.number}
                    className={`p-3 rounded-xl border transition-all ${
                      isProgram
                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
                        : isPreview
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-xs font-black px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono">
                        #{input.number}
                      </span>
                      <div className="flex items-center gap-1">
                        {isProgram && (
                          <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded uppercase">
                            PROGRAM
                          </span>
                        )}
                        {isPreview && (
                          <span className="px-1.5 py-0.5 bg-emerald-600 text-white text-[9px] font-black rounded uppercase">
                            PREVIEW
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleVMixToggleMuteInput(input.number)}
                          className={`p-1 rounded transition ${
                            input.isAudioMuted
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                          title="Mutar/Desmutar áudio deste input"
                        >
                          {input.isAudioMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <h5 className="font-bold text-xs text-slate-800 line-clamp-1 mb-3">
                      {input.name}
                    </h5>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleVMixSelectInput(input.number, 'preview')}
                        className={`py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                          isPreview
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        Preview
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVMixSelectInput(input.number, 'program')}
                        className={`py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                          isProgram
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        Program
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OVERLAYS 1 A 4 E MASTER LIVE / RECORD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Overlays / GC */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Overlays vMix (Tarjas, GC, Logos & Lower Thirds)</span>
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((ov) => {
                  const isActive = vmixOverlays[ov];
                  return (
                    <button
                      key={ov}
                      type="button"
                      onClick={() => handleVMixToggleOverlay(ov)}
                      className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer border ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      Overlay {ov} {isActive ? 'ON' : 'OFF'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Iniciar Transmissão & Gravação no vMix */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saídas de Transmissão vMix</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVmixIsStreaming(!vmixIsStreaming);
                    multiSoftwareService.sendVMixCommand('StartStreaming');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    vmixIsStreaming
                      ? 'bg-rose-600 text-white shadow-rose-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>{vmixIsStreaming ? 'Parar Streaming vMix' : 'Iniciar Streaming vMix'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVmixIsRecording(!vmixIsRecording);
                    multiSoftwareService.sendVMixCommand('StartRecording');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    vmixIsRecording
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>{vmixIsRecording ? 'Parar Gravação vMix' : 'Gravar no Disco'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MESA STREAMLABS DESKTOP (SCENE SWITCHING & RPC)                         */}
      {/* ========================================================================= */}
      {selectedSoftware === 'streamlabs' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Seletor de Cenas Streamlabs */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Cenas do Streamlabs Desktop (Porta 59650 WebSocket RPC)
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Alterna coleções de cenas e exibe status de fontes em tempo real
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSlobsIsStreaming(!slobsIsStreaming);
                    multiSoftwareService.sendStreamlabsRPC('toggleStreaming', 'StreamingService');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    slobsIsStreaming
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>{slobsIsStreaming ? 'Encerrar Live Streamlabs' : 'Go Live no Streamlabs'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {slobsScenes.map((scene) => {
                const isActive = slobsActiveScene === scene.id;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => handleSlobsSelectScene(scene.id)}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between h-24 ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Cena Ativa
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <span className="font-bold text-xs text-slate-900 line-clamp-2">
                      {scene.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {scene.sources.length} fontes integradas
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fontes da Cena Ativa */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fontes da Cena Atual: {slobsScenes.find((s) => s.id === slobsActiveScene)?.name}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {slobsScenes.find((s) => s.id === slobsActiveScene)?.sources.map((src) => (
                <div
                  key={src.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                >
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {src.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSlobsToggleSourceVisibility(src.id)}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      src.visible
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                    title={src.visible ? 'Ocultar Fonte' : 'Exibir Fonte'}
                  >
                    {src.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MESA PRISM LIVE STUDIO (COMPATÍVEL OBS-WS V5)                          */}
      {/* ========================================================================= */}
      {selectedSoftware === 'prism' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    PRISM Live Studio (Porta 4455 OBS-WS v5)
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Compatível nativamente com transmissões verticais (TikTok/Instagram) e horizontais (YouTube)
                  </span>
                </div>
              </div>

              {/* Modo Vertical vs Horizontal */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPrismMode('horizontal')}
                  className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                    prismMode === 'horizontal'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Horizontal (16:9)
                </button>
                <button
                  type="button"
                  onClick={() => setPrismMode('vertical')}
                  className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                    prismMode === 'vertical'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Vertical Móvel (9:16)
                </button>
              </div>
            </div>

            {/* Cenas PRISM */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'prism-scene-1', name: 'Câmera Principal + Filtro Beauty' },
                { id: 'prism-scene-2', name: 'Tela do Celular + Avatar Interativo' },
                { id: 'prism-scene-3', name: 'Abertura Vinheta PRISM Studio' },
              ].map((sc) => {
                const isActive = prismActiveScene === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handlePrismSelectScene(sc.id, sc.name)}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                      isActive
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-700 uppercase block mb-1">
                      {prismMode === 'vertical' ? 'Layout 9:16' : 'Layout 16:9'}
                    </span>
                    <h5 className="font-bold text-xs text-slate-800">{sc.name}</h5>
                  </button>
                );
              })}
            </div>

            {/* Efeitos & Live PRISM */}
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPrismBeautyFilter(!prismBeautyFilter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                  prismBeautyFilter
                    ? 'bg-pink-50 text-pink-700 border-pink-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                Filtro de Embelezamento: {prismBeautyFilter ? 'ATIVO' : 'DESLIGADO'}
              </button>

              <button
                type="button"
                onClick={() => setPrismStickers(!prismStickers)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                  prismStickers
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Adesivos Interativos PRISM: {prismStickers ? 'VISÍVEIS' : 'OCULTOS'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrismIsStreaming(!prismIsStreaming);
                  multiSoftwareService.sendPrismCommand('ToggleStream');
                }}
                className={`ml-auto px-4 py-1.5 rounded-lg text-xs font-bold transition text-white cursor-pointer ${
                  prismIsStreaming ? 'bg-rose-600' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                <Radio className="w-3.5 h-3.5 inline mr-1" />
                {prismIsStreaming ? 'Encerrar Live PRISM' : 'Transmitir via PRISM'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MESA WIRECAST (LAYERS & SHOTS REST API)                                */}
      {/* ========================================================================= */}
      {selectedSoftware === 'wirecast' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Telestream Wirecast (Camadas 1 a 5 & Shots REST API)
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Controle de shots por camada e transição AutoLive
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWirecastAutoLive(!wirecastAutoLive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                    wirecastAutoLive
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Modo AutoLive: {wirecastAutoLive ? 'ATIVO (1 Clique)' : 'MANUAL (Clique GO)'}
                </button>

                <button
                  type="button"
                  onClick={() => multiSoftwareService.sendWirecastCommand('/api/v1/transitions/go')}
                  className="px-4 py-1.5 rounded-lg text-xs font-black bg-purple-600 hover:bg-purple-700 text-white uppercase shadow-xs transition cursor-pointer"
                >
                  GO ➔
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5].map((layerNum) => {
                const shotsInLayer = wirecastLayers.filter((s) => s.layer === layerNum);
                const layerTitle = shotsInLayer[0]?.layerName || `Camada ${layerNum}`;

                return (
                  <div key={layerNum} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700">
                      {layerTitle}
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
                      {shotsInLayer.map((shot) => (
                        <button
                          key={shot.shotId}
                          type="button"
                          onClick={() => handleWirecastSelectShot(shot.shotId, shot.layer)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                            shot.isActive
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {shot.shotName} {shot.isActive && '● NO AR'}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MESA MELD STUDIO (IPC & TRACKS)                                        */}
      {/* ========================================================================= */}
      {selectedSoftware === 'meld' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-800">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Meld Studio (Porta 8989 IPC & Video Tracks)
                </h4>
                <span className="text-[11px] text-slate-500">
                  Gerenciamento de trilhas de iluminação, câmeras virtuais e áudio paramétrico
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Preset de Iluminação: Estúdio Quente 3200K', action: 'setLightingWarm' },
                { name: 'Preset de Iluminação: Luz do Dia 5600K', action: 'setLightingDaylight' },
                { name: 'Redução de Ruído de IA no Microfone', action: 'toggleNoiseReduction' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => multiSoftwareService.sendMeldCommand(item.action)}
                  className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition cursor-pointer space-y-1"
                >
                  <Wand2 className="w-4 h-4 text-rose-600 mb-1" />
                  <h5 className="font-bold text-xs text-slate-800">{item.name}</h5>
                  <span className="text-[10px] text-slate-500">Disparo via JSON-RPC</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MESA STREAMER.BOT AUTOMATION (JSON-RPC DISPARADOR DE AÇÕES)            */}
      {/* ========================================================================= */}
      {selectedSoftware === 'streamerbot' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-100 text-cyan-800">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Streamer.bot Automation (Porta 8080 WebSocket Server)
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Dispare ações, sub-ações, efeitos de áudio, integrações de chat e recompensas com 1 clique
                  </span>
                </div>
              </div>

              <span className="text-[11px] px-2.5 py-1 rounded-full font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                JSON-RPC v2.0 Ready
              </span>
            </div>

            {/* Grade de Botões de Ações do Streamer.bot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {streamerBotActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => handleStreamerBotAction(act.name)}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-cyan-300 rounded-xl text-left transition active:scale-95 cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{act.icon}</span>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      {act.group}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 group-hover:text-cyan-700 transition">
                    {act.name}
                  </h5>
                  <span className="text-[10px] text-slate-500 block">
                    Disparar `DoAction`
                  </span>
                </button>
              ))}
            </div>

            {/* Disparo de Ação Customizada por Nome ou ID */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={customActionInput}
                onChange={(e) => setCustomActionInput(e.target.value)}
                placeholder="Digitar nome ou GUID de ação do Streamer.bot..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
              />
              <button
                type="button"
                onClick={() => {
                  if (customActionInput.trim()) {
                    handleStreamerBotAction(customActionInput.trim());
                    setCustomActionInput('');
                  }
                }}
                disabled={!customActionInput.trim()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition cursor-pointer shadow-xs"
              >
                Disparar Ação
              </button>
            </div>
          </div>

        </div>
      )}

      {/* HISTÓRICO DE AÇÕES / LOG DE COMANDOS EXECUTADOS */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>Terminal de Eventos & Comandos em Tempo Real</span>
          </h4>
          <button
            type="button"
            onClick={() => setActionLog([])}
            className="text-[10px] text-slate-500 hover:text-slate-800 font-semibold"
          >
            Limpar Log
          </button>
        </div>

        {actionLog.length === 0 ? (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-400 font-mono">
            Nenhum comando recente. Interaja com os botões acima para ver os disparos WebSocket e HTTP.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px]">
            {actionLog.map((log) => (
              <div
                key={log.id}
                className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-blue-700 uppercase shrink-0">
                    [{log.software}]
                  </span>
                  <span className="text-slate-800 font-medium truncate">
                    {log.action}
                  </span>
                  <span className="text-slate-500 truncate text-[10px]">
                    {log.details}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
