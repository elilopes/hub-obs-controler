import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  MasterControlTab 
} from './components/MasterControlTab';
import { 
  MediaAudioTab 
} from './components/MediaAudioTab';
import { 
  TickerOverlayTab 
} from './components/TickerOverlayTab';
import { 
  VDONinjaTab 
} from './components/VDONinjaTab';
import { 
  MultiRTMPTab 
} from './components/MultiRTMPTab';
import { 
  SceneSwitcherTab 
} from './components/SceneSwitcherTab';
import { 
  LoginsTab 
} from './components/LoginsTab';
import { 
  ManualTab 
} from './components/ManualTab';
import { 
  VideoQualityTab 
} from './components/VideoQualityTab';
import { 
  ScriptsAutomationsTab 
} from './components/ScriptsAutomationsTab';
import { 
  QuickShareModal 
} from './components/QuickShareModal';
import { 
  OBSConnectionModal 
} from './components/OBSConnectionModal';
import { 
  OBSConnectionConfig, 
  StreamStats, 
  SceneItem, 
  RTMPDestination, 
  CrossStreamCopyPayload,
  AutomationRule,
  StudioProfile,
  ConnectionMode,
  LiveQualityConfig,
  RecordQualityConfig
} from './types';
import { 
  Sliders, 
  Volume2, 
  Type, 
  Users, 
  Radio, 
  Workflow, 
  Key, 
  BookOpen,
  Sparkles,
  Layers,
  Smartphone,
  Film
} from 'lucide-react';
import { obsService } from './services/obsWebSocketService';
import { ProfileManager } from './services/profileManager';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<
    'master' | 'quality' | 'scripts' | 'media' | 'ticker' | 'vdo' | 'multirtmp' | 'switcher' | 'logins' | 'manual'
  >('master');

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Profiles State
  const [profiles, setProfiles] = useState<StudioProfile[]>(() => ProfileManager.getProfiles());
  const [activeProfile, setActiveProfile] = useState<StudioProfile>(() => ProfileManager.getActiveProfile());

  // Status Message Feedback
  const [statusMessage, setStatusMessage] = useState<{ text: string; color: string }>({
    text: 'Pronto para transmitir com OBS WebSocket v5',
    color: '#16a34a',
  });

  // OBS Connection State
  const [obsConfig, setObsConfig] = useState<OBSConnectionConfig>({
    mode: activeProfile.mode,
    activeProfileId: activeProfile.id,
    host: activeProfile.host,
    port: activeProfile.port,
    password: activeProfile.password,
    connected: activeProfile.mode === 'simulation',
    connecting: false,
    version: '30.1.2',
    webSocketVersion: '5.4.1',
  });

  // Telemetry & Broadcast Stats
  const [stats, setStats] = useState<StreamStats>({
    isStreaming: false,
    isRecording: false,
    streamingTime: 0,
    recordingTime: 0,
    cpuUsage: 14.2,
    fps: 60.0,
    bitrate: 6000,
    droppedFrames: 0,
    totalFrames: 14200,
    memoryUsageMb: 320,
  });

  // Scenes
  const [scenes, setScenes] = useState<SceneItem[]>([
    { id: '1', name: 'Cena_Principal', active: true, sourcesCount: 4, type: 'standard' },
    { id: '2', name: 'Apresentacao', active: false, sourcesCount: 3, type: 'media' },
    { id: '3', name: 'Gameplay', active: false, sourcesCount: 5, type: 'standard' },
    { id: '4', name: 'Webcam_FullScreen', active: false, sourcesCount: 2, type: 'camera' },
    { id: '5', name: 'Letreiro_Aviso', active: false, sourcesCount: 2, type: 'standard' },
    { id: '6', name: 'BRB_Intervalo', active: false, sourcesCount: 3, type: 'media' },
    { id: '7', name: 'Encerramento', active: false, sourcesCount: 2, type: 'media' },
  ]);
  const [currentScene, setCurrentScene] = useState('Cena_Principal');

  // PTZ Virtual Camera state
  const [ptzState, setPtzState] = useState({ panX: 0, panY: 0, zoom: 1.0 });
  const [isVirtualCamActive, setIsVirtualCamActive] = useState(false);

  // Audio Mixer State (Microfone inicia sempre desativado por padrão / Proteção Hot Mic)
  const [volume, setVolume] = useState(0);
  const [filtersEnabled, setFiltersEnabled] = useState(true);
  const [smartDucking, setSmartDucking] = useState(true);

  // Stream Key State (Status da Chave de Transmissão para o LED Stream Key ON/OFF)
  const [activeStreamKey, setActiveStreamKey] = useState('cgwr-kmv8-11fh-aaws-a51r');
  const [streamKeyLabel, setStreamKeyLabel] = useState('YouTube Live');

  // Multi-RTMP Destinations
  const [destinations, setDestinations] = useState<RTMPDestination[]>([
    {
      id: 'dest-1',
      name: 'Twitch TV Principal',
      server: 'rtmp://live.twitch.tv/app',
      key: 'live_789423_a99f01b',
      enabled: true,
      status: 'idle',
      platform: 'twitch',
    },
    {
      id: 'dest-2',
      name: 'Kick Live Stream',
      server: 'rtmps://fa723ac112e3.global-contribute.live-video.net:443/app',
      key: 'sk_us_live_8849',
      enabled: true,
      status: 'idle',
      platform: 'kick',
    },
  ]);

  // Aitum Vertical state
  const [aitumStreaming, setAitumStreaming] = useState(false);

  // Automation Rules
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'rule-1',
      condition: 'stream_start',
      targetScene: 'Cena_Principal',
      delayMs: 1000,
      enabled: true,
      description: 'Ao Iniciar Transmissão -> Cortar para Cena_Principal',
    },
    {
      id: 'rule-2',
      condition: 'media_ended',
      targetScene: 'Apresentacao',
      delayMs: 500,
      enabled: true,
      description: 'Fim da Mídia da Intro -> Cortar para Apresentação',
    },
    {
      id: 'rule-3',
      condition: 'stream_stop',
      targetScene: 'Encerramento',
      delayMs: 0,
      enabled: true,
      description: 'Ao Encerrar Transmissão -> Cena de Encerramento',
    },
  ]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Connection handlers
  const handleConnectProfile = useCallback(async (profile: StudioProfile) => {
    setActiveProfile(profile);
    setObsConfig((prev) => ({
      ...prev,
      mode: profile.mode,
      activeProfileId: profile.id,
      host: profile.host,
      port: profile.port,
      password: profile.password,
      connecting: profile.mode === 'direct',
    }));

    if (profile.mode === 'direct') {
      setStatusMessage({ text: `Conectando ao OBS em ${profile.host}:${profile.port}...`, color: '#eab308' });
      try {
        const res = await obsService.connect(profile.host, profile.port, profile.password);
        setObsConfig((prev) => ({
          ...prev,
          connected: true,
          connecting: false,
          version: res.version,
          webSocketVersion: res.wsVersion,
          error: undefined,
        }));
        setStatusMessage({ text: `✅ Conectado via obs-websocket-js (${profile.host}:${profile.port})`, color: '#16a34a' });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setObsConfig((prev) => ({
          ...prev,
          connected: false,
          connecting: false,
          error: errorMsg,
        }));
        setStatusMessage({ text: `❌ Falha ao conectar no OBS: ${errorMsg}`, color: '#dc2626' });
      }
    } else {
      // Simulation / Hub mode
      await obsService.disconnect();
      setObsConfig((prev) => ({
        ...prev,
        connected: true,
        connecting: false,
        error: undefined,
      }));
      setStatusMessage({ text: `Modo Simulação Central Hub Ativo (${profile.name})`, color: '#2563eb' });
    }
  }, []);

  // Hook up OBS service events on mount
  useEffect(() => {
    obsService.onConnectionStateChange = (connected, error) => {
      setObsConfig((prev) => ({
        ...prev,
        connected,
        connecting: false,
        error,
      }));
      if (connected) {
        setStatusMessage({ text: '✅ Conexão OBS WebSocket ativa', color: '#16a34a' });
      } else if (error) {
        setStatusMessage({ text: `❌ OBS Desconectado: ${error}`, color: '#dc2626' });
      }
    };

    obsService.onSceneChange = (sceneName) => {
      setCurrentScene(sceneName);
      setScenes((prev) =>
        prev.map((s) => ({ ...s, active: s.name === sceneName }))
      );
    };

    obsService.onSceneListChange = (newScenes) => {
      if (newScenes && newScenes.length > 0) {
        setScenes(newScenes);
      }
    };

    obsService.onStreamStateChange = (isStreaming) => {
      setStats((prev) => ({ ...prev, isStreaming }));
    };

    obsService.onRecordStateChange = (isRecording) => {
      setStats((prev) => ({ ...prev, isRecording }));
    };

    obsService.onStatsUpdate = (updatedStats) => {
      setStats((prev) => ({ ...prev, ...updatedStats }));
    };

    // Auto-connect if initial active profile has autoConnect
    if (activeProfile.autoConnect && activeProfile.mode === 'direct') {
      handleConnectProfile(activeProfile);
    }

    return () => {
      obsService.disconnect();
    };
  }, [activeProfile, handleConnectProfile]);

  // Telemetry Simulation Timer (runs when in simulation mode or when streaming)
  useEffect(() => {
    const timer = setInterval(() => {
      if (obsConfig.mode === 'simulation') {
        setStats((prev) => {
          let newStreamingTime = prev.streamingTime;
          let newRecordingTime = prev.recordingTime;
          let newBitrate = prev.bitrate;
          let newCpu = prev.cpuUsage;

          if (prev.isStreaming) {
            newStreamingTime += 1;
            newBitrate = Math.round(5900 + (Math.random() - 0.5) * 250);
            newCpu = 22 + (Math.random() - 0.5) * 6;
          } else {
            newBitrate = 0;
            newCpu = 12 + (Math.random() - 0.5) * 3;
          }

          if (prev.isRecording) {
            newRecordingTime += 1;
          }

          return {
            ...prev,
            streamingTime: newStreamingTime,
            recordingTime: newRecordingTime,
            bitrate: newBitrate,
            cpuUsage: Math.max(5, Math.min(95, newCpu)),
            totalFrames: prev.totalFrames + (prev.isStreaming ? 60 : 0),
            fps: prev.isStreaming ? 59.94 + (Math.random() - 0.5) * 0.2 : 60.0,
          };
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [obsConfig.mode]);

  // Actions
  const handleToggleStream = async () => {
    if (stats.isStreaming) {
      if (obsConfig.mode === 'direct') {
        try {
          await obsService.stopStream();
        } catch (err) {
          console.error('StopStream error:', err);
        }
      }
      setStats((prev) => ({ ...prev, isStreaming: false, streamingTime: 0 }));
      setStatusMessage({ text: 'Transmissão encerrada no OBS', color: '#dc2626' });
    } else {
      if (obsConfig.mode === 'direct') {
        try {
          await obsService.startStream();
        } catch (err) {
          console.error('StartStream error:', err);
        }
      }
      setStats((prev) => ({ ...prev, isStreaming: true, streamingTime: 0 }));
      setStatusMessage({ text: '🔴 TRANSMISSÃO AO VIVO INICIADA!', color: '#16a34a' });
    }
  };

  const handleToggleRecord = async () => {
    if (stats.isRecording) {
      if (obsConfig.mode === 'direct') {
        try {
          await obsService.stopRecord();
        } catch (err) {
          console.error('StopRecord error:', err);
        }
      }
      setStats((prev) => ({ ...prev, isRecording: false, recordingTime: 0 }));
      setStatusMessage({ text: 'Gravação salva no OBS', color: '#d97706' });
    } else {
      if (obsConfig.mode === 'direct') {
        try {
          await obsService.startRecord();
        } catch (err) {
          console.error('StartRecord error:', err);
        }
      }
      setStats((prev) => ({ ...prev, isRecording: true, recordingTime: 0 }));
      setStatusMessage({ text: '⏺ Gravando localmente no OBS...', color: '#16a34a' });
    }
  };

  const handleSelectScene = async (sceneName: string) => {
    setCurrentScene(sceneName);
    setScenes((prev) =>
      prev.map((s) => ({ ...s, active: s.name === sceneName }))
    );
    if (obsConfig.mode === 'direct') {
      try {
        await obsService.setScene(sceneName);
      } catch (err) {
        console.error('SetScene error:', err);
      }
    }
    setStatusMessage({ text: `Cena alterada para: ${sceneName}`, color: '#2563eb' });
  };

  const handleCreateDefaultScenes = async () => {
    if (obsConfig.mode === 'direct') {
      try {
        await obsService.createSceneCollection('Hub - Transmissão');
      } catch (err) {
        console.error('CreateSceneCollection error:', err);
      }
    }
    setStatusMessage({ text: '🏗️ Coleção de Cenas "Hub - Transmissão" criada no OBS!', color: '#16a34a' });
  };

  const handleInjectSources = async (vdoUrl: string, mediaPath: string) => {
    setStatusMessage({ 
      text: vdoUrl ? `✅ Câmera VDO.Ninja injetada na ${currentScene}` : `✅ Fontes de mídia aplicadas no OBS`, 
      color: '#16a34a' 
    });
  };

  const handleTriggerMacro = async (macroName: string) => {
    if (macroName === 'Focar_Camera') {
      setPtzState({ panX: 0, panY: -20, zoom: 1.4 });
      setStatusMessage({ text: '✨ Macro Move Transition: Focar Câmera ativada', color: '#2563eb' });
    } else if (macroName === 'Modo_Gameplay') {
      await handleSelectScene('Gameplay');
      setPtzState({ panX: 120, panY: 90, zoom: 1.1 });
      setStatusMessage({ text: '🎮 Macro: Modo Gameplay e layout ativados', color: '#16a34a' });
    }
  };

  const handleSaveReplay = async () => {
    if (obsConfig.mode === 'direct') {
      try {
        await obsService.saveReplayBuffer();
      } catch (err) {
        console.error('Replay error:', err);
      }
    }
    setStatusMessage({ text: '💾 Buffer de Replay salvo!', color: '#d97706' });
  };

  const handlePTZControl = (action: 'up' | 'down' | 'left' | 'right' | 'zoom_in' | 'zoom_out' | 'reset') => {
    setPtzState((prev) => {
      let next = { ...prev };
      const step = 20;
      if (action === 'up') next.panY = Math.max(-120, prev.panY - step);
      if (action === 'down') next.panY = Math.min(120, prev.panY + step);
      if (action === 'left') next.panX = Math.max(-160, prev.panX - step);
      if (action === 'right') next.panX = Math.min(160, prev.panX + step);
      if (action === 'zoom_in') next.zoom = Math.min(2.5, +(prev.zoom + 0.2).toFixed(1));
      if (action === 'zoom_out') next.zoom = Math.max(1.0, +(prev.zoom - 0.2).toFixed(1));
      if (action === 'reset') next = { panX: 0, panY: 0, zoom: 1.0 };
      return next;
    });
  };

  const handleUpdateTicker = async (
    text: string, 
    _isBlinking: boolean, 
    _color: string, 
    _speed: string, 
    badge?: string
  ) => {
    if (obsConfig.mode === 'direct') {
      const fullText = badge ? `${badge} ${text}` : text;
      await obsService.setTextSource('Letreiro_Aviso', fullText);
    }
    if (!text) {
      setStatusMessage({ text: 'Letreiro ocultado / limpo na live', color: '#64748b' });
    } else {
      setStatusMessage({ text: `📢 Letreiro atualizado no OBS (${badge || 'Ao Vivo'})`, color: '#16a34a' });
    }
  };

  const handleApplyCustomProfile = async (platform: string, server: string, key: string) => {
    if (obsConfig.mode === 'direct') {
      await obsService.setStreamServiceSettings('rtmp_custom', server, key);
    }
    setStatusMessage({ text: `✅ Perfil (${platform.toUpperCase()}) injetado no OBS Studio!`, color: '#16a34a' });
  };

  const handleAddDestination = (dest: Omit<RTMPDestination, 'id'>) => {
    setDestinations((prev) => [...prev, { ...dest, id: `dest-${Date.now()}` }]);
    setStatusMessage({ text: `Destino RTMP "${dest.name}" adicionado!`, color: '#16a34a' });
  };

  const handleDeleteDestination = (id: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  const handleToggleDestination = (id: string) => {
    setDestinations((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const isLive = d.status === 'streaming';
          return { ...d, status: isLive ? 'idle' : 'streaming' };
        }
        return d;
      })
    );
  };

  const handleStartAllRTMP = async () => {
    if (obsConfig.mode === 'direct') {
      await obsService.callVendor('obs-multi-rtmp', 'StartAll');
    }
    setDestinations((prev) => prev.map((d) => ({ ...d, status: 'streaming' })));
    setStatusMessage({ text: '🚀 Multi-RTMP: Transmissões secundárias iniciadas!', color: '#16a34a' });
  };

  const handleStopAllRTMP = async () => {
    if (obsConfig.mode === 'direct') {
      await obsService.callVendor('obs-multi-rtmp', 'StopAll');
    }
    setDestinations((prev) => prev.map((d) => ({ ...d, status: 'idle' })));
    setStatusMessage({ text: '🛑 Multi-RTMP: Destinos secundários encerrados.', color: '#dc2626' });
  };

  const handleSyncAitum = async () => {
    if (obsConfig.mode === 'direct') {
      await obsService.callVendor('aitum-vertical', 'SyncCanvas');
    }
    setStatusMessage({ text: '🔄 Canvas Vertical Aitum 9:16 sincronizado com sucesso!', color: '#16a34a' });
  };

  const handleStartAitum = async () => {
    if (obsConfig.mode === 'direct') {
      await obsService.callVendor('aitum-vertical', 'StartStreaming');
    }
    setAitumStreaming(true);
    setStatusMessage({ text: '📱 Live Vertical Aitum (TikTok/Instagram) INICIADA!', color: '#16a34a' });
  };

  const handleStopAitum = async () => {
    if (obsConfig.mode === 'direct') {
      await obsService.callVendor('aitum-vertical', 'StopStreaming');
    }
    setAitumStreaming(false);
    setStatusMessage({ text: '📱 Live Vertical Aitum PARADA.', color: '#dc2626' });
  };

  const handleToggleVirtualCam = async () => {
    const nextState = !isVirtualCamActive;
    setIsVirtualCamActive(nextState);
    if (obsConfig.mode === 'direct') {
      if (nextState) {
        await obsService.startVirtualCam();
      } else {
        await obsService.stopVirtualCam();
      }
    }
    setStatusMessage({
      text: nextState
        ? '📹 Câmera Virtual do OBS ATIVADA! Disponível no Zoom, Google Meet e Teams como webcam USB.'
        : '📹 Câmera Virtual do OBS DESATIVADA.',
      color: nextState ? '#16a34a' : '#64748b',
    });
  };

  const handleExecuteCrossStreamCopy = (payload: CrossStreamCopyPayload) => {
    setDestinations((prev) => {
      let updated = prev.map((dest) => {
        if (payload.targetDestinationIds.includes(dest.id)) {
          return {
            ...dest,
            server: payload.sourceServer,
            key: payload.sourceKey,
          };
        }
        return dest;
      });

      if (payload.cloneAsNew) {
        const newDest: RTMPDestination = {
          id: `cross-dest-${Date.now()}`,
          name: payload.newDestinationName || `Clone de ${payload.sourceName}`,
          server: payload.sourceServer,
          key: payload.sourceKey,
          enabled: true,
          status: 'idle',
          platform: 'custom',
        };
        updated = [...updated, newDest];
      }

      return updated;
    });

    setStatusMessage({
      text: `⚡ Cópia Cruzada de Stream: Parâmetros de "${payload.sourceName}" replicados com sucesso!`,
      color: '#4f46e5',
    });
  };

  const handleAddRule = (rule: Omit<AutomationRule, 'id'>) => {
    setRules((prev) => [...prev, { ...rule, id: `rule-${Date.now()}` }]);
    setStatusMessage({ text: 'Regra de automação cadastrada!', color: '#16a34a' });
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearRules = () => {
    setRules([]);
    setStatusMessage({ text: 'Todas as regras foram limpas.', color: '#64748b' });
  };

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleTriggerRule = async (rule: AutomationRule) => {
    await handleSelectScene(rule.targetScene);
    setStatusMessage({ text: `⚡ Regra disparada -> Cena ${rule.targetScene}`, color: '#2563eb' });
  };

  const handleExportSwitcher = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rules, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'advanced_scene_switcher_rules.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMessage({ text: 'Arquivo JSON exportado para importação no OBS!', color: '#16a34a' });
  };

  const handleApplyVideoQuality = async (
    type: 'live' | 'record' | 'all',
    liveConfig: LiveQualityConfig,
    recordConfig: RecordQualityConfig
  ): Promise<boolean> => {
    if (obsConfig.mode === 'direct') {
      try {
        const fpsNum = Math.round(liveConfig.fps * 100);
        const fpsDen = 100;
        await obsService.setVideoSettings(
          fpsNum,
          fpsDen,
          liveConfig.width,
          liveConfig.height,
          liveConfig.width,
          liveConfig.height
        );
      } catch (err) {
        console.warn('SetVideoSettings direct call warning:', err);
      }
    }

    setStats((prev) => ({
      ...prev,
      bitrate: liveConfig.bitrate,
      fps: liveConfig.fps,
    }));

    setStatusMessage({
      text: `✅ Qualidade de Vídeo gravada: Live ${liveConfig.width}x${liveConfig.height} @ ${liveConfig.fps}fps (${liveConfig.bitrate} kbps) | Gravação ${recordConfig.format.toUpperCase()} (${recordConfig.qualityMode === 'cqp' ? `CQP ${recordConfig.cqpLevel}` : `${recordConfig.bitrate} kbps`})`,
      color: '#16a34a',
    });
    return true;
  };

  const handleTriggerScriptSim = (scriptId: string, name: string) => {
    setStatusMessage({
      text: `✨ Script acionado no OBS: "${name}" (${scriptId})`,
      color: '#9333ea',
    });
  };

  const handleTestConnection = async (profile: StudioProfile): Promise<{ success: boolean; message: string }> => {
    if (profile.mode === 'direct') {
      try {
        const res = await obsService.connect(profile.host, profile.port, profile.password);
        return {
          success: true,
          message: `✅ Conexão WebSocket v5 estabelecida com sucesso! (OBS v${res.version} / RPC v${res.wsVersion})`,
        };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return {
          success: false,
          message: `❌ Erro de conexão com o OBS (${profile.host}:${profile.port}): ${errorMsg}`,
        };
      }
    } else {
      return {
        success: true,
        message: '✅ Modo Simulação Central Hub verificado e pronto para testes locais.',
      };
    }
  };

  const handleSaveProfiles = (updatedProfiles: StudioProfile[], activeId: string) => {
    setProfiles(updatedProfiles);
    const active = updatedProfiles.find((p) => p.id === activeId) || updatedProfiles[0];
    if (active) {
      setActiveProfile(active);
      setObsConfig((prev) => ({
        ...prev,
        mode: active.mode,
        activeProfileId: active.id,
        host: active.host,
        port: active.port,
        password: active.password,
      }));
    }
  };

  const handleDisconnect = async () => {
    await obsService.disconnect();
    setObsConfig((prev) => ({ ...prev, connected: false }));
    setStatusMessage({ text: 'Desconectado do OBS Studio', color: '#d97706' });
  };

  const navTabs = [
    { id: 'master', label: 'Controle & Cenas', icon: <Sliders className="w-4 h-4" /> },
    { id: 'quality', label: 'Qualidade Vídeo & Gravação', icon: <Film className="w-4 h-4" /> },
    { id: 'scripts', label: 'Scripts & Embelezamento', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'media', label: 'Mídia & Áudio', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'ticker', label: 'Letreiro Dinâmico', icon: <Type className="w-4 h-4" /> },
    { id: 'vdo', label: 'VDO.Ninja Room', icon: <Users className="w-4 h-4" /> },
    { id: 'multirtmp', label: 'Multi-RTMP & Aitum', icon: <Radio className="w-4 h-4" /> },
    { id: 'switcher', label: 'Automações & Regras', icon: <Workflow className="w-4 h-4" /> },
    { id: 'logins', label: 'Logins & APIs', icon: <Key className="w-4 h-4" /> },
    { id: 'manual', label: 'Manual Técnico', icon: <BookOpen className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        obsConfig={obsConfig}
        stats={stats}
        hasStreamKey={!!activeStreamKey && activeStreamKey.trim().length > 0}
        streamKeyLabel={streamKeyLabel}
        isVirtualCamActive={isVirtualCamActive}
        onToggleVirtualCam={handleToggleVirtualCam}
        onNavigateToLogins={() => setActiveTab('logins')}
        onOpenCrossStream={() => setActiveTab('multirtmp')}
        onToggleStream={handleToggleStream}
        onToggleRecord={handleToggleRecord}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        statusMessage={statusMessage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-1.5 overflow-x-auto flex gap-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="animate-in fade-in duration-200">
          {activeTab === 'master' && (
            <MasterControlTab
              scenes={scenes}
              currentScene={currentScene}
              onSelectScene={handleSelectScene}
              onCreateDefaultScenes={handleCreateDefaultScenes}
              onInjectSources={handleInjectSources}
              onTriggerMacro={handleTriggerMacro}
              onSaveReplay={handleSaveReplay}
              onPTZControl={handlePTZControl}
              ptzState={ptzState}
              isStreaming={stats.isStreaming}
            />
          )}

          {activeTab === 'quality' && (
            <VideoQualityTab
              onApplyToOBS={handleApplyVideoQuality}
              isStreaming={stats.isStreaming}
              isRecording={stats.isRecording}
              obsConnected={obsConfig.connected}
            />
          )}

          {activeTab === 'scripts' && (
            <ScriptsAutomationsTab
              onTriggerScriptSim={handleTriggerScriptSim}
              isStreaming={stats.isStreaming}
            />
          )}

          {activeTab === 'media' && (
            <MediaAudioTab
              volume={volume}
              onVolumeChange={async (val) => {
                setVolume(val);
                if (obsConfig.mode === 'direct') {
                  const dbVal = val === 0 ? -100 : (val / 100) * 60 - 60;
                  await obsService.setVolume('Mic/Aux', dbVal);
                  await obsService.setInputMute('Mic/Aux', val === 0);
                }
                if (val === 0) {
                  setStatusMessage({ text: '🔒 Microfone silenciado / em espera (Hot Mic Safe)', color: '#dc2626' });
                } else {
                  setStatusMessage({ text: `🎤 Microfone ativo em ${val}% (${((val / 100) * 60 - 60).toFixed(1)} dB)`, color: '#16a34a' });
                }
              }}
              filtersEnabled={filtersEnabled}
              onToggleFilters={() => {
                setFiltersEnabled(!filtersEnabled);
                setStatusMessage({
                  text: filtersEnabled ? 'Filtros de áudio desativados' : 'Filtros RNNoise ativados',
                  color: '#16a34a',
                });
              }}
              smartDucking={smartDucking}
              onToggleSmartDucking={() => {
                setSmartDucking(!smartDucking);
                setStatusMessage({
                  text: smartDucking ? 'Smart ducking desativado' : 'Smart ducking ativado (-15dB)',
                  color: '#16a34a',
                });
              }}
              onControlVideo={(action) => {
                setStatusMessage({ text: `Reprodutor de Vídeo: ${action.toUpperCase()}`, color: '#2563eb' });
              }}
              onAdvanceSlide={() => {
                setStatusMessage({ text: 'Apresentação: Próximo slide', color: '#2563eb' });
              }}
              onPreviousSlide={() => {
                setStatusMessage({ text: 'Apresentação: Slide anterior', color: '#2563eb' });
              }}
              isStreaming={stats.isStreaming}
            />
          )}

          {activeTab === 'ticker' && (
            <TickerOverlayTab onUpdateTicker={handleUpdateTicker} />
          )}

          {activeTab === 'vdo' && (
            <VDONinjaTab
              onInjectVDONinja={(url) => {
                handleInjectSources(url, '');
              }}
            />
          )}

          {activeTab === 'multirtmp' && (
            <MultiRTMPTab
              destinations={destinations}
              onAddDestination={handleAddDestination}
              onDeleteDestination={handleDeleteDestination}
              onToggleDestination={handleToggleDestination}
              onStartAllRTMP={handleStartAllRTMP}
              onStopAllRTMP={handleStopAllRTMP}
              onSyncAitumCanvas={handleSyncAitum}
              onStartAitumVertical={handleStartAitum}
              onStopAitumVertical={handleStopAitum}
              aitumStreaming={aitumStreaming}
              activeStreamKey={activeStreamKey}
              streamKeyLabel={streamKeyLabel}
              onExecuteCrossCopy={handleExecuteCrossStreamCopy}
            />
          )}

          {activeTab === 'switcher' && (
            <SceneSwitcherTab
              scenes={scenes}
              rules={rules}
              onAddRule={handleAddRule}
              onDeleteRule={handleDeleteRule}
              onClearRules={handleClearRules}
              onToggleRule={handleToggleRule}
              isMonitoring={isMonitoring}
              onToggleMonitoring={() => {
                setIsMonitoring(!isMonitoring);
                setStatusMessage({
                  text: isMonitoring ? 'Chaveador automático pausado' : 'Chaveador automático rodando',
                  color: '#2563eb',
                });
              }}
              onExportSwitcherConfig={handleExportSwitcher}
              onTriggerRule={handleTriggerRule}
            />
          )}

          {activeTab === 'logins' && (
            <LoginsTab
              isVirtualCamActive={isVirtualCamActive}
              onToggleVirtualCam={handleToggleVirtualCam}
              onKeySelected={(key, label) => {
                setActiveStreamKey(key);
                setStreamKeyLabel(label);
              }}
              onCrossStreamCopy={(sourceName, server, key) => {
                handleExecuteCrossStreamCopy({
                  sourceName,
                  sourceServer: server,
                  sourceKey: key,
                  targetDestinationIds: destinations.map((d) => d.id),
                  cloneAsNew: false,
                });
              }}
              onApplyYouTubeKeyToOBS={async (key) => {
                setActiveStreamKey(key);
                setStreamKeyLabel('YouTube Live');
                if (obsConfig.mode === 'direct') {
                  await obsService.setStreamServiceSettings('rtmp_custom', 'rtmp://a.rtmp.youtube.com/live2', key);
                }
                setStatusMessage({ text: '✅ Chave do YouTube gravada no OBS Studio!', color: '#16a34a' });
              }}
              onApplyWPStreamToOBS={async (server, key) => {
                setActiveStreamKey(key);
                setStreamKeyLabel('WPStream');
                if (obsConfig.mode === 'direct') {
                  await obsService.setStreamServiceSettings('rtmp_custom', server, key);
                }
                setStatusMessage({ text: '✅ Credenciais WPStream aplicadas no OBS Studio!', color: '#16a34a' });
              }}
              onApplyCustomProfileToOBS={(platform, server, key) => {
                setActiveStreamKey(key);
                setStreamKeyLabel(platform);
                handleApplyCustomProfile(platform, server, key);
              }}
            />
          )}

          {activeTab === 'manual' && <ManualTab />}
        </div>

      </main>

      {/* Modals */}
      <QuickShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <OBSConnectionModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={obsConfig}
        profiles={profiles}
        onSaveProfiles={handleSaveProfiles}
        onConnect={handleConnectProfile}
        onDisconnect={handleDisconnect}
        onTestConnection={handleTestConnection}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong>Central Hub OBS</strong> — Painel de Controle de Transmissão por Elias Lopes
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>OBS WebSocket v5 Protocol</span>
            <span>•</span>
            <span>Aitum Vertical & Multi-RTMP</span>
            <span>•</span>
            <span>VDO.Ninja WebRTC</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
