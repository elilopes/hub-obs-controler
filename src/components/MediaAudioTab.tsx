import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sliders, 
  Play, 
  Pause, 
  RotateCcw, 
  Tv, 
  Presentation, 
  ChevronRight, 
  ChevronLeft, 
  Music, 
  ShieldCheck, 
  Mic, 
  MicOff,
  Lock,
  Unlock,
  AlertCircle,
  Sparkles,
  FileVideo,
  Headphones,
  Radio,
  Layers,
  Settings2,
  Activity,
  Check
} from 'lucide-react';

interface MediaAudioTabProps {
  volume: number;
  onVolumeChange: (newVol: number) => void;
  filtersEnabled: boolean;
  onToggleFilters: () => void;
  smartDucking: boolean;
  onToggleSmartDucking: () => void;
  onControlVideo: (action: 'play' | 'pause' | 'restart') => void;
  onAdvanceSlide: () => void;
  onPreviousSlide: () => void;
  isStreaming?: boolean;
}

export const MediaAudioTab: React.FC<MediaAudioTabProps> = ({
  volume,
  onVolumeChange,
  filtersEnabled,
  onToggleFilters,
  smartDucking,
  onToggleSmartDucking,
  onControlVideo,
  onAdvanceSlide,
  onPreviousSlide,
  isStreaming = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(34);
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 12;
  const [meterLevel, setMeterLevel] = useState(65);

  // Audio Monitor States
  const [monitorDevice, setMonitorDevice] = useState<'headphones' | 'virtual_cable' | 'zoom_teams'>('zoom_teams');
  const [monitorTrack, setMonitorTrack] = useState<number>(1);
  const [eqLow, setEqLow] = useState<number>(0);
  const [eqMid, setEqMid] = useState<number>(1);
  const [eqHigh, setEqHigh] = useState<number>(2);
  const [compressorThreshold, setCompressorThreshold] = useState<number>(-18);
  const [compressorRatio, setCompressorRatio] = useState<number>(4);
  const [compressorAttack, setCompressorAttack] = useState<number>(6);
  const [compressorRelease, setCompressorRelease] = useState<number>(60);
  const [isAudioMonitorActive, setIsAudioMonitorActive] = useState<boolean>(true);
  const [audioNotification, setAudioNotification] = useState<string | null>(null);

  const showAudioNotification = (msg: string) => {
    setAudioNotification(msg);
    setTimeout(() => setAudioNotification(null), 3500);
  };

  // Simulated audio level bounce
  useEffect(() => {
    const interval = setInterval(() => {
      const base = volume * 0.7;
      const noise = (Math.random() - 0.5) * 15;
      const nextLevel = Math.max(0, Math.min(100, base + noise));
      setMeterLevel(nextLevel);
    }, 200);
    return () => clearInterval(interval);
  }, [volume]);

  const handleVideoAction = (action: 'play' | 'pause' | 'restart') => {
    if (action === 'play') setIsPlaying(true);
    if (action === 'pause') setIsPlaying(false);
    if (action === 'restart') {
      setVideoProgress(0);
      setIsPlaying(true);
    }
    onControlVideo(action);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides ? prev + 1 : 1));
    onAdvanceSlide();
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 1 ? prev - 1 : totalSlides));
    onPreviousSlide();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Audio Mixing & Advanced Filters (6 Cols) */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Master Audio Mixing Console */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {volume === 0 ? (
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                  <MicOff className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <Mic className="w-5 h-5" />
                </div>
              )}
              <div>
                <h2 className="font-bold text-slate-800 text-base">Mixer de Áudio Master (Microfone / Linha)</h2>
                <span className="text-[11px] text-slate-500">Canal de voz principal conectado ao OBS Studio</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                volume === 0 
                  ? 'bg-rose-50 border-rose-300 text-rose-700' 
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${volume === 0 ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                <span>{volume === 0 ? '🔒 Microfone Desativado' : '🔴 Microfone Ativo'}</span>
              </span>

              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded text-slate-700">
                {volume === 0 ? '-inf dB (Mudo)' : `${((volume / 100) * 60 - 60).toFixed(1)} dB`}
              </span>
            </div>
          </div>

          {/* Hot Mic Prevention Security Notice */}
          <div className="mb-4 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-bold block">Proteção Ativa contra Hot Mic (Vazamento de Voz):</strong>
              <p className="text-[11px] text-amber-800">
                O microfone <strong>NÃO é ativado automaticamente</strong> ao abrir a página, conectar no OBS ou iniciar a live. Para transmitir seu áudio, clique no botão <strong>"Ativar Microfone"</strong> abaixo quando estiver pronto.
              </p>
            </div>
          </div>

          {/* Quick Activate / Mute Action Button */}
          <div className="mb-4 flex items-center gap-3">
            {volume === 0 ? (
              <button
                onClick={() => onVolumeChange(80)}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>🔓 Ativar Microfone / Abrir Canal de Voz (80%)</span>
              </button>
            ) : (
              <button
                onClick={() => onVolumeChange(0)}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
              >
                <MicOff className="w-4 h-4" />
                <span>🔒 Desativar / Mutar Microfone Imediatamente</span>
              </button>
            )}

            <button
              onClick={() => onVolumeChange(volume === 0 ? 80 : 0)}
              className={`p-2.5 rounded-lg border transition ${
                volume === 0
                  ? 'bg-rose-100 border-rose-300 text-rose-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={volume === 0 ? 'Desmutar' : 'Mutar'}
            >
              {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Volume Slider & Level Meter */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-600 w-16">Fader:</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <span className="text-xs font-bold text-slate-700 w-10 text-right">{volume}%</span>
            </div>

            {/* Stereo Audio VU-Meter */}
            <div className="bg-slate-900 rounded-lg p-3 space-y-1.5 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Canal L/R {volume === 0 && '(MUDO - CANAL SILENCIADO)'}</span>
                <span>-60dB &nbsp; -40dB &nbsp; -20dB &nbsp; -6dB &nbsp; 0dB</span>
              </div>
              
              {/* Meter Bar L */}
              <div className="h-3 w-full bg-slate-800 rounded-sm overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-100 ease-out"
                  style={{ width: `${volume > 0 ? meterLevel : 0}%` }}
                />
              </div>

              {/* Meter Bar R */}
              <div className="h-3 w-full bg-slate-800 rounded-sm overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-100 ease-out"
                  style={{ width: `${volume > 0 ? Math.max(0, meterLevel - 4) : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Audio Filters & Smart Ducking Switches */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Filtros & Redução de Ruído OBS</h4>
                  <p className="text-[11px] text-slate-500">Compressor + Expansor + Noise Suppression RNNoise</p>
                </div>
              </div>
              <button
                onClick={onToggleFilters}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filtersEnabled
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {filtersEnabled ? 'ATIVADO' : 'DESATIVADO'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Smart Ducking Automático</h4>
                  <p className="text-[11px] text-slate-500">Abaixa a música de fundo (-15dB) ao detectar fala do apresentador</p>
                </div>
              </div>
              <button
                onClick={onToggleSmartDucking}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  smartDucking
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {smartDucking ? 'ATIVADO' : 'DESATIVADO'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Video Track Player & Presentation Slides (6 Cols) */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Video Player Remote Control */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileVideo className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 text-base">Reprodutor Multimídia do OBS</h2>
            </div>
            <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium border border-blue-200">
              Fonte: Video_Introducao
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Controle remoto de reprodução, pause e reinício da fonte de mídia carregada no OBS.
          </p>

          {/* Video Preview Box */}
          <div className="bg-slate-900 rounded-lg p-4 text-white mb-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 truncate">
                intro_evento_oficial_2026.mp4
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {isPlaying ? '▶ REPRODUZINDO' : '⏸ EM PAUSA'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>00:42</span>
                <span>02:15</span>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleVideoAction('play')}
              className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                isPlaying
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play</span>
            </button>

            <button
              onClick={() => handleVideoAction('pause')}
              className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                !isPlaying
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              }`}
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>

            <button
              onClick={() => handleVideoAction('restart')}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>

        {/* Presentation Slide Remote Deck */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className={`flex items-center justify-between ${isStreaming ? 'mb-3' : ''}`}>
            <div className="flex items-center gap-2">
              <Presentation className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800 text-base">Passador de Slides Remoto</h2>
            </div>
            {isStreaming && (
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
                Slide {currentSlide} / {totalSlides}
              </span>
            )}
          </div>

          {isStreaming && (
            <>
              <p className="text-xs text-slate-500 mb-4">
                Avança ou retrocede as lâminas do slideshow de apresentação integrado no OBS.
              </p>

              {/* Slide Preview Card */}
              <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 flex flex-col justify-between border border-slate-700 mb-4 text-white">
                <div className="flex justify-between items-start text-xs text-slate-400">
                  <span>Deck: Apresentacao_Slides</span>
                  <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded text-[10px]">1920x1080</span>
                </div>
                
                <div className="text-center py-2">
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    Slide #{currentSlide}: Visão Geral do Projeto
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Arquitetura de Transmissão com Central Hub OBS
                  </p>
                </div>

                <div className="flex justify-center gap-1.5">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx + 1 === currentSlide ? 'w-6 bg-blue-400' : 'w-2 bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Slide Deck Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevSlide}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-slate-200 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Slide Anterior</span>
                </button>

                <button
                  onClick={handleNextSlide}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition shadow-sm"
                >
                  <span>Próximo Slide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

      </div>

      {/* ==================== AUDIO MONITOR PRO ==================== */}
      <div className="lg:col-span-12 bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        {audioNotification && (
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{audioNotification}</span>
            </div>
            <button onClick={() => setAudioNotification(null)} className="text-white hover:text-indigo-200">✕</button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Headphones className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Audio Monitor (Monitoramento & Roteamento Broadcast)</h3>
              <span className="text-[11px] text-slate-500">
                Envia faixas de áudio específicas para saídas de hardware ou plataformas como Zoom e Teams, com compressor e equalizador dedicados.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAudioMonitorActive}
                onChange={(e) => {
                  setIsAudioMonitorActive(e.target.checked);
                  showAudioNotification(e.target.checked ? '🎧 Audio Monitor ATIVADO!' : 'Audio Monitor pausado.');
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
            <span className="text-xs font-bold text-slate-700">
              {isAudioMonitorActive ? 'Monitor ON' : 'Monitor OFF'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Coluna 1: Roteamento de Dispositivo & Faixas */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Radio className="w-4 h-4 text-indigo-600" />
              <span>Destino de Roteamento (Saída)</span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Dispositivo de Envio</label>
              <select
                value={monitorDevice}
                onChange={(e) => {
                  setMonitorDevice(e.target.value as any);
                  showAudioNotification(`Roteamento alterado para ${e.target.value === 'zoom_teams' ? 'Zoom & Teams (Cabo Virtual)' : e.target.value}`);
                }}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white text-xs font-medium"
              >
                <option value="zoom_teams">Plataformas Zoom & Teams (VB-Audio Virtual Cable)</option>
                <option value="headphones">Fones de Ouvido de Retorno (Hardware Direto)</option>
                <option value="virtual_cable">Cabo de Áudio Virtual B (Auxiliar de Gravação)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Faixa de Áudio Enviada</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { num: 1, label: 'Faixa 1 (Mix Geral da Live)' },
                  { num: 2, label: 'Faixa 2 (Microfone Isolado)' },
                  { num: 3, label: 'Faixa 3 (Mídia/Música Limpa)' },
                  { num: 4, label: 'Faixa 4 (VDO.Ninja/Convidados)' },
                ].map((track) => (
                  <button
                    key={track.num}
                    type="button"
                    onClick={() => {
                      setMonitorTrack(track.num);
                      showAudioNotification(`Faixa ${track.num} roteada para saída`);
                    }}
                    className={`p-2 rounded-lg border text-[11px] font-bold text-left transition ${
                      monitorTrack === track.num
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {track.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna 2: Equalizador Paramétrico de 3 Bandas */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Equalizador Broadcast (3 Bandas)</span>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-700">
                  <span>Graves (Low 80Hz - Calor vocal)</span>
                  <span className="font-mono font-bold text-emerald-700">{eqLow > 0 ? `+${eqLow}` : eqLow} dB</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={eqLow}
                  onChange={(e) => setEqLow(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-700">
                  <span>Médios (Mid 1kHz - Clareza e Presença)</span>
                  <span className="font-mono font-bold text-emerald-700">{eqMid > 0 ? `+${eqMid}` : eqMid} dB</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={eqMid}
                  onChange={(e) => setEqMid(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-700">
                  <span>Agudos (High 10kHz - Brilho e Ar)</span>
                  <span className="font-mono font-bold text-emerald-700">{eqHigh > 0 ? `+${eqHigh}` : eqHigh} dB</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={eqHigh}
                  onChange={(e) => setEqHigh(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Coluna 3: Compressor Dinâmico de Transmissão */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Compressor Dinâmico do Monitor</span>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 block">Threshold</span>
                  <span className="font-mono font-bold text-blue-700">{compressorThreshold} dB</span>
                  <input
                    type="range"
                    min="-36"
                    max="0"
                    value={compressorThreshold}
                    onChange={(e) => setCompressorThreshold(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-600 block">Ratio (Compressão)</span>
                  <span className="font-mono font-bold text-blue-700">{compressorRatio}:1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={compressorRatio}
                    onChange={(e) => setCompressorRatio(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 block">Ataque: {compressorAttack}ms</span>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={compressorAttack}
                    onChange={(e) => setCompressorAttack(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-600 block">Release: {compressorRelease}ms</span>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    value={compressorRelease}
                    onChange={(e) => setCompressorRelease(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => showAudioNotification('✅ Configuração de Áudio Monitor aplicada no OBS Studio!')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Aplicar Parâmetros de Monitoramento</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
