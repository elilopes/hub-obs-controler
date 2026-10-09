import React, { useState } from 'react';
import { 
  Radio, 
  Smartphone, 
  Plus, 
  Trash2, 
  Play, 
  Square, 
  RefreshCw, 
  Layers, 
  Check, 
  Share2, 
  ShieldCheck, 
  ExternalLink,
  Tv2,
  Copy,
  X,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { RTMPDestination, CrossStreamCopyPayload } from '../types';

interface MultiRTMPTabProps {
  destinations: RTMPDestination[];
  onAddDestination: (dest: Omit<RTMPDestination, 'id'>) => void;
  onDeleteDestination: (id: string) => void;
  onToggleDestination: (id: string) => void;
  onStartAllRTMP: () => void;
  onStopAllRTMP: () => void;
  onSyncAitumCanvas: () => void;
  onStartAitumVertical: () => void;
  onStopAitumVertical: () => void;
  aitumStreaming: boolean;
  activeStreamKey?: string;
  streamKeyLabel?: string;
  onExecuteCrossCopy?: (payload: CrossStreamCopyPayload) => void;
}

export const MultiRTMPTab: React.FC<MultiRTMPTabProps> = ({
  destinations,
  onAddDestination,
  onDeleteDestination,
  onToggleDestination,
  onStartAllRTMP,
  onStopAllRTMP,
  onSyncAitumCanvas,
  onStartAitumVertical,
  onStopAitumVertical,
  aitumStreaming,
  activeStreamKey = 'cgwr-kmv8-11fh-aaws-a51r',
  streamKeyLabel = 'YouTube Live Principal',
  onExecuteCrossCopy,
}) => {
  const [name, setName] = useState('');
  const [server, setServer] = useState('');
  const [key, setKey] = useState('');
  const [platform, setPlatform] = useState<RTMPDestination['platform']>('twitch');
  const [isSyncing, setIsSyncing] = useState(false);

  // Cross-Stream Copy Modal State
  const [isCrossModalOpen, setIsCrossModalOpen] = useState(false);
  const [crossSource, setCrossSource] = useState<'hub_active' | 'youtube' | 'instagram' | 'custom'>('hub_active');
  const [customCrossServer, setCustomCrossServer] = useState('');
  const [customCrossKey, setCustomCrossKey] = useState('');
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  const [cloneAsNew, setCloneAsNew] = useState(false);
  const [newCloneName, setNewCloneName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [crossFeedback, setCrossFeedback] = useState<string | null>(null);

  const getSourceDetails = () => {
    if (crossSource === 'youtube') {
      return {
        name: 'YouTube Live (Google OAuth2)',
        platform: 'youtube',
        server: 'rtmp://a.rtmp.youtube.com/live2',
        key: 'cgwr-kmv8-11fh-aaws-a51r',
      };
    }
    if (crossSource === 'instagram') {
      return {
        name: 'Instagram Live (Meta RTMPS)',
        platform: 'instagram',
        server: 'rtmps://live-upload.instagram.com:443/rtmp/',
        key: 'live_891234710293_mX9aB8c7D6e5F4g3H2',
      };
    }
    if (crossSource === 'custom') {
      return {
        name: 'Servidor / Perfil Customizado',
        platform: 'custom',
        server: customCrossServer || 'rtmp://localhost/live',
        key: customCrossKey || 'stream_custom_key_relay',
      };
    }
    return {
      name: streamKeyLabel || 'Transmissão Ativa no Hub',
      platform: 'youtube',
      server: 'rtmp://a.rtmp.youtube.com/live2',
      key: activeStreamKey || 'cgwr-kmv8-11fh-aaws-a51r',
    };
  };

  const handleOpenCrossStreamModal = () => {
    // Inicializar alvos com todos os destinos existentes
    setSelectedTargetIds(destinations.map(d => d.id));
    setIsCrossModalOpen(true);
    setCrossFeedback(null);
  };

  const handleOpenCrossForSingle = (dest: RTMPDestination) => {
    setSelectedTargetIds([dest.id]);
    setIsCrossModalOpen(true);
    setCrossFeedback(null);
  };

  const toggleTargetId = (id: string) => {
    setSelectedTargetIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleConfirmCrossCopy = () => {
    const src = getSourceDetails();
    if (onExecuteCrossCopy) {
      onExecuteCrossCopy({
        sourceName: src.name,
        sourcePlatform: src.platform,
        sourceServer: src.server,
        sourceKey: src.key,
        targetDestinationIds: selectedTargetIds,
        cloneAsNew,
        newDestinationName: newCloneName || `Clone de ${src.name}`,
      });
    } else {
      if (cloneAsNew) {
        onAddDestination({
          name: newCloneName || `Clone de ${src.name}`,
          server: src.server,
          key: src.key,
          enabled: true,
          status: 'idle',
          platform: 'custom',
        });
      }
    }

    setCrossFeedback(`Cópia Cruzada realizada! Configurações de "${src.name}" propagadas para ${selectedTargetIds.length + (cloneAsNew ? 1 : 0)} destino(s).`);
    setTimeout(() => {
      setCrossFeedback(null);
      setIsCrossModalOpen(false);
    }, 1800);
  };

  const handleCopyFullRtmpUrl = () => {
    const src = getSourceDetails();
    const fullUrl = `${src.server.replace(/\/$/, '')}/${src.key}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !server.trim() || !key.trim()) return;

    onAddDestination({
      name,
      server,
      key,
      enabled: true,
      status: 'idle',
      platform,
    });

    setName('');
    setServer('');
    setKey('');
  };

  const handleSyncAitum = () => {
    setIsSyncing(true);
    onSyncAitumCanvas();
    setTimeout(() => setIsSyncing(false), 1500);
  };

  const activeCount = destinations.filter((d) => d.status === 'streaming').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Sorayuki Multi-RTMP Destinations (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 text-base">Multi-RTMP (Transmissão Simultânea)</h2>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
              {activeCount} de {destinations.length} Ativos
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-5">
            Gerencie múltiplos destinos RTMP simultâneos (Twitch, Kick, Facebook, YouTube Secundário) integrados ao plugin Sorayuki.
          </p>

          {/* Master Multi-RTMP Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-5">
            <button
              onClick={onStartAllRTMP}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Iniciar Todos os RTMP</span>
            </button>

            <button
              onClick={onStopAllRTMP}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Parar Todos os RTMP</span>
            </button>

            {/* BOTÃO EM DESTAQUE: CÓPIA CRUZADA DE STREAM */}
            <button
              onClick={handleOpenCrossStreamModal}
              className="py-2.5 px-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center justify-center gap-2 shrink-0"
              title="Cópia Cruzada de Stream: Replicar parâmetros de transmissão entre múltiplos destinos RTMP"
            >
              <Share2 className="w-4 h-4" />
              <span>Cópia Cruzada de Stream</span>
            </button>
          </div>

          {/* Destination List */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Destinos Configurados ({destinations.length})
              </h3>
              <button
                onClick={handleOpenCrossStreamModal}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" />
                <span>Clonar para múltiplos canais</span>
              </button>
            </div>

            {destinations.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-xs text-slate-500">
                Nenhum destino RTMP adicionado. Cadastre um abaixo.
              </div>
            ) : (
              destinations.map((dest) => (
                <div
                  key={dest.id}
                  className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 transition ${
                    dest.status === 'streaming'
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        dest.status === 'streaming' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{dest.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs sm:max-w-sm">
                        {dest.server}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenCrossForSingle(dest)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 rounded hover:bg-indigo-50 border border-slate-200 bg-white transition"
                      title="Cópia Cruzada direta para este destino"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleDestination(dest.id)}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                        dest.status === 'streaming'
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {dest.status === 'streaming' ? 'Parar' : 'Iniciar'}
                    </button>
                    <button
                      onClick={() => onDeleteDestination(dest.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                      title="Excluir Destino"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Destination Form */}
          <form onSubmit={handleAdd} className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              Adicionar Novo Destino RTMP
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Canal</label>
                <input
                  type="text"
                  placeholder="Ex: Twitch Oficial, Kick Principal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plataforma</label>
                <select
                  value={platform}
                  onChange={(e) => {
                    const plat = e.target.value as RTMPDestination['platform'];
                    setPlatform(plat);
                    if (plat === 'twitch') setServer('rtmp://live.twitch.tv/app');
                    if (plat === 'kick') setServer('rtmps://fa723ac112e3.global-contribute.live-video.net:443/app');
                    if (plat === 'facebook') setServer('rtmps://live-api-s.facebook.com:443/rtmp/');
                    if (plat === 'youtube') setServer('rtmp://a.rtmp.youtube.com/live2');
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="twitch">Twitch</option>
                  <option value="kick">Kick</option>
                  <option value="facebook">Facebook Live</option>
                  <option value="youtube">YouTube Secundário</option>
                  <option value="custom">Servidor Customizado / RTMP Privado</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">URL do Servidor RTMP</label>
                <input
                  type="text"
                  placeholder="rtmp://live.twitch.tv/app"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Chave de Transmissão (Stream Key)</label>
                <input
                  type="password"
                  placeholder="live_xxxxxxxxx"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Salvar Destino no Painel</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Right Column: Aitum Vertical (TikTok / Reels 9:16 Canvas) (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800 text-base">Aitum Vertical (TikTok & Reels)</h2>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                aitumStreaming
                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {aitumStreaming && <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />}
              {aitumStreaming ? 'Vertical AO VIVO' : 'Vertical Offline'}
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Sincroniza e transmite a tela em proporção vertical 9:16 (1080x1920) diretamente para TikTok, Instagram e Shorts.
          </p>

          {/* 9:16 Canvas Mockup Frame */}
          <div className="flex justify-center my-4">
            <div className="relative w-44 aspect-[9/16] bg-slate-950 rounded-2xl border-4 border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between p-3 text-white">
              <div className="flex justify-between items-center text-[9px] text-slate-400">
                <span>Canvas 9:16</span>
                <span className="bg-indigo-600/60 px-1 rounded text-white">Aitum</span>
              </div>

              {/* Centered Mock Cam */}
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/80 mx-auto mb-2 flex items-center justify-center text-xs font-bold">
                  Cam
                </div>
                <span className="text-[10px] text-slate-300 font-semibold block">Enquadramento Vertical</span>
                <span className="text-[9px] text-slate-500">Auto-Crop 1080x1920</span>
              </div>

              <div className="bg-black/80 rounded p-1.5 text-center text-[9px] font-mono text-emerald-400">
                {aitumStreaming ? '● STREAMING TIKTOK' : '○ CANVAS SINCRONIZADO'}
              </div>
            </div>
          </div>

          {/* Aitum Actions */}
          <div className="space-y-2.5">
            <button
              onClick={handleSyncAitum}
              disabled={isSyncing}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition border border-slate-300 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando Resolução...' : 'Sincronizar Canvas Vertical (Aitum)'}</span>
            </button>

            {aitumStreaming ? (
              <button
                onClick={onStopAitumVertical}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Parar Transmissão Vertical</span>
              </button>
            ) : (
              <button
                onClick={onStartAitumVertical}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Live Vertical (TikTok/Reels)</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* MODAL ASSISTENTE: CÓPIA CRUZADA DE STREAM */}
      {isCrossModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Share2 className="w-5 h-5 text-indigo-200" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base leading-tight">
                    Cópia Cruzada de Stream (Multi-RTMP Relay)
                  </h3>
                  <p className="text-[11px] text-blue-200">
                    Replique a transmissão primária do OBS para múltiplos canais simultâneos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCrossModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Passo 1: Selecionar Origem da Cópia */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800 text-xs">
                  1. Selecione a Origem do Sinal (Fonte da Transmissão):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setCrossSource('hub_active')}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      crossSource === 'hub_active'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-[11px]">Stream Ativo</span>
                    <span className="text-[10px] text-slate-500 truncate font-mono">OBS Principal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCrossSource('youtube')}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      crossSource === 'youtube'
                        ? 'bg-red-50 border-red-600 text-red-900 ring-2 ring-red-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-[11px] text-red-600">YouTube Live</span>
                    <span className="text-[10px] text-slate-500 truncate font-mono">Google OAuth2</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCrossSource('instagram')}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      crossSource === 'instagram'
                        ? 'bg-pink-50 border-pink-600 text-pink-900 ring-2 ring-pink-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-[11px] text-pink-600">Instagram Live</span>
                    <span className="text-[10px] text-slate-500 truncate font-mono">Meta Producer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCrossSource('custom')}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      crossSource === 'custom'
                        ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-[11px]">Personalizado</span>
                    <span className="text-[10px] text-slate-500 truncate font-mono">Outro RTMP</span>
                  </button>
                </div>
              </div>

              {/* Informações da Origem Escolhida */}
              {crossSource === 'custom' ? (
                <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-200 space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Servidor RTMP Origem:</label>
                    <input
                      type="text"
                      placeholder="rtmp://localhost/live"
                      value={customCrossServer}
                      onChange={(e) => setCustomCrossServer(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Chave de Stream Origem:</label>
                    <input
                      type="password"
                      placeholder="stream_key"
                      value={customCrossKey}
                      onChange={(e) => setCustomCrossKey(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 text-[11px]">Parâmetros de Transmissão que serão Replicados:</span>
                    <button
                      onClick={handleCopyFullRtmpUrl}
                      className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copiado!' : 'Copiar URL RTMP Completa'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Origem:</span>
                      <strong className="text-slate-800 truncate block">{getSourceDetails().name}</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Chave de Stream:</span>
                      <strong className="text-slate-800 font-mono truncate block">{getSourceDetails().key}</strong>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 truncate">
                    Servidor: {getSourceDetails().server}
                  </div>
                </div>
              )}

              {/* Passo 2: Destinos Alvo da Cópia Cruzada */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs">
                    2. Selecione os Destinos que Receberão a Cópia Cruzada:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedTargetIds.length === destinations.length) {
                        setSelectedTargetIds([]);
                      } else {
                        setSelectedTargetIds(destinations.map(d => d.id));
                      }
                    }}
                    className="text-[11px] text-indigo-600 hover:underline font-semibold"
                  >
                    {selectedTargetIds.length === destinations.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {destinations.length === 0 ? (
                    <p className="text-slate-400 italic py-2">Nenhum destino RTMP cadastrado ainda.</p>
                  ) : (
                    destinations.map((dest) => (
                      <label
                        key={dest.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition ${
                          selectedTargetIds.includes(dest.id)
                            ? 'bg-indigo-50/70 border-indigo-300 text-indigo-900'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedTargetIds.includes(dest.id)}
                            onChange={() => toggleTargetId(dest.id)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <span className="font-bold block text-xs">{dest.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono truncate block max-w-xs">{dest.server}</span>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">{dest.platform || 'rtmp'}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Opção Extra: Clonar como Novo Destino */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 text-xs">
                  <input
                    type="checkbox"
                    checked={cloneAsNew}
                    onChange={(e) => setCloneAsNew(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Criar também um novo destino clonado no painel</span>
                </label>
                {cloneAsNew && (
                  <input
                    type="text"
                    placeholder={`Ex: Espelho de ${getSourceDetails().name}`}
                    value={newCloneName}
                    onChange={(e) => setNewCloneName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  />
                )}
              </div>

              {/* Feedback visual de sucesso */}
              {crossFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{crossFeedback}</span>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsCrossModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 transition"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmCrossCopy}
                disabled={selectedTargetIds.length === 0 && !cloneAsNew}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-lg transition shadow flex items-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Executar Cópia Cruzada ({selectedTargetIds.length + (cloneAsNew ? 1 : 0)} destino(s))</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
