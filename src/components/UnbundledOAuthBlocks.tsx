import React, { useState } from 'react';
import { 
  Key, 
  Globe, 
  Check, 
  Copy, 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Zap,
  LogOut,
  Share2,
  Send,
  Video
} from 'lucide-react';

export const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const TwitchIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.16 1.18 2.09 2.35 2.3 1.11.23 2.31-.21 2.98-1.11.46-.57.68-1.31.7-2.04V.02z" />
  </svg>
);

export const DiscordIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

export const VimeoIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.84 6.84c-.11 2.37-1.74 5.61-4.89 9.72-3.26 4.31-6.02 6.47-8.29 6.47-1.41 0-2.61-1.3-3.6-3.91l-1.95-7.14C3.4 9.42 2.7 8.13 2.01 8.13c-.15 0-.68.32-1.58.96L0 8.04c1.01-.89 2.01-1.78 3-2.66 1.37-1.18 2.39-1.8 3.06-1.87 1.58-.15 2.56.93 2.94 3.23.41 2.48.69 4.02.85 4.63.48 2.09 1.01 3.13 1.58 3.13.44 0 1.08-.71 1.91-2.13.84-1.42 1.29-2.5 1.36-3.25.11-1.22-.35-1.83-1.39-1.83-.5 0-1.03.11-1.59.34 1.03-3.37 3.01-5 5.94-4.9 2.18.07 3.24 1.48 3.18 4.21z"/>
  </svg>
);

export const RestreamIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l5-7v4h3l-5 7z" />
  </svg>
);

export const ZoomIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.585 13.607a2.72 2.72 0 0 1-.728-1.87c0-1.503 1.218-2.722 2.721-2.722h6.804c1.503 0 2.722 1.219 2.722 2.722v3.402a2.72 2.72 0 0 1-2.722 2.722H6.578a2.72 2.72 0 0 1-1.993-.854zm12.923-3.673l3.662-2.617A.68.68 0 0 1 22 7.873v8.254a.68.68 0 0 1-.83.663l-3.662-2.617v-4.24zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
  </svg>
);

export const MeetIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 4a8 8 0 0 0-8 8c0 4.418 3.582 8 8 8 3.064 0 5.727-1.722 7.072-4.267l-3.072-2.233V10.5l4-3v6.767A8.003 8.003 0 0 0 12 4zm-2 5.5h4a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 8.5 13v-2A1.5 1.5 0 0 1 10 9.5z"/>
  </svg>
);

export const TeamsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-3 3h2a2 2 0 0 1 2 2v2.5h-6V12.5a2 2 0 0 1 2-2zm-6-5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm-4 4h3a2.5 2.5 0 0 1 2.5 2.5v5.5H4v-5.5A2.5 2.5 0 0 1 6.5 9.5zM2 20h20v2H2v-2z"/>
  </svg>
);

export interface PlatformBlockItem {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  headerGradient: string;
  badgeLabel: string;
  isConnected: boolean;
  isAuthenticating: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  clientId: string;
  clientIdLabel?: string;
  clientSecret: string;
  clientSecretLabel?: string;
  serverUrl: string;
  serverUrlLabel?: string;
  streamKey: string;
  streamKeyLabel?: string;
  devPortalUrl: string;
  devPortalLabel: string;
  scopeDescription: string;
  successMessage?: string | null;
  extraDetails?: React.ReactNode;
}

interface UnbundledOAuthBlocksProps {
  lang?: "pt" | "en";
  blocks: PlatformBlockItem[];
  onUpdateCredential: (id: string, field: 'clientId' | 'clientSecret' | 'serverUrl' | 'streamKey', val: string) => void;
  onApplyToOBS: (platformName: string, serverUrl: string, streamKey: string) => void;
  onCrossCopy: (sourceName: string, serverUrl: string, streamKey: string) => void;
}

