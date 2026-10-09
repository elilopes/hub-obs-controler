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
  FileVideo
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

    </div>
  );
};
