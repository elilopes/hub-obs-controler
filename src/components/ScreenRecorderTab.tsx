import React, { useState, useRef, useEffect } from 'react';
import { 
  Monitor, 
  Video, 
  Square, 
  Play, 
  Pause, 
  Download, 
  Scissors, 
  Clock, 
  HardDrive, 
  FolderOpen, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Film, 
  Sliders, 
  RotateCcw,
  Maximize,
  Volume2,
  VolumeX,
  FileVideo,
  Layers,
  Zap,
  Split
} from 'lucide-react';

interface ScreenRecorderTabProps {
  openLastRecordingEnabled?: boolean;
  onRecordingFinished?: (videoBlob: Blob, filename: string) => void;
  statusMessage?: { text: string; color: string };
}

export const ScreenRecorderTab: React.FC<ScreenRecorderTabProps> = ({
  openLastRecordingEnabled = true,
  onRecordingFinished,
}) => {
  // Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlobs, setRecordedBlobs] = useState<Blob[]>([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [screenResolution, setScreenResolution] = useState<{ width: number; height: number } | null>(null);
  const [captureAudio, setCaptureAudio] = useState(true);
  const [captureMic, setCaptureMic] = useState(false);
  const [fpsSelection, setFpsSelection] = useState<number>(60);
  const [recordedFileSizeMb, setRecordedFileSizeMb] = useState<number>(0);
  const [lastSavedFilename, setLastSavedFilename] = useState<string | null>(null);
  const [autoOpenFolder, setAutoOpenFolder] = useState(openLastRecordingEnabled);

  // References for MediaRecorder and Streams
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Trimmer / Editor State
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isEditorPlaying, setIsEditorPlaying] = useState<boolean>(false);
  const [isTrimming, setIsTrimming] = useState<boolean>(false);
  const [cutClips, setCutClips] = useState<Array<{ id: string; name: string; url: string; duration: number }>>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const editorVideoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Timer while recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording, isPaused]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}${ms > 0 ? `.${ms}` : ''}`;
  };

  // START SCREEN RECORDING
  const handleStartRecording = async () => {
    try {
      setRecordedBlobs([]);
      setRecordedVideoUrl(null);
      setRecordingTime(0);
      setRecordedFileSizeMb(0);

      // 1. Capture Display Screen / Window / Tab
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: fpsSelection, max: 60 },
          displaySurface: 'monitor',
        },
        audio: captureAudio,
      });

      // Optional mic audio mixing
      if (captureMic) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTracks = micStream.getAudioTracks();
          if (audioTracks.length > 0) {
            displayStream.addTrack(audioTracks[0]);
          }
        } catch (micErr) {
          console.warn('Microphone permission skipped or failed:', micErr);
        }
      }

      streamRef.current = displayStream;

      // Track resolution
      const videoTrack = displayStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        if (settings.width && settings.height) {
          setScreenResolution({ width: settings.width, height: settings.height });
        }
        videoTrack.onended = () => {
          handleStopRecording();
        };
      }

      // Assign to live preview element
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = displayStream;
        videoPreviewRef.current.play().catch(() => {});
      }

      // 2. Setup MediaRecorder with WebM
      let chosenMime = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(chosenMime)) {
        chosenMime = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(chosenMime)) {
          chosenMime = 'video/webm';
        }
      }
      const options: MediaRecorderOptions = { mimeType: chosenMime };

      const recorder = new MediaRecorder(displayStream, options);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
          const totalSize = chunks.reduce((acc, c) => acc + c.size, 0);
          setRecordedFileSizeMb(Number((totalSize / (1024 * 1024)).toFixed(2)));
        }
      };

      recorder.onstop = () => {
        const completeBlob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(completeBlob);
        setRecordedBlobs(chunks);
        setRecordedVideoUrl(url);

        const now = new Date();
        const filename = `gravacao_tela_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}.webm`;
        setLastSavedFilename(filename);

        if (onRecordingFinished) {
          onRecordingFinished(completeBlob, filename);
        }

        if (autoOpenFolder) {
          showToast(`✅ Gravação concluída e salva! [Open Last Recording: Pasta C:/OBS_Gravacoes aberta]`);
        } else {
          showToast(`✅ Gravação de tela concluída! Carregada no editor abaixo para corte.`);
        }
      };

      recorder.start(1000); // 1s slice
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setIsPaused(false);
      showToast('⏺ Gravação de tela INICIADA em formato WebM 60 FPS!');
    } catch (err) {
      console.error('Error starting screen recording:', err);
      showToast('⚠️ Gravação cancelada ou permissão de tela negada.');
    }
  };

  // STOP SCREEN RECORDING
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  // DOWNLOAD FULL RECORDING
  const handleDownloadFullRecording = () => {
    if (!recordedVideoUrl) return;
    const a = document.createElement('a');
    a.href = recordedVideoUrl;
    a.download = lastSavedFilename || 'gravacao_tela_obs.webm';
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(`⬇️ Download iniciado: ${a.download}`);
  };

  // OPEN LAST RECORDING ACTION
  const handleOpenLastRecordingFolder = () => {
    showToast(`📂 Abrindo pasta de arquivos do Windows: "C:/OBS_Gravacoes/${lastSavedFilename || ''}"`);
    if (recordedVideoUrl) {
      // In web app, we also trigger download / open in new tab
      const a = document.createElement('a');
      a.href = recordedVideoUrl;
      a.target = '_blank';
      a.download = lastSavedFilename || 'gravacao_tela_obs.webm';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  // LOAD CUSTOM VIDEO FROM DISK
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRecordedVideoUrl(url);
      setLastSavedFilename(file.name);
      showToast(`📁 Vídeo carregado para corte: "${file.name}"`);
    }
  };

  // EDITOR VIDEO LOADED METADATA
  const handleEditorLoadedMetadata = () => {
    if (editorVideoRef.current) {
      const dur = editorVideoRef.current.duration || 0;
      setVideoDuration(dur);
      setTrimStart(0);
      setTrimEnd(dur);
      setCurrentTime(0);
    }
  };

  // EDITOR TIME UPDATE
  const handleEditorTimeUpdate = () => {
    if (editorVideoRef.current) {
      const t = editorVideoRef.current.currentTime;
      setCurrentTime(t);
      // Loop within trim range if playing
      if (isEditorPlaying && trimEnd > 0 && t >= trimEnd) {
        editorVideoRef.current.currentTime = trimStart;
        editorVideoRef.current.play().catch(() => {});
      }
    }
  };

  // TOGGLE EDITOR PLAY
  const handleToggleEditorPlay = () => {
    if (!editorVideoRef.current) return;
    if (editorVideoRef.current.paused) {
      if (editorVideoRef.current.currentTime < trimStart || editorVideoRef.current.currentTime >= trimEnd) {
        editorVideoRef.current.currentTime = trimStart;
      }
      editorVideoRef.current.play();
      setIsEditorPlaying(true);
    } else {
      editorVideoRef.current.pause();
      setIsEditorPlaying(false);
    }
  };

  // SET START TRIM MARKER
  const handleSetTrimStart = () => {
    if (editorVideoRef.current) {
      const t = editorVideoRef.current.currentTime;
      if (t < trimEnd) {
        setTrimStart(t);
        showToast(`📍 Ponto Inicial [A] marcado em ${formatSeconds(t)}`);
      } else {
        showToast(`⚠️ O ponto inicial deve ser anterior ao ponto final.`);
      }
    }
  };

  // SET END TRIM MARKER
  const handleSetTrimEnd = () => {
    if (editorVideoRef.current) {
      const t = editorVideoRef.current.currentTime;
      if (t > trimStart) {
        setTrimEnd(t);
        showToast(`📍 Ponto Final [B] marcado em ${formatSeconds(t)}`);
      } else {
        showToast(`⚠️ O ponto final deve ser posterior ao ponto inicial.`);
      }
    }
  };

  // CUT AND EXPORT TRIMMED CLIP
  const handleCutAndSaveClip = async () => {
    if (!editorVideoRef.current || trimEnd <= trimStart) return;

    setIsTrimming(true);
    showToast(`✂️ Cortando pedaço de ${formatSeconds(trimStart)} até ${formatSeconds(trimEnd)}...`);

    const video = editorVideoRef.current;
    const clipDuration = trimEnd - trimStart;

    try {
      // Capture canvas stream of playback
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext('2d');

      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const cutBlob = new Blob(chunks, { type: 'video/webm' });
        const cutUrl = URL.createObjectURL(cutBlob);
        const clipName = `corte_${formatSeconds(trimStart).replace(':', 'm')}s_a_${formatSeconds(trimEnd).replace(':', 'm')}s.webm`;

        const newClip = {
          id: `cut-${Date.now()}`,
          name: clipName,
          url: cutUrl,
          duration: clipDuration,
        };

        setCutClips((prev) => [newClip, ...prev]);

        // Auto download cut
        const a = document.createElement('a');
        a.href = cutUrl;
        a.download = clipName;
        document.body.appendChild(a);
        a.click();
        a.remove();

        setIsTrimming(false);
        showToast(`🎉 Pedaço de vídeo cortado e salvo com sucesso em WebM: ${clipName}!`);
      };

      recorder.start();

      // Seek to start and play while drawing to canvas
      video.pause();
      video.currentTime = trimStart;

      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          resolve();
        };
        video.addEventListener('seeked', onSeeked);
      });

      await video.play();

      let animationId: number;
      const renderFrame = () => {
        if (ctx && video) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        if (video.currentTime >= trimEnd || video.ended) {
          cancelAnimationFrame(animationId);
          video.pause();
          recorder.stop();
        } else {
          animationId = requestAnimationFrame(renderFrame);
        }
      };

      animationId = requestAnimationFrame(renderFrame);
    } catch (err) {
      console.error('Error trimming video:', err);
      setIsTrimming(false);
      showToast('⚠️ Erro ao processar corte. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg border border-blue-400/40 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:text-blue-200 text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg md:text-xl text-white">
                  Gravador de Tela do Computador & Editor de Cortes (WebM)
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Nova Ferramenta
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Grave a tela inteira, janelas ou jogos em alta resolução WebM (VP9/60 FPS). Em seguida, abra o vídeo no editor integrado para marcar início/fim, cortar e salvar pedaços isolados instantaneamente.
              </p>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-medium cursor-pointer text-slate-200">
              <input
                type="checkbox"
                checked={autoOpenFolder}
                onChange={(e) => setAutoOpenFolder(e.target.checked)}
                className="rounded border-slate-600 text-blue-600 focus:ring-0"
              />
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Last Recording (Abre pasta após parar)</span>
            </label>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              title="Abrir arquivo de vídeo do computador para cortar"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Abrir Vídeo do PC</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/webm,video/mp4,video/mkv"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Grid: Gravador ao Vivo (Esquerda) & Editor de Cortes (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ==================== COLUNA 1: GRAVADOR DE TELA (6 COLS) ==================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-red-100 text-red-600">
                  <Film className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Captura & Gravação de Tela</h3>
                  <span className="text-[11px] text-slate-500">Tela Cheia, Janela de Programa ou Aba</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isRecording ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    REC {formatSeconds(recordingTime)}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    Pronto para Gravar
                  </span>
                )}
              </div>
            </div>

            {/* Video Preview Box */}
            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
              <video
                ref={videoPreviewRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-contain ${!isRecording ? 'hidden' : 'block'}`}
              />

              {!isRecording && (
                <div className="text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-300">Nenhuma captura de tela em andamento</p>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Clique em "Iniciar Gravação de Tela" abaixo para escolher a tela inteira ou janela e começar a gravar em WebM.
                  </p>
                </div>
              )}

              {/* Watermark badge */}
              {isRecording && (
                <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  GRAVANDO EM TEMPO REAL
                </div>
              )}

              {isRecording && screenResolution && (
                <div className="absolute top-3 right-3 bg-black/70 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                  {screenResolution.width}x{screenResolution.height} @ {fpsSelection}fps
                </div>
              )}
            </div>

            {/* Parâmetros de Gravação */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Taxa de Quadros (FPS)</label>
                <select
                  value={fpsSelection}
                  onChange={(e) => setFpsSelection(Number(e.target.value))}
                  disabled={isRecording}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 text-slate-800 font-medium focus:outline-none"
                >
                  <option value={60}>60 FPS (Ultra Fluido - Gamers/Lives)</option>
                  <option value={30}>30 FPS (Padrão Tutoriais)</option>
                  <option value={24}>24 FPS (Cinematográfico)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Áudio do Computador</label>
                <button
                  type="button"
                  disabled={isRecording}
                  onClick={() => setCaptureAudio(!captureAudio)}
                  className={`w-full p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    captureAudio
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {captureAudio ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{captureAudio ? 'Capturar Som do PC' : 'Mudo (Sem Som)'}</span>
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Microfone Opcional</label>
                <button
                  type="button"
                  disabled={isRecording}
                  onClick={() => setCaptureMic(!captureMic)}
                  className={`w-full p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    captureMic
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>{captureMic ? 'Mic Ligado' : 'Mic Desligado'}</span>
                </button>
              </div>
            </div>

            {/* Recorder Controls */}
            <div className="flex items-center gap-3 pt-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar Gravação da Tela (WebM)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs md:text-sm font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current text-red-500" />
                  <span>Interromper & Salvar Gravação</span>
                </button>
              )}
            </div>

            {/* Status do Arquivo Gravado */}
            {recordedFileSizeMb > 0 && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-slate-700">Tamanho acumulado:</span>
                  <span className="font-mono font-bold text-slate-900">{recordedFileSizeMb} MB</span>
                </div>
                {recordedVideoUrl && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadFullRecording}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar WebM Completo</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Botão Open Last Recording se finalizado */}
            {lastSavedFilename && (
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-amber-700" />
                  <div>
                    <span className="font-bold text-amber-900">Última Gravação Salva:</span>
                    <span className="text-[11px] font-mono text-slate-600 block">{lastSavedFilename}</span>
                  </div>
                </div>
                <button
                  onClick={handleOpenLastRecordingFolder}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <span>Abrir Arquivo / Pasta</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* ==================== COLUNA 2: EDITOR & CORTADOR DE VÍDEO (6 COLS) ==================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                  <Scissors className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Editor & Cortador de Vídeo (WebM)</h3>
                  <span className="text-[11px] text-slate-500">Marque início e fim, recorte e salve pedaços</span>
                </div>
              </div>

              {recordedVideoUrl && (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Vídeo Pronto para Corte
                </span>
              )}
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {recordedVideoUrl ? (
                <video
                  ref={editorVideoRef}
                  src={recordedVideoUrl}
                  onLoadedMetadata={handleEditorLoadedMetadata}
                  onTimeUpdate={handleEditorTimeUpdate}
                  className="w-full h-full object-contain"
                  playsInline
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 mx-auto">
                    <FileVideo className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">Nenhum vídeo aberto no editor</p>
                  <p className="text-[11px] text-slate-600 max-w-xs">
                    Grave a tela ao lado ou clique em "Abrir Vídeo do PC" no topo para cortar pedaços.
                  </p>
                </div>
              )}

              {/* Trim Markers Badge Overlay */}
              {recordedVideoUrl && (
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-xs p-2 rounded-lg border border-slate-700 flex items-center justify-between text-[11px] text-white">
                  <span className="font-mono">
                    Atual: <strong>{formatSeconds(currentTime)}</strong> / {formatSeconds(videoDuration)}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-emerald-400 font-bold">[A] {formatSeconds(trimStart)}</span>
                    <span>→</span>
                    <span className="text-red-400 font-bold">[B] {formatSeconds(trimEnd)}</span>
                    <span className="text-amber-300 font-bold">({formatSeconds(Math.max(0, trimEnd - trimStart))})</span>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Slider with Trim Range */}
            {recordedVideoUrl && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Timeline de Corte</span>
                  <span className="text-slate-500 font-normal">Duração do corte: {formatSeconds(Math.max(0, trimEnd - trimStart))}</span>
                </div>

                <div className="relative w-full h-8 bg-slate-100 rounded-lg p-1 border border-slate-300 flex items-center">
                  {/* Highlighted Trim Range on Track */}
                  {videoDuration > 0 && (
                    <div
                      className="absolute h-5 bg-indigo-500/30 border-y-2 border-indigo-500 rounded"
                      style={{
                        left: `${(trimStart / videoDuration) * 100}%`,
                        width: `${((trimEnd - trimStart) / videoDuration) * 100}%`,
                      }}
                    />
                  )}

                  {/* Scrubber Input */}
                  <input
                    type="range"
                    min={0}
                    max={videoDuration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={(e) => {
                      const t = Number(e.target.value);
                      setCurrentTime(t);
                      if (editorVideoRef.current) {
                        editorVideoRef.current.currentTime = t;
                      }
                    }}
                    className="w-full z-10 cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Mark Controls: Ponto A & Ponto B */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={handleToggleEditorPlay}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isEditorPlaying
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isEditorPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isEditorPlaying ? 'Pausar' : 'Reproduzir Corte'}</span>
                  </button>

                  <button
                    onClick={handleSetTrimStart}
                    className="py-2 px-3 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition flex items-center justify-center gap-1"
                    title="Definir início do corte no ponto atual da reprodução"
                  >
                    <span>Marcar Início [A]</span>
                  </button>

                  <button
                    onClick={handleSetTrimEnd}
                    className="py-2 px-3 rounded-lg text-xs font-bold bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 transition flex items-center justify-center gap-1"
                    title="Definir fim do corte no ponto atual da reprodução"
                  >
                    <span>Marcar Fim [B]</span>
                  </button>
                </div>

                {/* Botão Principal: Cortar e Salvar Pedaço */}
                <div className="pt-2">
                  <button
                    onClick={handleCutAndSaveClip}
                    disabled={isTrimming || trimEnd <= trimStart}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black text-xs md:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>{isTrimming ? 'Processando e Gerando Corte...' : 'Cortar e Salvar Pedaço (Baixar WebM)'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Histórico de Cortes Salvos */}
            {cutClips.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Pedaços Cortados Nesta Sessão ({cutClips.length})
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cutClips.map((clip) => (
                    <div
                      key={clip.id}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs hover:bg-white transition"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileVideo className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-slate-800 block truncate">{clip.name}</span>
                          <span className="text-[10px] text-slate-500">Duração: {formatSeconds(clip.duration)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={clip.url}
                          download={clip.name}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[11px] font-bold flex items-center gap-1 transition"
                        >
                          <Download className="w-3 h-3" />
                          <span>Baixar</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
