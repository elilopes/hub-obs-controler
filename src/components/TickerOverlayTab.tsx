import React, { useState } from 'react';
import { 
  Type, 
  Send, 
  Eye, 
  Palette, 
  AlertCircle, 
  Check, 
  Zap, 
  Radio, 
  Sparkles, 
  SlidersHorizontal,
  Flame,
  Tv,
  Cpu,
  Layers,
  Crown,
  Share2,
  Trash2,
  Clock,
  Heart,
  Gamepad2,
  Coins,
  Copy,
  ExternalLink
} from 'lucide-react';
import { TextEffectType, BoxEffectType, PreformattedAlert } from '../types';

interface TickerOverlayTabProps {
  onUpdateTicker: (
    text: string,
    isBlinking: boolean,
    color: string,
    speed: string,
    badge?: string,
    textEffect?: TextEffectType,
    boxEffect?: BoxEffectType
  ) => void;
  onClearTicker?: () => void;
}

const PREFORMATTED_ALERTS: PreformattedAlert[] = [
  // Categoria: Notícias & Plantão
  {
    id: 'news-1',
    category: 'noticias',
    title: 'Plantão de Última Hora',
    badge: '🚨 PLANTÃO',
    text: 'URGENTE: Notícia de última hora entrando ao vivo agora! Acompanhe as atualizações em primeira mão.',
    color: '#ffffff',
    textEffect: 'impact_news',
    boxEffect: 'breaking_news',
    speed: 'medium',
    isBlinking: true,
  },
  {
    id: 'news-2',
    category: 'noticias',
    title: 'Abertura da Transmissão',
    badge: '🔴 AO VIVO',
    text: 'Transmissão Oficial Central Hub OBS iniciada! Compartilhe com os amigos e participe do nosso chat ao vivo.',
    color: '#38bdf8',
    textEffect: 'neon',
    boxEffect: 'cyberpunk',
    speed: 'medium',
  },
  {
    id: 'news-3',
    category: 'noticias',
    title: 'Intervalo / Voltamos Já',
    badge: '⏱️ INTERVALO',
    text: 'Voltamos em 5 minutos com a próxima rodada! Não saia daí, deixe sua pergunta na caixa de comentários.',
    color: '#facc15',
    textEffect: 'shadow_3d',
    boxEffect: 'frosted_glass',
    speed: 'slow',
  },
  {
    id: 'news-4',
    category: 'noticias',
    title: 'Pronunciamento / Oficial',
    badge: '📢 COMUNICADO',
    text: 'Aviso importante da coordenação geral: Sessão extraordinária aberta ao público.',
    color: '#ffffff',
    textEffect: 'none',
    boxEffect: 'minimal_dark',
    speed: 'medium',
  },

  // Categoria: Interação, Redes & Apoio
  {
    id: 'interact-1',
    category: 'interacao',
    title: 'Meta de Likes',
    badge: '⭐ META DA LIVE',
    text: 'Meta de 500 LIKES para desbloquear o sorteio especial no final da live! Deixe o seu like e compartilhe!',
    color: '#facc15',
    textEffect: 'gradient_gold',
    boxEffect: 'vip_gold',
    speed: 'medium',
  },
  {
    id: 'interact-2',
    category: 'interacao',
    title: 'Chave PIX na Tela',
    badge: '💸 CHAVE PIX',
    text: 'Apoie esta transmissão independente! Chave PIX: contato@centralhub.com.br | Envie seu recado!',
    color: '#4ade80',
    textEffect: 'neon',
    boxEffect: 'gamer_rgb',
    speed: 'medium',
  },
  {
    id: 'interact-3',
    category: 'interacao',
    title: 'Participe do Chat',
    badge: '💬 CHAT AO VIVO',
    text: 'Envie sua mensagem e pergunta com a hashtag #HubOBS para ter seu comentário exibido e respondido na tela!',
    color: '#38bdf8',
    textEffect: 'shadow_3d',
    boxEffect: 'floating_pill',
    speed: 'medium',
  },
  {
    id: 'interact-4',
    category: 'interacao',
    title: 'Redes Sociais & Seguir',
    badge: '📲 REDES SOCIAIS',
    text: 'Siga nosso perfil no Instagram e TikTok: @CentralHubLive | Conteúdos de bastidores e cortes exclusivos todos os dias!',
    color: '#e2e8f0',
    textEffect: 'none',
    boxEffect: 'frosted_glass',
    speed: 'medium',
  },

  // Categoria: Gamer & Eventos
  {
    id: 'event-1',
    category: 'eventos',
    title: 'Vitória Épica / Recorde',
    badge: '🏆 VITÓRIA ÉPICA',
    text: 'NOVO RECORDE ATINGIDO! Vitória consagrada na partida classificatória com audiência máxima!',
    color: '#fbbf24',
    textEffect: 'gradient_gold',
    boxEffect: 'gamer_rgb',
    speed: 'fast',
    isBlinking: true,
  },
  {
    id: 'event-2',
    category: 'eventos',
    title: 'Novo Inscrito / Apoiador VIP',
    badge: '👑 NOVO MEMBRO',
    text: 'Parabéns ao novo membro VIP que acaba de fortalecer o canal! Bem-vindo ao time de apoiadores.',
    color: '#facc15',
    textEffect: 'gradient_gold',
    boxEffect: 'vip_gold',
    speed: 'medium',
  },
  {
    id: 'event-3',
    category: 'eventos',
    title: 'Raid / Host de Streamers',
    badge: '👾 RAID CHEGANDO',
    text: 'RAID DETECTADA! Sejam todos muito bem-vindos ao canal! Puxe uma cadeira e aproveite o conteúdo.',
    color: '#a855f7',
    textEffect: 'cyber_glitch',
    boxEffect: 'cyberpunk',
    speed: 'medium',
  },

  // Categoria: Avisos Técnicos
  {
    id: 'tech-1',
    category: 'tecnico',
    title: 'Ajuste de Áudio em Andamento',
    badge: '🎧 AJUSTE TÉCNICO',
    text: 'Equipe técnica calibrando canais de áudio e microfones da mesa. Retomamos o sinal pleno em segundos.',
    color: '#fbbf24',
    textEffect: 'typewriter',
    boxEffect: 'hazard_stripes',
    speed: 'slow',
  },
  {
    id: 'tech-2',
    category: 'tecnico',
    title: 'Qualidade 1080p60 Estável',
    badge: '📶 STATUS HD',
    text: 'Transmissão fluindo a 1080p a 60 FPS com bitrate fixo e baixa latência garantida.',
    color: '#34d399',
    textEffect: 'shadow_3d',
    boxEffect: 'minimal_dark',
    speed: 'medium',
  },
];

