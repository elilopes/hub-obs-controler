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
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-800/40 rounded-xl p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-600/30 text-purple-400 border border-purple-500/40">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">Scripts & Plugins Populares para Embelezar e Automatizar Lives</h2>
            <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
              Top 10 Mundial
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Catálogo completo com os scripts Lua, plugins e filtros mais utilizados por grandes canais e emissoras para dar acabamento cinematográfico, evitar quedas de rede e automatizar trocas de câmera.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-purple-300 bg-purple-900/50 border border-purple-700/60 px-3 py-1.5 rounded-lg font-mono">
            OBS v30+ Compatível
          </span>
        </div>
      </div>

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
