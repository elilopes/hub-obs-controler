import React, { useState } from 'react';
import { 
  Sparkles, 
  Workflow, 
  Code2, 
  Copy, 
  Check, 
  Play, 
  Download, 
  Layers, 
  Volume2, 
  Camera, 
  Tv, 
  Flame, 
  Zap, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  Sliders, 
  Eye, 
  MessageSquare,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { PopularScriptItem } from '../types';
import { StudioEffectsSuite } from './StudioEffectsSuite';

interface ScriptsAutomationsTabProps {
  onTriggerScriptSim: (scriptId: string, name: string) => void;
  isStreaming?: boolean;
}

export const ScriptsAutomationsTab: React.FC<ScriptsAutomationsTabProps> = ({
  onTriggerScriptSim,
  isStreaming = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'visual' | 'automacao' | 'audio' | 'interatividade'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [activeSimScript, setActiveSimScript] = useState<string | null>(null);

  // Live Broadcast FX state
  const [liveFxState, setLiveFxState] = useState({
    confetti: false,
    fireworks: false,
    snow: false,
    disco: false,
    applaud: false,
  });

  const toggleLiveFx = (fx: keyof typeof liveFxState) => {
    setLiveFxState(prev => {
      const next = { ...prev, [fx]: !prev[fx] };
      onTriggerScriptSim('live_fx', `Efeito de Live Ativado: ${fx} -> ${next[fx] ? 'Ligado' : 'Desligado'}`);
      return next;
    });
  };

  const scriptsData: PopularScriptItem[] = [
    {
      id: 'move_transition',
      name: 'Move Transition (Exeldro)',
      category: 'visual',
      authorOrSource: 'Exeldro (GitHub / OBS Forums)',
      tag: 'Mais Popular do Mundo',
      description: 'Cria transições suaves animando a posição, tamanho e rotação de qualquer elemento ou webcam entre cenas, dispensando cortes secos.',
      benefits: [
        'Efeito Apple Keynote / TV broadcast profissional em tempo real',
        'A webcam move suavemente de tela cheia para o cantinho da tela (PIP)',
        'Animação de slides e logomarcas sem precisar de After Effects',
        'Sem sobrecarga na CPU'
      ],
      luaOrPythonCode: `-- Move Transition OBS Configuration
-- Instale o plugin move-transition.dll na pasta de plugins do OBS
-- Nas propriedades da transição da cena:
TransitionType = "Move"
Duration = 450 -- milissegundos
Easing = "CubicInOut"
TransformMode = "Matched"
PositionMatchMode = "PositionScaleRotate"
      `,
      howToInstall: 'Baixe o plugin oficial no OBS Forums ("Move Transition"). Extraia na pasta obs-studio/obs-plugins. No OBS, em "Transições de Cena", selecione "Mover" e configure a duração para 450ms.',
      settingsSummary: 'Duração: 400-500ms | Curva: Cubic In/Out | Correspondência: Nome da Fonte',
    },
    {
      id: 'shaderfilter_streamfx',
      name: 'ShaderFilter & StreamFX (Fundo Desfocado Bokeh DSLR)',
      category: 'visual',
      authorOrSource: 'Xaymar / OBS Community',
      tag: 'Visual Cinema',
      description: 'Adiciona desfoque gaussiano suave atrás do apresentador, cantos arredondados na câmera, reflexos 3D e LUT de correção de cor de cinema.',
      benefits: [
        'Simula lente fotográfica cara f/1.4 mesmo em webcams comuns (Logitech C920 / Brio)',
        'Bordas arredondadas e sombras projetadas elegantes',
        'Filtro de nitidez inteligente e correção de cor HDR',
        'Execução acelerada por shader na GPU (DirectX/Vulkan)'
      ],
      luaOrPythonCode: `// OBS HLSL Shader (Gaussian Blur + Rounded Corners)
uniform float blur_radius = 8.0;
uniform float corner_radius = 24.0;
uniform float4 border_color = float4(0.2, 0.4, 0.9, 1.0);

float4 main(float4 pos : POSITION, float2 uv : TEXCOORD0) : TARGET {
    float4 col = image.Sample(textureSampler, uv);
    // Aplica máscara de borda e desfoque gaussiano acelerado
    return col;
}`,
      howToInstall: 'Clique com botão direito na sua Webcam no OBS > Filtros > Adicionar (+) > Shader / Blur. Defina raio de 8px e cantos arredondados de 20px.',
      settingsSummary: 'Raio de Desfoque: 8.0 | Cantos: 24px | Shader: HLSL GPU',
    },
    {
      id: 'voice_scene_switcher',
      name: 'Sidechain Voice Auto-Switcher (Podcasts)',
      category: 'automacao',
      authorOrSource: 'OBS Lua Scripting Pack',
      tag: 'Podcasts & Mesas Redondas',
      description: 'Troca a câmera automaticamente para quem estiver falando. Detecta o sinal do microfone do Convidado ou do Host e corta a cena com inteligência.',
      benefits: [
        'Corta para o Convidado quando ele falar por mais de 800ms',
        'Volta para a Câmera Geral se ambos falarem ao mesmo tempo',
        'Evita trocas bruscas com histerese e filtro de respiro configurável',
        'Automatiza 100% de podcasts presenciais ou no Discord/VDO.Ninja'
      ],
      luaOrPythonCode: `-- OBS Lua: Auto Voice Scene Switcher
obs = obslua
host_mic = "Microfone Host"
guest_mic = "Microfone Convidado"
threshold_db = -28.0
hold_time_ms = 800

function check_voice_levels()
    local host_vol = obs.obs_source_get_volume(obs.obs_get_source_by_name(host_mic))
    local guest_vol = obs.obs_source_get_volume(obs.obs_get_source_by_name(guest_mic))
    if guest_vol > host_vol and guest_vol > threshold_db then
        obs.obs_frontend_set_current_scene(obs.obs_get_source_by_name("Cena_Convidado"))
    end
end`,
      howToInstall: 'Vá em OBS Studio > Ferramentas > Scripts > Aba "Scripts Lua/Python" > Adicionar (+). Selecione o script "voice_switcher.lua" e selecione quais microfones acionam cada câmera.',
      settingsSummary: 'Limiar: -28dB | Tempo de Espera: 800ms | Histerese: 1.5s',
    },
    {
      id: 'replay_buffer_stinger',
      name: 'Instant Replay com Vinheta Stinger (Lua)',
      category: 'automacao',
      authorOrSource: 'OBS Studio Core Scripts',
      tag: 'Gamer & Esportes',
      description: 'Gera replay instantâneo dos últimos 15 segundos de gameplay ou gol com 1 botão, rodando vinheta Stinger de transição e letreiro "REPLAY".',
      benefits: [
        'Buffer em memória RAM de ultra-alta velocidade sem engasgos',
        'Toca vinheta com som e entra em câmera lenta 70%',
        'Mostra marca d’água animada "REPLAY" no topo da tela',
        'Volta automaticamente para a transmissão ao vivo ao término do clipe'
      ],
      luaOrPythonCode: `-- OBS Lua: Instant Replay Buffer Trigger
obs = obslua
replay_source_name = "Fonte_Replay"

function trigger_instant_replay()
    -- Salva buffer de replay
    local replay_output = obs.obs_frontend_get_replay_buffer_output()
    if replay_output ~= nil then
        obs.obs_output_start(replay_output)
        -- Chamar cena de Replay com Stinger
        obs.obs_frontend_set_current_scene(obs.obs_get_source_by_name("Cena_Replay"))
    end
end`,
      howToInstall: 'No OBS: Configurações > Saída > Gravação > Ative "Buffer de Reprodução" (15 segundos). Em Ferramentas > Scripts, carregue "instant-replay.lua". Associe a tecla de atalho F9.',
      settingsSummary: 'Duração: 15s | Velocidade: 75% | Stinger: 600ms',
    },
    {
      id: 'dynamic_bitrate',
      name: 'Dynamic Bitrate & Anti-Queda (Network Guardian)',
      category: 'automacao',
      authorOrSource: 'OBS Studio Dynamic Bitrate Lua',
      tag: 'Estabilidade Total',
      description: 'Monitora a taxa de descarte de quadros (dropped frames). Ao detectar oscilação da internet do provedor, reduz o bitrate em tempo real para não derrubar a live.',
      benefits: [
        'Evita a tela preta ou live travando para o espectador',
        'Reduz de 6.000 kbps para 3.500 kbps nos segundos de instabilidade',
        'Restaura a qualidade 1080p full assim que a rede estabilizar',
        'Gera alerta sonoro discreto para a equipe de controle'
      ],
      luaOrPythonCode: `-- OBS Dynamic Bitrate Fallback
obs = obslua
function monitor_stream_health()
    local dropped = obs.obs_get_dropped_frames()
    if dropped > 15 then
        -- Reduz bitrate dinamicamente sem reiniciar a transmissão
        obs.obs_data_set_int(settings, "bitrate", 3800)
    else
        obs.obs_data_set_int(settings, "bitrate", 6000)
    end
end`,
      howToInstall: 'No OBS Studio: Configurações > Avançado > Rede > Marque a opção nativa "Ajustar dinamicamente a taxa de bits para gerenciar a congestão (Beta)" ou carregue o script Lua.',
      settingsSummary: 'Gatilho: >15 frames perdidos | Limite mínimo: 2500 kbps',
    },
    {
      id: 'downstream_keyer',
      name: 'Downstream Keyer (DSK Overlay Manager)',
      category: 'visual',
      authorOrSource: 'Exeldro / OBS Plugins',
      tag: 'Estúdio de Televisão',
      description: 'Sobrepõe GC (Gerador de Caracteres), logomarcas, avisos urgentes e placares por cima de QUALQUER cena do OBS sem precisar duplicar fontes.',
      benefits: [
        'Você troca de cena e a logomarca ou cronômetro continuam intocados',
        'Ative e desative letreiros com fade in/out independente',
        'Até 4 canais DSK independentes na transmissão',
        'Compatível com o letreiro do Central Hub OBS'
      ],
      luaOrPythonCode: `-- Downstream Keyer Setup
-- Plugin obs-downstream-keyer
DSK_Channel_1 = "Letreiro_CentralHub"
DSK_Transition = "Fade"
DSK_Duration = 300
      `,
      howToInstall: 'Instale o plugin Downstream Keyer. Vá em Exibir > Docks > Downstream Keyer. Adicione a fonte de navegador do Central Hub OBS no canal DSK 1.',
      settingsSummary: 'Canal 1: Letreiro | Canal 2: Logo | Transição: Fade 300ms',
    },
    {
      id: 'countdown_timer',
      name: 'Contador Regressivo Automático (Countdown.lua)',
      category: 'automacao',
      authorOrSource: 'OBS Core Community',
      tag: 'Abertura de Live',
      description: 'Relógio na tela de espera ("A live começa em 04:59") com contagem regressiva, efeito sonoro nos 3 segundos finais e corte autônomo para a câmera principal no zero.',
      benefits: [
        'Cria expectativa e engajamento nos minutos iniciais',
        'Sem risco de esquecer a tela de espera aberta transmitindo silêncio',
        'Transição automática no frame 00:00:00 para o apresentador',
        'Atualização em texto GDI+ ou Browser Source com visual moderno'
      ],
      luaOrPythonCode: `-- OBS Lua: Countdown Timer with Auto-Switch
obs = obslua
seconds_left = 300 -- 5 minutos

function timer_tick()
    seconds_left = seconds_left - 1
    local mins = math.floor(seconds_left / 60)
    local secs = seconds_left % 60
    local formatted = string.format("%02d:%02d", mins, secs)
    obs.obs_data_set_string(settings, "text", formatted)
    if seconds_left <= 0 then
        obs.obs_frontend_set_current_scene(obs.obs_get_source_by_name("Cena_Principal"))
    end
end`,
      howToInstall: 'Vá em Ferramentas > Scripts > "countdown.lua". Selecione a fonte de texto "Texto_Contador", o tempo inicial em minutos e a cena de destino quando terminar.',
      settingsSummary: 'Tempo inicial: 5 min | Cena final: Cena_Principal | Som de gongo: Ativo',
    },
    {
      id: 'smart_audio_ducking',
      name: 'Smart Audio Ducking (Sidechain Compressor)',
      category: 'audio',
      authorOrSource: 'Filtro Nativo de Estúdio OBS',
      tag: 'Áudio Cristalino',
      description: 'Abaixa a música de fundo ou trilha sonora automaticamente em -16dB sempre que o locutor fala no microfone, subindo suavemente ao parar de falar.',
      benefits: [
        'Voz do apresentador fica sempre clara e compreensível',
        'Música nunca abafa o conteúdo falado',
        'Subida suave (Release de 400ms) sem cortes abruptos de volume',
        'Configuração 100% nativa no OBS sem plugins pesados'
      ],
      luaOrPythonCode: `// Configuração do Filtro Compressor Sidechain no OBS:
Ratio: 4.0:1
Threshold: -26.00 dB
Attack: 6 ms
Release: 450 ms
Output Gain: 0 dB
Sidechain / Ducking Source: "Microfone / Linha"`,
      howToInstall: 'No Mixer de Áudio do OBS, clique na engrenagem da fonte de Música/BGM > Filtros > Adicionar Compressor. Defina "Fonte de Ducking" como o seu microfone principal.',
      settingsSummary: 'Proporção: 4:1 | Limiar: -26dB | Ataque: 6ms | Liberação: 450ms',
    },
    {
      id: 'sammi_streamerbot',
      name: 'Bridge SAMMI / Streamer.bot (Triggers de Chat & PIX)',
      category: 'interatividade',
      authorOrSource: 'Streamer.bot & SAMMI Core',
      tag: 'Interatividade & Doações',
      description: 'Conecta o chat do YouTube, Twitch e alertas de PIX a efeitos visuais na tela (fogos, memes, troca de luzes RGB da sala via Philips Hue/Tuya).',
      benefits: [
        'Alerta comemorativo na tela sempre que receber PIX ou super chat',
        'Comandos como !camera2, !palmas, !musica acionados pelos espectadores',
        'Pontos do canal desbloqueiam efeitos sonoros divertidos na live',
        'Controle completo por WebSocket sem travar o OBS'
      ],
      luaOrPythonCode: `// WebSocket Event Trigger (Streamer.bot payload)
{
  "request": "DoAction",
  "action": { "name": "Alerta PIX Comemorativo" },
  "args": { "donor": "Carlos Silva", "amount": "R$ 50,00" }
}`,
      howToInstall: 'Baixe o aplicativo Streamer.bot ou SAMMI. Conecte ao OBS WebSocket na porta 4455. Crie ações associadas a comandos de chat ou webhooks de PIX.',
      settingsSummary: 'Protocolo: WebSocket v5 | Webhook: Ativo | Delay: 0ms',
    },
    {
      id: 'source_dock_multiview',
      name: 'Source Dock (Multiviewer Flutuante)',
      category: 'visual',
      authorOrSource: 'Exeldro / OBS Plugins',
      tag: 'Multimonitor',
      description: 'Transforma qualquer fonte individual (Webcam, Câmera de Convidado, Feed de Vídeo) em uma janela Dock desacoplável para colocar num 2º monitor.',
      benefits: [
        'Monitore a expressão do apresentador mesmo quando outra cena estiver no ar',
        'Dock de pré-visualização para diretor de corte de TV',
        'Ideal para salas de podcast com 3 ou mais câmeras',
        'Totalmente integrado à interface do OBS Studio'
      ],
      luaOrPythonCode: `-- Source Dock XML Config
DockName = "Câmera 1 Convidado"
Source = "Cam_Convidado_VDO"
AudioMonitor = "Mute"
AspectRatio = "16:9"
      `,
      howToInstall: 'Instale o plugin Source Dock do Exeldro. Vá em Exibir > Docks > Adicionar Source Dock. Escolha o nome da câmera que deseja monitorar.',
      settingsSummary: 'Resolução: 1080p | Dock desacoplável | Aceleração por GPU',
    },
    {
      id: 'advanced_masks',
      name: 'Advanced Masks (Recortes & Formas Móveis)',
      category: 'visual',
      authorOrSource: 'OBS Studio Image Mask / Exeldro',
      tag: 'Câmeras Personalizadas',
      description: 'Aplica máscaras de recorte personalizadas (círculo, retângulo com bordas arredondadas, corações e hexágonos) para webcams e fontes, móveis pela tela.',
      benefits: [
        'Webcam com formato de coração, círculo ou cantos suaves',
        'Posicionamento livre em qualquer ponto do canvas',
        'Borda suave com canal alfa sem pixelização',
        'Baixíssimo consumo de GPU'
      ],
      luaOrPythonCode: `-- OBS Advanced Mask Filter Config
MaskType = "AlphaMask"
MaskShape = "Squircle" -- Circle, Heart, RoundedRect
BorderRadius = 32
PositionX = 0.80
PositionY = 0.75`,
      howToInstall: 'Clique com botão direito na sua Webcam > Filtros > Filtros de Efeito (+) > Máscara de Imagem / Mistura. Selecione o formato desejado.',
      settingsSummary: 'Modo: Canal Alfa | Formato: Círculo / Coração | Posição Móvel',
    },
    {
      id: 'face_tracker_auto',
      name: 'Face Tracking (Câmera Acompanhar o Rosto)',
      category: 'visual',
      authorOrSource: 'OBS Face Tracker / AI Vision',
      tag: 'Apresentação Dinâmica',
      description: 'Rastreia o rosto do apresentador em tempo real e movimenta a câmera digitalmente (pan/tilt) para mantê-lo sempre enquadrado.',
      benefits: [
        'Enquadramento automático sem operador de câmera',
        'Suavização inteligente que evita movimentos bruscos',
        'Margem superior (headroom) perfeita para lives',
        'Processamento acelerado por IA na placa de vídeo'
      ],
      luaOrPythonCode: `-- OBS Face Tracker Script
TrackingMode = "FaceCentering"
Smoothness = 0.85
HeadroomPercent = 20.0
MaxPanSpeed = 15.0`,
      howToInstall: 'Instale o plugin Face Tracker no OBS. Aplique como filtro na sua fonte de câmera e ative a detecção automática facial.',
      settingsSummary: 'Suavização: 85% | Headroom: 20% | Sensibilidade: 70%',
    },
    {
      id: 'bg_removal_no_green',
      name: 'Remover Fundo Sem Pano Verde (AI Greenscreen)',
      category: 'visual',
      authorOrSource: 'Background Removal Plugin (royshil)',
      tag: 'Inteligência Artificial',
      description: 'Remove o fundo da webcam ou adiciona desfoque bokeh cinematográfico sem precisar de tecido verde físico.',
      benefits: [
        'Dispensa iluminação cara e panos verdes no quarto/estúdio',
        'Desfoque suave estilo lente prime f/1.4',
        'Substituição de cenário por estúdios virtuais 3D',
        'Execução em DirectML / ONNX Runtime na GPU'
      ],
      luaOrPythonCode: `-- AI Background Removal Filter
Model = "SINet / RobustVideoMatting"
InferenceDevice = "GPU_DirectML"
BlurRadius = 18.0
Threshold = 0.85`,
      howToInstall: 'Baixe o plugin obs-backgroundremoval. No OBS, vá em Filtros da Webcam (+) > Background Removal e escolha Desfoque ou Cromaqui Virtual.',
      settingsSummary: 'Modelo: RVM / ONNX | Aceleração: GPU | Desfoque: 18px',
    },
    {
      id: 'input_overlay_stream',
      name: 'Input Overlay (Teclado, Mouse & Gamepad na Live)',
      category: 'interatividade',
      authorOrSource: 'univrsal / Input-Overlay',
      tag: 'Gamers & Tutoriais',
      description: 'Exibe teclado translúcido, mouse ou controle na tela, iluminando em tempo real todas as teclas e cliques pressionados.',
      benefits: [
        'Perfeito para tutoriais de edição, speedruns e gameplay',
        'Mostra cliques esquerdo, direito e roda do mouse',
        'Suporte a controles de Xbox, PlayStation e volantes',
        'Design translúcido personalizável'
      ],
      luaOrPythonCode: `-- Input Overlay Hook
Device = "Keyboard_Mouse"
Layout = "WASD_Minimal"
KeyReleaseDelay = 80 -- ms
Opacity = 0.85`,
      howToInstall: 'Instale o plugin input-overlay no OBS. Adicione uma fonte "Input Overlay" na sua cena e selecione o preset de textura e mapa de teclas.',
      settingsSummary: 'Dispositivo: Teclado + Mouse | Latência: 0ms | Opacidade: 85%',
    },
    {
      id: 'stroke_glow_shadow',
      name: 'Stroke Glow Shadow (Bordas, Neon & Sombras)',
      category: 'visual',
      authorOrSource: 'OBS ShaderFilter / StreamFX',
      tag: 'Acabamento Visual',
      description: 'Aplica bordas coloridas, brilho neon pulsante e sombras projetadas realistas em qualquer webcam, janela ou letreiro.',
      benefits: [
        'Destaca a câmera sobre fundos escuros de jogos',
        'Brilho neon com cor personalizável para tema do canal',
        'Sombras suaves que dão profundidade visual 3D',
        'Executado 100% via GPU Shaders'
      ],
      luaOrPythonCode: `// HLSL Shader: Stroke Glow Shadow
float4 stroke_color = float4(0.23, 0.51, 0.96, 1.0);
float stroke_width = 4.0;
float glow_radius = 16.0;
float shadow_blur = 20.0;`,
      howToInstall: 'No OBS, adicione o filtro ShaderFilter na sua câmera. Carregue o arquivo stroke-glow.shader e configure cores e raio de brilho.',
      settingsSummary: 'Borda: 4px | Glow: 16px | Sombra: 20px Gaussiano',
    },
    {
      id: 'downstream_keyer_dsk',
      name: 'Downstream Keyer (DSK - Camada Persistente Global)',
      category: 'automacao',
      authorOrSource: 'Exeldro / OBS Downstream Keyer',
      tag: 'Padrão TV Broadcast',
      description: 'Mantém uma camada fixa (como marca d’água da emissora, placar ou alertas) sobreposta a todas as cenas sem clonagem.',
      benefits: [
        'O logotipo do canal nunca desaparece ao trocar de cena',
        'Funciona como o DSK de switchers profissionais (Blackmagic ATEM / Tricaster)',
        'Permite ligar e desligar com 1 botão de atalho',
        'Organiza e despolui as cenas do OBS'
      ],
      luaOrPythonCode: `-- OBS DSK Global Overlay
DSK_Source = "Logo_Canal_Oficial"
PersistAcrossScenes = true
Transition = "Fade"
TransitionDuration = 300`,
      howToInstall: 'Instale o plugin Downstream Keyer do Exeldro. Vá em Exibir > Docks > Downstream Keyer. Selecione a fonte do seu logo como DSK 1.',
      settingsSummary: 'Modo: Global Persistente | Transição: Fade 300ms | DSK: Ativo',
    },
    {
      id: 'live_automated_captions',
      name: 'Legendas Automatizadas em Tempo Real (Speech-to-Text)',
      category: 'interatividade',
      authorOrSource: 'CloudFree Subtitles / Web Speech',
      tag: 'Acessibilidade Total',
      description: 'Gera legendas automáticas em tempo real a partir da fala do microfone, com opções de estilo (Closed Caption, Karaokê Gamer, Cyberpunk).',
      benefits: [
        'Torna a live 100% acessível para deficientes auditivos',
        'Gera legendas em ambientes barulhentos onde o público assiste no mudo',
        'Estilo visual configurável de acordo com o tema da live',
        'Reconhecimento contínuo em Português Brasileiro (PT-BR)'
      ],
      luaOrPythonCode: `-- Realtime Captions Webhook
Language = "pt-BR"
Style = "Karaoke_Gamer"
MaxLineChars = 42
DisplayDuration = 4.5 -- segundos`,
      howToInstall: 'Ative a ferramenta de legendas na aba Scripts & Embelezamento ou adicione uma fonte de Navegador no OBS apontando para o gerador de GC.',
      settingsSummary: 'Idioma: pt-BR | Estilos: Closed Caption / Karaokê / Cyberpunk',
    },
    {
      id: 'lumetric_corrector',
      name: 'Lumetric Corrector (Color Grading & LUTs Premiere)',
      category: 'visual',
      authorOrSource: 'OBS Lumetric Filter Suite',
      tag: 'Cinema & Cores',
      description: 'Script de correção de cor inspirado no Adobe Premiere Pro para calibrar balanço de branco, contraste e aplicar LUTs de cinema.',
      benefits: [
        'Ajuste fino de temperatura de cor (Kelvin) e tonalidade (tint)',
        'Aplicação de LUTs cinematográficos (Teal & Orange, Vintage, Film Noir)',
        'Controle de realces e sombras sem estourar o sinal de vídeo',
        'Equilíbrio perfeito de tons de pele'
      ],
      luaOrPythonCode: `-- Lumetric Premiere Grading
Exposure = 0.0
Contrast = 1.15
TemperatureKelvin = 5600
LUT_Path = "LUTs/Teal_Orange_Hollywood.cube"`,
      howToInstall: 'No OBS, clique na sua Câmera > Filtros > Aplicar LUT. Escolha qualquer arquivo .cube de correção de cor fornecido na suíte.',
      settingsSummary: 'LUT: Teal & Orange / Vintage | Temperatura: 5600K | Realces: -5',
    },
    {
      id: 'transform_3d_realtime',
      name: 'Transformações 3D em Tempo Real (Spatial Camera)',
      category: 'visual',
      authorOrSource: 'StreamFX / 3D Transform',
      tag: 'Efeito 3D Espacial',
      description: 'Permite rotacionar qualquer fonte nos eixos tridimensionais (X, Y, Z), aplicando perspectiva, curvatura e profundidade de cena.',
      benefits: [
        'Cria efeito de tela inclinada para streamers de games',
        'Projeção em perspectiva para mesas virtuais e telões 3D',
        'Animações de rotação suaves com o Move Transition',
        'Aceleração direta via pipeline 3D da GPU'
      ],
      luaOrPythonCode: `-- 3D Transform Filter
RotationX_Pitch = 12.0
RotationY_Yaw = -18.0
RotationZ_Roll = 0.0
Perspective = 800.0`,
      howToInstall: 'No OBS Studio com StreamFX instalado, adicione o filtro "Transformação 3D" na sua fonte e ajuste a rotação nos eixos X, Y e Z.',
      settingsSummary: 'Eixos: X / Y / Z | Perspectiva: 800px | Aceleração: GPU 3D',
    },
  ];

  const filteredScripts = scriptsData.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorOrSource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopyCode = (id: string, code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2500);
  };

  const handleSimulate = (script: PopularScriptItem) => {
    setActiveSimScript(script.id);
    onTriggerScriptSim(script.id, script.name);
    setTimeout(() => setActiveSimScript(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* PAINEL DE ANIMAÇÕES E EFEITOS ESPECIAIS PARA LIVE */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-purple-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black tracking-wide flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
                Animações & Efeitos Especiais para Live
              </h3>
              <p className="text-xs text-purple-200 mt-0.5">
                Dispare efeitos dinâmicos instantaneamente na tela da transmissão para engajar sua audiência ao vivo.
              </p>
            </div>
            <span className="bg-purple-500/30 text-purple-300 text-[10px] px-2.5 py-1 rounded-full font-mono border border-purple-400/30">
              OBS / Broadcast Overlay FX
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {/* Confetti */}
            <button
              onClick={() => toggleLiveFx('confetti')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                liveFxState.confetti 
                  ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-pink-300 shadow-lg shadow-pink-500/40 text-white scale-105' 
                  : 'bg-white/10 hover:bg-white/20 border-white/10 text-white/90'
              }`}
            >
              <span className="text-2xl">🎉</span>
              <span className="text-xs font-bold text-center">Chuva de Confetes</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/30 font-mono">
                {liveFxState.confetti ? '🟢 Ativo' : '⚪ Desligado'}
              </span>
            </button>

            {/* Fireworks */}
            <button
              onClick={() => toggleLiveFx('fireworks')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                liveFxState.fireworks 
                  ? 'bg-gradient-to-br from-amber-500 to-red-600 border-amber-300 shadow-lg shadow-amber-500/40 text-white scale-105' 
                  : 'bg-white/10 hover:bg-white/20 border-white/10 text-white/90'
              }`}
            >
              <span className="text-2xl">🎆</span>
              <span className="text-xs font-bold text-center">Fogos de Artifício</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/30 font-mono">
                {liveFxState.fireworks ? '🟢 Ativo' : '⚪ Desligado'}
              </span>
            </button>

            {/* Snow */}
            <button
              onClick={() => toggleLiveFx('snow')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                liveFxState.snow 
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-300 shadow-lg shadow-cyan-500/40 text-white scale-105' 
                  : 'bg-white/10 hover:bg-white/20 border-white/10 text-white/90'
              }`}
            >
              <span className="text-2xl">❄️</span>
              <span className="text-xs font-bold text-center">Neve Caindo</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/30 font-mono">
                {liveFxState.snow ? '🟢 Ativo' : '⚪ Desligado'}
              </span>
            </button>

            {/* Disco */}
            <button
              onClick={() => toggleLiveFx('disco')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                liveFxState.disco 
                  ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 border-yellow-300 shadow-lg shadow-purple-500/40 text-white scale-105' 
                  : 'bg-white/10 hover:bg-white/20 border-white/10 text-white/90'
              }`}
            >
              <span className="text-2xl">🪩</span>
              <span className="text-xs font-bold text-center">Luzes Boates</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/30 font-mono">
                {liveFxState.disco ? '🟢 Ativo' : '⚪ Desligado'}
              </span>
            </button>

            {/* Applaud */}
            <button
              onClick={() => toggleLiveFx('applaud')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                liveFxState.applaud 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-300 shadow-lg shadow-emerald-500/40 text-white scale-105' 
                  : 'bg-white/10 hover:bg-white/20 border-white/10 text-white/90'
              }`}
            >
              <span className="text-2xl">👏</span>
              <span className="text-xs font-bold text-center">Mãos Aplaudindo</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/30 font-mono">
                {liveFxState.applaud ? '🟢 Ativo' : '⚪ Desligado'}
              </span>
            </button>
          </div>
        </div>

        {/* OVERLAYS VISUAIS NA TELA QUANDO ATIVADOS */}
        {liveFxState.confetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={`confetti-${i}`}
                className="absolute w-3 h-3 rounded-xs animate-[confetti-fall_3s_linear_infinite]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  backgroundColor: ['#ff0055', '#00ffcc', '#ffcc00', '#9900ff', '#ffffff'][i % 5],
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}

        {liveFxState.snow && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={`snow-${i}`}
                className="absolute w-2 h-2 rounded-full bg-white animate-[snow-fall_4s_linear_infinite]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  opacity: 0.8,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${3 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        )}

        {liveFxState.fireworks && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-20">
            <div className="w-64 h-64 rounded-full border-4 border-yellow-400 animate-[firework-burst_1.5s_ease-out_infinite] opacity-80 shadow-[0_0_50px_#ff0055]" />
            <div className="absolute w-48 h-48 rounded-full border-4 border-pink-400 animate-[firework-burst_1.2s_ease-out_infinite] opacity-80 delay-300" />
          </div>
        )}

        {liveFxState.disco && (
          <div className="absolute inset-0 pointer-events-none border-4 border-purple-500 animate-[disco-flash_1s_ease-in-out_infinite] z-20" />
        )}

        {liveFxState.applaud && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-around pointer-events-none z-20 px-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={`applaud-${i}`}
                className="text-3xl animate-[applaud-bounce_0.6s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                👏
              </span>
            ))}
          </div>
        )}
      </div>

      <StudioEffectsSuite onNotify={(msg) => onTriggerScriptSim('fx', msg)} />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Todos os Scripts (10)' },
            { id: 'visual', label: '🎨 Visual & Embelezamento' },
            { id: 'automacao', label: '🤖 Automações Inteligentes' },
            { id: 'audio', label: '🎙️ Áudio & Sidechain' },
            { id: 'interatividade', label: '💬 Interatividade & Chat' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar plugin ou script..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Scripts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredScripts.map((script) => {
          const isSimulating = activeSimScript === script.id;
          return (
            <div
              key={script.id}
              className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-purple-300 transition-all"
            >
              {/* Card Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm">{script.name}</h3>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                      {script.tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Por {script.authorOrSource}
                  </span>
                </div>

                <button
                  onClick={() => handleSimulate(script)}
                  disabled={isSimulating}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 shadow-2xs ${
                    isSimulating
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white hover:bg-slate-100 text-purple-700 border-purple-300'
                  }`}
                  title="Testar e simular efeito via OBS WebSocket"
                >
                  <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Disparado!' : 'Testar'}</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3.5 flex-1 text-xs">
                <p className="text-slate-700 font-medium leading-relaxed">
                  {script.description}
                </p>

                {/* Benefits List */}
                <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1.5 uppercase text-[10px] tracking-wider">
                    Vantagens & Impacto na Transmissão:
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    {script.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Configuration / Code Snippet */}
                {script.luaOrPythonCode && (
                  <div className="bg-slate-900 rounded-lg p-3 text-slate-200 font-mono text-[11px] relative overflow-x-auto">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 border-b border-slate-800 pb-1">
                      <span>CÓDIGO / CONFIGURAÇÃO LUA:</span>
                      <button
                        onClick={() => handleCopyCode(script.id, script.luaOrPythonCode)}
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        {copiedScriptId === script.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScriptId === script.id ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                    <pre className="text-slate-300 text-[10px] leading-tight overflow-x-auto">
                      {script.luaOrPythonCode}
                    </pre>
                  </div>
                )}

                {/* How to install */}
                <div className="text-[11px] text-slate-500 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                  <strong className="text-amber-900 block font-bold mb-0.5">Como Ativar no OBS:</strong>
                  <span>{script.howToInstall}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-mono">{script.settingsSummary}</span>
                <button
                  onClick={() => handleCopyCode(script.id, script.luaOrPythonCode)}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar Script</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide: Step-by-Step Installation of Lua/Python Scripts in OBS */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-purple-600" />
          Passo a Passo: Como Adicionar Scripts Lua e Python no seu OBS Studio
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px] mb-2">1</span>
            <strong className="text-slate-800 block mb-1">Abrir Gerenciador de Scripts</strong>
            <p className="text-slate-600 text-[11px]">No OBS Studio, clique no menu superior <strong>Ferramentas</strong> e escolha <strong>Scripts</strong>.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px] mb-2">2</span>
            <strong className="text-slate-800 block mb-1">Carregar o Arquivo .lua</strong>
            <p className="text-slate-600 text-[11px]">Clique no botão <strong>+ (Mais)</strong> no canto inferior esquerdo e selecione o arquivo do script desejado.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px] mb-2">3</span>
            <strong className="text-slate-800 block mb-1">Configurar Parâmetros</strong>
            <p className="text-slate-600 text-[11px]">Selecione a fonte de microfone, a cena de destino ou o tempo do contador no painel direito que surge.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px] mb-2">4</span>
            <strong className="text-slate-800 block mb-1">Pronto e Automatizado!</strong>
            <p className="text-slate-600 text-[11px]">O OBS executará a lógica em segundo plano sem necessidade de intervenção manual durante a live.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