export const TickerOverlayTab: React.FC<TickerOverlayTabProps> = ({
  onUpdateTicker,
  onClearTicker,
}) => {
  // Form State
  const [tickerText, setTickerText] = useState(
    '🔴 AO VIVO: Transmissão Oficial Central Hub OBS | Compartilhe e deixe seu Like!'
  );
  const [badgeText, setBadgeText] = useState('🚨 ALERTA');
  const [isBlinking, setIsBlinking] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#eab308');
  const [speed, setSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [textEffect, setTextEffect] = useState<TextEffectType>('neon');
  const [boxEffect, setBoxEffect] = useState<BoxEffectType>('breaking_news');
  const [isSent, setIsSent] = useState(false);
  const [lastSentAlertId, setLastSentAlertId] = useState<string | null>(null);
  const [activeAlertCategory, setActiveAlertCategory] = useState<'todos' | 'noticias' | 'interacao' | 'eventos' | 'tecnico'>('todos');

  const colorPresets = [
    { label: 'Amarelo Ouro', hex: '#eab308', bg: 'bg-amber-500' },
    { label: 'Vermelho Fogo', hex: '#ef4444', bg: 'bg-red-500' },
    { label: 'Azul Elétrico', hex: '#38bdf8', bg: 'bg-sky-400' },
    { label: 'Verde Neon', hex: '#22c55e', bg: 'bg-green-500' },
    { label: 'Ciano Tech', hex: '#06b6d4', bg: 'bg-cyan-500' },
    { label: 'Roxo Gamer', hex: '#a855f7', bg: 'bg-purple-500' },
    { label: 'Branco Puro', hex: '#ffffff', bg: 'bg-white border border-slate-300' },
    { label: 'Laranja Alerta', hex: '#f97316', bg: 'bg-orange-500' },
  ];

  const textEffectsList: { id: TextEffectType; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'none', label: 'Padrão Nítido', desc: 'Texto limpo de alta legibilidade', icon: <Type className="w-3.5 h-3.5" /> },
    { id: 'neon', label: 'Brilho Neon', desc: 'Glow vibrante pulsante', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> },
    { id: 'gradient_gold', label: 'Gradiente Ouro', desc: 'Brilho nobre metálico', icon: <Crown className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'impact_news', label: 'Plantão Impacto', desc: 'Caixa alta de telejornal', icon: <Tv className="w-3.5 h-3.5 text-red-500" /> },
    { id: 'cyber_glitch', label: 'Cyber Glitch', desc: 'Efeito tech offset RGB', icon: <Cpu className="w-3.5 h-3.5 text-purple-500" /> },
    { id: 'shadow_3d', label: 'Relevo 3D', desc: 'Sombra volumétrica profunda', icon: <Layers className="w-3.5 h-3.5 text-blue-500" /> },
    { id: 'typewriter', label: 'Terminal / Mono', desc: 'Estilo console digital', icon: <Radio className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 'strobe', label: 'Strobe Flash', desc: 'Piscar de emergência rápida', icon: <Zap className="w-3.5 h-3.5 text-yellow-500" /> },
  ];

  const boxEffectsList: { id: BoxEffectType; label: string; desc: string }[] = [
    { id: 'breaking_news', label: 'Noticiário TV / Urgente', desc: 'Faixa sólida vermelha e preta com corte diagonal' },
    { id: 'cyberpunk', label: 'Cyber Neon Gamer', desc: 'Moldura angular com bordas ciano e magenta neon' },
    { id: 'frosted_glass', label: 'Vidro Fosco (Glass)', desc: 'Translúcido com desfoque e bordas suaves' },
    { id: 'gamer_rgb', label: 'RGB Chroma Rainbow', desc: 'Borda gradiente multicolorida animada' },
    { id: 'floating_pill', label: 'Cápsula Flutuante', desc: 'Barra arredondada moderna suspensa' },
    { id: 'hazard_stripes', label: 'Atenção Zebrada', desc: 'Listras de perigo em amarelo/preto' },
    { id: 'vip_gold', label: 'Dourado VIP Imperial', desc: 'Bordas e reflexos em ouro brilhante' },
    { id: 'minimal_dark', label: 'Minimalista Escuro', desc: 'Preto puro com contraste cristalino' },
  ];

  const handleSend = () => {
    onUpdateTicker(tickerText, isBlinking, selectedColor, speed, badgeText, textEffect, boxEffect);
    setIsSent(true);
    setTimeout(() => setIsSent(false), 2200);
  };

  const handleClear = () => {
    setTickerText('');
    setBadgeText('');
    if (onClearTicker) {
      onClearTicker();
    } else {
      onUpdateTicker('', false, selectedColor, speed, '', textEffect, boxEffect);
    }
    setIsSent(true);
    setTimeout(() => setIsSent(false), 2000);
  };

  const handleApplyPreset = (alert: PreformattedAlert, autoSend: boolean = false) => {
    setTickerText(alert.text);
    setBadgeText(alert.badge);
    setSelectedColor(alert.color);
    setTextEffect(alert.textEffect);
    setBoxEffect(alert.boxEffect);
    setSpeed(alert.speed);
    setIsBlinking(!!alert.isBlinking);

    if (autoSend) {
      onUpdateTicker(
        alert.text,
        !!alert.isBlinking,
        alert.color,
        alert.speed,
        alert.badge,
        alert.textEffect,
        alert.boxEffect
      );
      setLastSentAlertId(alert.id);
      setIsSent(true);
      setTimeout(() => {
        setLastSentAlertId(null);
        setIsSent(false);
      }, 2500);
    }
  };

  const filteredAlerts = PREFORMATTED_ALERTS.filter(
    (a) => activeAlertCategory === 'todos' || a.category === activeAlertCategory
  );

  // Helper to render text effect styles
  const getTextEffectClass = () => {
    switch (textEffect) {
      case 'neon':
        return 'text-neon-glow font-bold';
      case 'gradient_gold':
        return 'text-gold-gradient font-extrabold tracking-wide';
      case 'impact_news':
        return 'uppercase font-black tracking-wider drop-shadow-md';
      case 'cyber_glitch':
        return 'text-glitch font-mono font-bold';
      case 'shadow_3d':
        return 'text-3d-shadow font-extrabold';
      case 'typewriter':
        return 'font-mono tracking-tight font-semibold';
      case 'strobe':
        return 'animate-strobe font-extrabold';
      default:
        return 'font-bold';
    }
  };

  // Helper to render box effect container styles
  const getBoxEffectWrapper = () => {
    switch (boxEffect) {
      case 'breaking_news':
        return 'bg-gradient-to-r from-red-950 via-slate-950 to-red-950 border-y-2 border-red-600 shadow-2xl';
      case 'cyberpunk':
        return 'bg-slate-950/90 border border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded';
      case 'frosted_glass':
        return 'bg-slate-900/60 backdrop-blur-md border border-white/20 shadow-xl rounded-lg';
      case 'gamer_rgb':
        return 'p-[2px] rounded-lg animate-rgb-glow shadow-xl';
      case 'floating_pill':
        return 'bg-slate-950/90 border border-slate-700/80 rounded-full shadow-2xl mx-4';
      case 'hazard_stripes':
        return 'bg-hazard-stripes border-y-2 border-amber-500 shadow-2xl';
      case 'vip_gold':
        return 'bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 border border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] rounded-lg';
      case 'minimal_dark':
      default:
        return 'bg-black/90 border-t border-slate-700 shadow-2xl';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner - Quick Action Alert Presets */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-slate-800 text-base">
                Alertas Pré-formatados Prontos para a Live
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Clique em <strong>"⚡ ENVIAR DIRETO"</strong> para lançar o alerta no OBS com 1 clique, ou em <strong>"✏️ EDITAR"</strong> para personalizar o texto.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'noticias', label: '🚨 Notícias' },
              { id: 'interacao', label: '⭐ Interação & PIX' },
              { id: 'eventos', label: '🏆 Gamer & Metas' },
              { id: 'tecnico', label: '⚙️ Técnicos' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveAlertCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  activeAlertCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredAlerts.map((alert) => {
            const isJustSent = lastSentAlertId === alert.id;
            return (
              <div
                key={alert.id}
                className="flex flex-col justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 hover:shadow-md transition group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-white tracking-wider">
                      {alert.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      {alert.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-800 mb-1 group-hover:text-blue-600 transition">
                    {alert.title}
                  </h3>

                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-3 mb-3">
                    {alert.text}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center gap-1.5">
                  <button
                    onClick={() => handleApplyPreset(alert, true)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                      isJustSent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {isJustSent ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Enviado!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>⚡ Enviar Direto</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleApplyPreset(alert, false)}
                    title="Carregar no editor para customizar antes de enviar"
                    className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px] font-semibold transition"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Customizer (7 cols) + Live Overlay Simulator (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Comprehensive Ticker Customizer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-slate-800 text-base">
                  Editor do Letreiro Dinâmico & Efeitos
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Fonte: <code>Letreiro_Aviso</code>
              </span>
            </div>

            <div className="space-y-4">
              {/* Badge & Text Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-semibold text-xs text-slate-700 mb-1">
                    Etiqueta / Badge
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="Ex: 🚨 ALERTA"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-xs text-slate-700">
                      Texto do Letreiro / Notícia
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {tickerText.length} caracteres
                    </span>
                  </div>
                  <input
                    type="text"
                    value={tickerText}
                    onChange={(e) => setTickerText(e.target.value)}
                    placeholder="Digite a mensagem que passará na transmissão..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Text Effect Selector */}
              <div>
                <label className="block font-semibold text-xs text-slate-700 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Efeito Visual no Texto</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {textEffectsList.map((eff) => (
                    <button
                      key={eff.id}
                      onClick={() => setTextEffect(eff.id)}
                      className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                        textEffect === eff.id
                          ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {eff.icon}
                        <span className="text-xs font-bold text-slate-800">{eff.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 leading-tight">
                        {eff.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Box Effect Selector */}
              <div>
                <label className="block font-semibold text-xs text-slate-700 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Efeito de Caixa / Moldura do Letreiro</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {boxEffectsList.map((box) => (
                    <button
                      key={box.id}
                      onClick={() => setBoxEffect(box.id)}
                      className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                        boxEffect === box.id
                          ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800 mb-1">{box.label}</span>
                      <span className="text-[10px] text-slate-500 leading-tight">
                        {box.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette Selector */}
              <div>
                <label className="block font-semibold text-xs text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cor Principal do Texto</span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.hex}
                      onClick={() => setSelectedColor(preset.hex)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                        selectedColor === preset.hex
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${preset.bg}`} />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Effects & Speed Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Blinking Switch */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Efeito Piscar / Strobe</h4>
                      <p className="text-[10px] text-slate-500">Alterna visibilidade para atenção</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsBlinking(!isBlinking)}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${
                      isBlinking
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isBlinking ? 'LIGADO' : 'DESLIGADO'}
                  </button>
                </div>

                {/* Speed Selector */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Velocidade da Rolagem</h4>
                    <p className="text-[10px] text-slate-500">Taxa do scroll horizontal</p>
                  </div>
                  <div className="flex gap-1">
                    {(['slow', 'medium', 'fast'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition ${
                          speed === s
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {s === 'slow' ? '1x Lenta' : s === 'medium' ? '2x Média' : '3x Rápida'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Send vs Clear */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <button
                  onClick={handleClear}
                  className="w-full sm:w-auto px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold rounded-lg text-xs transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Ocultar / Limpar Letreiro</span>
                </button>

                <button
                  onClick={handleSend}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow-sm flex items-center justify-center gap-2"
                >
                  {isSent ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Enviado ao OBS Studio!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Atualizar Letreiro na Live</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Live Broadcast Overlay Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-slate-800 text-base">
                  Pré-visualização do Overlay
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                AO VIVO
              </span>
            </div>
            
            <p className="text-xs text-slate-500 mb-3">
              Renderização visual em tempo real combinando o <strong>efeito de caixa</strong> e o <strong>efeito de texto</strong> selecionados.
            </p>

            {/* Virtual Live TV Canvas */}
            <div className="relative w-full aspect-video bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-between p-3.5 shadow-inner">
              
              {/* Live Canvas Top Bar */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>AO VIVO</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                    OBS 60FPS
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded">
                    1080p
                  </span>
                </div>
              </div>

              {/* Center Monitor Placeholder */}
              <div className="text-center text-slate-600/80 text-xs font-mono">
                [ Câmera Principal / Transmissão do OBS ]
              </div>

              {/* Dynamic Bottom Box Effect Overlay */}
              <div className="w-full">
                {boxEffect === 'gamer_rgb' ? (
                  <div className={getBoxEffectWrapper()}>
                    <div className="bg-slate-950/95 backdrop-blur-md rounded-lg p-2 overflow-hidden flex items-center gap-2.5">
                      {badgeText && (
                        <span className="bg-gradient-to-r from-red-600 to-purple-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shrink-0 shadow">
                          {badgeText}
                        </span>
                      )}
                      <div className="overflow-hidden whitespace-nowrap w-full">
                        <span
                          className={`inline-block text-xs ${getTextEffectClass()} ${
                            isBlinking ? 'animate-pulse' : ''
                          } animate-marquee`}
                          style={{ 
                            color: selectedColor,
                            animationDuration: speed === 'slow' ? '22s' : speed === 'medium' ? '14s' : '7s'
                          }}
                        >
                          {tickerText || 'Nenhum texto ativo no momento'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-2.5 overflow-hidden flex items-center gap-2.5 ${getBoxEffectWrapper()}`}>
                    {badgeText && (
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded shrink-0 shadow ${
                        boxEffect === 'breaking_news'
                          ? 'bg-red-600 text-white'
                          : boxEffect === 'vip_gold'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-blue-600 text-white'
                      }`}>
                        {badgeText}
                      </span>
                    )}
                    
                    <div className="overflow-hidden whitespace-nowrap w-full">
                      <span
                        className={`inline-block text-xs ${getTextEffectClass()} ${
                          isBlinking ? 'animate-pulse' : ''
                        } animate-marquee`}
                        style={{ 
                          color: selectedColor,
                          animationDuration: speed === 'slow' ? '22s' : speed === 'medium' ? '14s' : '7s'
                        }}
                      >
                        {tickerText || 'Nenhum texto ativo no momento'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Quick OBS Integration Guide */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px]">Fonte do OBS Studio</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Sincronizado
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Crie no OBS Studio uma fonte do tipo <strong>Texto (GDI+)</strong> com o nome exato <code>Letreiro_Aviso</code>. O Central Hub injeta as atualizações instantaneamente via WebSocket sem reiniciar suas cenas.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
