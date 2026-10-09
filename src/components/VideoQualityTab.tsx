import React, { useState } from 'react';
import { 
  Tv, 
  Film, 
  Sliders, 
  Settings2, 
  HardDrive, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Download, 
  Zap, 
  Layers, 
  Radio, 
  Check, 
  AlertTriangle,
  Monitor,
  Disc,
  Info
} from 'lucide-react';
import { LiveQualityConfig, RecordQualityConfig } from '../types';

interface VideoQualityTabProps {
  onApplyToOBS: (type: 'live' | 'record' | 'all', liveConfig: LiveQualityConfig, recordConfig: RecordQualityConfig) => Promise<boolean>;
  isStreaming?: boolean;
  isRecording?: boolean;
  obsConnected?: boolean;
}

export const VideoQualityTab: React.FC<VideoQualityTabProps> = ({
  onApplyToOBS,
  isStreaming = false,
  isRecording = false,
  obsConnected = false,
}) => {
  // Live Quality State
  const [liveConfig, setLiveConfig] = useState<LiveQualityConfig>({
    resolution: '1080p',
    width: 1920,
    height: 1080,
    fps: 60,
    bitrate: 6000,
    encoder: 'nvenc_h264',
    rateControl: 'CBR',
    keyframeInterval: 2,
    preset: 'p5_balanced',
    audioBitrate: 192,
  });

  // Recording Quality State
  const [recordConfig, setRecordConfig] = useState<RecordQualityConfig>({
    resolution: 'same_as_stream',
    width: 1920,
    height: 1080,
    format: 'mkv',
    qualityMode: 'cqp',
    cqpLevel: 18,
    bitrate: 25000,
    encoder: 'nvenc_hevc',
    multiTrackAudio: true,
    audioTracks: [1, 2, 3],
    preset: 'p6_high',
  });

  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [recordingFolder, setRecordingFolder] = useState('D:/Transmissoes/Gravacoes_OBS');

  const triggerNotification = (msg: string) => {
    setAppliedNotification(msg);
    setTimeout(() => setAppliedNotification(null), 3500);
  };

  // Presets for Live
  const livePresets = [
    {
      id: 'pro_1080p60',
      label: '🏆 1080p 60fps Pro Broadcast',
      desc: 'YouTube / Twitch padrão ouro. 6.000 kbps, NVENC P6, CBR, 2s keyframe',
      badge: 'Recomendado',
      config: {
        resolution: '1080p' as const,
        width: 1920,
        height: 1080,
        fps: 60,
        bitrate: 6000,
        encoder: 'nvenc_h264' as const,
        rateControl: 'CBR' as const,
        keyframeInterval: 2,
        preset: 'p6_high' as const,
        audioBitrate: 192 as const,
      },
    },
    {
      id: 'vertical_shorts',
      label: '📱 1080x1920 Vertical (Shorts/TikTok/Reels)',
      desc: 'Transmissão no formato mobile 9:16 nativo para TikTok Live, Reels e YouTube Shorts',
      badge: 'Mobile 9:16',
      config: {
        resolution: 'vertical_1080' as const,
        width: 1080,
        height: 1920,
        fps: 60,
        bitrate: 5500,
        encoder: 'nvenc_h264' as const,
        rateControl: 'CBR' as const,
        keyframeInterval: 2,
        preset: 'p5_balanced' as const,
        audioBitrate: 160 as const,
      },
    },
    {
      id: 'twitch_936p60',
      label: '🎯 936p 60fps Twitch Otimizado',
      desc: '1664x936 (múltiplo de 16). Menos artefatos de compressão no limite de 8.000 kbps',
      badge: 'Twitch King',
      config: {
        resolution: '936p' as const,
        width: 1664,
        height: 936,
        fps: 60,
        bitrate: 7500,
        encoder: 'nvenc_h264' as const,
        rateControl: 'CBR' as const,
        keyframeInterval: 2,
        preset: 'p5_balanced' as const,
        audioBitrate: 160 as const,
      },
    },
    {
      id: 'ultra_4k60',
      label: '💎 4K Ultra HD 60fps (YouTube / WPStream)',
      desc: '3840x2160 com NVENC AV1 ou HEVC. Máxima fidelidade para monitores premium',
      badge: 'Ultra HD',
      config: {
        resolution: '4k' as const,
        width: 3840,
        height: 2160,
        fps: 60,
        bitrate: 18000,
        encoder: 'nvenc_av1' as const,
        rateControl: 'CBR' as const,
        keyframeInterval: 2,
        preset: 'p5_balanced' as const,
        audioBitrate: 320 as const,
      },
    },
    {
      id: 'eco_720p60',
      label: '⚡ 720p 60fps Econômico / PC Leve',
      desc: '1280x720 com 3.500 kbps. Ideal para conexões limitadas e notebooks sem GPU dedicada',
      badge: 'Econômico',
      config: {
        resolution: '720p' as const,
        width: 1280,
        height: 720,
        fps: 60,
        bitrate: 3500,
        encoder: 'x264' as const,
        rateControl: 'CBR' as const,
        keyframeInterval: 2,
        preset: 'veryfast' as const,
        audioBitrate: 128 as const,
      },
    },
  ];

  // Presets for Recording
  const recordPresets = [
    {
      id: 'rec_cqp18',
      label: '🎬 Master Cinema (CQP 18 + Multi-Faixa MKV)',
      desc: 'Qualidade indistinguível da fonte original. Áudio do microfone e jogo em faixas separadas para edição no Premiere/DaVinci',
      badge: 'Estúdio / Edição',
      config: {
        resolution: 'same_as_stream' as const,
        width: 1920,
        height: 1080,
        format: 'mkv' as const,
        qualityMode: 'cqp' as const,
        cqpLevel: 18,
        bitrate: 30000,
        encoder: 'nvenc_hevc' as const,
        multiTrackAudio: true,
        audioTracks: [1, 2, 3],
        preset: 'p6_high' as const,
      },
    },
    {
      id: 'rec_4k_cinema',
      label: '🌟 4K Ultra Lossless CQP 16',
      desc: 'Captura 3840x2160 pura com NVENC AV1/HEVC para vídeos de gameplay ou tutoriais em altíssima definição',
      badge: '4K Master',
      config: {
        resolution: '4k' as const,
        width: 3840,
        height: 2160,
        format: 'mkv' as const,
        qualityMode: 'cqp' as const,
        cqpLevel: 16,
        bitrate: 50000,
        encoder: 'nvenc_av1' as const,
        multiTrackAudio: true,
        audioTracks: [1, 2, 3, 4],
        preset: 'p6_high' as const,
      },
    },
    {
      id: 'rec_fast_mp4',
      label: '⚡ MP4 Pronto para Publicar (CBR 12.000 kbps)',
      desc: 'Formato .mp4 direto sem necessidade de remux. Arquivo leve e compatível com WhatsApp, Google Drive e redes sociais',
      badge: 'Pronto / Web',
      config: {
        resolution: 'same_as_stream' as const,
        width: 1920,
        height: 1080,
        format: 'mp4' as const,
        qualityMode: 'high_cbr' as const,
        cqpLevel: 22,
        bitrate: 12000,
        encoder: 'nvenc_h264' as const,
        multiTrackAudio: false,
        audioTracks: [1],
        preset: 'p5_balanced' as const,
      },
    },
    {
      id: 'rec_light_disk',
      label: '💾 Econômico em Disco (CQP 24 HEVC)',
      desc: 'Gera arquivos 5x menores com excelente nitidez. Ideal para gravações longas de 4h+ de palestras e aulas',
      badge: 'Poupa HD/SSD',
      config: {
        resolution: '1080p' as const,
        width: 1920,
        height: 1080,
        format: 'mkv' as const,
        qualityMode: 'cqp' as const,
        cqpLevel: 24,
        bitrate: 8000,
        encoder: 'nvenc_hevc' as const,
        multiTrackAudio: true,
        audioTracks: [1, 2],
        preset: 'p5_balanced' as const,
      },
    },
  ];

  const handleApplyLive = async () => {
    const success = await onApplyToOBS('live', liveConfig, recordConfig);
    if (success) {
      triggerNotification(`✅ Qualidade de Live (${liveConfig.width}x${liveConfig.height} @ ${liveConfig.fps}fps, ${liveConfig.bitrate} kbps) aplicada ao OBS!`);
    } else {
      triggerNotification(`ℹ️ Configuração de Live memorizada. Conecte o OBS Studio para sincronização automática.`);
    }
  };

  const handleApplyRecord = async () => {
    const success = await onApplyToOBS('record', liveConfig, recordConfig);
    if (success) {
      triggerNotification(`✅ Qualidade de Gravação (${recordConfig.format.toUpperCase()} - ${recordConfig.qualityMode === 'cqp' ? `CQP ${recordConfig.cqpLevel}` : `${recordConfig.bitrate} kbps`}) aplicada ao OBS!`);
    } else {
      triggerNotification(`ℹ️ Configuração de Gravação memorizada para a sessão do OBS.`);
    }
  };

  const handleApplyAll = async () => {
    const success = await onApplyToOBS('all', liveConfig, recordConfig);
    if (success) {
      triggerNotification(`🚀 Parâmetros de Vídeo da Live E Gravação atualizados no OBS com sucesso!`);
    } else {
      triggerNotification(`ℹ️ Parâmetros de Live e Gravação salvos com sucesso.`);
    }
  };

  const copyConfigJSON = (type: 'live' | 'record' | 'all') => {
    const payload = type === 'live' 
      ? { live: liveConfig } 
      : type === 'record' 
      ? { recording: recordConfig, folder: recordingFolder } 
      : { live: liveConfig, recording: recordConfig, folder: recordingFolder };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-700 rounded-xl p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40">
              <Sliders className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">Central de Qualidade de Imagem: Live & Gravação</h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
              Independente
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Configure resoluções, taxas de bits (bitrate), taxas de quadros (FPS), encoders por hardware (NVENC/AV1/AMF) e controle de taxa separados para a transmissão ao vivo e gravação local em disco.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleApplyAll}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition"
          >
            <Zap className="w-4 h-4" />
            <span>Aplicar Ambos no OBS</span>
          </button>
          <button
            onClick={() => copyConfigJSON('all')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
          >
            {copiedType === 'all' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'all' ? 'Copiado!' : 'Copiar JSON'}</span>
          </button>
        </div>
      </div>

      {appliedNotification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{appliedNotification}</span>
        </div>
      )}

      {/* Main Two-Column Grid: Left = Live Quality, Right = Recording Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ===================== COLUNA 1: QUALIDADE DA LIVE ===================== */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-rose-100 text-rose-700">
                <Radio className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Qualidade de Imagem da Live (Streaming)</h3>
                <span className="text-[11px] text-slate-500">Fluxo enviado para YouTube, Twitch, Facebook e RTMP</span>
              </div>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              isStreaming 
                ? 'bg-rose-100 border-rose-300 text-rose-800 animate-pulse' 
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              {isStreaming ? '🔴 TRANSMITINDO' : 'EM ESPERA'}
            </span>
          </div>

          <div className="p-5 space-y-5 flex-1">
            {/* Quick Presets for Live */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Predefinições Rápidas da Live
              </label>
              <div className="grid grid-cols-1 gap-2">
                {livePresets.map((preset) => {
                  const isSelected = 
                    liveConfig.resolution === preset.config.resolution &&
                    liveConfig.fps === preset.config.fps &&
                    liveConfig.bitrate === preset.config.bitrate;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setLiveConfig((prev) => ({ ...prev, ...preset.config }))}
                      className={`text-left p-3 rounded-lg border text-xs transition flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500/30'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900">{preset.label}</strong>
                          <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-medium text-slate-700">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{preset.desc}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resolution & Aspect Ratio */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Resolução de Saída (Canvas)
                </label>
                <select
                  value={liveConfig.resolution}
                  onChange={(e) => {
                    const val = e.target.value as LiveQualityConfig['resolution'];
                    let w = 1920;
                    let h = 1080;
                    if (val === '720p') { w = 1280; h = 720; }
                    else if (val === '1440p') { w = 2560; h = 1440; }
                    else if (val === '4k') { w = 3840; h = 2160; }
                    else if (val === 'vertical_1080') { w = 1080; h = 1920; }
                    else if (val === '936p') { w = 1664; h = 936; }
                    setLiveConfig((prev) => ({ ...prev, resolution: val, width: w, height: h }));
                  }}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="1080p">1080p Full HD (1920 × 1080) - Padrão</option>
                  <option value="720p">720p HD (1280 × 720) - Baixa Carga</option>
                  <option value="936p">936p Otimizado (1664 × 936) - Twitch</option>
                  <option value="1440p">1440p 2K QHD (2560 × 1440)</option>
                  <option value="4k">4K Ultra HD (3840 × 2160)</option>
                  <option value="vertical_1080">Vertical 9:16 (1080 × 1920) - Shorts/TikTok</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Taxa de Quadros (FPS)
                </label>
                <select
                  value={liveConfig.fps}
                  onChange={(e) => setLiveConfig((prev) => ({ ...prev, fps: Number(e.target.value) }))}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="60">60 FPS (Fluidez Máxima para Games / Apresentação)</option>
                  <option value="59.94">59.94 FPS (Padrão NTSC Broadcast)</option>
                  <option value="50">50 FPS (Padrão PAL)</option>
                  <option value="30">30 FPS (Padrão Web / Menor uso de CPU e GPU)</option>
                  <option value="29.97">29.97 FPS (Broadcast NTSC)</option>
                </select>
              </div>
            </div>

            {/* Video Bitrate Slider & Presets */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Taxa de Bits de Vídeo (Bitrate da Live)
                </label>
                <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                  {liveConfig.bitrate.toLocaleString()} kbps ({(liveConfig.bitrate / 1000).toFixed(1)} Mbps)
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="25000"
                step="250"
                value={liveConfig.bitrate}
                onChange={(e) => setLiveConfig((prev) => ({ ...prev, bitrate: Number(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1.500 kbps (Básico)</span>
                <span>4.500 kbps (720p60)</span>
                <span>6.000 kbps (1080p60)</span>
                <span>12.000 kbps (2K)</span>
                <span>25.000 kbps (4K)</span>
              </div>
            </div>

            {/* Hardware Encoder & Rate Control */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Encoder de Vídeo (Codec)
                </label>
                <select
                  value={liveConfig.encoder}
                  onChange={(e) => setLiveConfig((prev) => ({ ...prev, encoder: e.target.value as LiveQualityConfig['encoder'] }))}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="nvenc_h264">NVIDIA NVENC H.264 (Recomendado)</option>
                  <option value="nvenc_hevc">NVIDIA NVENC HEVC / H.265 (Alta Eficiência)</option>
                  <option value="nvenc_av1">NVIDIA NVENC AV1 (Geração RTX 40)</option>
                  <option value="amd_amf">AMD AMF / Radeon HW H.264</option>
                  <option value="qsv">Intel QuickSync Video (QSV)</option>
                  <option value="x264">x264 (Processador CPU Software)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Preset de Desempenho
                </label>
                <select
                  value={liveConfig.preset}
                  onChange={(e) => setLiveConfig((prev) => ({ ...prev, preset: e.target.value as LiveQualityConfig['preset'] }))}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="p6_high">P6: Mais Alta Qualidade</option>
                  <option value="p5_balanced">P5: Equilibrado (Recomendado)</option>
                  <option value="p3_fast">P3: Rápido (Menor uso de GPU)</option>
                  <option value="p1_fastest">P1: Ultrarrápido (Mínima Latência)</option>
                  <option value="p7_max">P7: Máxima Qualidade (2 Passagens)</option>
                </select>
              </div>
            </div>

            {/* Keyframe & Audio Bitrate */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Intervalo de Keyframes (GOP)
                </label>
                <select
                  value={liveConfig.keyframeInterval}
                  onChange={(e) => setLiveConfig((prev) => ({ ...prev, keyframeInterval: Number(e.target.value) }))}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="2">2 segundos (Obrigatório YouTube / Twitch)</option>
                  <option value="1">1 segundo (Ultra-baixa latência interativa)</option>
                  <option value="0">Automático (Gerenciado pelo encoder)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Bitrate de Áudio da Live
                </label>
                <select
                  value={liveConfig.audioBitrate}
                  onChange={(e) => setLiveConfig((prev) => ({ ...prev, audioBitrate: Number(e.target.value) as any }))}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="192">192 kbps (Padrão YouTube / Alta Fidelidade)</option>
                  <option value="160">160 kbps (Padrão Twitch)</option>
                  <option value="320">320 kbps (Qualidade de Estúdio / Músicos)</option>
                  <option value="128">128 kbps (Econômico)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={() => copyConfigJSON('live')}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5"
            >
              {copiedType === 'live' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'live' ? 'Copiado!' : 'Copiar Config Live'}</span>
            </button>

            <button
              onClick={handleApplyLive}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Aplicar Qualidade da Live no OBS</span>
            </button>
          </div>
        </div>

        {/* ===================== COLUNA 2: QUALIDADE DA GRAVAÇÃO LOCAL ===================== */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Film className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Qualidade de Imagem da Gravação Local</h3>
                <span className="text-[11px] text-slate-500">Salva no disco com qualidade independente da live</span>
              </div>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              isRecording 
                ? 'bg-amber-100 border-amber-300 text-amber-800 animate-pulse' 
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              {isRecording ? '⏺ GRAVANDO' : 'EM ESPERA'}
            </span>
          </div>

          <div className="p-5 space-y-5 flex-1">
            {/* Quick Presets for Recording */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Predefinições Rápidas de Gravação
              </label>
              <div className="grid grid-cols-1 gap-2">
                {recordPresets.map((preset) => {
                  const isSelected = 
                    recordConfig.format === preset.config.format &&
                    recordConfig.qualityMode === preset.config.qualityMode &&
                    (preset.config.qualityMode === 'cqp' ? recordConfig.cqpLevel === preset.config.cqpLevel : recordConfig.bitrate === preset.config.bitrate);
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setRecordConfig((prev) => ({ ...prev, ...preset.config }))}
                      className={`text-left p-3 rounded-lg border text-xs transition flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500/30'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900">{preset.label}</strong>
                          <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-medium text-slate-700">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{preset.desc}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Container Format & Resolution */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Formato de Contêiner (.mkv / .mp4)
                </label>
                <select
                  value={recordConfig.format}
                  onChange={(e) => setRecordConfig((prev) => ({ ...prev, format: e.target.value as any }))}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="mkv">.mkv (Mais Seguro - À prova de corrupção se o PC desligar)</option>
                  <option value="mp4">.mp4 (Padrão de Edição - Pode corromper se travar)</option>
                  <option value="mov">.mov (Apple QuickTime ProRes)</option>
                </select>
                <span className="text-[10px] text-amber-700 mt-1 block">
                  💡 Dica Pro: O OBS possui função de auto-remux de .mkv para .mp4 ao terminar de gravar.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Resolução da Gravação
                </label>
                <select
                  value={recordConfig.resolution}
                  onChange={(e) => {
                    const val = e.target.value as RecordQualityConfig['resolution'];
                    let w = 1920;
                    let h = 1080;
                    if (val === 'same_as_stream') { w = liveConfig.width; h = liveConfig.height; }
                    else if (val === '1080p') { w = 1920; h = 1080; }
                    else if (val === '1440p') { w = 2560; h = 1440; }
                    else if (val === '4k') { w = 3840; h = 2160; }
                    else if (val === 'vertical_1080') { w = 1080; h = 1920; }
                    setRecordConfig((prev) => ({ ...prev, resolution: val, width: w, height: h }));
                  }}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="same_as_stream">Igual à Resolução da Tela ({liveConfig.width}x{liveConfig.height})</option>
                  <option value="1080p">1080p Full HD (1920 × 1080)</option>
                  <option value="1440p">1440p 2K QHD (2560 × 1440)</option>
                  <option value="4k">4K Ultra HD (3840 × 2160 - Master)</option>
                  <option value="vertical_1080">Vertical (1080 × 1920)</option>
                </select>
              </div>
            </div>

            {/* Quality Mode (CQP vs CBR) */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Modo de Controle de Qualidade
                </label>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setRecordConfig((prev) => ({ ...prev, qualityMode: 'cqp' }))}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                      recordConfig.qualityMode === 'cqp'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    CQP / CRF (Recomendado)
                  </button>
                  <button
                    onClick={() => setRecordConfig((prev) => ({ ...prev, qualityMode: 'high_cbr' }))}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                      recordConfig.qualityMode === 'high_cbr'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bitrate Fixo (CBR Alto)
                  </button>
                </div>
              </div>

              {recordConfig.qualityMode === 'cqp' ? (
                <div className="space-y-1.5 bg-amber-50/70 p-3 rounded-lg border border-amber-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-900">Nível CQP (Fator de Quantização):</span>
                    <span className="font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                      CQP {recordConfig.cqpLevel} ({recordConfig.cqpLevel <= 16 ? 'Qualidade Máxima / Quase Sem Perdas' : recordConfig.cqpLevel <= 20 ? 'Estúdio / Indistinguível' : 'Balanceado'})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="28"
                    step="1"
                    value={recordConfig.cqpLevel}
                    onChange={(e) => setRecordConfig((prev) => ({ ...prev, cqpLevel: Number(e.target.value) }))}
                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex justify-between text-[10px] text-amber-800 font-mono">
                    <span>14 (Tamanho gigante)</span>
                    <span>18 (Padrão Pro Master)</span>
                    <span>22 (Balanceado)</span>
                    <span>28 (Menor tamanho)</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    O CQP ajusta a taxa de bits automaticamente cena por cena. Cenas simples consomem pouco espaço, cenas com muito movimento recebem toda a banda necessária sem pixelar.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Taxa de Bits Fixa de Gravação:</span>
                    <span className="font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                      {recordConfig.bitrate.toLocaleString()} kbps ({(recordConfig.bitrate / 1000).toFixed(1)} Mbps)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6000"
                    max="60000"
                    step="2000"
                    value={recordConfig.bitrate}
                    onChange={(e) => setRecordConfig((prev) => ({ ...prev, bitrate: Number(e.target.value) }))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>8.000 kbps</span>
                    <span>20.000 kbps (1080p)</span>
                    <span>40.000 kbps (2K)</span>
                    <span>60.000 kbps (4K)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Encoder de Gravação & Áudio Multi-Faixas */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Encoder de Gravação
                  </label>
                  <select
                    value={recordConfig.encoder}
                    onChange={(e) => setRecordConfig((prev) => ({ ...prev, encoder: e.target.value as any }))}
                    className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    <option value="nvenc_hevc">NVIDIA NVENC HEVC / H.265 (Mais recomendada)</option>
                    <option value="nvenc_av1">NVIDIA NVENC AV1 (Compressão máxima)</option>
                    <option value="nvenc_h264">NVIDIA NVENC H.264 (Compatibilidade total)</option>
                    <option value="x264">x264 CRF (CPU)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pasta de Destino das Gravações
                  </label>
                  <input
                    type="text"
                    value={recordingFolder}
                    onChange={(e) => setRecordingFolder(e.target.value)}
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    placeholder="D:/Gravacoes_OBS"
                  />
                </div>
              </div>

              {/* Multi-Track Audio Selector */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800">Gravação de Áudio Multi-Faixa (Separado)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={recordConfig.multiTrackAudio}
                      onChange={(e) => setRecordConfig((prev) => ({ ...prev, multiTrackAudio: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {recordConfig.multiTrackAudio && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                    <div className="p-1.5 bg-white rounded border border-slate-200 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">1</span>
                      <span className="font-medium text-slate-700">Mix Geral (Live)</span>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">2</span>
                      <span className="font-medium text-slate-700">Microfone Isolado</span>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-[10px]">3</span>
                      <span className="font-medium text-slate-700">Áudio do Jogo / PC</span>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">4</span>
                      <span className="font-medium text-slate-700">VDO.Ninja / Discord</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={() => copyConfigJSON('record')}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5"
            >
              {copiedType === 'record' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'record' ? 'Copiado!' : 'Copiar Config Gravação'}</span>
            </button>

            <button
              onClick={handleApplyRecord}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Aplicar Qualidade de Gravação no OBS</span>
            </button>
          </div>
        </div>

      </div>

      {/* Comparison Reference Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          Guia Técnico: Bitrates Recomendados por Plataforma (YouTube, Twitch, Kick, Facebook)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-red-50/60 rounded-lg border border-red-200">
            <strong className="text-red-900 block font-bold mb-1">YouTube Live</strong>
            <p className="text-slate-600 text-[11px] mb-1">Permite até 4K60 e bitrates elevados sem restrição de corte.</p>
            <ul className="text-[11px] text-slate-700 space-y-0.5 font-mono">
              <li>• 1080p60: 4.500 - 9.000 kbps</li>
              <li>• 1440p60: 9.000 - 18.000 kbps</li>
              <li>• 4K60: 20.000 - 51.000 kbps</li>
            </ul>
          </div>

          <div className="p-3 bg-purple-50/60 rounded-lg border border-purple-200">
            <strong className="text-purple-900 block font-bold mb-1">Twitch TV</strong>
            <p className="text-slate-600 text-[11px] mb-1">Teto máximo recomendado de 6.000 a 8.000 kbps (936p60 é a melhor nitidez).</p>
            <ul className="text-[11px] text-slate-700 space-y-0.5 font-mono">
              <li>• 1080p60: 6.000 - 8.000 kbps</li>
              <li>• 936p60: 7.500 kbps (Sem borrão)</li>
              <li>• 720p60: 4.500 kbps</li>
            </ul>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
            <strong className="text-emerald-900 block font-bold mb-1">Kick Live</strong>
            <p className="text-slate-600 text-[11px] mb-1">Suporta até 8.000 kbps em 1080p60 nativo sem transcodificação obrigatória.</p>
            <ul className="text-[11px] text-slate-700 space-y-0.5 font-mono">
              <li>• 1080p60: 6.000 - 8.000 kbps</li>
              <li>• Áudio: 160 kbps AAC</li>
            </ul>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
            <strong className="text-blue-900 block font-bold mb-1">Facebook Live</strong>
            <p className="text-slate-600 text-[11px] mb-1">Páginas comuns recebem 720p30 (4.000 kbps). Level Up recebe 1080p60.</p>
            <ul className="text-[11px] text-slate-700 space-y-0.5 font-mono">
              <li>• Level Up 1080p60: 6.000 kbps</li>
              <li>• Padrão 720p30: 3.000 - 4.000 kbps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
