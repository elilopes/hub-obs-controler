import React, { useState } from 'react';
import { 
  Radio, 
  CircleDot, 
  Activity, 
  Cpu, 
  Tv, 
  Share2, 
  Play, 
  Square, 
  Disc, 
  Server, 
  Wifi, 
  WifiOff, 
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Video
} from 'lucide-react';
import { OBSConnectionConfig, StreamStats } from '../types';

interface HeaderProps {
  obsConfig: OBSConnectionConfig;
  lang?: "pt" | "en";
  onToggleLang?: () => void;
  stats: StreamStats;
  hasStreamKey?: boolean;
  streamKeyLabel?: string;
  isVirtualCamActive?: boolean;
  onNavigateToLogins?: () => void;
  onOpenCrossStream?: () => void;
  onToggleVirtualCam?: () => void;
  onToggleStream: () => void;
  onToggleRecord: () => void;
  onOpenShareModal: () => void;
  onOpenSettingsModal: () => void;
  statusMessage: { text: string; color: string };
}

export const Header: React.FC<HeaderProps> = ({
  obsConfig,
  stats,
  hasStreamKey = true,
  streamKeyLabel = 'YouTube / Padrão',
  isVirtualCamActive = false,
  lang = "pt",
  onToggleLang,
  onNavigateToLogins,
  onOpenCrossStream,
  onToggleVirtualCam,
  onToggleStream,
  onToggleRecord,
  onOpenShareModal,
  onOpenSettingsModal,
  statusMessage,
}) => {
  const [isTelemetryCollapsed, setIsTelemetryCollapsed] = useState(true);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-40">
      {/* Top Banner with Branding & Global Switches */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          
          {/* Logo & OBS Status */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start flex-wrap">
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-white whitespace-nowrap">
                Central Hub OBS
              </h1>
            </div>

            {/* 4 LEDs de Status: OBS, STREAM KEY, LIVE, REC */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* LED 1: OBS ON / OFF */}
              <button
                type="button"
                onClick={onOpenSettingsModal}
                className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                  obsConfig.connected
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900 shadow-sm shadow-emerald-950'
                    : 'bg-rose-950/80 border-rose-500/50 text-rose-300 hover:bg-rose-900'
                }`}
                title="Status da Conexão com OBS Studio (Clique para configurar)"
              >
                <span className="relative flex h-2 w-2">
                  {obsConfig.connected && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${obsConfig.connected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                </span>
                <span>{obsConfig.connected ? 'obs on' : 'obs off'}</span>
              </button>

              {/* LED 2: LIVE ON / OFF */}
              <div
                className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                  stats.isStreaming
                    ? 'bg-rose-950/90 border-rose-500/60 text-rose-300 shadow-sm shadow-rose-950 animate-pulse'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-400'
                }`}
                title="Status da Transmissão de Vídeo (Streaming)"
              >
                <span className="relative flex h-2 w-2">
                  {stats.isStreaming && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${stats.isStreaming ? 'bg-rose-500' : 'bg-slate-500'}`}></span>
                </span>
                <span>{stats.isStreaming ? 'live on' : 'live off'}</span>
              </div>

              {/* LED 4: REC ON / OFF */}
              <div
                className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                  stats.isRecording
                    ? 'bg-amber-950/90 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-950 animate-pulse'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-400'
                }`}
                title="Status da Gravação Local (Recording)"
              >
                <span className="relative flex h-2 w-2">
                  {stats.isRecording && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${stats.isRecording ? 'bg-amber-500' : 'bg-slate-500'}`}></span>
                </span>
                <span>{stats.isRecording ? 'rec on' : 'rec off'}</span>
              </div>
            </div>
          </div>

          {/* Master Live Switches */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
            {/* Share Link Button */}
            <button
              onClick={onOpenShareModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] md:text-xs font-semibold transition"
              title="Compartilhar Link da Live"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Links Rápidos</span>
            </button>

            {/* Cross-Stream Copy Shortcut */}
            {onOpenCrossStream && (
              <button
                onClick={onOpenCrossStream}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 text-[11px] md:text-xs font-semibold transition shadow-xs"
                title="Cópia Cruzada de Stream: Replicar transmissão primária para destinos simultâneos"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cópia Cruzada</span>
              </button>
            )}

            {/* Virtual Cam Switch (Zoom, Meet, Teams) */}
            {onToggleVirtualCam && (
              <button
                onClick={onToggleVirtualCam}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] md:text-xs font-semibold transition border ${
                  isVirtualCamActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-sm animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Câmera Virtual do OBS: Envia imagem das cenas para Zoom, Google Meet e Teams como webcam"
              >
                <Video className={`w-3.5 h-3.5 ${isVirtualCamActive ? 'text-white' : 'text-emerald-400'}`} />
                <span>{isVirtualCamActive ? 'CAM VIRTUAL ON' : 'CAM VIRTUAL'}</span>
              </button>
            )}

            {/* Record Switch */}
            <button
              onClick={onToggleRecord}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] md:text-xs font-bold transition shadow-sm ${
                stats.isRecording
                  ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {stats.isRecording ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>PARAR ({formatTime(stats.recordingTime)})</span>
                </>
              ) : (
                <>
                  <Disc className="w-3.5 h-3.5 text-amber-400" />
                  <span>GRAVAR OBS</span>
                </>
              )}
            </button>

            {/* Main Stream Switch */}
            <button
              onClick={onToggleStream}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] md:text-xs font-bold transition shadow-md ${
                stats.isStreaming
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-live'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {stats.isStreaming ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>PARAR LIVE ({formatTime(stats.streamingTime)})</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>INICIAR LIVE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Toggle Telemetry Button on Mobile */}
        <div className="md:hidden flex justify-center border-t border-slate-800/60 py-2">
          <button
            type="button"
            onClick={() => setIsTelemetryCollapsed(!isTelemetryCollapsed)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 border border-slate-700/50 px-3 py-1.5 rounded-md transition"
          >
            {isTelemetryCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            <span>{isTelemetryCollapsed ? 'Mostrar Painel de Status' : 'Ocultar Painel de Status'}</span>
          </button>
        </div>

        {/* Live Aggregator Telemetry Bar (CPU, Bitrate, FPS, Status) */}
        <div className={`${isTelemetryCollapsed ? 'hidden' : 'grid'} md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 py-2 border-t border-slate-800 text-xs text-slate-300`}>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2 bg-slate-800/60 rounded px-2.5 py-1.5 border border-slate-700/50">
            <Radio className={`w-3.5 h-3.5 ${stats.isStreaming ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
            <div>
              <span className="text-[10px] uppercase text-slate-400 block leading-tight">Status Live</span>
              <span className={`font-semibold ${stats.isStreaming ? 'text-rose-400' : 'text-slate-400'}`}>
                {stats.isStreaming ? 'AO VIVO' : 'OFFLINE'}
              </span>
            </div>
          </div>

          {/* Bitrate */}
          <div className="flex items-center gap-2 bg-slate-800/60 rounded px-2.5 py-1.5 border border-slate-700/50">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 block leading-tight">Bitrate</span>
              <span className="font-semibold text-slate-200">
                {stats.isStreaming ? `${stats.bitrate} kbps` : '0 kbps'}
              </span>
            </div>
          </div>

          {/* FPS */}
          <div className="flex items-center gap-2 bg-slate-800/60 rounded px-2.5 py-1.5 border border-slate-700/50">
            <Tv className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 block leading-tight">FPS Saída</span>
              <span className="font-semibold text-slate-200">{stats.fps.toFixed(1)} fps</span>
            </div>
          </div>

          {/* CPU Usage */}
          <div className="flex items-center gap-2 bg-slate-800/60 rounded px-2.5 py-1.5 border border-slate-700/50">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 block leading-tight">Uso CPU</span>
              <span className={`font-semibold ${stats.cpuUsage > 70 ? 'text-rose-400' : 'text-slate-200'}`}>
                {stats.cpuUsage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Dropped Frames */}
          <div className="flex items-center gap-2 bg-slate-800/60 rounded px-2.5 py-1.5 border border-slate-700/50">
            <CircleDot className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 block leading-tight">Quadros Perdidos</span>
              <span className="font-semibold text-slate-200">
                {stats.droppedFrames} ({stats.totalFrames > 0 ? ((stats.droppedFrames / stats.totalFrames) * 100).toFixed(2) : '0.00'}%)
              </span>
            </div>
          </div>

          {/* Live Message Feedback */}
          <div className="flex items-center gap-2 bg-slate-800/60 rounded px-2.5 py-1.5 border border-slate-700/50 truncate">
            <Server className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] uppercase text-slate-400 block leading-tight">Console OBS</span>
              <span className="font-semibold truncate text-[11px]" style={{ color: statusMessage.color }}>
                {statusMessage.text}
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