export const UnbundledOAuthBlocks: React.FC<UnbundledOAuthBlocksProps> = ({
  blocks,
  onUpdateCredential,
  onApplyToOBS,
  onCrossCopy,
  lang = "pt",
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'social' | 'meetings' | 'enterprise'>('all');
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleVisibility = (key: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyVal = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredBlocks = blocks.filter((b) => {
    if (filterCategory === 'social') {
      return ['youtube', 'twitch', 'facebook', 'instagram', 'tiktok', 'restream'].includes(b.id);
    }
    if (filterCategory === 'meetings') {
      return ['zoom', 'meet', 'teams', 'discord'].includes(b.id);
    }
    if (filterCategory === 'enterprise') {
      return ['vimeo', 'wpstream', 'teams'].includes(b.id);
    }
    return true;
  });

  const connectedCount = blocks.filter((b) => b.isConnected).length;

  return (
    <div className="space-y-5">
      {/* Barra Superior da Central de Integrações Desagrupadas */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 text-base md:text-lg leading-tight">
                  Central de Integrações OAuth2 & APIs Oficiais (Blocos Desagrupados)
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{connectedCount} de {blocks.length} Conectadas</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Todos os canais e serviços agora em blocos dedicados com Login OAuth2, Client ID/App ID, Client Secret, Servidor RTMPS e Stream Key.
              </p>
            </div>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: `Todos (${blocks.length} Blocos)` },
              { id: 'social', label: 'Redes Sociais & Vídeo' },
              { id: 'meetings', label: 'Reuniões & Conferências' },
              { id: 'enterprise', label: 'Corporativo & Portais' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                  filterCategory === cat.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grade de 12 Blocos Desagrupados em 2 Colunas Amplas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBlocks.map((block) => {
          const secretVisible = !!visibleSecrets[block.id + '-secret'];
          const keyVisible = !!visibleSecrets[block.id + '-key'];

          return (
            <div
              key={block.id}
              className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 relative overflow-hidden transition-all hover:border-slate-300 space-y-4"
            >
              {/* Top Gradient Stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${block.headerGradient}`} />

              {/* Cabeçalho do Bloco */}
              <div className="flex items-start justify-between gap-3 pt-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs shrink-0">
                    {block.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                      {block.name}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium truncate block">
                      {block.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border flex items-center gap-1 ${
                      block.isConnected
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        block.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    <span>{block.isConnected ? (lang === 'en' ? 'CONNECTED (ON)' : 'CONECTADO (ON)') : (lang === 'en' ? 'WAITING (OFF)' : 'AGUARDANDO (OFF)')}</span>
                  </span>
                </div>
              </div>

              {/* Botão de Login OAuth2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-700">{lang === 'en' ? 'Official OAuth2 Auth' : 'Autenticação OAuth2 Oficial'}</span>
                  <span className="text-[10px] font-mono text-slate-500">{block.badgeLabel}</span>
                </div>

                <div className="flex items-center gap-2">
                  {block.isConnected ? (
                    <div className="flex items-center justify-between w-full p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Autenticação Ativa via OAuth2</span>
                      </span>
                      <button
                        type="button"
                        onClick={block.onDisconnect}
                        className="px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100/60 rounded transition flex items-center gap-1 cursor-pointer"
                        title="Desconectar OAuth2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Desconectar</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={block.onConnect}
                      disabled={block.isAuthenticating}
                      className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {block.isAuthenticating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Autenticando via OAuth2...</span>
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4 text-amber-400" />
                          <span>Conectar com {block.name} (Login OAuth2)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Escopos: <code>{block.scopeDescription}</code></span>
                </div>
              </div>

              {/* Grade de Credenciais da API: Client ID e Client Secret */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Campo Client ID ou App ID */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 truncate">
                    {block.clientIdLabel || 'Client ID ou App ID:'}
                  </label>
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
                    <input
                      type="text"
                      value={block.clientId}
                      onChange={(e) => onUpdateCredential(block.id, 'clientId', e.target.value)}
                      placeholder="Client ID / App ID"
                      className="w-full bg-transparent text-xs font-mono text-slate-800 focus:outline-none min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => copyVal(block.id + '-clientId', block.clientId)}
                      className="p-1 hover:bg-slate-200 text-slate-500 rounded transition shrink-0 cursor-pointer"
                      title="Copiar Client ID"
                    >
                      {copiedKey === block.id + '-clientId' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Campo Client Secret ou App Secret */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 truncate">
                    {block.clientSecretLabel || 'Client Secret ou App Secret:'}
                  </label>
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
                    <input
                      type={secretVisible ? 'text' : 'password'}
                      value={block.clientSecret}
                      onChange={(e) => onUpdateCredential(block.id, 'clientSecret', e.target.value)}
                      placeholder="Client Secret / App Secret"
                      className="w-full bg-transparent text-xs font-mono text-slate-800 focus:outline-none min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility(block.id + '-secret')}
                      className="p-1 hover:bg-slate-200 text-slate-500 rounded transition shrink-0 cursor-pointer"
                      title={secretVisible ? 'Ocultar Secret' : 'Revelar Secret'}
                    >
                      {secretVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyVal(block.id + '-clientSecret', block.clientSecret)}
                      className="p-1 hover:bg-slate-200 text-slate-500 rounded transition shrink-0 cursor-pointer"
                      title="Copiar Secret"
                    >
                      {copiedKey === block.id + '-clientSecret' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Grade de Ingestão: URL Servidor RTMPS ou Webhook e Stream Key */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Campo URL Servidor RTMPS ou Webhook URL direta */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 truncate">
                    {block.serverUrlLabel || 'URL Servidor RTMPS ou Webhook:'}
                  </label>
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
                    <input
                      type="text"
                      value={block.serverUrl}
                      onChange={(e) => onUpdateCredential(block.id, 'serverUrl', e.target.value)}
                      placeholder="rtmps://... ou webhook url"
                      className="w-full bg-transparent text-xs font-mono text-slate-800 focus:outline-none min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => copyVal(block.id + '-serverUrl', block.serverUrl)}
                      className="p-1 hover:bg-slate-200 text-slate-500 rounded transition shrink-0 cursor-pointer"
                      title="Copiar URL"
                    >
                      {copiedKey === block.id + '-serverUrl' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Campo Stream Key (Chave de Transmissão) */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 truncate">
                    {block.streamKeyLabel || 'Chave de Transmissão (Stream Key):'}
                  </label>
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
                    <input
                      type={keyVisible ? 'text' : 'password'}
                      value={block.streamKey}
                      onChange={(e) => onUpdateCredential(block.id, 'streamKey', e.target.value)}
                      placeholder="Digite a Stream Key"
                      className="w-full bg-transparent text-xs font-mono text-slate-800 focus:outline-none min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility(block.id + '-key')}
                      className="p-1 hover:bg-slate-200 text-slate-500 rounded transition shrink-0 cursor-pointer"
                      title={keyVisible ? 'Ocultar Chave' : 'Revelar Chave'}
                    >
                      {keyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyVal(block.id + '-streamKey', block.streamKey)}
                      className="p-1 hover:bg-slate-200 text-slate-500 rounded transition shrink-0 cursor-pointer"
                      title="Copiar Stream Key"
                    >
                      {copiedKey === block.id + '-streamKey' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {block.extraDetails}

              {/* Barra de Ações: Injetar no OBS, Cópia Cruzada e Link Oficial */}
              <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onApplyToOBS(block.name, block.serverUrl, block.streamKey)}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  title={`Injetar ${block.name} diretamente no OBS Studio`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Injetar no OBS Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => onCrossCopy(block.name, block.serverUrl, block.streamKey)}
                  className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Cópia Cruzada: Replicar para Multi-RTMP"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cópia Cruzada</span>
                </button>

                <a
                  href={block.devPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1 shrink-0"
                  title={block.devPortalLabel}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px] hidden md:inline">{block.devPortalLabel}</span>
                </a>
              </div>

              {/* Feedback de Sucesso */}
              {block.successMessage && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{block.successMessage}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
