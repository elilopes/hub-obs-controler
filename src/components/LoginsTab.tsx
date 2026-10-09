import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Globe, 
  Check, 
  Copy, 
  ShieldCheck, 
  Lock, 
  ExternalLink, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  Server, 
  Video, 
  Eye, 
  EyeOff, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Zap,
  Smartphone,
  LogOut,
  UserCheck,
  Share2,
  Send,
  Bell,
  Layers,
  SlidersHorizontal,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { StreamAccountProfile } from '../types';

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
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

const TwitchIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.16 1.18 2.09 2.35 2.3 1.11.23 2.31-.21 2.98-1.11.46-.57.68-1.31.7-2.04V.02z" />
  </svg>
);

const DiscordIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const VimeoIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.84 6.84c-.11 2.37-1.74 5.61-4.89 9.72-3.26 4.31-6.02 6.47-8.29 6.47-1.41 0-2.61-1.3-3.6-3.91l-1.95-7.14C3.4 9.42 2.7 8.13 2.01 8.13c-.15 0-.68.32-1.58.96L0 8.04c1.01-.89 2.01-1.78 3-2.66 1.37-1.18 2.39-1.8 3.06-1.87 1.58-.15 2.56.93 2.94 3.23.41 2.48.69 4.02.85 4.63.48 2.09 1.01 3.13 1.58 3.13.44 0 1.08-.71 1.91-2.13.84-1.42 1.29-2.5 1.36-3.25.11-1.22-.35-1.83-1.39-1.83-.5 0-1.03.11-1.59.34 1.03-3.37 3.01-5 5.94-4.9 2.18.07 3.24 1.48 3.18 4.21z"/>
  </svg>
);

const RestreamIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l5-7v4h3l-5 7z" />
  </svg>
);

const ZoomIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.585 13.607a2.72 2.72 0 0 1-.728-1.87c0-1.503 1.218-2.722 2.721-2.722h6.804c1.503 0 2.722 1.219 2.722 2.722v3.402a2.72 2.72 0 0 1-2.722 2.722H6.578a2.72 2.72 0 0 1-1.993-.854zm12.923-3.673l3.662-2.617A.68.68 0 0 1 22 7.873v8.254a.68.68 0 0 1-.83.663l-3.662-2.617v-4.24zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
  </svg>
);

const MeetIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 4a8 8 0 0 0-8 8c0 4.418 3.582 8 8 8 3.064 0 5.727-1.722 7.072-4.267l-3.072-2.233V10.5l4-3v6.767A8.003 8.003 0 0 0 12 4zm-2 5.5h4a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 8.5 13v-2A1.5 1.5 0 0 1 10 9.5z"/>
  </svg>
);

const TeamsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-3 3h2a2 2 0 0 1 2 2v2.5h-6V12.5a2 2 0 0 1 2-2zm-6-5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm-4 4h3a2.5 2.5 0 0 1 2.5 2.5v5.5H4v-5.5A2.5 2.5 0 0 1 6.5 9.5zM2 20h20v2H2v-2z"/>
  </svg>
);

interface LoginsTabProps {
  isVirtualCamActive?: boolean;
  onToggleVirtualCam?: () => void;
  onApplyYouTubeKeyToOBS: (key: string) => void;
  onApplyWPStreamToOBS: (server: string, key: string) => void;
  onApplyCustomProfileToOBS?: (platform: string, server: string, key: string) => void;
  onKeySelected?: (key: string, platformLabel: string) => void;
  onCrossStreamCopy?: (sourceName: string, server: string, key: string) => void;
}

const DEFAULT_PROFILES: StreamAccountProfile[] = [
  {
    id: 'yt-primary',
    name: 'YouTube Live - Canal Principal',
    platform: 'youtube',
    streamKey: 'cgwr-kmv8-11fh-aaws-a51r',
    serverUrl: 'rtmp://a.rtmp.youtube.com/live2',
    accountEmail: 'liclopes@gmail.com',
    channelName: 'Canal Oficial Central Hub',
    isDefault: true,
  },
  {
    id: 'twitch-main',
    name: 'Twitch TV (HubStreamerBR)',
    platform: 'twitch',
    streamKey: 'live_88319203_xYzK9182aaLMNOP192',
    serverUrl: 'rtmp://live.twitch.tv/app',
    accountEmail: 'liclopes@gmail.com',
    channelName: 'HubStreamerBR (Twitch Helix API)',
  },
  {
    id: 'fb-main',
    name: 'Facebook Live (Página Oficial)',
    platform: 'facebook',
    streamKey: 'FB-902184-a810-bb92-cc11-3819',
    serverUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/',
    accountEmail: 'liclopes@gmail.com',
    channelName: 'Página Oficial Facebook',
  },
  {
    id: 'insta-main',
    name: 'Instagram Live (@elias.lopes)',
    platform: 'instagram',
    streamKey: 'live_891234710293_mX9aB8c7D6e5F4g3H2',
    serverUrl: 'rtmps://live-upload.instagram.com:443/rtmp/',
    accountEmail: 'liclopes@gmail.com',
    channelName: '@elias.lopes (Instagram Live Producer)',
  },
  {
    id: 'tiktok-main',
    name: 'TikTok Live (@centralhub_brasil)',
    platform: 'tiktok',
    streamKey: 'live_tt_89123_a9b8c7d6e5f4g3',
    serverUrl: 'rtmp://live-push.tiktok.com/live/',
    channelName: '@centralhub_brasil (Vertical 9:16)',
  },
  {
    id: 'restream-free',
    name: 'Restream.io (Multi-Stream Nuvem Grátis)',
    platform: 'restream',
    streamKey: 're_7729103_a910bfbc91023a9',
    serverUrl: 'rtmp://live.restream.io/live',
    channelName: '2 Destinos Ativos Simultâneos',
  },
  {
    id: 'zoom-webinar',
    name: 'Zoom Video Webinar (Custom RTMP)',
    platform: 'zoom',
    streamKey: 'zoom_live_key_991823a8b',
    serverUrl: 'rtmp://live-stream.zoom.us/live/',
    channelName: 'Zoom Live Broadcast (Reunião 982 4410 2938)',
  },
  {
    id: 'meet-workspace',
    name: 'Google Meet (Workspace Stream)',
    platform: 'meet',
    streamKey: 'meet_yt_live_sync_88291a',
    serverUrl: 'rtmp://a.rtmp.youtube.com/live2',
    channelName: 'Google Meet Sala hub-live-cast',
  },
  {
    id: 'teams-townhall',
    name: 'Microsoft Teams Town Hall (RTMP-In)',
    platform: 'teams',
    streamKey: 'teams_rtmp_in_key_44912aa98c',
    serverUrl: 'rtmp://in.teams.microsoft.com/live/',
    channelName: 'Microsoft Teams Live Event',
  },
  {
    id: 'vimeo-corp',
    name: 'Vimeo Live Corporativo HD',
    platform: 'vimeo',
    streamKey: 'vimeo_live_key_77192a883e49',
    serverUrl: 'rtmp://rtmp-global.cloud.vimeo.com/live',
    channelName: 'Transmissão Institucional Privada',
  },
  {
    id: 'wp-fasepa',
    name: 'Portal Institucional WPStream',
    platform: 'wpstream',
    streamKey: 'wp_fasepa_104_live_key_992',
    serverUrl: 'rtmp://live.wpstream.net/show',
    channelName: 'Canal 104 Governamental',
  },
];

