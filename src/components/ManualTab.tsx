import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Code, 
  Sparkles, 
  Radio, 
  PlayCircle, 
  CheckCircle2, 
  Tv, 
  Sliders, 
  ShieldCheck, 
  Key, 
  Video, 
  Layers, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  Zap,
  Mic,
  Monitor,
  ArrowUp,
  ChevronUp,
  ListOrdered,
  BookmarkCheck,
  Compass,
  FileText,
  Printer
} from 'lucide-react';

export const ManualTab: React.FC = () => {
  const handleSavePDF = (sectionTitle = "Manual Técnico & Operacional Broadcast") => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Por favor, permita pop-ups no navegador para exportar o PDF.");
      return;
    }
    
    const manualElement = document.getElementById("broadcast-manual-container");
    const contentHTML = manualElement ? manualElement.innerHTML : document.body.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${sectionTitle}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; line-height: 1.6; padding: 2rem; background: #ffffff; }
          h1, h2, h3 { color: #0f172a; }
          button { display: none !important; }
          table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
          th, td { border: 1px solid #cbd5e1; padding: 0.5rem; text-align: left; }
          th { background: #f1f5f9; }
          code, pre { background: #f8fafc; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.85em; }
          pre { padding: 1rem; overflow-x: auto; }
          div, section { break-inside: avoid; }
        </style>
      </head>
      <body>
        <h1>${sectionTitle}</h1>
        <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 2rem;">Gerado em Broadcast Suite - Manual Técnico Oficial</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 2rem;" />
        ${contentHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 600);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGuideView, setActiveGuideView] = useState<'all' | 'checklist'>('all');
  
  // Checklist interativo pré-live
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
  });

  const toggleCheck = (stepId: string) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;

  const liveSteps = [
    {
      id: 'step1',
      stepNumber: '01',
      title: 'Conectar o OBS Studio ao Central Hub',
      shortDesc: 'Estabeleça a ponte de comunicação via WebSocket v5 entre o programa e o OBS.',
      icon: <Monitor className="w-5 h-5 text-blue-600" />,
      tag: 'Conexão & Conectividade',
      color: 'blue',
      actions: [
        'Abra o OBS Studio instalado em seu computador (Windows ou Mac/Linux).',
        'No OBS, vá em Ferramentas > Configurações do servidor WebSocket.',
        'Certifique-se de que a opção "Ativar servidor WebSocket" está MARCADA (Porta padrão: 4455).',
        'No Central Hub OBS clique no led "OBS OFF" no topo do sistema (cor vermelha); em Perfil de Estúdio Selecionado clique em Estúdio principal (OBS Studio); em Software / Motor de Transmissão Suportado clique em OBS Studio Porta 4455; em Modo de Operação da Conexão clique no Modo direto (obs-websocket-js); então digite: o IP (localhost), a porta (4455) e, a senha configurada; para finalizar clique no botão Salvar e conectar perfil.',
      ],
      proTip: 'Dica Pro: Quando o LED "OBS ON" acender em verde, você terá controle instantâneo e telemetria em tempo real (FPS, CPU e Bitrate) sem latência.'
    },
    {
      id: 'step2',
      stepNumber: '02',
      title: 'Configurar Destino, YouTube/Instagram OAuth2 e Cópia Cruzada',
      shortDesc: 'Defina para onde o sinal de vídeo será enviado e use Cópia Cruzada para replicar nos destinos simultâneos.',
      icon: <Key className="w-5 h-5 text-purple-600" />,
      tag: 'Destinos & Plataformas',
      color: 'purple',
      actions: [
        'Acesse a aba "Logins & APIs" ou utilize a aba "Multi-Destinos & Aitum" para transmissões simultâneas.',
        'Autenticação YouTube OAuth2: Conecte sua conta Google no card oficial para capturar automaticamente a Stream Key ativa e servidor RTMP do seu canal sem abrir o YouTube Studio.',
        'Para Instagram: clique em "Conectar com Instagram OAuth2" ou insira a Stream Key gerada no Instagram Live Producer.',
        'Use o novo botão "Cópia Cruzada de Stream": ele clona instantaneamente os parâmetros do stream primário (chave e servidor) para a Twitch, Kick, Facebook ou destinos do plugin Sorayuki.',
        'Ao aplicar a chave no OBS, confira no painel de Logins se o status OAuth2 está ativo e pronto para o streaming.',
        'Se for transmitir também na vertical (TikTok/Instagram Reels), ative a saída correspondente no ecossistema Aitum Vertical.',
      ],
      proTip: 'Cópia Cruzada & Status: O botão "Cópia Cruzada de Stream" economiza minutos preciosos na pré-live replicando as credenciais para todos os canais com 1 clique de forma segura.'
    },
    {
      id: 'step3',
      stepNumber: '03',
      title: 'Ajustar Qualidade de Vídeo e Trava de Áudio (Proteção Hot Mic)',
      shortDesc: 'Defina a taxa de bits e garanta que nenhum microfone seja aberto sem autorização prévia.',
      icon: <Sliders className="w-5 h-5 text-amber-600" />,
      tag: 'Vídeo & Áudio Seguro',
      color: 'amber',
      actions: [
        'Vá para a aba "Qualidade Vídeo & Gravação": escolha a resolução (ex: 1080p 60fps ou 936p para Twitch) e taxa de bitrate compatível com sua velocidade de upload (ex: 6.000 kbps para Full HD estável).',
        'Escolha o codificador NVENC (placas NVIDIA) para aliviar o processador da máquina.',
        'Acesse a aba "Mídia & Áudio": verifique o Mixer de Áudio Master.',
        'ATENÇÃO: Por segurança (Proteção Hot Mic), o microfone inicia DESATIVADO (volume 0 e mutado). Suba o fader e clique em "Desmutar" somente quando estiver preparado para falar!',
      ],
      proTip: 'Dica Hot Mic: O silêncio do microfone no início evita vazamento acidental de conversas de bastidores antes do show começar.'
    },
    {
      id: 'step4',
      stepNumber: '04',
      title: 'Preparar Cenas, Letreiro Dinâmico e Câmeras',
      shortDesc: 'Organize o layout visual da live, letreiro de notícias e posicione a cena de contagem regressiva.',
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      tag: 'Layout & Produção',
      color: 'indigo',
      actions: [
        'Na aba "Controle & Cenas", certifique-se de que a cena inicial (ex: "Em Breve / Espera" ou "Contagem Regressiva") está selecionada no Preview/Programa.',
        'Se ainda não criou cenas, use o botão "Criar Cenas Padrão" para gerar automaticamente Cena Principal, Câmera Cheia, Tela Cheia e Encerramento.',
        'Na aba "Letreiro Dinâmico", digite sua mensagem de boas-vindas, links de redes sociais ou chave PIX de apoio.',
        'Se houver convidados remotos, envie os links gerados na aba "VDO.Ninja Room".',
      ],
      proTip: 'Profissionalismo: Iniciar a live com uma tela de contagem regressiva de 2 a 5 minutos permite que seus espectadores entrem e recebam a notificação da plataforma.'
    },
    {
      id: 'step5',
      stepNumber: '05',
      title: 'Iniciar a Transmissão (LIVE ON) e Gravação Local',
      shortDesc: 'Dispare o sinal oficial de transmissão e libere os painéis ao vivo.',
      icon: <Radio className="w-5 h-5 text-emerald-600" />,
      tag: 'Entrando no Ar',
      color: 'emerald',
      actions: [
        'No painel mestre de controle superior, clique no botão "Iniciar Transmissão".',
        'Confirme que o LED de status "LIVE ON" acendeu em vermelho no cabeçalho.',
        'Com a LIVE ON ativa, o bloco "Controle PTZ Virtual (Pan / Tilt / Zoom)" e as automações ao vivo serão totalmente destravados para operação.',
        'Opcional recomendado: Se desejar arquivar o vídeo bruto em altíssima qualidade para edição posterior de cortes/reels, clique em "Iniciar Gravação" (LED "REC ON" acende em vermelho).',
      ],
      proTip: 'Monitoramento: Verifique o indicador de Bitrate e Perda de Quadros (Dropped Frames). Se a linha de bitrate estiver verde e sem oscilações drásticas, seu streaming está perfeito.'
    },
    {
      id: 'step6',
      stepNumber: '06',
      title: 'Durante a Live e Encerramento Profissional',
      shortDesc: 'Operação fluida durante o evento e passo a passo para finalizar sem cortes abruptos.',
      icon: <ShieldCheck className="w-5 h-5 text-cyan-600" />,
      tag: 'Operação & Desfecho',
      color: 'cyan',
      actions: [
        'Alterne entre as cenas clicando nos botões de cena rápida ou use o trocador automático configurado.',
        'Use o Controle PTZ Virtual (Zoom e enquadramento suave da câmera) para focar no palestrante ou convidado.',
        'Para finalizar com excelência: agradeça a audiência, mude para a cena "Encerramento / Créditos", mute o microfone na aba Áudio e aguarde 15 a 30 segundos.',
        'Clique em "Parar Transmissão" e depois em "Parar Gravação". Os LEDs "LIVE ON" e "REC ON" serão desativados.',
      ],
      proTip: 'Finalização Suave: Aguardar 15 segundos na tela final antes de interromper evita que os últimos segundos de fala sejam cortados pelo atraso (buffer/delay) das redes sociais.'
    }
  ];

  const docFunctions = [
    {
      name: 'acao_criar_cenas',
      pt: 'Gera e monta automaticamente no OBS Studio a estrutura inicial de cenas padrões necessárias para a transmissão.',
      en: 'Automatically generates and builds the initial standard scene structure required for broadcasting within OBS Studio.',
      category: 'Cenas & Fontes',
    },
    {
      name: 'acao_salvar_destino_rtmp',
      pt: 'Captura o nome do servidor personalizado inserido na aba Multi-Destinos e valida o endpoint de streaming.',
      en: 'Captures the custom server name entered in the Multi-Destinations tab and validates the streaming endpoint.',
      category: 'Multi-RTMP',
    },
    {
      name: 'acao_iniciar_multi_rtmp / acao_parar_multi_rtmp',
      pt: 'Controla o disparo simultâneo do fluxo de dados para múltiplos servidores RTMP independentes.',
      en: 'Controls the simultaneous streaming data output to multiple independent RTMP servers.',
      category: 'Multi-RTMP',
    },
    {
      name: 'acao_sincronizar_canvas_aitum',
      pt: 'Força o alinhamento de proporção e posicionamento entre o Canvas mestre (16:9) e o painel vertical do plugin Aitum (9:16).',
      en: 'Forces the aspect ratio and positioning alignment between the master Canvas (16:9) and the Aitum plugin vertical panel (9:16).',
      category: 'Aitum Vertical',
    },
    {
      name: 'acao_iniciar_multistream_aitum',
      pt: 'Dispara as transmissões secundárias focadas em plataformas verticais (TikTok/Instagram) e liga o indicador LED visual de Live Online.',
      en: 'Triggers secondary broadcasts focused on vertical platforms (TikTok/Instagram) and turns on the visual Live Online LED indicator.',
      category: 'Aitum Vertical',
    },
    {
      name: 'acao_parar_multistream_aitum',
      pt: 'Encerra o envio de dados para o ecossistema Aitum Vertical e desliga o indicador LED visual de status no topo.',
      en: 'Terminates data streaming to the Aitum Vertical ecosystem and turns off the top visual status LED indicator.',
      category: 'Aitum Vertical',
    },
    {
      name: 'iniciar_login_youtube',
      pt: 'Inicia a autenticação oficial e segura via Google OAuth2 abrindo o navegador do sistema para capturar o canal e Stream Key.',
      en: 'Initiates the official and secure Google OAuth2 authentication by opening the system browser to capture channel and Stream Key.',
      category: 'Autenticação',
    },
    {
      name: 'acao_disparar_macro_movimento',
      pt: 'Interage com o plugin Move Transition para acionar filtros de animação e movimentação suave de elementos visuais na cena.',
      en: 'Interacts with the Move Transition plugin to trigger animation and smooth motion filters for visual elements in the scene.',
      category: 'Macros & Animações',
    },
    {
      name: 'acao_controlar_ptz',
      pt: 'Gerencia o PTZ Virtual (Pan, Tilt, Zoom) recalculando e aplicando em tempo real as coordenadas de Crop de forma suave na webcam.',
      en: 'Manages Virtual PTZ (Pan, Tilt, Zoom) by recalculating and applying smooth webcam Crop coordinates in real time.',
      category: 'Câmeras',
    },
    {
      name: 'alternar_estado_advanced_switcher',
      pt: 'Comunica-se via protocolo Vendor com o plugin Advanced Scene Switcher para ligar ou pausar as rotinas nativas de automação do OBS.',
      en: 'Communicates via Vendor protocol with the Advanced Scene Switcher plugin to start or pause native OBS automation routines.',
      category: 'Automação',
    },
    {
      name: 'exportar_regras_para_advanced_switcher',
      pt: 'Converte o dicionário local de automações do aplicativo em um arquivo estruturado no formato JSON legível para importação no OBS.',
      en: 'Converts the application local automation dictionary into a structured JSON file readable for import into OBS.',
      category: 'Automação',
    },
    {
      name: 'criar_monitor_fluxo',
      pt: 'Renderiza no topo o display dinâmico de monitoramento, exibindo taxas de bitrate, consumo de CPU, FPS e cronometragem da transmissão.',
      en: 'Renders the dynamic monitoring display at the top, showing bitrate, CPU usage, FPS, and live stream timers.',
      category: 'Telemetria',
    },
    {
      name: 'criar_inicializador_obs',
      pt: 'Constrói o bloco de controle inicial que permite definir o diretório do OBS Studio e disparar o executável do programa.',
      en: 'Builds the initial control block used to set the OBS Studio path and launch the program executable file.',
      category: 'Sistema',
    },
    {
      name: 'criar_master_switches',
      pt: 'Cria os interruptores mestres globais para Iniciar/Parar Transmissão, Iniciar/Parar Gravação e o botão de compartilhar links rápidos.',
      en: 'Creates the global master switches to Start/Stop Streaming, Start/Stop Recording, and the quick link sharing button.',
      category: 'Controle Mestre',
    },
    {
      name: 'criar_audio_filtros',
      pt: 'Gera o slider de volume master em tempo real e o botão de alternância para ligar ou desligar filtros e compressores de áudio.',
      en: 'Generates the real-time master volume slider and the toggle button to turn audio filters and compressors on or off.',
      category: 'Áudio',
    },
    {
      name: 'criar_midias_slides',
      pt: 'Estrutura o painel multimídia contendo os botões de Play/Pause para vídeos e o acionador para avançar slides de apresentação.',
      en: 'Structures the multimedia panel featuring Play/Pause buttons for video tracks and the remote trigger to advance presentation slides.',
      category: 'Mídia',
    },
    {
      name: 'criar_painel_chaveador_automatico',
      pt: 'Desenha a interface lógica de automação onde o usuário pode cadastrar, listar e limpar regras condicionais para a troca de cenas.',
      en: 'Designs the automation logical interface where users can register, view, and clear conditional rules for scene switching.',
      category: 'Automação',
    },
    {
      name: 'criar_painel_wpstream',
      pt: 'Injeta o painel de integração dedicado à plataforma WPStream para gerenciamento de chaves privadas e transmissão via WordPress.',
      en: 'Injects the integration panel dedicated to the WPStream platform for private key management and WordPress live broadcasting.',
      category: 'Integrações',
    },
    {
      name: 'criar_painel_central_logins',
      pt: 'Centraliza o gerenciamento de chaves e os botões oficiais de conexão com APIs externas de transmissão.',
      en: 'Centralizes key management and official connection buttons for external broadcasting APIs.',
      category: 'Autenticação',
    },
  ];

  const filtered = docFunctions.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToBlock = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const manualBlocks = [
    {
      id: 'bloco-checklist-live',
      number: '01',
      title: 'Checklist & Manual Operacional Pré-Live',
      subtitle: 'Passo a passo cronológico completo do setup inicial até o encerramento da live',
      icon: <PlayCircle className="w-5 h-5 text-emerald-400" />,
      badge: '6 Etapas',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'bloco-regras-ouro',
      number: '02',
      title: 'Regras de Ouro para Transmissão Sem Erros',
      subtitle: 'Boas práticas de microfone seguro, cabo de rede, GPU e cenas de emergência',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      badge: '4 Recomendações',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'bloco-zoom-meet-teams',
      number: '03',
      title: 'OBS com Zoom, Google Meet e Microsoft Teams',
      subtitle: 'Comparativo: Modo Câmera Virtual (Webcam HD) vs Modo OAuth2 / RTMP Ingest',
      icon: <Video className="w-5 h-5 text-blue-400" />,
      badge: '3 Softwares',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    {
      id: 'bloco-guia-desenvolvedor',
      number: '04',
      title: 'Guia do Desenvolvedor: URLs & Chaves de API (OAuth2)',
      subtitle: 'Manual detalhado para Twitch, Facebook, TikTok, Discord, Vimeo, Zoom e Teams',
      icon: <Key className="w-5 h-5 text-purple-400" />,
      badge: 'Client IDs & Secrets',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'bloco-dicionario-funcoes',
      number: '05',
      title: 'Dicionário Técnico de Funções / Technical Functions',
      subtitle: 'Documentação técnica bilíngue (PT/EN) de rotinas, métodos e scripts internos',
      icon: <BookOpen className="w-5 h-5 text-cyan-400" />,
      badge: `${docFunctions.length} Métodos`,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'bloco-comandos-voz',
      number: '06',
      title: 'Comandos por Voz para Transmissão Ao Vivo (Voice Control)',
      subtitle: 'Comandos falados em Português para iniciar live, trocar cenas, mutar e gravar sem as mãos',
      icon: <Mic className="w-5 h-5 text-rose-400" />,
      badge: '14 Comandos',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'bloco-controle-remoto-vpn',
      number: '07',
      title: 'Conexão Remota Online: WebSocket, VPNs & Multi-Softwares',
      subtitle: 'Tailscale, ZeroTier, Chaveador Automático e controle de vMix, Streamlabs, Wirecast, PRISM e Meld',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      badge: 'Rede & APIs',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    }
  ];

  return (
    <div className="space-y-6" id="broadcast-manual-container">

      {/* ÍNDICE DE TODOS OS BLOCOS DO MANUAL TÉCNICO */}
      <div id="bloco-indice-manual" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base md:text-lg text-white">
                  Índice Geral do Manual Técnico
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Selecione qualquer bloco abaixo para ir direto ao conteúdo. Cada bloco possui um botão com seta para cima para retornar a este índice e opção de imprimir.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => handleSavePDF()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              title="Salvar Manual em PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Salvar em PDF</span>
            </button>
            <button
              type="button"
              onClick={() => handleSavePDF()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition shadow-xs cursor-pointer"
              title="Imprimir Manual Técnico Completo"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* Grade de Acesso Direto aos Blocos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {manualBlocks.map((block) => (
            <button
              key={block.id}
              type="button"
              onClick={() => scrollToBlock(block.id)}
              className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/60 text-left transition group cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-300 group-hover:text-blue-400 group-hover:border-blue-500/50 transition">
                      {block.number}
                    </span>
                    <span className="p-1 rounded-md bg-slate-900/80">
                      {block.icon}
                    </span>
                  </div>
                  <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded border ${block.badgeColor}`}>
                    {block.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-xs md:text-sm text-white group-hover:text-blue-300 transition">
                    {block.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                    {block.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-2.5 mt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span className="text-slate-500 group-hover:text-slate-300">Ir para o bloco</span>
                <span className="text-blue-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  Acessar <span>→</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* BLOCO 1: GUIA PASSO A PASSO & CHECKLIST PRÉ-LIVE */}
      <div id="bloco-checklist-live" className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl shadow-md border border-slate-700/60 p-6 text-white relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Header do Guia com Botão Voltar ao Índice */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-700/70">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
                <PlayCircle className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    Bloco 01 • Guia Passo a Passo Oficial
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-400" /> Transmissão Perfeita
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                  Como Iniciar uma Live Usando Este Programa
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Manual prático cronológico para conectar, configurar, proteger áudio e transmitir ao vivo com qualidade broadcast.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Botão Imprimir Bloco 1 */}
              <button
                type="button"
                onClick={() => handleSavePDF()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition shadow-xs cursor-pointer"
                title="Salvar este bloco em PDF"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span>Salvar em PDF</span>
              </button>

              {/* Botão de Retorno ao Índice */}
              <button
                type="button"
                onClick={() => scrollToBlock('bloco-indice-manual')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition shadow-xs cursor-pointer"
                title="Retornar para o Índice do Manual Técnico"
              >
                <ArrowUp className="w-3.5 h-3.5 text-blue-400" />
                <span>Voltar ao Índice ↑</span>
              </button>

              {/* Checklist Progress Indicator */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex items-center gap-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Progresso Pré-Live</div>
                <div className="text-base font-extrabold text-white flex items-center gap-1">
                  <span>{completedCount}</span>
                  <span className="text-xs text-slate-400">/ {liveSteps.length} passos concluídos</span>
                </div>
              </div>
              <div className="w-16 bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    completedCount === liveSteps.length ? 'bg-emerald-400' : 'bg-blue-400'
                  }`}
                  style={{ width: `${(completedCount / liveSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

          {/* Destaque dos 3 LEDs de Status do Programa (OBS, LIVE, REC) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <div className="text-xs font-bold text-white">1. LED OBS ON/OFF</div>
                <div className="text-[11px] text-slate-300">Conexão ativa com o motor OBS via WebSocket v5.</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div>
                <div className="text-xs font-bold text-white">2. LED LIVE ON/OFF</div>
                <div className="text-[11px] text-slate-300">Transmissão no ar. Destrava controles ao vivo e PTZ.</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div>
                <div className="text-xs font-bold text-white">3. LED REC ON/OFF</div>
                <div className="text-[11px] text-slate-300">Gravação local ativa para gravação e corte de vídeos.</div>
              </div>
            </div>
          </div>

          {/* Grade de Passos Cronológicos (Passo a Passo) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveSteps.map((step) => {
              const isChecked = checkedSteps[step.id];
              return (
                <div 
                  key={step.id} 
                  className={`relative rounded-xl border p-4.5 transition-all duration-200 flex flex-col justify-between ${
                    isChecked 
                      ? 'bg-slate-800/95 border-emerald-500/60 shadow-sm' 
                      : 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Top Step Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-700/80 border border-slate-600 text-xs font-black text-cyan-300 font-mono">
                          {step.stepNumber}
                        </span>
                        <div className="p-1.5 rounded-lg bg-slate-700/50">
                          {step.icon}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded">
                          {step.tag}
                        </span>
                      </div>

                      {/* Botão de Check para checklist interativo */}
                      <button
                        onClick={() => toggleCheck(step.id)}
                        className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                          isChecked
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-700/40 text-slate-400 border-slate-600 hover:text-slate-200 hover:bg-slate-700/70'
                        }`}
                        title="Marcar como passo revisado"
                      >
                        {isChecked ? (
                          <>
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Concluído</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-3.5 h-3.5" />
                            <span>Check</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Step Title & Short Desc */}
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        {step.shortDesc}
                      </p>
                    </div>

                    {/* Action Items */}
                    <div className="space-y-1.5 pt-1">
                      {step.actions.map((act, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{act}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Pro Tip Box */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-700/60">
                    <div className="bg-slate-900/60 rounded-lg p-2.5 text-[11px] text-amber-200/90 border border-amber-500/20 flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{step.proTip}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* BLOCO 2: Dicas Rápidas de Ouro para a Live Perfeita */}
          <div id="bloco-regras-ouro" className="bg-gradient-to-r from-blue-950/70 via-slate-900/80 to-purple-950/70 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Bloco 02 • Regras de Ouro para uma Transmissão Sem Erros
              </h4>
              <div className="flex items-center gap-2">
                <button
                type="button"
                onClick={() => handleSavePDF()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold transition cursor-pointer"
                title="Salvar este bloco em PDF"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span>Salvar em PDF</span>
              </button>
                <button
                  type="button"
                  onClick={() => scrollToBlock('bloco-indice-manual')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold transition cursor-pointer"
                  title="Voltar ao Índice"
                >
                  <ArrowUp className="w-3 h-3 text-blue-400" />
                  <span>Índice ↑</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-300">
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                <span className="font-bold text-white block mb-0.5">🔒 Microfone Seguro</span>
                Nunca abra o microfone antes da contagem acabar. Utilize a trava Hot Mic padrão deste programa.
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                <span className="font-bold text-white block mb-0.5">🌐 Cabo de Rede (Ethernet)</span>
                Transmita sempre via cabo de rede em vez de Wi-Fi para evitar perda de pacotes e oscilação de bitrate.
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                <span className="font-bold text-white block mb-0.5">⚙️ Carga do Processador</span>
                Mantenha a CPU abaixo de 40% utilizando codificadores de hardware GPU (NVIDIA NVENC ou AMD AMF).
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                <span className="font-bold text-white block mb-0.5">🎬 Telas de Transição</span>
                Tenha sempre uma cena de emergência "Voltamos em Breve" para pausas técnicas sem fechar a live.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BLOCO 3: OBS COM ZOOM, GOOGLE MEET E MICROSOFT TEAMS */}
      <div id="bloco-zoom-meet-teams" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  Bloco 03
                </span>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">
                  Guia Completo: OBS Studio com Zoom, Google Meet e Microsoft Teams
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Entenda os dois modos disponíveis: <strong>Modo Câmera Virtual</strong> e <strong>Modo OAuth2 / RTMP Ingest</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
                type="button"
                onClick={() => handleSavePDF()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition shadow-xs cursor-pointer"
                title="Salvar este bloco em PDF"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span>Salvar em PDF</span>
              </button>
            <button
              type="button"
              onClick={() => scrollToBlock('bloco-indice-manual')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition shadow-xs cursor-pointer"
              title="Retornar para o Índice do Manual Técnico"
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Voltar ao Índice ↑</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Card 1: Câmera Virtual */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <Video className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. Modo Câmera Virtual (Webcam HD)</h4>
                <span className="text-[10px] text-slate-500">Reuniões diárias, aulas e chamadas de vídeo</span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">
              O OBS transforma sua saída de vídeo em uma <strong>webcam virtual do sistema</strong> ("OBS Virtual Camera"). Os aplicativos (Zoom, Meet ou Teams) recebem o sinal como se fosse uma câmera física conectada.
            </p>
            <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc list-inside">
              <li><strong>Vantagem:</strong> Funciona em contas gratuitas de qualquer usuário sem precisar de plano Enterprise.</li>
              <li><strong>Interatividade:</strong> Você troca de cenas, insere letreiros, GC, vídeos e chroma key ao vivo na reunião.</li>
              <li><strong>Áudio:</strong> O microfone pode ser enviado direto ou via cabo de áudio virtual (VB-CABLE).</li>
            </ul>
          </div>

          {/* Card 2: Modo OAuth2 / RTMP Ingest */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600 text-white">
                <Key className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. Modo OAuth2 / RTMP Ingest (Nuvem)</h4>
                <span className="text-[10px] text-slate-500">Webinars, Town Halls e Eventos Oficiais</span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">
              O OBS transmite um fluxo de vídeo codificado (RTMP) diretamente para a infraestrutura de nuvem da plataforma com chave de transmissão segura capturada via OAuth2.
            </p>
            <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc list-inside">
              <li><strong>Zoom:</strong> Custom Live Streaming Service via Zoom REST API v2 para webinars e sessões públicas.</li>
              <li><strong>Google Meet:</strong> Integração com Google Workspace para transmitir reuniões corporativas ao vivo.</li>
              <li><strong>Microsoft Teams:</strong> RTMP-In e Entra ID OAuth2 para eventos do tipo Town Hall e Live Events.</li>
            </ul>
          </div>
        </div>

        {/* Passo a passo prático para cada um dos 3 programas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1.5">
            <h5 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
              <span>🔵 No Zoom:</span>
            </h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Vá em <strong>Configurações &gt; Vídeo</strong>, selecione <strong>"OBS Virtual Camera"</strong>, ative <strong>"Habilitar HD"</strong> e desmarque <em>"Espelhar meu vídeo"</em>.
            </p>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
            <h5 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
              <span>🟢 No Google Meet:</span>
            </h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              No menu (⋮), vá em <strong>Configurações &gt; Vídeo</strong>, escolha <strong>"OBS Virtual Camera"</strong> e defina a <strong>Resolução de envio em 720p HD</strong>.
            </p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-1.5">
            <h5 className="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
              <span>🟣 No Microsoft Teams:</span>
            </h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Acesse <strong>Configurações (...) &gt; Dispositivos</strong>, selecione <strong>"OBS Virtual Camera"</strong> no menu de Câmera e aproveite taxa fluida de 60 FPS.
            </p>
          </div>
        </div>
      </div>

      {/* BLOCO 4: GUIA COMPLETO DE CONFIGURAÇÃO DE URLS E KEYS DE DESENVOLVEDOR (OAUTH2) */}
      <div id="bloco-guia-desenvolvedor" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Bloco 04
                </span>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">
                  Guia do Desenvolvedor: URLs de Redirecionamento & Chaves de API (OAuth2)
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  Manual de Credenciais
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Saiba quais plataformas exigem registro em Portais de Desenvolvedores, quais necessitam apenas de URL/Webhook e como gerar cada Client ID, Client Secret e Token.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
                type="button"
                onClick={() => handleSavePDF()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition shadow-xs cursor-pointer"
                title="Salvar este bloco em PDF"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span>Salvar em PDF</span>
              </button>
            <button
              type="button"
              onClick={() => scrollToBlock('bloco-indice-manual')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition shadow-xs cursor-pointer"
              title="Retornar para o Índice do Manual Técnico"
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Voltar ao Índice ↑</span>
            </button>
          </div>
        </div>

        {/* Tabela Comparativa de Exigências */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Plataforma / Serviço</th>
                <th className="py-2.5 px-3">Necessita Portal Desenvolvedor?</th>
                <th className="py-2.5 px-3">O Que Configurar? (Key / Secret / URL)</th>
                <th className="py-2.5 px-3">URL de Redirecionamento (Redirect URI)</th>
                <th className="py-2.5 px-3">Nível de Complexidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>YouTube Live (Google)</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    SIM (Google Cloud)
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  Client ID + Client Secret + YouTube Live Streaming API
                </td>
                <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">
                  https://.../oauth/callback
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Médio</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  <span>Twitch TV</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    SIM (Twitch Dev Console)
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  Client ID + Client Secret (Helix API)
                </td>
                <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">
                  https://.../oauth/twitch
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Fácil</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>Facebook Live (Meta)</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    SIM (Meta for Developers)
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  App ID + App Secret + Live Video API
                </td>
                <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">
                  https://.../oauth/facebook
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Médio</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Instagram Live Producer</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    NÃO (Direto no Navegador)
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  URL Servidor RTMPS + Stream Key de Sessão
                </td>
                <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">
                  Não requer redirect
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Muito Fácil</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                  <span>TikTok Live</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    SIM ou Creator Center
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  Client Key + Client Secret ou Stream Key Push
                </td>
                <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">
                  https://.../oauth/tiktok
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Médio</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2D8CFF]"></span>
                  <span>Zoom Meetings & Webinars</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    SIM (Zoom Marketplace)
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  Client ID + Secret (OAuth / Server-to-Server)
                </td>
                <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">
                  https://.../oauth/zoom
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Médio</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5059C9]"></span>
                  <span>Microsoft Teams</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    SIM (Azure Entra ID)
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  App (Client) ID + Tenant ID + Client Secret
                </td>
                <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">
                  https://.../oauth/teams
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Avançado</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5865F2]"></span>
                  <span>Discord (Alertas de Live)</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    NÃO (Apenas Webhook) ou SIM (Bot)
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  Webhook URL direta ou Client ID + Secret + Bot Token
                </td>
                <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">
                  https://.../oauth/discord
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Fácil</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1AB7EA]"></span>
                  <span>Vimeo Live HD</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    SIM (Vimeo Devs)
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  Client ID + Client Secret ou Personal Access Token
                </td>
                <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">
                  https://.../oauth/vimeo
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Fácil</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span>WPStream (WordPress)</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    NÃO (Painel WordPress)
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  URL do Site + Usuário Admin + Application Password
                </td>
                <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">
                  https://seusite.com.br
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Muito Fácil</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Guias Detalhados Passo a Passo Expandidos */}
        <div className="space-y-4 pt-2">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Passo a Passo Oficial para Obter as Chaves, Client IDs, Secrets e Configurar URLs:</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* 1. YouTube */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  <span>1. YouTube Live (Google Cloud Console)</span>
                </h5>
                <span className="text-[10px] font-mono text-blue-600">console.cloud.google.com</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 leading-relaxed">
                <li>Acesse o <strong>Google Cloud Console</strong> e crie um novo projeto (ex: <em>"Central Hub OBS"</em>).</li>
                <li>Vá em <strong>APIs e Serviços &gt; Biblioteca</strong> e ative a <strong>YouTube Data API v3</strong>.</li>
                <li>Em <strong>Tela de Consentimento OAuth</strong>, defina o nome do app e adicione o escopo <code>https://www.googleapis.com/auth/youtube.readonly</code> e <code>youtube.force-ssl</code>.</li>
                <li>Em <strong>Credenciais &gt; Criar Credenciais &gt; ID do cliente OAuth</strong>, selecione <strong>Aplicativo da Web</strong>.</li>
                <li>Em <strong>URIs de redirecionamento autorizados</strong>, adicione a URL da aplicação e copie o <strong>Client ID</strong> e <strong>Client Secret</strong>.</li>
              </ol>
            </div>

            {/* 2. Twitch TV (EXPANDIDO) */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-purple-950 flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  <span>2. Twitch TV (Twitch Developer Console & Helix API)</span>
                </h5>
                <span className="text-[10px] font-mono text-purple-600">dev.twitch.tv/console/apps</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 leading-relaxed">
                <li>Acesse o <strong>Twitch Developer Console</strong> (<code>dev.twitch.tv/console/apps</code>) com sua conta Twitch com 2FA ativado.</li>
                <li>Clique no botão <strong>"Register Your Application"</strong>.</li>
                <li>Preencha o <strong>Name</strong> (ex: <em>"Central Hub OBS Live"</em>) e em <strong>Category</strong> selecione <em>"Broadcaster Tool"</em> ou <em>"Application Integration"</em>.</li>
                <li>Em <strong>OAuth Redirect URLs</strong>, adicione a URL de callback (ex: <code>http://localhost:3000/oauth/twitch</code> ou sua URL de produção) e clique em <strong>Create</strong>.</li>
                <li>Clique em <strong>Manage</strong>: copie o <strong>Client ID</strong> imediatamente exibido na tela.</li>
                <li>No campo <strong>Client Secret</strong>, clique em <strong>"New Secret"</strong> e copie a chave secreta gerada (salve com segurança, pois ela não será exibida novamente).</li>
                <li><strong>Escopos Obrigatórios:</strong> Solicite <code>channel:read:stream_key</code> (para ler a chave de live), <code>channel:manage:broadcast</code> (atualizar título/jogo) e <code>chat:read</code> / <code>chat:edit</code>.</li>
                <li>A Stream Key é consultada via endpoint <code>GET https://api.twitch.tv/helix/streams/key</code> enviando <code>Client-Id</code> e o Bearer Token obtido.</li>
              </ol>
            </div>

            {/* 3. Facebook Live (Meta for Developers - EXPANDIDO) */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span>3. Facebook Live & Meta Graph API (Meta for Developers)</span>
                </h5>
                <span className="text-[10px] font-mono text-blue-600">developers.facebook.com/apps</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 leading-relaxed">
                <li>Acesse <strong>developers.facebook.com</strong> e faça login com a conta administradora da sua Página.</li>
                <li>Clique em <strong>"Meus Aplicativos" &gt; "Criar Aplicativo"</strong> e selecione o tipo de aplicativo <strong>"Empresa" (Business)</strong>.</li>
                <li>No painel do app, adicione os produtos <strong>"Facebook Login"</strong> e <strong>"Live Video API"</strong>.</li>
                <li>No menu esquerdo, acesse <strong>Configurações &gt; Básico</strong>: copie o <strong>ID do Aplicativo (App ID / Client ID)</strong>.</li>
                <li>Ao lado de <strong>Chave Secreta do Aplicativo (App Secret / Client Secret)</strong>, clique em <strong>"Mostrar"</strong>, confirme sua senha e copie o código secreto.</li>
                <li>Em <strong>Facebook Login &gt; Configurações</strong>, adicione em <em>"URIs de redirecionamento do OAuth válidos"</em> a URL de retorno (ex: <code>https://.../oauth/facebook</code>).</li>
                <li><strong>Escopos/Permissões:</strong> Conceda <code>publish_video</code>, <code>pages_manage_posts</code>, <code>pages_read_engagement</code> e <code>pages_show_list</code> para transmitir em Páginas oficiais.</li>
                <li>Para gerar a live: endpoint <code>POST https://graph.facebook.com/v19.0/{'{page-id}'}/live_videos</code> com <code>status=LIVE_NOW</code> retorna o <code>secure_stream_url</code> RTMPS.</li>
              </ol>
            </div>

            {/* 4. TikTok Live (NOVO E COMPLETO) */}
            <div className="p-4 rounded-xl border border-slate-300 bg-slate-100/60 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
                  <span>4. TikTok Live (TikTok for Developers & Creator Center)</span>
                </h5>
                <span className="text-[10px] font-mono text-slate-700">developers.tiktok.com</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 leading-relaxed">
                <li>Acesse o <strong>TikTok Developer Portal</strong> (<code>developers.tiktok.com</code>) e cadastre-se como desenvolvedor.</li>
                <li>Vá em <strong>Manage Apps &gt; Create an App</strong>, defina o nome (ex: <em>"Central Hub OBS"</em>) e faça o upload do ícone.</li>
                <li>Na página do aplicativo, copie a <strong>Client Key (equivalente ao Client ID)</strong>.</li>
                <li>No campo <strong>Client Secret</strong>, clique para visualizar ou gerar sua chave secreta privada.</li>
                <li>Em <strong>Products &gt; Login Kit &gt; Web / Desktop</strong>, cadastre sua <strong>Redirect URI</strong> autorizada (ex: <code>https://.../oauth/tiktok</code>).</li>
                <li>Adicione os escopos da API: <code>user.info.basic</code>, <code>video.upload</code> e <code>video.publish</code>.</li>
                <li><strong>Como Obter a Chave RTMP Nativa no TikTok:</strong> O TikTok libera transmissões RTMP para contas de criadores com mais de 1.000 seguidores. Acesse <code>live.tiktok.com</code> ou o aplicativo <strong>TikTok Live Studio</strong>.</li>
                <li>Ao clicar em <em>"Go LIVE / Transmitir"</em>, a plataforma gera a <strong>Server URL</strong> (ex: <code>rtmp://...</code>) e a <strong>Stream Key</strong> dinâmica que é injetada diretamente no OBS.</li>
              </ol>
            </div>

            {/* 5. Discord (EXPANDIDO: PORTAL DE DESENVOLVEDORES + WEBHOOK) */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5865F2]"></span>
                  <span>5. Discord (Developer Portal, Bot Token & Webhooks)</span>
                </h5>
                <span className="text-[10px] font-mono text-[#5865F2]">discord.com/developers/applications</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 leading-relaxed">
                <li>Acesse o <strong>Discord Developer Portal</strong> (<code>discord.com/developers/applications</code>) e faça login.</li>
                <li>Clique em <strong>"New Application"</strong>, informe o nome (ex: <em>"CentralHub Live Notifier"</em>) e confirme.</li>
                <li>Na aba <strong>General Information</strong>, copie o <strong>Application ID</strong> (este é o seu <strong>Client ID</strong>).</li>
                <li>Na aba <strong>OAuth2 &gt; General</strong>, localize o campo <strong>Client Secret</strong>, clique em <strong>"Reset Secret"</strong> e copie o código gerado.</li>
                <li>Em <strong>OAuth2 &gt; Redirects</strong>, adicione a URL de retorno (ex: <code>https://.../oauth/discord</code>). Escopos: <code>identify</code>, <code>guilds</code>, <code>bot</code> e <code>webhook.incoming</code>.</li>
                <li>Na aba <strong>Bot</strong>: clique em <strong>"Add Bot" &gt; "Reset Token"</strong> para obter o <strong>Bot Token</strong> oficial caso deseje disparo automatizado de Embeds detalhadas (título, jogo, banner e botão "Assistir").</li>
                <li><strong>Método Super Rápido por Webhook (Sem App Dev):</strong> Se você quer apenas enviar mensagens no seu servidor sem criar app, abra o Discord &gt; clique com botão direito no canal de texto &gt; <strong>Editar Canal &gt; Integrações &gt; Webhooks &gt; Novo Webhook</strong> &gt; Copie a <strong>URL do Webhook</strong> e cole no Central Hub!</li>
              </ol>
            </div>

            {/* 6. Vimeo Live HD (NOVO E COMPLETO) */}
            <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-cyan-950 flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1AB7EA]"></span>
                  <span>6. Vimeo Live HD (Vimeo Developer Portal & Access Tokens)</span>
                </h5>
                <span className="text-[10px] font-mono text-[#1AB7EA]">developer.vimeo.com/apps</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 leading-relaxed">
                <li>Acesse <strong>developer.vimeo.com/apps</strong> com sua conta Vimeo (planos Standard, Advanced ou Enterprise possuem suporte nativo a transmissões ao vivo via RTMP).</li>
                <li>Clique no botão <strong>"Create App"</strong>, defina o nome (ex: <em>"Central Hub OBS Live"</em>), descrição e aceite os termos.</li>
                <li>Na página do app criado, copie o <strong>Client Identifier (Client ID)</strong>.</li>
                <li>No campo <strong>Client Secrets</strong>, clique em <strong>"Generate a new client secret"</strong> e salve o segredo fornecido.</li>
                <li>Em <strong>OAuth2 Redirect URLs</strong>, cadastre sua URL autorizada (ex: <code>https://.../oauth/vimeo</code>).</li>
                <li><strong>Método Personal Access Token (Mais Rápido e Estável):</strong> O Vimeo permite gerar um token permanente sem precisar de fluxo web externo. Role até <em>"Generate an Access Token"</em>, selecione <em>"Authenticated (you)"</em> e marque os escopos <code>public</code>, <code>private</code>, <code>video_files</code>, <code>create</code> e <code>edit</code>.</li>
                <li>Com o token, a API cria o evento em <code>POST https://api.vimeo.com/me/live_events</code> e retorna a <strong>URL RTMP Global</strong> (<code>rtmps://rtmp-global.cloud.vimeo.com:443/live</code>) e a Stream Key dedicada para broadcast corporativo sem anúncios.</li>
              </ol>
            </div>

            {/* 7. Zoom */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2D8CFF]"></span>
                  <span>7. Zoom Meetings & Webinars (Zoom App Marketplace)</span>
                </h5>
                <span className="text-[10px] font-mono text-blue-600">marketplace.zoom.us</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 leading-relaxed">
                <li>Entre no <strong>Zoom App Marketplace</strong> (<code>marketplace.zoom.us</code>) com conta Zoom Pro ou Corporativa.</li>
                <li>No menu superior, vá em <strong>Develop &gt; Build App</strong>.</li>
                <li>Escolha <strong>Server-to-Server OAuth</strong> ou <strong>General App</strong>.</li>
                <li>Adicione os escopos <code>meeting:write:admin</code>, <code>webinar:write:admin</code> e <code>live_stream:write</code>.</li>
                <li>Copie o <strong>Client ID</strong>, <strong>Client Secret</strong> e o <strong>Account ID</strong>. O servidor RTMP oficial é <code>rtmp://live-stream.zoom.us/live/</code>.</li>
              </ol>
            </div>

            {/* 8. Microsoft Teams */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5059C9]"></span>
                  <span>8. Microsoft Teams & Azure Entra ID (Graph API)</span>
                </h5>
                <span className="text-[10px] font-mono text-indigo-600">portal.azure.com</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 leading-relaxed">
                <li>Acesse o <strong>Portal do Azure</strong> &gt; <strong>Microsoft Entra ID</strong>.</li>
                <li>Vá em <strong>Registro de Aplicativos (App Registrations) &gt; Novo Registro</strong>.</li>
                <li>Copie o <strong>ID do Aplicativo (Client ID)</strong> e o <strong>ID do Diretório (Tenant ID)</strong>.</li>
                <li>Em <strong>Certificados e Segredos</strong>, gere um novo <strong>Client Secret</strong>.</li>
                <li>Em <strong>Permissões de API</strong>, adicione permissão Microsoft Graph: <code>OnlineMeetings.ReadWrite</code>.</li>
              </ol>
            </div>

            {/* 9. WPStream WordPress */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  <span>9. WPStream (WordPress Application Password)</span>
                </h5>
                <span className="text-[10px] font-mono text-indigo-600">seusite.com/wp-admin</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 leading-relaxed">
                <li>No painel do WordPress, certifique-se de que o plugin <strong>WPStream</strong> está ativo.</li>
                <li>Acesse <strong>Usuários &gt; Perfil</strong> e role até <strong>Senhas de Aplicativos</strong>.</li>
                <li>Digite o nome <em>"Central Hub OBS"</em> e clique em <strong>Adicionar Nova Senha de Aplicativo</strong>.</li>
                <li>Copie a senha de 24 caracteres gerada e use-a para autenticar com segurança sem expor sua senha real.</li>
              </ol>
            </div>

            {/* 10. Câmera Virtual */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>10. Câmera Virtual (Zoom, Meet e Teams)</span>
                </h5>
                <span className="text-[10px] font-bold text-emerald-700">100% Livre de Chaves</span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                <strong>💡 Dica de Ouro:</strong> Se você não quiser lidar com consoles de desenvolvedor para reuniões diárias, ligue o <strong>Modo Câmera Virtual</strong> no cabeçalho deste painel. O OBS transmite para o Zoom, Google Meet e Microsoft Teams instantaneamente sem precisar de nenhuma conta de desenvolvedor, Client ID ou token!
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* BLOCO 5: DE REFERÊNCIA TÉCNICA E DICIONÁRIO DE FUNÇÕES */}
      <div id="bloco-dicionario-funcoes" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        
        {/* Header & Search com Botão Voltar ao Índice */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  Bloco 05
                </span>
                <h2 className="font-bold text-slate-800 text-lg leading-tight">
                  Dicionário Técnico de Funções / Technical Functions
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Documentação técnica bilíngue de todos os métodos, rotinas e scripts internos do Central Hub OBS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar função ou termo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Botão Imprimir Bloco 5 */}
            <button
                type="button"
                onClick={() => handleSavePDF()}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition shadow-xs cursor-pointer"
                title="Salvar este bloco em PDF"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Salvar em PDF</span>
              </button>

            {/* Botão Voltar ao Índice */}
            <button
              type="button"
              onClick={() => scrollToBlock('bloco-indice-manual')}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition shadow-xs cursor-pointer"
              title="Retornar para o Índice do Manual Técnico"
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Índice ↑</span>
            </button>
          </div>
        </div>

        {/* Function Documentation List */}
        <div className="space-y-4">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 hover:border-blue-300 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-600" />
                  <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {item.name}
                  </span>
                </div>
                <span className="text-[10px] font-semibold uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-slate-700">
                  <strong className="text-blue-700 mr-1.5">[PT]</strong>
                  {item.pt}
                </p>
                <p className="text-slate-500 italic">
                  <strong className="text-slate-600 mr-1.5">[EN]</strong>
                  {item.en}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Signature */}
        <div className="pt-4 border-t border-slate-200 text-right">
          <span className="text-xs font-bold text-slate-500 italic">
            Desenvolvido por Elias Lopes (liclopes@gmail.com)
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* BLOCO 06: COMANDOS POR VOZ PARA A LIVE & ESTÚDIO (VOICE CONTROL)          */}
      {/* ========================================================================= */}
      <div id="bloco-comandos-voz" className="bg-white rounded-xl shadow-xs border border-rose-200 p-6 space-y-6">
        
        {/* Header do Bloco com Botões Imprimir e Índice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/20">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                  BLOCO 06
                </span>
                <h3 className="font-bold text-slate-900 text-base md:text-lg">
                  Comandos por Voz para Transmissão Ao Vivo (Voice Control)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Acione ações no OBS Studio e na transmissão falando diretamente no seu microfone em Português do Brasil.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Botão Imprimir Bloco 06 */}
            <button
                type="button"
                onClick={() => handleSavePDF()}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition shadow-xs cursor-pointer"
                title="Salvar este bloco em PDF"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Salvar em PDF</span>
              </button>

            {/* Botão Voltar ao Índice */}
            <button
              type="button"
              onClick={() => scrollToBlock('bloco-indice-manual')}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition shadow-xs cursor-pointer"
              title="Retornar para o Índice do Manual Técnico"
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Índice ↑</span>
            </button>
          </div>
        </div>

        {/* Como Funciona o Reconhecimento por Voz */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-500" />
              1. Reconhecimento Nativo
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Utiliza a <strong>Web Speech API (webkitSpeechRecognition)</strong> integrada no Google Chrome, Microsoft Edge, Opera e Safari. Não envia dados para servidores externos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              2. Latência Quase Zero
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              O processamento léxico e a execução ocorrem localmente no navegador, disparando o comando WebSocket para o OBS em milissegundos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              3. Proteção Hot Mic
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Você pode ligar e desligar a escuta a qualquer momento na barra superior com um clique no botão de microfone.
            </p>
          </div>
        </div>

        {/* Tabela de Comandos por Voz Suportados */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <BookmarkCheck className="w-4 h-4 text-rose-600" />
            <span>Tabela Oficial de Comandos por Voz (Diga em voz alta):</span>
          </h4>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">O que Falar (Frase de Gatilho)</th>
                  <th className="px-4 py-3">Ação Executada no OBS Studio</th>
                  <th className="px-4 py-3">Feedback no Painel</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Iniciar live" / "Começar transmissão" / "Entrar ao vivo"</td>
                  <td className="px-4 py-2.5 text-slate-700">Inicia a transmissão oficial no OBS para todas as plataformas configuradas</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-semibold">🔴 Iniciar Transmissão</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Parar live" / "Encerrar transmissão" / "Finalizar live"</td>
                  <td className="px-4 py-2.5 text-slate-700">Finaliza a transmissão com segurança e envia comando de corte</td>
                  <td className="px-4 py-2.5 text-rose-700 font-semibold">🛑 Encerrar Transmissão</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Iniciar gravação" / "Começar gravação" / "Gravar tela"</td>
                  <td className="px-4 py-2.5 text-slate-700">Inicia a gravação limpa no disco rígido em alta qualidade</td>
                  <td className="px-4 py-2.5 text-blue-700 font-semibold">⏺ Iniciar Gravação</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Parar gravação" / "Encerrar gravação"</td>
                  <td className="px-4 py-2.5 text-slate-700">Interrompe a gravação e aciona a abertura da pasta se ativada</td>
                  <td className="px-4 py-2.5 text-slate-700 font-semibold">⏹ Parar Gravação</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Mutar microfone" / "Silenciar microfone" / "Mudo"</td>
                  <td className="px-4 py-2.5 text-slate-700">Coloca o microfone em mudo absoluto instantaneamente (Mute Toggle)</td>
                  <td className="px-4 py-2.5 text-rose-700 font-semibold">🔇 Mutar Microfone</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Ativar microfone" / "Desmutar microfone" / "Ligar áudio"</td>
                  <td className="px-4 py-2.5 text-slate-700">Abre o microfone com volume nominal de broadcast (85%)</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-semibold">🎙️ Microfone Ativado</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Câmera principal" / "Cena principal" / "Cena um"</td>
                  <td className="px-4 py-2.5 text-slate-700">Troca instantaneamente para a Cena_Principal no OBS Studio</td>
                  <td className="px-4 py-2.5 text-purple-700 font-semibold">🎬 Cena: Cena_Principal</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Apresentação" / "Slides" / "Palestra"</td>
                  <td className="px-4 py-2.5 text-slate-700">Troca para a cena com captura de janela do PowerPoint ou PDF</td>
                  <td className="px-4 py-2.5 text-purple-700 font-semibold">📊 Cena: Apresentacao</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Gameplay" / "Jogo" / "Partida"</td>
                  <td className="px-4 py-2.5 text-slate-700">Troca para a cena com captura de jogo em tela cheia e webcam overlay</td>
                  <td className="px-4 py-2.5 text-purple-700 font-semibold">🎮 Cena: Gameplay</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Webcam cheia" / "Câmera cheia" / "Só câmera"</td>
                  <td className="px-4 py-2.5 text-slate-700">Foca a imagem do apresentador em tela inteira (Webcam_FullScreen)</td>
                  <td className="px-4 py-2.5 text-purple-700 font-semibold">📷 Cena: Webcam_FullScreen</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Intervalo" / "Já volto" / "Pausa"</td>
                  <td className="px-4 py-2.5 text-slate-700">Muda para a tela de espera BRB e abaixa música de fundo</td>
                  <td className="px-4 py-2.5 text-purple-700 font-semibold">☕ Cena: BRB_Intervalo</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Encerramento" / "Terminar" / "Fim da live"</td>
                  <td className="px-4 py-2.5 text-slate-700">Troca para os créditos finais de encerramento antes do corte</td>
                  <td className="px-4 py-2.5 text-purple-700 font-semibold">🏁 Cena: Encerramento</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Salvar replay" / "Salvar clipe" / "Pegar jogada"</td>
                  <td className="px-4 py-2.5 text-slate-700">Dispara o Replay Buffer do OBS e salva os últimos 30 segundos em disco</td>
                  <td className="px-4 py-2.5 text-amber-700 font-semibold">⭐ Replay Salvo!</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-rose-700">"Câmera virtual" / "Ligar virtual cam"</td>
                  <td className="px-4 py-2.5 text-slate-700">Inicia ou interrompe a Câmera Virtual do OBS para Zoom, Teams e Meet</td>
                  <td className="px-4 py-2.5 text-indigo-700 font-semibold">🎥 Câmera Virtual Alternada</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ativo</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* BLOCO 07: CONEXÃO REMOTA VIA INTERNET: WEBSOCKET, VPNS & MULTI-SOFTWARE    */}
      {/* ========================================================================= */}
      <div id="bloco-controle-remoto-vpn" className="bg-white rounded-xl shadow-xs border border-amber-200 p-6 space-y-6">
        
        {/* Header do Bloco com Botões Imprimir e Índice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  BLOCO 07
                </span>
                <h3 className="font-bold text-slate-900 text-base md:text-lg">
                  Conexão Remota Online: WebSocket, VPNs & Multi-Softwares
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Guia de infraestrutura de rede para operar o OBS Studio remotamente pela internet e integrar outros softwares de transmissão.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Botão Imprimir Bloco 07 */}
            <button
                type="button"
                onClick={() => handleSavePDF()}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition shadow-xs cursor-pointer"
                title="Salvar este bloco em PDF"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Salvar em PDF</span>
              </button>

            {/* Botão Voltar ao Índice */}
            <button
              type="button"
              onClick={() => scrollToBlock('bloco-indice-manual')}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition shadow-xs cursor-pointer"
              title="Retornar para o Índice do Manual Técnico"
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Índice ↑</span>
            </button>
          </div>
        </div>

        {/* 1. Tópico: Preciso de VPN (Tailscale ou ZeroTier) para controlar pela internet? */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs">1</span>
            <h4 className="font-bold text-slate-900 text-sm">
              Precisa configurar VPN (Tailscale ou ZeroTier) para controlar o OBS pela Internet?
            </h4>
          </div>
          
          <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <p>
              <strong>Na mesma rede local (LAN / Wi-Fi do estúdio):</strong> <span className="text-emerald-700 font-bold">NÃO precisa de VPN.</span> Basta usar o IP local do computador onde o OBS está aberto (ex: <code>192.168.1.100:4455</code>) e a senha definida no OBS.
            </p>
            <p>
              <strong>Pela Internet Pública (Operador remoto fora do estúdio):</strong> <span className="text-amber-800 font-bold">SIM, o uso de uma Mesh VPN como Tailscale ou ZeroTier é altamente recomendado e o padrão profissional.</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Por que NÃO fazer Port Forwarding no roteador:
                </span>
                <p className="text-[11px] text-slate-600">
                  Abrir a porta 4455 do seu roteador residencial ou corporativo expõe o computador diretamente a scanners de portas e ataques de força bruta na internet.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Vantagens do Tailscale / ZeroTier:
                </span>
                <p className="text-[11px] text-slate-600">
                  Cria uma rede privada virtual ponto-a-ponto com criptografia WireGuard sem abrir portas no roteador. Você conecta no IP privado (ex: <code>100.x.y.z:4455</code>) com total segurança.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              💡 <em>Dica de Navegador (Mixed Content):</em> Navegadores modernos em páginas com <code>https://</code> bloqueiam conexões WebSocket não criptografadas (<code>ws://</code>). Se você hospedar o painel online com HTTPS, utilize túnel seguro com certificado TLS (<code>wss://</code> via Tailscale Funnel ou Cloudflare Tunnel) ou acesse o painel na mesma rede.
            </p>
          </div>
        </div>

        {/* 2. Tópico: O que faz o Chaveador Automático e por que o monitor já inicia ativo? */}
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs">2</span>
            <h4 className="font-bold text-slate-900 text-sm">
              Na aba Automações & Regras: O que faz o Chaveador e por que o LED "Monitor Ativo" já inicia ligado?
            </h4>
          </div>

          <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <p>
              <strong>O que o Chaveador Automático faz:</strong> É o motor inteligente do estúdio inspirado no plugin <em>Advanced Scene Switcher</em>. Ele monitora eventos em tempo real — como término da vinheta de contagem regressiva, silêncio no microfone por mais de 5 segundos, ativação de compartilhamento de tela ou início da transmissão — e realiza cortes de câmera automáticos sem que o operador precise clicar manualmente.
            </p>
            <p>
              <strong>Por que o LED "Monitor Ativo" já inicia ligado sem a live começar:</strong> O motor precisa estar em estado de escuta passiva em segundo plano <em>antes</em> do início da live para conseguir capturar o gatilho <code>"Ao Iniciar Transmissão"</code>. Caso iniciasse desligado, quando o operador clicasse em Iniciar Transmissão, o sistema não conseguiria detectar o momento exato para transitar da tela de espera para a abertura! Você pode pausar o monitor a qualquer momento clicando no botão "Pausar Monitoramento Automático".
            </p>
          </div>
        </div>

        {/* 3. Tópico: Integração com outros softwares além do OBS Studio */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-800 text-white font-bold text-xs">3</span>
            <h4 className="font-bold text-slate-900 text-sm">
              Além do OBS Studio, é possível controlar outros programas usando WebSocket e APIs?
            </h4>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-emerald-700 font-bold">SIM!</strong> Este painel conta com arquitetura modular preparada para multi-software. No modal de configurações de conexão, você pode selecionar e cadastrar perfis para:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-blue-600" />
                vMix (Estúdios de TV)
              </span>
              <p className="text-[11px] text-slate-500">
                Porta padrão <code>8088</code>. Utiliza vMix Web Controller HTTP API e TCP WebSocket Bridge para trocar inputs, disparar overlays e cortes Cut/Fade.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
                Streamlabs Desktop
              </span>
              <p className="text-[11px] text-slate-500">
                Porta padrão <code>59650</code>. Comunicação via Streamlabs OBS Remote API WebSocket com token de sessão para trocar cenas e fontes.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <PlayCircle className="w-3.5 h-3.5 text-amber-600" />
                PRISM Live Studio
              </span>
              <p className="text-[11px] text-slate-500">
                Porta padrão <code>4455</code>. Totalmente compatível com o protocolo OBS WebSocket v5 padrão, controlando cenas, áudio e transmissão.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Telestream Wirecast
              </span>
              <p className="text-[11px] text-slate-500">
                Porta padrão <code>8080</code>. Integração via Wirecast REST Controller API e WebSocket para disparar master layers e shot transitions.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Meld Studio
              </span>
              <p className="text-[11px] text-slate-500">
                Porta padrão <code>8989</code>. Conexão WebSocket nativa do novo encoder profissional Meld para controle de cenas e efeitos de áudio.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-rose-600" />
                Streamer.bot
              </span>
              <p className="text-[11px] text-slate-500">
                Porta padrão <code>8080</code>. WebSocket Server v2 nativo para disparar ações automáticas, recompensas de canal e alertas da live.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-blue-600" />
              Mesa de Controle Multi-Software Broadcast Integrada
            </span>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Você pode operar todos esses softwares diretamente pela aba <strong>"Multi-Software Broadcast"</strong> no menu superior do Central Hub. Ela fornece uma mesa de corte ao vivo com monitores de Preview e Program para vMix (CUT, FADE, QUICKPLAY, Overlays 1-4), seletor de cenas e fontes para Streamlabs Desktop, layouts 9:16 e 16:9 para PRISM Live Studio, layers de transmissão para Wirecast e disparo instantâneo de ações para Streamer.bot.
            </p>
          </div>
        </div>

      </div>

      {/* BOTÃO FLUTUANTE: RETORNAR AO ÍNDICE DA ABA MANUAL TÉCNICO */}
      <button
        type="button"
        onClick={() => scrollToBlock('bloco-indice-manual')}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-full shadow-xl shadow-blue-900/40 border border-blue-400/40 flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 cursor-pointer"
        title="Retornar para o Índice Geral do Manual Técnico"
      >
        <ArrowUp className="w-4 h-4 animate-bounce" />
        <span className="hidden sm:inline">Voltar ao Índice ↑</span>
      </button>

    </div>
  );
};

