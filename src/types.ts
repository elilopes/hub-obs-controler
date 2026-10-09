export type ConnectionMode = 'direct' | 'simulation';

export interface StudioProfile {
  id: string;
  name: string;
  mode: ConnectionMode;
  host: string;
  port: number;
  password: string;
  autoConnect: boolean;
  lastUsed: string;
  isDefault?: boolean;
  description?: string;
}

export interface OBSConnectionConfig {
  mode: ConnectionMode;
  activeProfileId: string;
  host: string;
  port: number;
  password: string;
  connected: boolean;
  connecting: boolean;
  version?: string;
  webSocketVersion?: string;
  error?: string;
}

export interface StreamStats {
  isStreaming: boolean;
  isRecording: boolean;
  streamingTime: number; // in seconds
  recordingTime: number; // in seconds
  cpuUsage: number; // percentage
  fps: number;
  bitrate: number; // kbps
  droppedFrames: number;
  totalFrames: number;
  memoryUsageMb: number;
}

export interface SceneItem {
  id: string;
  name: string;
  active: boolean;
  sourcesCount: number;
  type: 'standard' | 'camera' | 'media' | 'vertical';
}

export interface RTMPDestination {
  id: string;
  name: string;
  server: string;
  key: string;
  enabled: boolean;
  status: 'idle' | 'streaming' | 'error';
  platform?: 'youtube' | 'twitch' | 'facebook' | 'kick' | 'tiktok' | 'instagram' | 'discord' | 'vimeo' | 'restream' | 'zoom' | 'meet' | 'teams' | 'custom';
}

export interface CrossStreamCopyPayload {
  sourceName: string;
  sourcePlatform?: string;
  sourceServer: string;
  sourceKey: string;
  targetDestinationIds: string[];
  cloneAsNew?: boolean;
  newDestinationName?: string;
}

export interface AutomationRule {
  id: string;
  condition: string;
  targetScene: string;
  delayMs: number;
  enabled: boolean;
  description: string;
}

export interface VDONinjaGuest {
  id: string;
  name: string;
  streamId: string;
  isMuted: boolean;
  isLowQuality: boolean;
  connectedAt: string;
  resolution: string;
  avatarColor: string;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

export type TextEffectType = 
  | 'none'
  | 'neon' 
  | 'gradient_gold' 
  | 'impact_news' 
  | 'cyber_glitch' 
  | 'shadow_3d' 
  | 'typewriter' 
  | 'strobe';

export type BoxEffectType = 
  | 'breaking_news' 
  | 'cyberpunk' 
  | 'frosted_glass' 
  | 'gamer_rgb' 
  | 'floating_pill' 
  | 'hazard_stripes' 
  | 'vip_gold' 
  | 'minimal_dark';

export interface PreformattedAlert {
  id: string;
  category: 'noticias' | 'interacao' | 'eventos' | 'tecnico';
  title: string;
  badge: string;
  text: string;
  color: string;
  textEffect: TextEffectType;
  boxEffect: BoxEffectType;
  speed: 'slow' | 'medium' | 'fast';
  isBlinking?: boolean;
}

export interface StreamAccountProfile {
  id: string;
  name: string;
  platform: 'youtube' | 'twitch' | 'facebook' | 'kick' | 'instagram' | 'tiktok' | 'discord' | 'vimeo' | 'restream' | 'zoom' | 'meet' | 'teams' | 'wpstream' | 'custom';
  streamKey: string;
  serverUrl?: string;
  accountEmail?: string;
  channelName?: string;
  lastUsed?: string;
  isDefault?: boolean;
}

export interface LiveQualityConfig {
  resolution: '1080p' | '720p' | '1440p' | '4k' | 'vertical_1080' | '936p' | 'custom';
  width: number;
  height: number;
  fps: number;
  bitrate: number; // kbps, e.g. 6000
  encoder: 'nvenc_h264' | 'nvenc_hevc' | 'nvenc_av1' | 'x264' | 'qsv' | 'amd_amf';
  rateControl: 'CBR' | 'VBR';
  keyframeInterval: number; // seconds, default 2s
  preset: 'p1_fastest' | 'p3_fast' | 'p5_balanced' | 'p6_high' | 'p7_max' | 'veryfast' | 'medium';
  audioBitrate: 128 | 160 | 192 | 320;
}

export interface RecordQualityConfig {
  resolution: 'same_as_stream' | '1080p' | '1440p' | '4k' | 'vertical_1080';
  width: number;
  height: number;
  format: 'mkv' | 'mp4' | 'mov';
  qualityMode: 'cqp' | 'high_cbr' | 'lossless';
  cqpLevel: number; // 14 (quase sem perdas) a 28
  bitrate: number; // kbps quando em CBR (ex: 25000)
  encoder: 'nvenc_hevc' | 'nvenc_av1' | 'nvenc_h264' | 'x264' | 'prores';
  multiTrackAudio: boolean;
  audioTracks: number[]; // [1, 2, 3]
  preset: 'p5_balanced' | 'p6_high' | 'p7_max' | 'medium';
}

export interface PopularScriptItem {
  id: string;
  name: string;
  category: 'visual' | 'automacao' | 'audio' | 'interatividade';
  authorOrSource: string;
  description: string;
  tag: string;
  benefits: string[];
  luaOrPythonCode?: string;
  howToInstall: string;
  settingsSummary: string;
  activeInSim?: boolean;
}