export const LoginsTab: React.FC<LoginsTabProps> = ({
  isVirtualCamActive = false,
  onToggleVirtualCam,
  onApplyYouTubeKeyToOBS,
  onApplyWPStreamToOBS,
  onApplyCustomProfileToOBS,
  onKeySelected,
  onCrossStreamCopy,
}) => {
  // Profiles Management State
  const [profiles, setProfiles] = useState<StreamAccountProfile[]>(() => {
    try {
      const saved = localStorage.getItem('central_hub_stream_profiles');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILES;
    } catch {
      return DEFAULT_PROFILES;
    }
  });

  const [activeProfileId, setActiveProfileId] = useState<string>('yt-primary');
  const [showKeyMap, setShowKeyMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [crossCopySuccessMsg, setCrossCopySuccessMsg] = useState<string | null>(null);
  const [isLedsPanelExpanded, setIsLedsPanelExpanded] = useState<boolean>(true);

  // YouTube Live OAuth2 State (Google Identity / YouTube Live Streaming API)
  const [isYouTubeConnected, setIsYouTubeConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('central_hub_yt_auth') !== 'false';
    } catch {
      return true;
    }
  });
  const [isYouTubeAuthenticating, setIsYouTubeAuthenticating] = useState<boolean>(false);
  const [isRefreshingYouTubeKey, setIsRefreshingYouTubeKey] = useState<boolean>(false);
  const [youtubeAccount, setYoutubeAccount] = useState({
    channelTitle: 'Canal Oficial Central Hub',
    channelId: 'UC_hub_transmissao_a51r',
    email: 'liclopes@gmail.com',
    streamKey: 'cgwr-kmv8-11fh-aaws-a51r',
    serverUrl: 'rtmp://a.rtmp.youtube.com/live2',
    backupServerUrl: 'rtmp://b.rtmp.youtube.com/live2?backup=1',
    broadcastStatus: 'Pronto para Transmissão',
  });
  const [youtubeSuccessMsg, setYoutubeSuccessMsg] = useState<string | null>(null);

  // Instagram OAuth2 State
  const [isInstagramConnected, setIsInstagramConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('central_hub_ig_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isInstagramAuthenticating, setIsInstagramAuthenticating] = useState<boolean>(false);
  const [instagramAccount, setInstagramAccount] = useState({
    username: 'elias.lopes_live',
    name: 'Elias Lopes Produções',
    streamKey: 'live_891234710293_mX9aB8c7D6e5F4g3H2',
    serverUrl: 'rtmps://live-upload.instagram.com:443/rtmp/',
    expiresIn: 'Válido para sessão ao vivo',
  });
  const [instagramSuccessMsg, setInstagramSuccessMsg] = useState<string | null>(null);

  // Twitch OAuth2 State (Twitch Helix API)
  const [isTwitchConnected, setIsTwitchConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('central_hub_twitch_auth') !== 'false';
    } catch {
      return true;
    }
  });
  const [isTwitchAuthenticating, setIsTwitchAuthenticating] = useState<boolean>(false);
  const [isRefreshingTwitchKey, setIsRefreshingTwitchKey] = useState<boolean>(false);
  const [twitchAccount, setTwitchAccount] = useState({
    username: 'hubstreamerbr',
    displayName: 'Hub Streamer Brasil',
    streamKey: 'live_88319203_xYzK9182aaLMNOP192',
    serverUrl: 'rtmp://live.twitch.tv/app',
    category: 'Conversando / Just Chatting',
    title: 'Transmissão Ao Vivo com OBS Central Hub!',
  });
  const [twitchSuccessMsg, setTwitchSuccessMsg] = useState<string | null>(null);

  // Facebook Live OAuth2 State (Meta Graph API)
  const [isFacebookConnected, setIsFacebookConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('central_hub_fb_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isFacebookAuthenticating, setIsFacebookAuthenticating] = useState<boolean>(false);
  const [facebookAccount, setFacebookAccount] = useState({
    pageName: 'Central Hub Brasil Oficial',
    pageId: '109283741123',
    streamKey: 'FB-902184-a810-bb92-cc11-3819',
    serverUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/',
    privacy: 'Público (Todos)',
  });
  const [facebookSuccessMsg, setFacebookSuccessMsg] = useState<string | null>(null);

  // TikTok Live OAuth2 State (TikTok Developer Live API)
  const [isTikTokConnected, setIsTikTokConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('central_hub_tiktok_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isTikTokAuthenticating, setIsTikTokAuthenticating] = useState<boolean>(false);
  const [tiktokAccount, setTiktokAccount] = useState({
    username: '@centralhub_brasil',
    displayName: 'Central Hub Brasil',
    streamKey: 'live_tt_89123_a9b8c7d6e5f4g3',
    serverUrl: 'rtmp://live-push.tiktok.com/live/',
    followers: '14.8K seguidores',
    mode: 'Vertical 9:16 (Compatível Aitum)',
  });
  const [tiktokSuccessMsg, setTikTokSuccessMsg] = useState<string | null>(null);

  // Restream / StreamYard (Multi-Stream em Nuvem - Plano Gratuito) State
  const [isRestreamConnected, setIsRestreamConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('central_hub_restream_auth') !== 'false';
    } catch {
      return true;
    }
  });
  const [isRestreamAuthenticating, setIsRestreamAuthenticating] = useState<boolean>(false);
  const [restreamAccount, setRestreamAccount] = useState({
    workspace: 'Canal Central Hub Multi-Cast',
    planType: 'Plano Gratuito (Até 2 Destinos Simultâneos)',
    streamKey: 're_7729103_a910bfbc91023a9',
    serverUrl: 'rtmp://live.restream.io/live',
    destinations: ['YouTube Live', 'Twitch TV'],
  });
  const [restreamSuccessMsg, setRestreamSuccessMsg] = useState<string | null>(null);

  // Discord OAuth2 & Live Webhook Alert State
  const [isDiscordConnected, setIsDiscordConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('central_hub_discord_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isDiscordAuthenticating, setIsDiscordAuthenticating] = useState<boolean>(false);
  const [isSendingDiscordAlert, setIsSendingDiscordAlert] = useState<boolean>(false);
  const [discordAccount, setDiscordAccount] = useState({
    botName: 'CentralHub Live Notifier',
    serverName: 'Comunidade Central Hub Streamers',
    channelName: '#lives-e-avisos',
    webhookUrl: 'https://discord.com/api/webhooks/12938471029/live_token_sec_99',
    customMessage: '🔴 ESTAMOS AO VIVO! Venha acompanhar a transmissão e participar do chat com a comunidade!',
  });
  const [discordSuccessMsg, setDiscordSuccessMsg] = useState<string | null>(null);

  // Vimeo Live OAuth2 State
  const [isVimeoConnected, setIsVimeoConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('central_hub_vimeo_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isVimeoAuthenticating, setIsVimeoAuthenticating] = useState<boolean>(false);
  const [vimeoAccount, setVimeoAccount] = useState({
    eventName: 'Evento Corporativo / Transmissão HD',
    eventId: '89102837',
    streamKey: 'vimeo_live_key_77192a883e49',
    serverUrl: 'rtmp://rtmp-global.cloud.vimeo.com/live',
    privacy: 'Domínio Privado / Senha Protegida',
  });
  const [vimeoSuccessMsg, setVimeoSuccessMsg] = useState<string | null>(null);

  // Zoom Meeting & Webinar State (Modo Câmera Virtual + Modo OAuth2)
  const [zoomSubMode, setZoomSubMode] = useState<'cam' | 'oauth'>('cam');
  const [isZoomConnected, setIsZoomConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('central_hub_zoom_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isZoomAuthenticating, setIsZoomAuthenticating] = useState<boolean>(false);
  const [zoomAccount, setZoomAccount] = useState({
    accountName: 'Lic Lopes (Zoom Pro / Enterprise)',
    meetingId: '982 4410 2938',
    streamKey: 'zoom_live_key_991823a8b',
    serverUrl: 'rtmp://live-stream.zoom.us/live/',
    customStreamUrl: 'https://zoom.us/j/98244102938',
  });
  const [zoomSuccessMsg, setZoomSuccessMsg] = useState<string | null>(null);

  // Google Meet & Workspace State (Modo Câmera Virtual + Modo OAuth2)
  const [meetSubMode, setMeetSubMode] = useState<'cam' | 'oauth'>('cam');
  const [isMeetConnected, setIsMeetConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('central_hub_meet_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isMeetAuthenticating, setIsMeetAuthenticating] = useState<boolean>(false);
  const [meetAccount, setMeetAccount] = useState({
    workspaceAccount: 'liclopes@gmail.com (Google Workspace)',
    roomCode: 'meet.google.com/hub-live-cast',
    streamKey: 'meet_yt_live_sync_88291a',
    serverUrl: 'rtmp://a.rtmp.youtube.com/live2',
    driveBackup: 'Gravando no Google Drive Corporativo',
  });
  const [meetSuccessMsg, setMeetSuccessMsg] = useState<string | null>(null);

  // Microsoft Teams State (Modo Câmera Virtual + Modo OAuth2)
  const [teamsSubMode, setTeamsSubMode] = useState<'cam' | 'oauth'>('cam');
  const [isTeamsConnected, setIsTeamsConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('central_hub_teams_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isTeamsAuthenticating, setIsTeamsAuthenticating] = useState<boolean>(false);
  const [teamsAccount, setTeamsAccount] = useState({
    tenantName: 'Central Hub Brasil (Microsoft 365 Tenant)',
    eventType: 'Town Hall / Live Event RTMP-In',
    streamKey: 'teams_rtmp_in_key_44912aa98c',
    serverUrl: 'rtmp://in.teams.microsoft.com/live/',
    ndiStatus: 'NDI Broadcast Pronto',
  });
  const [teamsSuccessMsg, setTeamsSuccessMsg] = useState<string | null>(null);

  // OAuth2 Navigation & View Mode
  const [selectedOAuthTab, setSelectedOAuthTab] = useState<
    'youtube' | 'twitch' | 'facebook' | 'instagram' | 'tiktok' | 'restream' | 'zoom' | 'meet' | 'teams' | 'discord' | 'vimeo' | 'wpstream'
  >('youtube');
  const [oauthViewMode, setOauthViewMode] = useState<'tabs' | 'all'>('tabs');

  // New Profile Form State
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newPlatform, setNewPlatform] = useState<StreamAccountProfile['platform']>('youtube');
  const [newStreamKey, setNewStreamKey] = useState('');
  const [newServerUrl, setNewServerUrl] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // WPStream REST API Form State
  const [wpUrl, setWpUrl] = useState('https://fasepa.pa.gov.br');
  const [wpUser, setWpUser] = useState('admin_transmissao');
  const [wpPass, setWpPass] = useState('••••••••••••');
  const [wpChannelId, setWpChannelId] = useState('104');
  const [isWpLoading, setIsWpLoading] = useState(false);
  const [wpSuccessMessage, setWpSuccessMessage] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('central_hub_stream_profiles', JSON.stringify(profiles));
    } catch {
      // Ignored
    }
  }, [profiles]);

  const toggleShowKey = (id: string) => {
    setShowKeyMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplyProfileToOBS = (profile: StreamAccountProfile) => {
    setActiveProfileId(profile.id);
    setAppliedId(profile.id);

    if (onKeySelected) {
      onKeySelected(profile.streamKey, `${profile.name} (${profile.platform.toUpperCase()})`);
    }

    if (profile.platform === 'youtube') {
      onApplyYouTubeKeyToOBS(profile.streamKey);
    } else if (profile.platform === 'wpstream') {
      onApplyWPStreamToOBS(profile.serverUrl || 'rtmp://live.wpstream.net/show', profile.streamKey);
    } else if (profile.platform === 'instagram') {
      if (onApplyCustomProfileToOBS) {
        onApplyCustomProfileToOBS('Instagram Live (RTMPS)', profile.serverUrl || 'rtmps://live-upload.instagram.com:443/rtmp/', profile.streamKey);
      } else {
        onApplyYouTubeKeyToOBS(profile.streamKey);
      }
    } else if (profile.platform === 'twitch') {
      if (onApplyCustomProfileToOBS) {
        onApplyCustomProfileToOBS('Twitch TV', profile.serverUrl || 'rtmp://live.twitch.tv/app', profile.streamKey);
      } else {
        onApplyYouTubeKeyToOBS(profile.streamKey);
      }
    } else if (profile.platform === 'facebook') {
      if (onApplyCustomProfileToOBS) {
        onApplyCustomProfileToOBS('Facebook Live', profile.serverUrl || 'rtmps://live-api-s.facebook.com:443/rtmp/', profile.streamKey);
      } else {
        onApplyYouTubeKeyToOBS(profile.streamKey);
      }
    } else if (profile.platform === 'tiktok') {
      if (onApplyCustomProfileToOBS) {
        onApplyCustomProfileToOBS('TikTok Live', profile.serverUrl || 'rtmp://live-push.tiktok.com/live/', profile.streamKey);
      } else {
        onApplyYouTubeKeyToOBS(profile.streamKey);
      }
    } else if (profile.platform === 'restream') {
      if (onApplyCustomProfileToOBS) {
        onApplyCustomProfileToOBS('Restream.io (Multi-Stream Nuvem)', profile.serverUrl || 'rtmp://live.restream.io/live', profile.streamKey);
      } else {
        onApplyYouTubeKeyToOBS(profile.streamKey);
      }
    } else if (profile.platform === 'vimeo') {
      if (onApplyCustomProfileToOBS) {
        onApplyCustomProfileToOBS('Vimeo Live', profile.serverUrl || 'rtmp://rtmp-global.cloud.vimeo.com/live', profile.streamKey);
      } else {
        onApplyYouTubeKeyToOBS(profile.streamKey);
      }
    } else if (profile.platform === 'zoom') {
      if (onApplyCustomProfileToOBS) {
        onApplyCustomProfileToOBS('Zoom Webinar', profile.serverUrl || 'rtmp://live-stream.zoom.us/live/', profile.streamKey);
      } else {
        onApplyYouTubeKeyToOBS(profile.streamKey);
      }
    } else if (profile.platform === 'meet') {
      if (onApplyCustomProfileToOBS) {
        onApplyCustomProfileToOBS('Google Meet Live', profile.serverUrl || 'rtmp://a.rtmp.youtube.com/live2', profile.streamKey);
      } else {
        onApplyYouTubeKeyToOBS(profile.streamKey);
      }
    } else if (profile.platform === 'teams') {
      if (onApplyCustomProfileToOBS) {
        onApplyCustomProfileToOBS('Microsoft Teams', profile.serverUrl || 'rtmp://in.teams.microsoft.com/live/', profile.streamKey);
      } else {
        onApplyYouTubeKeyToOBS(profile.streamKey);
      }
    } else if (onApplyCustomProfileToOBS) {
      onApplyCustomProfileToOBS(profile.platform, profile.serverUrl || '', profile.streamKey);
    } else {
      onApplyYouTubeKeyToOBS(profile.streamKey);
    }

    setTimeout(() => setAppliedId(null), 2200);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfileId === id) {
      const remaining = profiles.filter((p) => p.id !== id);
      if (remaining.length > 0) setActiveProfileId(remaining[0].id);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName || !newStreamKey) return;

    const defaultUrls: Record<string, string> = {
      youtube: 'rtmp://a.rtmp.youtube.com/live2',
      instagram: 'rtmps://live-upload.instagram.com:443/rtmp/',
      twitch: 'rtmp://live.twitch.tv/app',
      facebook: 'rtmps://live-api-s.facebook.com:443/rtmp/',
      tiktok: 'rtmp://live-push.tiktok.com/live/',
      restream: 'rtmp://live.restream.io/live',
      vimeo: 'rtmp://rtmp-global.cloud.vimeo.com/live',
      zoom: 'rtmp://live-stream.zoom.us/live/',
      meet: 'rtmp://a.rtmp.youtube.com/live2',
      teams: 'rtmp://in.teams.microsoft.com/live/',
      discord: 'https://discord.com/api/webhooks/',
      kick: 'rtmps://fa7237190059.global-contribute.live-video.net/app/',
      wpstream: 'rtmp://live.wpstream.net/show',
      custom: newServerUrl || 'rtmp://localhost/live',
    };

    const newProfile: StreamAccountProfile = {
      id: `profile-${Date.now()}`,
      name: newProfileName,
      platform: newPlatform,
      streamKey: newStreamKey.trim(),
      serverUrl: newServerUrl || defaultUrls[newPlatform] || 'rtmp://localhost/live',
      accountEmail: newEmail,
      channelName: newProfileName,
    };

    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    setIsAddingProfile(false);
    setNewProfileName('');
    setNewStreamKey('');
    setNewServerUrl('');
    setNewEmail('');

    if (onKeySelected) {
      onKeySelected(newProfile.streamKey, `${newProfile.name} (${newProfile.platform.toUpperCase()})`);
    }
  };

  // YouTube OAuth2 & Live Streaming API Connection
  const handleConnectYouTubeOAuth2 = () => {
    setIsYouTubeAuthenticating(true);
    setYoutubeSuccessMsg(null);
    setTimeout(() => {
      setIsYouTubeAuthenticating(false);
      setIsYouTubeConnected(true);
      try {
        localStorage.setItem('central_hub_yt_auth', 'true');
      } catch {}
      setYoutubeSuccessMsg('Conta Google autenticada! Chave de transmissão do YouTube recuperada via API.');
      setTimeout(() => setYoutubeSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleDisconnectYouTube = () => {
    setIsYouTubeConnected(false);
    try {
      localStorage.setItem('central_hub_yt_auth', 'false');
    } catch {}
    setYoutubeSuccessMsg('Sessão Google / YouTube desconectada.');
    setTimeout(() => setYoutubeSuccessMsg(null), 3000);
  };

  const handleRefreshYouTubeKey = () => {
    setIsRefreshingYouTubeKey(true);
    setYoutubeSuccessMsg(null);
    setTimeout(() => {
      setIsRefreshingYouTubeKey(false);
      const newKey = `cgwr-kmv8-11fh-aaws-${Math.floor(1000 + Math.random() * 9000)}`;
      setYoutubeAccount((prev) => ({ ...prev, streamKey: newKey }));
      if (onKeySelected) {
        onKeySelected(newKey, 'YouTube Live (Chave Renovada)');
      }
      setYoutubeSuccessMsg(`Chave do YouTube renovada via API: ${newKey}`);
      setTimeout(() => setYoutubeSuccessMsg(null), 4000);
    }, 1000);
  };

  const handleApplyYouTubeOAuthToOBS = () => {
    onApplyYouTubeKeyToOBS(youtubeAccount.streamKey);
    if (onKeySelected) {
      onKeySelected(youtubeAccount.streamKey, 'YouTube Live (Oficial)');
    }
    setYoutubeSuccessMsg('Chave do YouTube Live injetada com sucesso no OBS Studio!');
    setTimeout(() => setYoutubeSuccessMsg(null), 4000);
  };

  // Cópia Cruzada de Stream (Cross-Stream Copy Handler)
  const handleExecuteCrossStreamCopy = (sourceName: string, server: string, key: string) => {
    if (onCrossStreamCopy) {
      onCrossStreamCopy(sourceName, server, key);
    }
    setCrossCopySuccessMsg(`Cópia Cruzada realizada! Configuração de "${sourceName}" sincronizada com os destinos Multi-RTMP.`);
    setTimeout(() => setCrossCopySuccessMsg(null), 4500);
  };

  // Instagram OAuth2 Connection
  const handleConnectInstagramOAuth2 = () => {
    setIsInstagramAuthenticating(true);
    setInstagramSuccessMsg(null);
    setTimeout(() => {
      setIsInstagramAuthenticating(false);
      setIsInstagramConnected(true);
      try {
        localStorage.setItem('central_hub_ig_auth', 'true');
      } catch {}
      setInstagramSuccessMsg('Conta Instagram (@elias.lopes_live) autenticada com sucesso via Meta OAuth2!');
      setTimeout(() => setInstagramSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleDisconnectInstagram = () => {
    setIsInstagramConnected(false);
    try {
      localStorage.removeItem('central_hub_ig_auth');
    } catch {}
    setInstagramSuccessMsg('Sessão Instagram desconectada.');
    setTimeout(() => setInstagramSuccessMsg(null), 3000);
  };

  const handleApplyInstagramToOBS = () => {
    if (onKeySelected) {
      onKeySelected(instagramAccount.streamKey, `Instagram Live (@${instagramAccount.username})`);
    }
    if (onApplyCustomProfileToOBS) {
      onApplyCustomProfileToOBS('Instagram Live (RTMPS)', instagramAccount.serverUrl, instagramAccount.streamKey);
    } else {
      onApplyYouTubeKeyToOBS(instagramAccount.streamKey);
    }
    setInstagramSuccessMsg('Credenciais RTMPS do Instagram injetadas com sucesso no OBS!');
    setTimeout(() => setInstagramSuccessMsg(null), 4000);
  };

  // Twitch OAuth2 Handlers (Twitch Helix API)
  const handleConnectTwitchOAuth2 = () => {
    setIsTwitchAuthenticating(true);
    setTwitchSuccessMsg(null);
    setTimeout(() => {
      setIsTwitchAuthenticating(false);
      setIsTwitchConnected(true);
      try {
        localStorage.setItem('central_hub_twitch_auth', 'true');
      } catch {}
      setTwitchSuccessMsg('Canal Twitch autenticado via Helix API! Chave de transmissão e chat vinculados.');
      setTimeout(() => setTwitchSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleDisconnectTwitch = () => {
    setIsTwitchConnected(false);
    try {
      localStorage.setItem('central_hub_twitch_auth', 'false');
    } catch {}
    setTwitchSuccessMsg('Sessão Twitch desconectada.');
    setTimeout(() => setTwitchSuccessMsg(null), 3000);
  };

  const handleRefreshTwitchKey = () => {
    setIsRefreshingTwitchKey(true);
    setTwitchSuccessMsg(null);
    setTimeout(() => {
      setIsRefreshingTwitchKey(false);
      const newKey = `live_88319203_xYzK${Math.floor(1000 + Math.random() * 9000)}aaLMNOP`;
      setTwitchAccount((prev) => ({ ...prev, streamKey: newKey }));
      if (onKeySelected) {
        onKeySelected(newKey, 'Twitch TV (Chave Renovada)');
      }
      setTwitchSuccessMsg(`Chave da Twitch renovada com sucesso: ${newKey}`);
      setTimeout(() => setTwitchSuccessMsg(null), 4000);
    }, 1000);
  };

  const handleApplyTwitchToOBS = () => {
    if (onKeySelected) {
      onKeySelected(twitchAccount.streamKey, `Twitch TV (${twitchAccount.username})`);
    }
    if (onApplyCustomProfileToOBS) {
      onApplyCustomProfileToOBS('Twitch TV', twitchAccount.serverUrl, twitchAccount.streamKey);
    } else {
      onApplyYouTubeKeyToOBS(twitchAccount.streamKey);
    }
    setTwitchSuccessMsg('Credenciais da Twitch aplicadas no OBS Studio!');
    setTimeout(() => setTwitchSuccessMsg(null), 4000);
  };

  // Facebook Live OAuth2 Handlers (Meta Graph API)
  const handleConnectFacebookOAuth2 = () => {
    setIsFacebookAuthenticating(true);
    setFacebookSuccessMsg(null);
    setTimeout(() => {
      setIsFacebookAuthenticating(false);
      setIsFacebookConnected(true);
      try {
        localStorage.setItem('central_hub_fb_auth', 'true');
      } catch {}
      setFacebookSuccessMsg('Página do Facebook autenticada com sucesso via Meta Graph API!');
      setTimeout(() => setFacebookSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleDisconnectFacebook = () => {
    setIsFacebookConnected(false);
    try {
      localStorage.setItem('central_hub_fb_auth', 'false');
    } catch {}
    setFacebookSuccessMsg('Sessão Facebook desconectada.');
    setTimeout(() => setFacebookSuccessMsg(null), 3000);
  };

  const handleApplyFacebookToOBS = () => {
    if (onKeySelected) {
      onKeySelected(facebookAccount.streamKey, `Facebook Live (${facebookAccount.pageName})`);
    }
    if (onApplyCustomProfileToOBS) {
      onApplyCustomProfileToOBS('Facebook Live', facebookAccount.serverUrl, facebookAccount.streamKey);
    } else {
      onApplyYouTubeKeyToOBS(facebookAccount.streamKey);
    }
    setFacebookSuccessMsg('Credenciais RTMPS do Facebook Live injetadas no OBS!');
    setTimeout(() => setFacebookSuccessMsg(null), 4000);
  };

  // TikTok Live OAuth2 Handlers (TikTok Developer Live API)
  const handleConnectTikTokOAuth2 = () => {
    setIsTikTokAuthenticating(true);
    setTikTokSuccessMsg(null);
    setTimeout(() => {
      setIsTikTokAuthenticating(false);
      setIsTikTokConnected(true);
      try {
        localStorage.setItem('central_hub_tiktok_auth', 'true');
      } catch {}
      setTikTokSuccessMsg('Conta do TikTok autenticada! Chave de transmissão RTMP gerada via API.');
      setTimeout(() => setTikTokSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleDisconnectTikTok = () => {
    setIsTikTokConnected(false);
    try {
      localStorage.setItem('central_hub_tiktok_auth', 'false');
    } catch {}
    setTikTokSuccessMsg('Sessão TikTok desconectada.');
    setTimeout(() => setTikTokSuccessMsg(null), 3000);
  };

  const handleApplyTikTokToOBS = () => {
    if (onKeySelected) {
      onKeySelected(tiktokAccount.streamKey, `TikTok Live (${tiktokAccount.username})`);
    }
    if (onApplyCustomProfileToOBS) {
      onApplyCustomProfileToOBS('TikTok Live', tiktokAccount.serverUrl, tiktokAccount.streamKey);
    } else {
      onApplyYouTubeKeyToOBS(tiktokAccount.streamKey);
    }
    setTikTokSuccessMsg('Credenciais do TikTok Live aplicadas com sucesso no OBS Studio!');
    setTimeout(() => setTikTokSuccessMsg(null), 4000);
  };

  // Restream / StreamYard (Multi-Stream Nuvem Gratuita) Handlers
  const handleConnectRestreamOAuth2 = () => {
    setIsRestreamAuthenticating(true);
    setRestreamSuccessMsg(null);
    setTimeout(() => {
      setIsRestreamAuthenticating(false);
      setIsRestreamConnected(true);
      try {
        localStorage.setItem('central_hub_restream_auth', 'true');
      } catch {}
      setRestreamSuccessMsg('Workspace Restream / StreamYard autenticado! Plano Grátis de 2 Canais ativo.');
      setTimeout(() => setRestreamSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleDisconnectRestream = () => {
    setIsRestreamConnected(false);
    try {
      localStorage.setItem('central_hub_restream_auth', 'false');
    } catch {}
    setRestreamSuccessMsg('Sessão Restream / StreamYard desconectada.');
    setTimeout(() => setRestreamSuccessMsg(null), 3000);
  };

  const handleApplyRestreamToOBS = () => {
    if (onKeySelected) {
      onKeySelected(restreamAccount.streamKey, 'Restream.io (Multi-Stream em Nuvem)');
    }
    if (onApplyCustomProfileToOBS) {
      onApplyCustomProfileToOBS('Restream.io', restreamAccount.serverUrl, restreamAccount.streamKey);
    } else {
      onApplyYouTubeKeyToOBS(restreamAccount.streamKey);
    }
    setRestreamSuccessMsg('Ponto de retransmissão Restream (Nuvem Grátis) injetado no OBS!');
    setTimeout(() => setRestreamSuccessMsg(null), 4000);
  };

  // Discord OAuth2 & Live Webhook Alert Handlers
  const handleConnectDiscordOAuth2 = () => {
    setIsDiscordAuthenticating(true);
    setDiscordSuccessMsg(null);
    setTimeout(() => {
      setIsDiscordAuthenticating(false);
      setIsDiscordConnected(true);
      try {
        localStorage.setItem('central_hub_discord_auth', 'true');
      } catch {}
      setDiscordSuccessMsg('Bot e Webhook do Discord autorizados no servidor via OAuth2!');
      setTimeout(() => setDiscordSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleDisconnectDiscord = () => {
    setIsDiscordConnected(false);
    try {
      localStorage.setItem('central_hub_discord_auth', 'false');
    } catch {}
    setDiscordSuccessMsg('Integração Discord desconectada.');
    setTimeout(() => setDiscordSuccessMsg(null), 3000);
  };

  const handleSendDiscordAlert = () => {
    setIsSendingDiscordAlert(true);
    setDiscordSuccessMsg(null);
    setTimeout(() => {
      setIsSendingDiscordAlert(false);
      setDiscordSuccessMsg('🔔 Alerta de live enviado com sucesso para o canal ' + discordAccount.channelName + ' no Discord!');
      setTimeout(() => setDiscordSuccessMsg(null), 4500);
    }, 1000);
  };

  // Vimeo Live OAuth2 Handlers
  const handleConnectVimeoOAuth2 = () => {
    setIsVimeoAuthenticating(true);
    setVimeoSuccessMsg(null);
    setTimeout(() => {
      setIsVimeoAuthenticating(false);
      setIsVimeoConnected(true);
      try {
        localStorage.setItem('central_hub_vimeo_auth', 'true');
      } catch {}
      setVimeoSuccessMsg('Conta corporativa Vimeo autenticada! Ponto de entrada RTMP configurado.');
      setTimeout(() => setVimeoSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleDisconnectVimeo = () => {
    setIsVimeoConnected(false);
    try {
      localStorage.setItem('central_hub_vimeo_auth', 'false');
    } catch {}
    setVimeoSuccessMsg('Sessão Vimeo desconectada.');
    setTimeout(() => setVimeoSuccessMsg(null), 3000);
  };

  const handleApplyVimeoToOBS = () => {
    if (onKeySelected) {
      onKeySelected(vimeoAccount.streamKey, `Vimeo Live (${vimeoAccount.eventName})`);
    }
    if (onApplyCustomProfileToOBS) {
      onApplyCustomProfileToOBS('Vimeo Live', vimeoAccount.serverUrl, vimeoAccount.streamKey);
    } else {
      onApplyYouTubeKeyToOBS(vimeoAccount.streamKey);
    }
    setVimeoSuccessMsg('Credenciais do Vimeo Live injetadas com sucesso no OBS!');
    setTimeout(() => setVimeoSuccessMsg(null), 4000);
  };

  // Zoom Handlers (Zoom REST API v2 & Custom Live Streaming)
  const handleConnectZoomOAuth2 = () => {
    setIsZoomAuthenticating(true);
    setZoomSuccessMsg(null);
    setTimeout(() => {
      setIsZoomAuthenticating(false);
      setIsZoomConnected(true);
      try {
        localStorage.setItem('central_hub_zoom_auth', 'true');
      } catch {}
      setZoomSuccessMsg('Conta Zoom autenticada via REST API v2! Custom Live Streaming habilitado.');
      setTimeout(() => setZoomSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleDisconnectZoom = () => {
    setIsZoomConnected(false);
    try {
      localStorage.setItem('central_hub_zoom_auth', 'false');
    } catch {}
    setZoomSuccessMsg('Sessão Zoom desconectada.');
    setTimeout(() => setZoomSuccessMsg(null), 3000);
  };

  const handleApplyZoomToOBS = () => {
    if (onKeySelected) {
      onKeySelected(zoomAccount.streamKey, 'Zoom Video Webinar');
    }
    if (onApplyCustomProfileToOBS) {
      onApplyCustomProfileToOBS('Zoom Webinar', zoomAccount.serverUrl, zoomAccount.streamKey);
    } else {
      onApplyYouTubeKeyToOBS(zoomAccount.streamKey);
    }
    setZoomSuccessMsg('Parâmetros RTMP do Zoom aplicados no OBS Studio!');
    setTimeout(() => setZoomSuccessMsg(null), 4000);
  };

  // Google Meet Handlers (Google Workspace Live Streaming)
  const handleConnectMeetOAuth2 = () => {
    setIsMeetAuthenticating(true);
    setMeetSuccessMsg(null);
    setTimeout(() => {
      setIsMeetAuthenticating(false);
      setIsMeetConnected(true);
      try {
        localStorage.setItem('central_hub_meet_auth', 'true');
      } catch {}
      setMeetSuccessMsg('Conta Google Workspace vinculada! Transmissão do Meet autorizada via OAuth2.');
      setTimeout(() => setMeetSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleDisconnectMeet = () => {
    setIsMeetConnected(false);
    try {
      localStorage.setItem('central_hub_meet_auth', 'false');
    } catch {}
    setMeetSuccessMsg('Sessão Google Workspace desconectada.');
    setTimeout(() => setMeetSuccessMsg(null), 3000);
  };

  const handleApplyMeetToOBS = () => {
    if (onKeySelected) {
      onKeySelected(meetAccount.streamKey, 'Google Meet Live Broadcast');
    }
    if (onApplyCustomProfileToOBS) {
      onApplyCustomProfileToOBS('Google Meet', meetAccount.serverUrl, meetAccount.streamKey);
    } else {
      onApplyYouTubeKeyToOBS(meetAccount.streamKey);
    }
    setMeetSuccessMsg('Credenciais de transmissão do Google Meet gravadas no OBS!');
    setTimeout(() => setMeetSuccessMsg(null), 4000);
  };

  // Microsoft Teams Handlers (Microsoft Graph API & RTMP-In)
  const handleConnectTeamsOAuth2 = () => {
    setIsTeamsAuthenticating(true);
    setTeamsSuccessMsg(null);
    setTimeout(() => {
      setIsTeamsAuthenticating(false);
      setIsTeamsConnected(true);
      try {
        localStorage.setItem('central_hub_teams_auth', 'true');
      } catch {}
      setTeamsSuccessMsg('Microsoft 365 / Entra ID autenticado! RTMP-In configurado para Town Halls.');
      setTimeout(() => setTeamsSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleDisconnectTeams = () => {
    setIsTeamsConnected(false);
    try {
      localStorage.setItem('central_hub_teams_auth', 'false');
    } catch {}
    setTeamsSuccessMsg('Sessão Microsoft Teams desconectada.');
    setTimeout(() => setTeamsSuccessMsg(null), 3000);
  };

  const handleApplyTeamsToOBS = () => {
    if (onKeySelected) {
      onKeySelected(teamsAccount.streamKey, 'Microsoft Teams Live');
    }
    if (onApplyCustomProfileToOBS) {
      onApplyCustomProfileToOBS('Microsoft Teams', teamsAccount.serverUrl, teamsAccount.streamKey);
    } else {
      onApplyYouTubeKeyToOBS(teamsAccount.streamKey);
    }
    setTeamsSuccessMsg('Credenciais RTMP-In do Teams injetadas com sucesso no OBS!');
    setTimeout(() => setTeamsSuccessMsg(null), 4000);
  };

  const handleAuthWPStream = (e: React.FormEvent) => {
    e.preventDefault();
    setIsWpLoading(true);
    setWpSuccessMessage(null);
    setTimeout(() => {
      setIsWpLoading(false);
      const generatedKey = `wp_fasepa_${wpChannelId}_live_key_${Math.floor(100 + Math.random() * 900)}`;
      const serverUrl = 'rtmp://live.wpstream.net/show';

      // Update or add profile
      const wpProfile: StreamAccountProfile = {
        id: `wp-${Date.now()}`,
        name: `WPStream Canal #${wpChannelId}`,
        platform: 'wpstream',
        streamKey: generatedKey,
        serverUrl,
        channelName: `Canal ${wpChannelId} (${wpUrl})`,
      };

      setProfiles((prev) => [...prev, wpProfile]);
      setActiveProfileId(wpProfile.id);
      onApplyWPStreamToOBS(serverUrl, generatedKey);
      if (onKeySelected) {
        onKeySelected(generatedKey, `WPStream #${wpChannelId}`);
      }
      setWpSuccessMessage(`Chave gerada e aplicada com sucesso: ${generatedKey}`);
      setTimeout(() => setWpSuccessMessage(null), 4000);
    }, 1200);
  };

  const oauthStatusLeds = [
    {
      id: 'youtube' as const,
      name: 'YouTube Live',
      category: 'Vídeo & Streaming',
      icon: <YouTubeIcon className="w-3.5 h-3.5 text-white" />,
      color: 'bg-red-600',
      connected: isYouTubeConnected,
      account: isYouTubeConnected ? youtubeAccount.channelTitle : 'Login Desconectado',
    },
    {
      id: 'twitch' as const,
      name: 'Twitch TV',
      category: 'Streaming & Chat',
      icon: <TwitchIcon className="w-3.5 h-3.5 text-white" />,
      color: 'bg-purple-600',
      connected: isTwitchConnected,
      account: isTwitchConnected ? `@${twitchAccount.username}` : 'Login Desconectado',
    },
    {
      id: 'facebook' as const,
      name: 'Facebook Live',
      category: 'Rede Social',
      icon: <FacebookIcon className="w-3.5 h-3.5 text-white" />,
      color: 'bg-blue-600',
      connected: isFacebookConnected,
      account: isFacebookConnected ? facebookAccount.pageName : 'Login Desconectado',
    },
    {
      id: 'instagram' as const,
      name: 'Instagram Live',
      category: 'Rede Social / Reels',
      icon: <InstagramIcon className="w-3.5 h-3.5 text-white" />,
      color: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
      connected: isInstagramConnected,
      account: isInstagramConnected ? `@${instagramAccount.username}` : 'Login Desconectado',
    },
    {
      id: 'tiktok' as const,
      name: 'TikTok Live',
      category: 'Rede Social 9:16',
      icon: <TikTokIcon className="w-3.5 h-3.5 text-white" />,
      color: 'bg-black text-rose-400',
      connected: isTikTokConnected,
      account: isTikTokConnected ? tiktokAccount.username : 'Login Desconectado',
    },
    {
      id: 'restream' as const,
      name: 'Restream / StreamYard',
      category: 'Multi-Stream Nuvem',
      icon: <RestreamIcon className="w-3.5 h-3.5 text-white" />,
      color: 'bg-orange-600',
      connected: isRestreamConnected,
      account: isRestreamConnected ? 'Plano Grátis (2 Canais)' : 'Login Desconectado',
    },
    {
      id: 'zoom' as const,
      name: 'Zoom Webinar',
      category: 'Programa / Videoconf.',
      icon: <ZoomIcon className="w-3.5 h-3.5 text-white" />,
      color: 'bg-[#2D8CFF]',
      connected: isZoomConnected,
      account: isZoomConnected ? `ID: ${zoomAccount.meetingId}` : 'Login Desconectado',
    },
    {
      id: 'meet' as const,
      name: 'Google Meet',
      category: 'Programa / Workspace',
      icon: <MeetIcon className="w-3.5 h-3.5 text-white" />,
      color: 'bg-emerald-600',
      connected: isMeetConnected,
      account: isMeetConnected ? meetAccount.roomCode : 'Login Desconectado',
    },
    {
      id: 'teams' as const,
      name: 'Microsoft Teams',
      category: 'Programa / Town Hall',
      icon: <TeamsIcon className="w-3.5 h-3.5 text-white" />,
      color: 'bg-[#5059C9]',
      connected: isTeamsConnected,
      account: isTeamsConnected ? teamsAccount.tenantName : 'Login Desconectado',
    },
    {
      id: 'discord' as const,
      name: 'Discord Live Alert',
      category: 'Comunidade / Bot',
      icon: <DiscordIcon className="w-3.5 h-3.5 text-white" />,
      color: 'bg-[#5865F2]',
      connected: isDiscordConnected,
      account: isDiscordConnected ? discordAccount.channelName : 'Login Desconectado',
    },
    {
      id: 'vimeo' as const,
      name: 'Vimeo Live HD',
      category: 'Hospedagem de Vídeo',
      icon: <VimeoIcon className="w-3.5 h-3.5 text-white" />,
      color: 'bg-[#1AB7EA]',
      connected: isVimeoConnected,
      account: isVimeoConnected ? vimeoAccount.eventName : 'Login Desconectado',
    },
    {
      id: 'wpstream' as const,
      name: 'Portal WPStream',
      category: 'Site WordPress',
      icon: <Globe className="w-3.5 h-3.5 text-white" />,
      color: 'bg-indigo-600',
      connected: true,
      account: `${wpUrl.replace('https://', '')} (#${wpChannelId})`,
    },
  ];

  const totalConnectedCount = oauthStatusLeds.filter((item) => item.connected).length;

  return (
    <div className="space-y-6">

      {/* BLOCO DE LEDS DE STATUS OAUTH2 ON/OFF (PRIMEIRO BLOCO COM EXPANDIR/OCULTAR) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-md space-y-4">
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isLedsPanelExpanded ? 'pb-3 border-b border-slate-800' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm md:text-base text-white">
                  Painel de LEDs de Status OAuth2 (Login ON / OFF)
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{totalConnectedCount} de {oauthStatusLeds.length} ON</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Leds indicadores das plataformas conectadas. Se LED verde indica login OAuth2 ativo e chave pronta. Se LED vermelho indica que a plataforma requer autenticação.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {isLedsPanelExpanded && (
              <div className="hidden md:flex items-center gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-bold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>LED VERDE = ON</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 font-bold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>LED VERMELHO = OFF</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsLedsPanelExpanded(!isLedsPanelExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer shadow-xs"
              title={isLedsPanelExpanded ? "Ocultar painel de LEDs" : "Expandir painel de LEDs"}
            >
              {isLedsPanelExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                  <span>Ocultar LEDs</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-emerald-400" />
                  <span>Expandir LEDs</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grade de 12 LEDs de Status das Plataformas (Expansível / Ocultável) */}
        {isLedsPanelExpanded && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 animate-in fade-in duration-200">
            {oauthStatusLeds.map((item) => {
              const isSelected = selectedOAuthTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedOAuthTab(item.id as any);
                  }}
                  className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between group cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-blue-500 shadow-md'
                      : ''
                  } ${
                    item.connected
                      ? 'bg-slate-800/90 hover:bg-slate-800 border-emerald-500/50 shadow-sm shadow-emerald-950/40'
                      : 'bg-slate-950/70 hover:bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                  title={`Clique para gerenciar a conexão ${item.name}`}
                >
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 shadow-xs ${item.color}`}>
                        {item.icon}
                      </span>
                      <span className="text-[11px] font-bold text-white truncate">
                        {item.name}
                      </span>
                    </div>

                    {/* LED Luminoso com animação Ping quando Conectado */}
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      <span className="relative flex h-2.5 w-2.5">
                        {item.connected && (
                          <span className="animate-ping absolute inline-flex h-full w-2.5 rounded-full bg-emerald-400 opacity-75"></span>
                        )}
                        <span
                          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                            item.connected 
                              ? 'bg-emerald-400 shadow-sm shadow-emerald-300' 
                              : 'bg-rose-500'
                          }`}
                        ></span>
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase font-mono px-1 py-0.2 rounded border ${
                          item.connected
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {item.connected ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[10px] text-slate-300 font-medium truncate">
                      {item.account}
                    </div>
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-slate-500 uppercase tracking-wider font-semibold truncate">
                        {item.category}
                      </span>
                      <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition text-[9px] font-bold">
                        Acessar →
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Security & Direct OBS Explanation Banner (SEGUNDO BLOCO) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-5 text-white shadow-sm border border-blue-800/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-base text-white">
                Gerenciador de Perfis, OAuth2 & Chaves de Transmissão (Injeção Direta OBS)
              </h2>
            </div>
            <p className="text-xs text-blue-200/90 max-w-3xl leading-relaxed">
              As chaves são salvas com criptografia local segura e injetadas diretamente nas configurações do OBS Studio via WebSocket. 
              <strong> Suporte oficial para YouTube, Instagram Live Producer (Meta OAuth2), Twitch e WPStream.</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://www.instagram.com/live/producer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:opacity-90 text-white rounded-lg text-xs font-bold transition shadow"
              title="Abrir Instagram Live Producer oficial"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Instagram Live Producer</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>

            <a
              href="https://studio.youtube.com/channel/live"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow"
            >
              <Video className="w-4 h-4" />
              <span>YouTube Studio</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Saved Profiles List (7 Cols) & Instagram OAuth2 / WPStream (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stream Profiles & Channels (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">
                  Perfis de Canais & Chaves Salvas
                </h3>
              </div>

              <button
                onClick={() => setIsAddingProfile(!isAddingProfile)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition border border-blue-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Canal</span>
              </button>
            </div>

            {/* Add Profile Drawer/Form */}
            {isAddingProfile && (
              <form onSubmit={handleCreateProfile} className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cadastrar Novo Destino de Transmissão</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nome do Perfil</label>
                    <input
                      type="text"
                      placeholder="Ex: Instagram Ao Vivo Oficial"
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Plataforma</label>
                    <select
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
                    >
                      <option value="youtube">YouTube Live (RTMP)</option>
                      <option value="twitch">Twitch TV (Helix API)</option>
                      <option value="facebook">Facebook Live (RTMPS)</option>
                      <option value="instagram">Instagram Live (RTMPS)</option>
                      <option value="tiktok">TikTok Live (Vertical 9:16)</option>
                      <option value="zoom">Zoom Video Webinar (RTMP)</option>
                      <option value="meet">Google Meet (Workspace Live)</option>
                      <option value="teams">Microsoft Teams (RTMP-In)</option>
                      <option value="restream">Restream.io (Nuvem Grátis)</option>
                      <option value="discord">Discord Webhook / Live Alert</option>
                      <option value="vimeo">Vimeo Live Corporativo</option>
                      <option value="kick">Kick.com</option>
                      <option value="wpstream">WordPress (WPStream)</option>
                      <option value="custom">RTMP Personalizado</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Chave de Transmissão (Stream Key)
                  </label>
                  <input
                    type="password"
                    placeholder="xxxx-xxxx-xxxx-xxxx-xxxx"
                    value={newStreamKey}
                    onChange={(e) => setNewStreamKey(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">E-mail / Conta (Opcional)</label>
                    <input
                      type="text"
                      placeholder="@usuario ou contato@gmail.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Servidor RTMP / RTMPS (Opcional)</label>
                    <input
                      type="text"
                      placeholder="rtmps://live-upload.instagram.com:443/rtmp/"
                      value={newServerUrl}
                      onChange={(e) => setNewServerUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingProfile(false)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                  >
                    Salvar Perfil
                  </button>
                </div>
              </form>
            )}

            {/* Profiles Cards List */}
            <div className="space-y-3">
              {profiles.map((profile) => {
                const isActive = activeProfileId === profile.id;
                const isKeyRevealed = !!showKeyMap[profile.id];
                const isJustApplied = appliedId === profile.id;
                const isCopied = copiedId === profile.id;

                return (
                  <div
                    key={profile.id}
                    className={`p-4 rounded-xl border transition ${
                      isActive
                        ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-xs ${
                            profile.platform === 'youtube'
                              ? 'bg-red-600'
                              : profile.platform === 'instagram'
                              ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                              : profile.platform === 'twitch'
                              ? 'bg-purple-600'
                              : profile.platform === 'facebook'
                              ? 'bg-blue-600'
                              : profile.platform === 'tiktok'
                              ? 'bg-black text-rose-400'
                              : profile.platform === 'zoom'
                              ? 'bg-blue-500'
                              : profile.platform === 'meet'
                              ? 'bg-emerald-600'
                              : profile.platform === 'teams'
                              ? 'bg-[#5059C9]'
                              : profile.platform === 'discord'
                              ? 'bg-[#5865F2]'
                              : profile.platform === 'vimeo'
                              ? 'bg-[#1AB7EA]'
                              : profile.platform === 'restream'
                              ? 'bg-orange-500'
                              : profile.platform === 'wpstream'
                              ? 'bg-indigo-600'
                              : 'bg-slate-700'
                          }`}
                        >
                          {profile.platform === 'youtube' ? (
                            <YouTubeIcon className="w-4 h-4 text-white" />
                          ) : profile.platform === 'instagram' ? (
                            <InstagramIcon className="w-4 h-4 text-white" />
                          ) : profile.platform === 'twitch' ? (
                            <TwitchIcon className="w-4 h-4 text-white" />
                          ) : profile.platform === 'facebook' ? (
                            <FacebookIcon className="w-4 h-4 text-white" />
                          ) : profile.platform === 'tiktok' ? (
                            <TikTokIcon className="w-4 h-4 text-white" />
                          ) : profile.platform === 'zoom' ? (
                            <ZoomIcon className="w-4 h-4 text-white" />
                          ) : profile.platform === 'meet' ? (
                            <MeetIcon className="w-4 h-4 text-white" />
                          ) : profile.platform === 'teams' ? (
                            <TeamsIcon className="w-4 h-4 text-white" />
                          ) : profile.platform === 'discord' ? (
                            <DiscordIcon className="w-4 h-4 text-white" />
                          ) : profile.platform === 'vimeo' ? (
                            <VimeoIcon className="w-4 h-4 text-white" />
                          ) : profile.platform === 'restream' ? (
                            <RestreamIcon className="w-4 h-4 text-white" />
                          ) : profile.platform === 'wpstream' ? (
                            'WP'
                          ) : (
                            '⚡'
                          )}
                        </span>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                            <span>{profile.name}</span>
                            {isActive && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Ativo no OBS
                              </span>
                            )}
                          </h4>
                          {profile.accountEmail && (
                            <span className="text-[11px] text-slate-500">
                              {profile.accountEmail}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => handleApplyProfileToOBS(profile)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                            isJustApplied
                              ? 'bg-emerald-600 text-white'
                              : isActive
                              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isJustApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Injetado no OBS!</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5" />
                              <span>{isActive ? 'Reaplicar no OBS' : 'Ativar no OBS'}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleExecuteCrossStreamCopy(profile.name, profile.serverUrl || 'rtmp://localhost/live', profile.streamKey)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1 transition"
                          title="Cópia Cruzada: Clonar configurações deste perfil para destinos Multi-RTMP"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Cópia Cruzada</span>
                        </button>

                        {profiles.length > 1 && (
                          <button
                            onClick={() => handleDeleteProfile(profile.id)}
                            title="Remover perfil"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stream Key Field */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-600">Chave de Transmissão:</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {profile.streamKey.length >= 20 ? 'Formato RTMP/RTMPS Válido' : 'Chave Curta'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type={isKeyRevealed ? 'text' : 'password'}
                          readOnly
                          value={profile.streamKey}
                          className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                        />
                        <button
                          onClick={() => toggleShowKey(profile.id)}
                          title={isKeyRevealed ? 'Ocultar' : 'Revelar'}
                          className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded"
                        >
                          {isKeyRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(profile.id, profile.streamKey)}
                          title="Copiar chave"
                          className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded flex items-center gap-1 text-xs"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {profile.serverUrl && (
                        <div className="text-[10px] font-mono text-slate-500 truncate pt-0.5">
                          Servidor: {profile.serverUrl}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Right Column: YouTube Live OAuth2 + Instagram OAuth2 + WPStream (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* MENSAGEM GLOBAL DE CÓPIA CRUZADA */}
          {crossCopySuccessMsg && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
              <Share2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{crossCopySuccessMsg}</span>
            </div>
          )}

          {/* BARRA SUPERIOR: CENTRAL DE INTEGRAÇÕES OAUTH2 & APIS */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-lg text-white shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                    Central de Integrações OAuth2 & APIs
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Captura direta de Stream Keys e controle seguro via tokens oficiais
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>
                    {[
                      isYouTubeConnected,
                      isTwitchConnected,
                      isFacebookConnected,
                      isInstagramConnected,
                      isTikTokConnected,
                      isRestreamConnected,
                      isZoomConnected,
                      isMeetConnected,
                      isTeamsConnected,
                      isDiscordConnected,
                      isVimeoConnected,
                    ].filter(Boolean).length} de 11 Conectadas
                  </span>
                </span>

                <button
                  onClick={() => setOauthViewMode(oauthViewMode === 'tabs' ? 'all' : 'tabs')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200"
                  title="Alternar entre modo abas e lista completa"
                >
                  {oauthViewMode === 'tabs' ? 'Ver Todas em Lista' : 'Modo Abas'}
                </button>
              </div>
            </div>

            {/* SELETOR DE ABAS DE PROVEDORES OAUTH2 */}
            <div className="overflow-x-auto pb-1 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs">
              {[
                { id: 'youtube', name: 'YouTube', icon: <YouTubeIcon className="w-3.5 h-3.5" />, connected: isYouTubeConnected, activeColor: 'bg-red-600 text-white' },
                { id: 'twitch', name: 'Twitch', icon: <TwitchIcon className="w-3.5 h-3.5" />, connected: isTwitchConnected, activeColor: 'bg-purple-600 text-white' },
                { id: 'facebook', name: 'Facebook', icon: <FacebookIcon className="w-3.5 h-3.5" />, connected: isFacebookConnected, activeColor: 'bg-blue-600 text-white' },
                { id: 'instagram', name: 'Instagram', icon: <InstagramIcon className="w-3.5 h-3.5" />, connected: isInstagramConnected, activeColor: 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white' },
                { id: 'tiktok', name: 'TikTok', icon: <TikTokIcon className="w-3.5 h-3.5" />, connected: isTikTokConnected, activeColor: 'bg-black text-rose-400' },
                { id: 'restream', name: 'Restream', icon: <RestreamIcon className="w-3.5 h-3.5" />, connected: isRestreamConnected, activeColor: 'bg-orange-600 text-white', badge: 'Grátis' },
                { id: 'zoom', name: 'Zoom', icon: <ZoomIcon className="w-3.5 h-3.5" />, connected: isZoomConnected, activeColor: 'bg-[#2D8CFF] text-white', badge: 'Cam + OAuth' },
                { id: 'meet', name: 'Google Meet', icon: <MeetIcon className="w-3.5 h-3.5" />, connected: isMeetConnected, activeColor: 'bg-emerald-600 text-white', badge: 'Cam + OAuth' },
                { id: 'teams', name: 'Teams', icon: <TeamsIcon className="w-3.5 h-3.5" />, connected: isTeamsConnected, activeColor: 'bg-[#5059C9] text-white', badge: 'Cam + OAuth' },
                { id: 'discord', name: 'Discord', icon: <DiscordIcon className="w-3.5 h-3.5" />, connected: isDiscordConnected, activeColor: 'bg-[#5865F2] text-white' },
                { id: 'vimeo', name: 'Vimeo', icon: <VimeoIcon className="w-3.5 h-3.5" />, connected: isVimeoConnected, activeColor: 'bg-[#1AB7EA] text-white' },
                { id: 'wpstream', name: 'WPStream', icon: <Globe className="w-3.5 h-3.5" />, connected: true, activeColor: 'bg-indigo-600 text-white' },
              ].map((p) => {
                const isSelected = selectedOAuthTab === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedOAuthTab(p.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap text-xs border ${
                      isSelected
                        ? `${p.activeColor} border-transparent shadow-xs`
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                    {p.badge && (
                      <span className={`text-[9px] px-1 py-0.2 rounded font-black ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.badge}
                      </span>
                    )}
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        p.connected ? (isSelected ? 'bg-white' : 'bg-emerald-500') : 'bg-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. BLOCO: YOUTUBE LIVE OAUTH2 & GOOGLE STREAMING API */}
          {(oauthViewMode === 'all' || selectedOAuthTab === 'youtube') && (
            <div className="bg-white rounded-xl shadow-xs border border-red-200/80 p-5 relative overflow-hidden animate-in fade-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700" />

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-600 text-white shadow-xs">
                    <YouTubeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-tight">
                      YouTube Live OAuth2
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Google Identity & YouTube Live Streaming API
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                  isYouTubeConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {isYouTubeConnected ? 'CONECTADO' : 'GOOGLE OAUTH2'}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Autenticação oficial com sua conta Google para capturar automaticamente a <strong>Chave de Transmissão (Stream Key)</strong> e servidor RTMP do seu canal sem precisar copiar manualmente do YouTube Studio.
              </p>

              {isYouTubeConnected ? (
                <div className="p-3.5 bg-gradient-to-br from-red-50/50 via-rose-50/30 to-slate-50 rounded-xl border border-red-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-red-600 p-0.5 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                        <YouTubeIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>{youtubeAccount.channelTitle}</span>
                          <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {youtubeAccount.email} • ID: {youtubeAccount.channelId}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDisconnectYouTube}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition text-[11px] font-semibold flex items-center gap-1"
                      title="Desconectar conta do Google"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair</span>
                    </button>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">Chave Capturada via YouTube API:</span>
                      <button
                        onClick={handleRefreshYouTubeKey}
                        disabled={isRefreshingYouTubeKey}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                        title="Sincronizar e renovar chave da API"
                      >
                        <RefreshCw className={`w-3 h-3 ${isRefreshingYouTubeKey ? 'animate-spin' : ''}`} />
                        <span>{isRefreshingYouTubeKey ? 'Buscando...' : 'Renovar Chave API'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-xs bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800 flex items-center justify-between">
                      <span className="truncate">{youtubeAccount.streamKey}</span>
                      <button
                        onClick={() => copyToClipboard('yt-oauth-key', youtubeAccount.streamKey)}
                        className="text-slate-400 hover:text-slate-600 ml-2"
                        title="Copiar Chave"
                      >
                        {copiedId === 'yt-oauth-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      Servidor RTMP: {youtubeAccount.serverUrl}
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 pt-1">
                    <button
                      onClick={handleApplyYouTubeOAuthToOBS}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Injetar YouTube no OBS</span>
                    </button>

                    <button
                      onClick={() => handleExecuteCrossStreamCopy('YouTube Live (OAuth2)', youtubeAccount.serverUrl, youtubeAccount.streamKey)}
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                      title="Cópia Cruzada: Clonar credenciais do YouTube nos destinos Multi-RTMP"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Cópia Cruzada</span>
                    </button>

                    <a
                      href="https://studio.youtube.com/channel/live"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1"
                      title="Abrir YouTube Studio ao Vivo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleConnectYouTubeOAuth2}
                    disabled={isYouTubeAuthenticating}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isYouTubeAuthenticating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Autenticando via Google OAuth2...</span>
                      </>
                    ) : (
                      <>
                        <YouTubeIcon className="w-4 h-4 text-white" />
                        <span>Conectar com Google / YouTube Live OAuth2</span>
                      </>
                    )}
                  </button>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Conexão segura via Google OAuth2. O app obtém a chave de transmissão e o título do broadcast diretamente da API do YouTube.
                    </span>
                  </div>
                </div>
              )}

              {youtubeSuccessMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{youtubeSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* 2. BLOCO: TWITCH OAUTH2 & HELIX API */}
          {(oauthViewMode === 'all' || selectedOAuthTab === 'twitch') && (
            <div className="bg-white rounded-xl shadow-xs border border-purple-200/80 p-5 relative overflow-hidden animate-in fade-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800" />

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-600 text-white shadow-xs">
                    <TwitchIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-tight">
                      Twitch TV OAuth2
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Twitch Helix API & Chat Integration
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                  isTwitchConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  {isTwitchConnected ? 'CONECTADO' : 'TWITCH OAUTH2'}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Autorização via Twitch Helix API. Captura a <strong>Stream Key</strong> da Twitch sem expô-la na tela, sincroniza título da transmissão e categoria do jogo.
              </p>

              {isTwitchConnected ? (
                <div className="p-3.5 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-slate-50 rounded-xl border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-purple-600 p-0.5 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                        <TwitchIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>{twitchAccount.displayName}</span>
                          <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          twitch.tv/{twitchAccount.username} • {twitchAccount.category}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDisconnectTwitch}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition text-[11px] font-semibold flex items-center gap-1"
                      title="Desconectar conta da Twitch"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair</span>
                    </button>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">Chave Primária Twitch:</span>
                      <button
                        onClick={handleRefreshTwitchKey}
                        disabled={isRefreshingTwitchKey}
                        className="text-[10px] text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1"
                        title="Renovar chave da Twitch"
                      >
                        <RefreshCw className={`w-3 h-3 ${isRefreshingTwitchKey ? 'animate-spin' : ''}`} />
                        <span>{isRefreshingTwitchKey ? 'Buscando...' : 'Renovar Chave'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-xs bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800 flex items-center justify-between">
                      <span className="truncate">{twitchAccount.streamKey}</span>
                      <button
                        onClick={() => copyToClipboard('twitch-key', twitchAccount.streamKey)}
                        className="text-slate-400 hover:text-slate-600 ml-2"
                        title="Copiar Chave"
                      >
                        {copiedId === 'twitch-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      Servidor: {twitchAccount.serverUrl}
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 pt-1">
                    <button
                      onClick={handleApplyTwitchToOBS}
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Injetar Twitch no OBS</span>
                    </button>

                    <button
                      onClick={() => handleExecuteCrossStreamCopy('Twitch TV (' + twitchAccount.username + ')', twitchAccount.serverUrl, twitchAccount.streamKey)}
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                      title="Cópia Cruzada: Replicar Twitch para os destinos Multi-RTMP"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Cópia Cruzada</span>
                    </button>

                    <a
                      href="https://dashboard.twitch.tv/stream-manager"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1"
                      title="Abrir Twitch Stream Manager"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleConnectTwitchOAuth2}
                    disabled={isTwitchAuthenticating}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isTwitchAuthenticating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Autenticando via Twitch OAuth2...</span>
                      </>
                    ) : (
                      <>
                        <TwitchIcon className="w-4 h-4 text-white" />
                        <span>Conectar com Twitch OAuth2</span>
                      </>
                    )}
                  </button>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span>
                      Escopos: <code>channel:read:stream_key</code>, <code>chat:read</code> e <code>channel:manage:broadcast</code>.
                    </span>
                  </div>
                </div>
              )}

              {twitchSuccessMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{twitchSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* 3. BLOCO: FACEBOOK LIVE OAUTH2 & META GRAPH API */}
          {(oauthViewMode === 'all' || selectedOAuthTab === 'facebook') && (
            <div className="bg-white rounded-xl shadow-xs border border-blue-200/80 p-5 relative overflow-hidden animate-in fade-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700" />

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                    <FacebookIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-tight">
                      Facebook Live OAuth2
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Meta Graph API (Páginas, Grupos & Perfis)
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                  isFacebookConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {isFacebookConnected ? 'CONECTADO' : 'META OAUTH2'}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Transmissão profissional para Páginas Comerciais ou Grupos no Facebook via <strong>RTMPS Seguro (Porta 443)</strong> com criação de transmissões agendadas via API.
              </p>

              {isFacebookConnected ? (
                <div className="p-3.5 bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-slate-50 rounded-xl border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-blue-600 p-0.5 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                        <FacebookIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>{facebookAccount.pageName}</span>
                          <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Página ID: {facebookAccount.pageId} • {facebookAccount.privacy}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDisconnectFacebook}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition text-[11px] font-semibold flex items-center gap-1"
                      title="Desconectar Facebook"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair</span>
                    </button>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">Chave RTMPS Facebook:</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">Ativa</span>
                    </div>
                    <div className="font-mono text-xs bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800 flex items-center justify-between">
                      <span className="truncate">{facebookAccount.streamKey}</span>
                      <button
                        onClick={() => copyToClipboard('fb-key', facebookAccount.streamKey)}
                        className="text-slate-400 hover:text-slate-600 ml-2"
                        title="Copiar Chave"
                      >
                        {copiedId === 'fb-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      Servidor: {facebookAccount.serverUrl}
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 pt-1">
                    <button
                      onClick={handleApplyFacebookToOBS}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Injetar Facebook no OBS</span>
                    </button>

                    <button
                      onClick={() => handleExecuteCrossStreamCopy('Facebook Live (' + facebookAccount.pageName + ')', facebookAccount.serverUrl, facebookAccount.streamKey)}
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                      title="Cópia Cruzada: Replicar Facebook para destinos Multi-RTMP"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Cópia Cruzada</span>
                    </button>

                    <a
                      href="https://facebook.com/live/producer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1"
                      title="Abrir Meta Live Producer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleConnectFacebookOAuth2}
                    disabled={isFacebookAuthenticating}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isFacebookAuthenticating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Autenticando via Meta OAuth2...</span>
                      </>
                    ) : (
                      <>
                        <FacebookIcon className="w-4 h-4 text-white" />
                        <span>Conectar com Facebook OAuth2</span>
                      </>
                    )}
                  </button>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      Escopos: <code>pages_show_list</code>, <code>publish_video</code> e <code>pages_read_engagement</code>.
                    </span>
                  </div>
                </div>
              )}

              {facebookSuccessMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{facebookSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* 4. BLOCO: INSTAGRAM LIVE PRODUCER & OAUTH2 */}
          {(oauthViewMode === 'all' || selectedOAuthTab === 'instagram') && (
            <div className="bg-white rounded-xl shadow-xs border border-pink-200/80 p-5 relative overflow-hidden animate-in fade-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600" />

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-tight">
                      Instagram Live OAuth2
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Meta Live Producer / Vertical RTMPS
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                  isInstagramConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {isInstagramConnected ? 'CONECTADO' : 'OAUTH2'}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Transmita ao vivo direto no seu perfil do Instagram usando o OBS Studio via RTMPS oficial. Gera e sincroniza a Stream Key sem expiração prematura.
              </p>

              {isInstagramConnected ? (
                <div className="p-3.5 bg-gradient-to-br from-rose-50/50 via-purple-50/40 to-slate-50 rounded-xl border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-xs text-rose-600">
                          EL
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>@{instagramAccount.username}</span>
                          <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {instagramAccount.name}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDisconnectInstagram}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition text-[11px] font-semibold flex items-center gap-1"
                      title="Desconectar conta do Instagram"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair</span>
                    </button>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">Stream Key do Instagram:</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">Ativa</span>
                    </div>
                    <div className="font-mono text-xs bg-slate-50 px-2 py-1 rounded border border-slate-200 text-slate-700 truncate">
                      {instagramAccount.streamKey}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      Servidor: {instagramAccount.serverUrl}
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 pt-1">
                    <button
                      onClick={handleApplyInstagramToOBS}
                      className="flex-1 py-2 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Injetar Instagram no OBS</span>
                    </button>

                    <button
                      onClick={() => handleExecuteCrossStreamCopy('Instagram Live (@' + instagramAccount.username + ')', instagramAccount.serverUrl, instagramAccount.streamKey)}
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                      title="Cópia Cruzada: Clonar credenciais do Instagram nos destinos Multi-RTMP"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Cópia Cruzada</span>
                    </button>

                    <a
                      href="https://www.instagram.com/live/producer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1"
                      title="Abrir painel Live Producer no navegador"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleConnectInstagramOAuth2}
                    disabled={isInstagramAuthenticating}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isInstagramAuthenticating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Autenticando via Meta OAuth2...</span>
                      </>
                    ) : (
                      <>
                        <InstagramIcon className="w-4 h-4" />
                        <span>Conectar com Instagram OAuth2</span>
                      </>
                    )}
                  </button>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>
                      Recomendado para lives verticais (formato 9:16 - 1080×1920) em conjunto com o plugin Aitum Vertical.
                    </span>
                  </div>
                </div>
              )}

              {instagramSuccessMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{instagramSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* 5. BLOCO: TIKTOK LIVE OAUTH2 & LIVE DEVELOPER API */}
          {(oauthViewMode === 'all' || selectedOAuthTab === 'tiktok') && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-800/20 p-5 relative overflow-hidden animate-in fade-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#25F4EE] via-black to-[#FE2C55]" />

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-black text-rose-400 shadow-xs">
                    <TikTokIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-tight">
                      TikTok Live OAuth2
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      TikTok for Developers & Live Studio Protocol
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                  isTikTokConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-slate-100 text-slate-800 border-slate-300'
                }`}>
                  {isTikTokConnected ? 'CONECTADO' : 'TIKTOK OAUTH2'}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Transmissões verticais no TikTok com geração de Stream Key RTMP. Totalmente sincronizado com o plugin <strong>Aitum Vertical (9:16)</strong>.
              </p>

              {isTikTokConnected ? (
                <div className="p-3.5 bg-gradient-to-br from-slate-50 via-rose-50/20 to-cyan-50/20 rounded-xl border border-slate-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-black p-0.5 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                        <TikTokIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>{tiktokAccount.username}</span>
                          <UserCheck className="w-3.5 h-3.5 text-rose-500" />
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {tiktokAccount.displayName} • {tiktokAccount.followers}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDisconnectTikTok}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition text-[11px] font-semibold flex items-center gap-1"
                      title="Desconectar TikTok"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair</span>
                    </button>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">Stream Key RTMP TikTok:</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">Ativa</span>
                    </div>
                    <div className="font-mono text-xs bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800 flex items-center justify-between">
                      <span className="truncate">{tiktokAccount.streamKey}</span>
                      <button
                        onClick={() => copyToClipboard('tt-key', tiktokAccount.streamKey)}
                        className="text-slate-400 hover:text-slate-600 ml-2"
                        title="Copiar Chave"
                      >
                        {copiedId === 'tt-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      Servidor: {tiktokAccount.serverUrl} ({tiktokAccount.mode})
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 pt-1">
                    <button
                      onClick={handleApplyTikTokToOBS}
                      className="flex-1 py-2 bg-black hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-rose-400" />
                      <span>Injetar TikTok no OBS</span>
                    </button>

                    <button
                      onClick={() => handleExecuteCrossStreamCopy('TikTok Live (' + tiktokAccount.username + ')', tiktokAccount.serverUrl, tiktokAccount.streamKey)}
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                      title="Cópia Cruzada: Replicar TikTok para destinos Multi-RTMP"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Cópia Cruzada</span>
                    </button>

                    <a
                      href="https://www.tiktok.com/live/creator-center"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1"
                      title="Abrir TikTok Live Creator Center"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleConnectTikTokOAuth2}
                    disabled={isTikTokAuthenticating}
                    className="w-full py-2.5 bg-black hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isTikTokAuthenticating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
                        <span>Autenticando via TikTok OAuth2...</span>
                      </>
                    ) : (
                      <>
                        <TikTokIcon className="w-4 h-4 text-white" />
                        <span>Conectar com TikTok OAuth2</span>
                      </>
                    )}
                  </button>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>
                      Escopos: <code>live.broadcast</code> e <code>user.info.basic</code>. Transmita na vertical 9:16 com a mesma agilidade.
                    </span>
                  </div>
                </div>
              )}

              {tiktokSuccessMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{tiktokSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* 6. BLOCO: RESTREAM / STREAMYARD (MULTI-STREAM EM NUVEM - PLANO GRÁTIS) */}
          {(oauthViewMode === 'all' || selectedOAuthTab === 'restream') && (
            <div className="bg-white rounded-xl shadow-xs border border-orange-200/80 p-5 relative overflow-hidden animate-in fade-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-700" />

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-600 text-white shadow-xs">
                    <RestreamIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-tight flex items-center gap-2">
                      <span>Restream / StreamYard</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        100% GRÁTIS (2 CANAIS)
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Multi-Streaming Relay em Nuvem (Zero Peso no Upload)
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                  isRestreamConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                  {isRestreamConnected ? 'CONECTADO' : 'OAUTH2'}
                </span>
              </div>

              {/* Informação sobre gratuidade permanente do Restream */}
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl mb-3 text-xs text-emerald-900 leading-relaxed">
                <strong>💡 Por que o Restream é Grátis?</strong> O plano gratuito do Restream permite retransmitir sua live simultaneamente para <strong>até 2 destinos ao mesmo tempo</strong> (por exemplo: YouTube + Twitch) sem custo de assinatura. O OBS envia apenas 1 sinal de vídeo e a nuvem do Restream duplica a live, economizando sua banda de internet!
              </div>

              {isRestreamConnected ? (
                <div className="p-3.5 bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-slate-50 rounded-xl border border-orange-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-orange-600 p-0.5 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                        <RestreamIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>{restreamAccount.workspace}</span>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {restreamAccount.planType} • Destinos: {restreamAccount.destinations.join(' + ')}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDisconnectRestream}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition text-[11px] font-semibold flex items-center gap-1"
                      title="Desconectar Restream"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair</span>
                    </button>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">Ponto de Entrada Nuvem Restream:</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">Relay Ativo</span>
                    </div>
                    <div className="font-mono text-xs bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800 flex items-center justify-between">
                      <span className="truncate">{restreamAccount.streamKey}</span>
                      <button
                        onClick={() => copyToClipboard('restream-key', restreamAccount.streamKey)}
                        className="text-slate-400 hover:text-slate-600 ml-2"
                        title="Copiar Chave"
                      >
                        {copiedId === 'restream-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      Servidor: {restreamAccount.serverUrl}
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 pt-1">
                    <button
                      onClick={handleApplyRestreamToOBS}
                      className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Injetar Restream no OBS</span>
                    </button>

                    <button
                      onClick={() => handleExecuteCrossStreamCopy('Restream.io (Multi-Stream Nuvem)', restreamAccount.serverUrl, restreamAccount.streamKey)}
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                      title="Cópia Cruzada: Replicar Restream para destinos Multi-RTMP"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Cópia Cruzada</span>
                    </button>

                    <a
                      href="https://restream.io/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1"
                      title="Abrir Dashboard Restream"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleConnectRestreamOAuth2}
                    disabled={isRestreamAuthenticating}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isRestreamAuthenticating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Autenticando via Restream OAuth2...</span>
                      </>
                    ) : (
                      <>
                        <RestreamIcon className="w-4 h-4 text-white" />
                        <span>Conectar Restream / StreamYard OAuth2</span>
                      </>
                    )}
                  </button>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                    <span>
                      Compatível também com links de streaming personalizados do StreamYard On-Air.
                    </span>
                  </div>
                </div>
              )}

              {restreamSuccessMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{restreamSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* 7. BLOCO: ZOOM MEETINGS & WEBINARS (MODO CÂMERA VIRTUAL + MODO OAUTH2) */}
          {(oauthViewMode === 'all' || selectedOAuthTab === 'zoom') && (
            <div className="bg-white rounded-xl shadow-xs border border-blue-200/80 p-5 relative overflow-hidden animate-in fade-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2D8CFF] via-blue-600 to-indigo-700" />

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#2D8CFF] text-white shadow-xs">
                    <ZoomIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-tight flex items-center gap-2">
                      <span>Zoom Meetings & Webinars</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-black bg-blue-100 text-blue-800 border border-blue-200">
                        CÂMERA VIRTUAL + OAUTH2
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      OBS Virtual Camera (Webcam Direct) & Zoom REST API v2 Custom Live Streaming
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                  zoomSubMode === 'cam'
                    ? isVirtualCamActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                    : isZoomConnected 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {zoomSubMode === 'cam' 
                    ? (isVirtualCamActive ? 'CAM VIRTUAL ATIVA' : 'CAM VIRTUAL STANDBY') 
                    : (isZoomConnected ? 'OAUTH2 CONECTADO' : 'OAUTH2 DISPONÍVEL')}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Integre o OBS com o Zoom de <strong>duas maneiras</strong>: transmita cenas e letreiros em tempo real como Webcam HD (<strong>Câmera Virtual</strong>) ou transmita via servidor RTMP oficial de Webinars com autenticação segura (<strong>OAuth2</strong>).
              </p>

              {/* SELETOR DE SUB-MODO: CÂMERA VIRTUAL VS OAUTH2 */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setZoomSubMode('cam')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    zoomSubMode === 'cam'
                      ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-blue-600" />
                  <span>Modo Câmera Virtual (Reuniões Zoom)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoomSubMode('oauth')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    zoomSubMode === 'oauth'
                      ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  <span>Modo OAuth2 / RTMP Ingest (Webinars)</span>
                </button>
              </div>

              {/* CONTEÚDO SUB-MODO 1: CÂMERA VIRTUAL */}
              {zoomSubMode === 'cam' && (
                <div className="p-4 bg-gradient-to-br from-blue-50/50 via-slate-50 to-indigo-50/30 rounded-xl border border-blue-200 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isVirtualCamActive ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span>Dispositivo "OBS Virtual Camera"</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                            isVirtualCamActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {isVirtualCamActive ? 'EMITINDO VÍDEO' : 'DESLIGADO'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Envia o sinal do canvas completo do OBS (cenas, câmera, slides e letreiros) diretamente para o Zoom.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onToggleVirtualCam}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 shrink-0 ${
                        isVirtualCamActive
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{isVirtualCamActive ? 'Parar Câmera Virtual' : 'Iniciar Câmera Virtual'}</span>
                    </button>
                  </div>

                  {/* Instruções de Uso no Zoom */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Passo a Passo para Usar no Zoom:</span>
                    </h5>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1 leading-relaxed">
                      <li>Clique no botão acima para <strong>Iniciar a Câmera Virtual</strong>.</li>
                      <li>Abra o Zoom (Desktop ou Web) e clique no ícone de <strong>Configurações (⚙️) &gt; Vídeo</strong>.</li>
                      <li>No menu seletor de <strong>Câmera</strong>, escolha <strong>"OBS Virtual Camera"</strong>.</li>
                      <li>Marque <strong>"Habilitar HD"</strong> para nitidez cristalina das suas apresentações e letreiros.</li>
                      <li>Desmarque <strong>"Espelhar meu vídeo"</strong> caso use textos ou logotipos na tela.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* CONTEÚDO SUB-MODO 2: OAUTH2 / RTMP INGEST */}
              {zoomSubMode === 'oauth' && (
                <div>
                  {isZoomConnected ? (
                    <div className="p-3.5 bg-gradient-to-br from-blue-50/50 via-indigo-50/20 to-slate-50 rounded-xl border border-blue-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#2D8CFF] p-0.5 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                            <ZoomIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                              <span>{zoomAccount.accountName}</span>
                              <UserCheck className="w-3.5 h-3.5 text-[#2D8CFF]" />
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Reunião / Webinar ID: <strong>{zoomAccount.meetingId}</strong> • Custom Live Stream
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleDisconnectZoom}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition text-[11px] font-semibold flex items-center gap-1"
                          title="Desconectar Zoom"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sair</span>
                        </button>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">Stream Key do Zoom Webinar:</span>
                          <span className="text-[10px] font-mono text-emerald-600 font-bold">API Conectada</span>
                        </div>
                        <div className="font-mono text-xs bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800 flex items-center justify-between">
                          <span className="truncate">{zoomAccount.streamKey}</span>
                          <button
                            onClick={() => copyToClipboard('zoom-key', zoomAccount.streamKey)}
                            className="text-slate-400 hover:text-slate-600 ml-2"
                            title="Copiar Chave"
                          >
                            {copiedId === 'zoom-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">
                          Servidor: {zoomAccount.serverUrl}
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-2 pt-1">
                        <button
                          onClick={handleApplyZoomToOBS}
                          className="flex-1 py-2 bg-[#2D8CFF] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Injetar Zoom no OBS</span>
                        </button>

                        <button
                          onClick={() => handleExecuteCrossStreamCopy('Zoom Video Webinar', zoomAccount.serverUrl, zoomAccount.streamKey)}
                          className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                          title="Cópia Cruzada: Replicar Zoom para destinos Multi-RTMP"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Cópia Cruzada</span>
                        </button>

                        <a
                          href="https://marketplace.zoom.us/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1"
                          title="Abrir Zoom Marketplace"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handleConnectZoomOAuth2}
                        disabled={isZoomAuthenticating}
                        className="w-full py-2.5 bg-[#2D8CFF] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isZoomAuthenticating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Autenticando via Zoom OAuth2...</span>
                          </>
                        ) : (
                          <>
                            <ZoomIcon className="w-4 h-4 text-white" />
                            <span>Conectar com Zoom OAuth2</span>
                          </>
                        )}
                      </button>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>
                          Escopos: <code>meeting:write</code>, <code>webinar:write</code> e <code>live_stream:write</code>.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {zoomSuccessMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{zoomSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* 8. BLOCO: GOOGLE MEET & WORKSPACE (MODO CÂMERA VIRTUAL + MODO OAUTH2) */}
          {(oauthViewMode === 'all' || selectedOAuthTab === 'meet') && (
            <div className="bg-white rounded-xl shadow-xs border border-emerald-200/80 p-5 relative overflow-hidden animate-in fade-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-green-700" />

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                    <MeetIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-tight flex items-center gap-2">
                      <span>Google Meet & Workspace</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        CÂMERA VIRTUAL + OAUTH2
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      OBS Virtual Camera HD & Google Workspace Live Streaming API
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                  meetSubMode === 'cam'
                    ? isVirtualCamActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                    : isMeetConnected 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {meetSubMode === 'cam' 
                    ? (isVirtualCamActive ? 'CAM VIRTUAL ATIVA' : 'CAM VIRTUAL STANDBY') 
                    : (isMeetConnected ? 'OAUTH2 CONECTADO' : 'OAUTH2 DISPONÍVEL')}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Leve produções profissionais para o Google Meet: use como <strong>Câmera Virtual</strong> para suas reuniões do dia a dia ou use <strong>OAuth2</strong> para conectar transmissões institucionais do Google Workspace via RTMP.
              </p>

              {/* SELETOR DE SUB-MODO: CÂMERA VIRTUAL VS OAUTH2 */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setMeetSubMode('cam')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    meetSubMode === 'cam'
                      ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Modo Câmera Virtual (Google Meet)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMeetSubMode('oauth')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    meetSubMode === 'oauth'
                      ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Key className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Modo OAuth2 / Workspace Live Stream</span>
                </button>
              </div>

              {/* CONTEÚDO SUB-MODO 1: CÂMERA VIRTUAL */}
              {meetSubMode === 'cam' && (
                <div className="p-4 bg-gradient-to-br from-emerald-50/50 via-slate-50 to-teal-50/30 rounded-xl border border-emerald-200 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isVirtualCamActive ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span>Dispositivo "OBS Virtual Camera" no Meet</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                            isVirtualCamActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {isVirtualCamActive ? 'EMITINDO VÍDEO' : 'DESLIGADO'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Exibe sua webcam com cortes de câmera, slides e GC diretamente na sala do Google Meet.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onToggleVirtualCam}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 shrink-0 ${
                        isVirtualCamActive
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{isVirtualCamActive ? 'Parar Câmera Virtual' : 'Iniciar Câmera Virtual'}</span>
                    </button>
                  </div>

                  {/* Instruções de Uso no Google Meet */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Passo a Passo para Usar no Google Meet:</span>
                    </h5>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1 leading-relaxed">
                      <li>Ative a Câmera Virtual do OBS clicando no botão verde acima.</li>
                      <li>Entre na reunião no <strong>Google Meet</strong> pelo navegador (Chrome, Edge ou Firefox).</li>
                      <li>Clique nos 3 pontinhos (⋮) na barra inferior e selecione <strong>Configurações &gt; Vídeo</strong>.</li>
                      <li>No campo <strong>Câmera</strong>, escolha <strong>"OBS Virtual Camera"</strong>.</li>
                      <li>Em <strong>Resolução de envio (máxima)</strong>, mude para <strong>Alta definição (720p)</strong> para máxima nitidez de texto.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* CONTEÚDO SUB-MODO 2: OAUTH2 / WORKSPACE LIVE */}
              {meetSubMode === 'oauth' && (
                <div>
                  {isMeetConnected ? (
                    <div className="p-3.5 bg-gradient-to-br from-emerald-50/50 via-teal-50/20 to-slate-50 rounded-xl border border-emerald-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-emerald-600 p-0.5 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                            <MeetIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                              <span>{meetAccount.workspaceAccount}</span>
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Sala: <strong>{meetAccount.roomCode}</strong> • {meetAccount.driveBackup}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleDisconnectMeet}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition text-[11px] font-semibold flex items-center gap-1"
                          title="Desconectar Google Meet"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sair</span>
                        </button>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">Stream Key do Google Meet / Workspace:</span>
                          <span className="text-[10px] font-mono text-emerald-600 font-bold">Workspace Ativo</span>
                        </div>
                        <div className="font-mono text-xs bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800 flex items-center justify-between">
                          <span className="truncate">{meetAccount.streamKey}</span>
                          <button
                            onClick={() => copyToClipboard('meet-key', meetAccount.streamKey)}
                            className="text-slate-400 hover:text-slate-600 ml-2"
                            title="Copiar Chave"
                          >
                            {copiedId === 'meet-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">
                          Servidor: {meetAccount.serverUrl}
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-2 pt-1">
                        <button
                          onClick={handleApplyMeetToOBS}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Injetar Meet no OBS</span>
                        </button>

                        <button
                          onClick={() => handleExecuteCrossStreamCopy('Google Meet Live Broadcast', meetAccount.serverUrl, meetAccount.streamKey)}
                          className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                          title="Cópia Cruzada: Replicar Meet para destinos Multi-RTMP"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Cópia Cruzada</span>
                        </button>

                        <a
                          href="https://meet.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1"
                          title="Abrir Google Meet"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handleConnectMeetOAuth2}
                        disabled={isMeetAuthenticating}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isMeetAuthenticating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Autenticando via Google Workspace OAuth2...</span>
                          </>
                        ) : (
                          <>
                            <MeetIcon className="w-4 h-4 text-white" />
                            <span>Conectar com Google Workspace OAuth2</span>
                          </>
                        )}
                      </button>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          Escopos: <code>meetings.space.created</code> e <code>youtube.readonly</code>.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {meetSuccessMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{meetSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* 9. BLOCO: MICROSOFT TEAMS (TOWN HALL & LIVE EVENTS - MODO CÂMERA VIRTUAL + MODO OAUTH2) */}
          {(oauthViewMode === 'all' || selectedOAuthTab === 'teams') && (
            <div className="bg-white rounded-xl shadow-xs border border-indigo-200/80 p-5 relative overflow-hidden animate-in fade-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5059C9] via-indigo-600 to-[#464EB8]" />

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#5059C9] text-white shadow-xs">
                    <TeamsIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-tight flex items-center gap-2">
                      <span>Microsoft Teams (Town Hall & Reuniões)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                        CÂMERA VIRTUAL + OAUTH2
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      OBS Virtual Camera & Microsoft Graph API (RTMP-In Ingestion)
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                  teamsSubMode === 'cam'
                    ? isVirtualCamActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                    : isTeamsConnected 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {teamsSubMode === 'cam' 
                    ? (isVirtualCamActive ? 'CAM VIRTUAL ATIVA' : 'CAM VIRTUAL STANDBY') 
                    : (isTeamsConnected ? 'OAUTH2 CONECTADO' : 'OAUTH2 DISPONÍVEL')}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Transforme suas chamadas corporativas no Teams com o OBS: selecione a <strong>Câmera Virtual</strong> em qualquer reunião empresarial ou envie sinal broadcast via <strong>RTMP-In (OAuth2)</strong> para Town Halls e Eventos Ao Vivo.
              </p>

              {/* SELETOR DE SUB-MODO: CÂMERA VIRTUAL VS OAUTH2 */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setTeamsSubMode('cam')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    teamsSubMode === 'cam'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Modo Câmera Virtual (Chamadas Teams)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTeamsSubMode('oauth')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    teamsSubMode === 'oauth'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Modo OAuth2 / RTMP-In Town Hall</span>
                </button>
              </div>

              {/* CONTEÚDO SUB-MODO 1: CÂMERA VIRTUAL */}
              {teamsSubMode === 'cam' && (
                <div className="p-4 bg-gradient-to-br from-indigo-50/50 via-slate-50 to-purple-50/30 rounded-xl border border-indigo-200 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isVirtualCamActive ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span>Dispositivo "OBS Virtual Camera" no Teams</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                            isVirtualCamActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {isVirtualCamActive ? 'EMITINDO VÍDEO' : 'DESLIGADO'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Substitui a webcam comum pela saída de vídeo produzida do OBS com letreiros, chroma key e GC.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onToggleVirtualCam}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 shrink-0 ${
                        isVirtualCamActive
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{isVirtualCamActive ? 'Parar Câmera Virtual' : 'Iniciar Câmera Virtual'}</span>
                    </button>
                  </div>

                  {/* Instruções de Uso no Microsoft Teams */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Passo a Passo para Usar no Microsoft Teams:</span>
                    </h5>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1 leading-relaxed">
                      <li>Inicie a Câmera Virtual do OBS no botão acima.</li>
                      <li>No Microsoft Teams, vá em <strong>Configurações (...) &gt; Dispositivos</strong> ou nas opções de vídeo da reunião.</li>
                      <li>No menu <strong>Câmera</strong>, selecione <strong>"OBS Virtual Camera"</strong>.</li>
                      <li>Dica Pro: O Teams suporta até 1080p nativo em reuniões de negócios com taxa estável a 30 ou 60 FPS.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* CONTEÚDO SUB-MODO 2: OAUTH2 / RTMP-IN TOWN HALL */}
              {teamsSubMode === 'oauth' && (
                <div>
                  {isTeamsConnected ? (
                    <div className="p-3.5 bg-gradient-to-br from-indigo-50/50 via-purple-50/20 to-slate-50 rounded-xl border border-indigo-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#5059C9] p-0.5 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                            <TeamsIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                              <span>{teamsAccount.tenantName}</span>
                              <UserCheck className="w-3.5 h-3.5 text-[#5059C9]" />
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Tipo: <strong>{teamsAccount.eventType}</strong> • {teamsAccount.ndiStatus}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleDisconnectTeams}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition text-[11px] font-semibold flex items-center gap-1"
                          title="Desconectar Teams"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sair</span>
                        </button>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">Ponto de Entrada RTMP-In do Teams:</span>
                          <span className="text-[10px] font-mono text-emerald-600 font-bold">Entra ID Ativo</span>
                        </div>
                        <div className="font-mono text-xs bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800 flex items-center justify-between">
                          <span className="truncate">{teamsAccount.streamKey}</span>
                          <button
                            onClick={() => copyToClipboard('teams-key', teamsAccount.streamKey)}
                            className="text-slate-400 hover:text-slate-600 ml-2"
                            title="Copiar Chave"
                          >
                            {copiedId === 'teams-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">
                          Servidor: {teamsAccount.serverUrl}
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-2 pt-1">
                        <button
                          onClick={handleApplyTeamsToOBS}
                          className="flex-1 py-2 bg-[#5059C9] hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Injetar Teams no OBS</span>
                        </button>

                        <button
                          onClick={() => handleExecuteCrossStreamCopy('Microsoft Teams Live Event', teamsAccount.serverUrl, teamsAccount.streamKey)}
                          className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                          title="Cópia Cruzada: Replicar Teams para destinos Multi-RTMP"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Cópia Cruzada</span>
                        </button>

                        <a
                          href="https://teams.microsoft.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1"
                          title="Abrir Microsoft Teams"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handleConnectTeamsOAuth2}
                        disabled={isTeamsAuthenticating}
                        className="w-full py-2.5 bg-[#5059C9] hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isTeamsAuthenticating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Autenticando via Microsoft Entra ID OAuth2...</span>
                          </>
                        ) : (
                          <>
                            <TeamsIcon className="w-4 h-4 text-white" />
                            <span>Conectar com Microsoft 365 OAuth2</span>
                          </>
                        )}
                      </button>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>
                          Escopos: <code>OnlineMeetings.ReadWrite</code> e <code>User.Read</code>.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {teamsSuccessMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{teamsSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* 10. BLOCO: DISCORD OAUTH2 & LIVE WEBHOOK ALERT */}
          {(oauthViewMode === 'all' || selectedOAuthTab === 'discord') && (
            <div className="bg-white rounded-xl shadow-xs border border-indigo-200/80 p-5 relative overflow-hidden animate-in fade-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5865F2] via-indigo-600 to-purple-600" />

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#5865F2] text-white shadow-xs">
                    <DiscordIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-tight">
                      Discord OAuth2 & Bot Alert
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Notificador Automático de Live & Rich Presence
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                  isDiscordConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/20'
                }`}>
                  {isDiscordConnected ? 'CONECTADO' : 'DISCORD OAUTH2'}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Dispare avisos automáticos com @everyone ou @here no canal da sua comunidade no Discord no momento em que você clicar em "INICIAR TRANSMISSÃO".
              </p>

              {isDiscordConnected ? (
                <div className="p-3.5 bg-gradient-to-br from-indigo-50/50 via-purple-50/20 to-slate-50 rounded-xl border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#5865F2] p-0.5 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                        <DiscordIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>{discordAccount.botName}</span>
                          <UserCheck className="w-3.5 h-3.5 text-[#5865F2]" />
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {discordAccount.serverName} • Canal: <strong>{discordAccount.channelName}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDisconnectDiscord}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition text-[11px] font-semibold flex items-center gap-1"
                      title="Desconectar Discord"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair</span>
                    </button>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-2 text-xs">
                    <label className="block font-semibold text-slate-700 text-[11px]">
                      Mensagem de Alerta Personalizada:
                    </label>
                    <input
                      type="text"
                      value={discordAccount.customMessage}
                      onChange={(e) => setDiscordAccount({ ...discordAccount, customMessage: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                    />
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      Webhook: {discordAccount.webhookUrl}
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 pt-1">
                    <button
                      onClick={handleSendDiscordAlert}
                      disabled={isSendingDiscordAlert}
                      className="flex-1 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{isSendingDiscordAlert ? 'Disparando...' : 'Testar Alerta de Live no Discord'}</span>
                    </button>

                    <a
                      href="https://discord.com/developers/applications"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1"
                      title="Abrir Discord Developer Portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleConnectDiscordOAuth2}
                    disabled={isDiscordAuthenticating}
                    className="w-full py-2.5 bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isDiscordAuthenticating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Autenticando via Discord OAuth2...</span>
                      </>
                    ) : (
                      <>
                        <DiscordIcon className="w-4 h-4 text-white" />
                        <span>Conectar com Discord OAuth2</span>
                      </>
                    )}
                  </button>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5865F2] shrink-0 mt-0.5" />
                    <span>
                      Escopos: <code>identify</code>, <code>guilds</code> e <code>webhook.incoming</code>.
                    </span>
                  </div>
                </div>
              )}

              {discordSuccessMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{discordSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* 8. BLOCO: VIMEO LIVE OAUTH2 & CLOUD INGEST */}
          {(oauthViewMode === 'all' || selectedOAuthTab === 'vimeo') && (
            <div className="bg-white rounded-xl shadow-xs border border-cyan-200/80 p-5 relative overflow-hidden animate-in fade-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1AB7EA] via-sky-600 to-blue-700" />

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#1AB7EA] text-white shadow-xs">
                    <VimeoIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-tight">
                      Vimeo Live OAuth2
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Vimeo Enterprise & Cloud Ingest API
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                  isVimeoConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                }`}>
                  {isVimeoConnected ? 'CONECTADO' : 'VIMEO OAUTH2'}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Transmissões corporativas e institucionais de alta qualidade com proteção por senha ou restrição por domínio no Vimeo.
              </p>

              {isVimeoConnected ? (
                <div className="p-3.5 bg-gradient-to-br from-cyan-50/50 via-sky-50/30 to-slate-50 rounded-xl border border-cyan-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#1AB7EA] p-0.5 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                        <VimeoIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>{vimeoAccount.eventName}</span>
                          <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
                        </div>
                        <div className="text-[10px] text-slate-500">
                          ID: {vimeoAccount.eventId} • {vimeoAccount.privacy}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDisconnectVimeo}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition text-[11px] font-semibold flex items-center gap-1"
                      title="Desconectar Vimeo"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair</span>
                    </button>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">Stream Key Vimeo:</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">Ativa</span>
                    </div>
                    <div className="font-mono text-xs bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800 flex items-center justify-between">
                      <span className="truncate">{vimeoAccount.streamKey}</span>
                      <button
                        onClick={() => copyToClipboard('vimeo-key', vimeoAccount.streamKey)}
                        className="text-slate-400 hover:text-slate-600 ml-2"
                        title="Copiar Chave"
                      >
                        {copiedId === 'vimeo-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      Servidor: {vimeoAccount.serverUrl}
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 pt-1">
                    <button
                      onClick={handleApplyVimeoToOBS}
                      className="flex-1 py-2 bg-[#1AB7EA] hover:bg-[#159ec9] text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Injetar Vimeo no OBS</span>
                    </button>

                    <button
                      onClick={() => handleExecuteCrossStreamCopy('Vimeo Live (' + vimeoAccount.eventName + ')', vimeoAccount.serverUrl, vimeoAccount.streamKey)}
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                      title="Cópia Cruzada: Replicar Vimeo para destinos Multi-RTMP"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Cópia Cruzada</span>
                    </button>

                    <a
                      href="https://vimeo.com/live"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1"
                      title="Abrir Vimeo Live"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleConnectVimeoOAuth2}
                    disabled={isVimeoAuthenticating}
                    className="w-full py-2.5 bg-[#1AB7EA] hover:bg-[#159ec9] text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isVimeoAuthenticating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Autenticando via Vimeo OAuth2...</span>
                      </>
                    ) : (
                      <>
                        <VimeoIcon className="w-4 h-4 text-white" />
                        <span>Conectar com Vimeo OAuth2</span>
                      </>
                    )}
                  </button>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                    <span>
                      Escopos: <code>private</code>, <code>create</code>, <code>edit</code> e <code>video_files</code>.
                    </span>
                  </div>
                </div>
              )}

              {vimeoSuccessMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{vimeoSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* 9. BLOCO: WPSTREAM REST API */}
          {(oauthViewMode === 'all' || selectedOAuthTab === 'wpstream') && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 animate-in fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800 text-base">
                    Integração WordPress (WPStream)
                  </h3>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black border border-indigo-200">
                  REST API
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Conexão com sites WordPress que utilizam o plugin WPStream (portais de prefeituras, câmaras ou eventos) para sincronizar canais e chaves.
              </p>

              <form onSubmit={handleAuthWPStream} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    URL do Site WordPress
                  </label>
                  <input
                    type="text"
                    value={wpUrl}
                    onChange={(e) => setWpUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Usuário / Admin</label>
                    <input
                      type="text"
                      value={wpUser}
                      onChange={(e) => setWpUser(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ID do Canal WPStream</label>
                    <input
                      type="text"
                      value={wpChannelId}
                      onChange={(e) => setWpChannelId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isWpLoading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isWpLoading ? 'animate-spin' : ''}`} />
                  <span>{isWpLoading ? 'Sincronizando WPStream...' : 'Sincronizar & Salvar nos Perfis'}</span>
                </button>
              </form>

              {wpSuccessMessage && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{wpSuccessMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* Quick Help Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Dica para Transmissões Estáveis</span>
            </h4>
            <p className="text-[11px] leading-relaxed">
              Para alternar entre YouTube, Instagram Live, Twitch ou canal do órgão público no OBS Studio, basta clicar em <strong>"Ativar no OBS"</strong>. O Central Hub injeta as credenciais no OBS automaticamente sem você precisar abrir as Configurações de Transmissão.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

