import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Radio, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Film, 
  Video, 
  Layers, 
  Check, 
  AlertCircle, 
  X,
  Play,
  Tv
} from 'lucide-react';
import { multiSoftwareService } from '../services/multiSoftwareService';

interface VoiceCommandsBarProps {
  onStartStream: () => void;
  onStopStream: () => void;
  onStartRecord: () => void;
  onStopRecord: () => void;
  onToggleVirtualCam: () => void;
  onMuteMic: () => void;
  onUnmuteMic: () => void;
  onSelectScene: (sceneName: string) => void;
  onSaveReplay: () => void;
  isStreaming: boolean;
  isRecording: boolean;
  currentScene: string;
}

export const VoiceCommandsBar: React.FC<VoiceCommandsBarProps> = ({
  onStartStream,
  onStopStream,
  onStartRecord,
  onStopRecord,
  onToggleVirtualCam,
  onMuteMic,
  onUnmuteMic,
  onSelectScene,
  onSaveReplay,
  isStreaming,
  isRecording,
  currentScene,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const executeCommand = (text: string) => {
    const clean = text.toLowerCase().trim();
    setLastTranscript(text);

    // 1. Iniciar Live
    if (clean.includes('iniciar live') || clean.includes('começar live') || clean.includes('iniciar transmissão') || clean.includes('começar transmissão') || clean.includes('entrar ao vivo')) {
      if (!isStreaming) {
        onStartStream();
        setLastExecutedCommand('🔴 Iniciar Transmissão');
      }
    } 
    // 2. Parar Live
    else if (clean.includes('parar live') || clean.includes('encerrar live') || clean.includes('parar transmissão') || clean.includes('encerrar transmissão') || clean.includes('finalizar live')) {
      if (isStreaming) {
        onStopStream();
        setLastExecutedCommand('🛑 Encerrar Transmissão');
      }
    }
    // 3. Iniciar Gravação
    else if (clean.includes('iniciar gravação') || clean.includes('começar gravação') || clean.includes('gravar tela') || clean.includes('gravar vídeo')) {
      if (!isRecording) {
        onStartRecord();
        setLastExecutedCommand('⏺ Iniciar Gravação');
      }
    }
    // 4. Parar Gravação
    else if (clean.includes('parar gravação') || clean.includes('encerrar gravação') || clean.includes('terminar gravação')) {
      if (isRecording) {
        onStopRecord();
        setLastExecutedCommand('⏹ Parar Gravação');
      }
    }
    // 5. Mutar Microfone
    else if (clean.includes('mutar microfone') || clean.includes('silenciar microfone') || clean.includes('mudo') || clean.includes('mutar áudio')) {
      onMuteMic();
      setLastExecutedCommand('🔇 Mutar Microfone');
    }
    // 6. Desmutar Microfone
    else if (clean.includes('ativar microfone') || clean.includes('desmutar microfone') || clean.includes('abrir microfone') || clean.includes('ligar áudio')) {
      onUnmuteMic();
      setLastExecutedCommand('🎙️ Microfone Ativado');
    }
    // 7. Câmera Virtual
    else if (clean.includes('câmera virtual') || clean.includes('webcam virtual') || clean.includes('ligar câmera virtual') || clean.includes('desligar câmera virtual')) {
      onToggleVirtualCam();
      setLastExecutedCommand('📹 Alternar Câmera Virtual');
    }
    // 8. Salvar Replay
    else if (clean.includes('salvar replay') || clean.includes('guardar replay') || clean.includes('clipe') || clean.includes('clipar')) {
      onSaveReplay();
      setLastExecutedCommand('💾 Salvar Replay Instantâneo');
    }
    // 9. Trocar de Cenas
    else if (clean.includes('cena principal') || clean.includes('cena um') || clean.includes('cena 1') || clean.includes('câmera principal')) {
      onSelectScene('Cena_Principal');
      setLastExecutedCommand('🎬 Cortar para Cena_Principal');
    }
    else if (clean.includes('apresentação') || clean.includes('cena dois') || clean.includes('cena 2') || clean.includes('slides')) {
      onSelectScene('Apresentacao');
      setLastExecutedCommand('📊 Cortar para Apresentação');
    }
    else if (clean.includes('gameplay') || clean.includes('cena jogo') || clean.includes('cena três') || clean.includes('cena 3')) {
      onSelectScene('Gameplay');
      setLastExecutedCommand('🎮 Cortar para Gameplay');
    }
    else if (clean.includes('webcam tela cheia') || clean.includes('câmera cheia') || clean.includes('câmera grande') || clean.includes('webcam cheia')) {
      onSelectScene('Webcam_FullScreen');
      setLastExecutedCommand('👤 Cortar para Webcam FullScreen');
    }
    else if (clean.includes('intervalo') || clean.includes('já volto') || clean.includes('pausa')) {
      onSelectScene('BRB_Intervalo');
      setLastExecutedCommand('☕ Cortar para Intervalo');
    }
    else if (clean.includes('encerramento') || clean.includes('final')) {
      onSelectScene('Encerramento');
      setLastExecutedCommand('🏁 Cortar para Encerramento');
    }
    // 10. Comandos de Transmissão Multi-Software (vMix, Streamlabs, Streamer.bot)
    else if (clean.includes('corte vmix') || clean.includes('cut vmix') || clean.includes('corte seco')) {
      multiSoftwareService.sendVMixCommand('Cut');
      setLastExecutedCommand('📺 vMix: CUT (Corte Seco)');
    }
    else if (clean.includes('transição vmix') || clean.includes('fade vmix') || clean.includes('fade suave')) {
      multiSoftwareService.sendVMixCommand('Fade', undefined, 1000);
      setLastExecutedCommand('📺 vMix: FADE 1s');
    }
    else if (clean.includes('alerta streamer bot') || clean.includes('som aplausos') || clean.includes('aplausos')) {
      multiSoftwareService.sendStreamerBotAction('Efeito Sonoro: Aplausos de Auditório');
      setLastExecutedCommand('👏 Streamer.bot: Aplausos');
    }
    else if (clean.includes('alerta chat') || clean.includes('anúncio live')) {
      multiSoftwareService.sendStreamerBotAction('Disparar Anúncio de Live no Chat');
      setLastExecutedCommand('📢 Streamer.bot: Alerta Chat');
    }

    setTimeout(() => setLastExecutedCommand(null), 4000);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Seu navegador não suporta reconhecimento de fala nativo (Web Speech API). Recomendamos Chrome ou Edge.');
        return;
      }
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const text = event.results[i][0].transcript;
              executeCommand(text);
            }
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Voice command recognition error:', err);
        };

        recognition.onend = () => {
          if (isListening) {
            try { recognition.start(); } catch {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 rounded-xl p-3.5 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/40 animate-pulse'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
          title={isListening ? 'Clique para desativar comandos por voz' : 'Clique para ativar comandos por voz para a live'}
        >
          {isListening ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-purple-200" />}
          <span>{isListening ? 'Ouvindo Comandos de Voz (ON)' : 'Ativar Comandos por Voz'}</span>
        </button>

        <div className="text-xs">
          <div className="font-bold flex items-center gap-2">
            <span>Controle da Live por Voz (Português PT-BR)</span>
            {isListening && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </div>
          <p className="text-[11px] text-slate-300">
            Diga: <em>"Iniciar live"</em>, <em>"Cena principal"</em>, <em>"Cena gameplay"</em>, <em>"Mutar microfone"</em>, <em>"Salvar replay"</em>
          </p>
        </div>
      </div>

      {/* Feedback do último comando */}
      <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
        {lastExecutedCommand ? (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Comando Executado: {lastExecutedCommand}</span>
          </div>
        ) : lastTranscript && isListening ? (
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono truncate max-w-xs">
            Ouvido: "{lastTranscript}"
          </div>
        ) : (
          <span className="text-[11px] text-purple-300/80 font-mono">
            {isListening ? 'Aguardando comando...' : 'Microfone em espera'}
          </span>
        )}
      </div>
    </div>
  );
};
