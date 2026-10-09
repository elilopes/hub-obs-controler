import { StudioProfile } from '../types';

const PROFILES_STORAGE_KEY = 'central_hub_obs_studio_profiles_v1';
const ACTIVE_PROFILE_KEY = 'central_hub_obs_active_profile_id_v1';

const defaultEnvHost = import.meta.env.VITE_OBS_HOST || 'localhost';
const defaultEnvPort = Number(import.meta.env.VITE_OBS_PORT) || 4455;
const defaultEnvPassword = import.meta.env.VITE_OBS_PASSWORD || '@viclic2';

export const DEFAULT_PROFILES: StudioProfile[] = [
  {
    id: 'profile-local-direct',
    name: 'Estúdio Principal (OBS Local Direto)',
    mode: 'direct',
    host: defaultEnvHost,
    port: defaultEnvPort,
    password: defaultEnvPassword,
    autoConnect: false,
    lastUsed: new Date().toISOString(),
    isDefault: true,
    description: 'Conexão WebSocket direta do navegador para o OBS Studio rodando na mesma máquina.',
  },
  {
    id: 'profile-remote-lan',
    name: 'Estúdio Remoto / Igreja / Evento (LAN)',
    mode: 'direct',
    host: '192.168.1.150',
    port: 4455,
    password: '',
    autoConnect: false,
    lastUsed: new Date().toISOString(),
    description: 'Conexão com servidor OBS remoto em rede local ou via IP público/VPN.',
  },
  {
    id: 'profile-simulated-hub',
    name: 'Ambiente de Teste & Simulação Central Hub',
    mode: 'simulation',
    host: defaultEnvHost,
    port: defaultEnvPort,
    password: defaultEnvPassword,
    autoConnect: true,
    lastUsed: new Date().toISOString(),
    description: 'Modo simulador interativo completo para testes sem necessidade de OBS ativo.',
  },
];

export class ProfileManager {
  public static getProfiles(): StudioProfile[] {
    try {
      const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    this.saveProfiles(DEFAULT_PROFILES);
    return DEFAULT_PROFILES;
  }

  public static saveProfiles(profiles: StudioProfile[]): void {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    } catch (err) {
      console.error('Failed to save studio profiles to localStorage:', err);
    }
  }

  public static getActiveProfileId(): string {
    try {
      const storedId = localStorage.getItem(ACTIVE_PROFILE_KEY);
      if (storedId) {
        const profiles = this.getProfiles();
        if (profiles.some((p) => p.id === storedId)) {
          return storedId;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILES[0].id;
  }

  public static setActiveProfileId(id: string): void {
    try {
      localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    } catch (err) {
      console.error('Failed to set active profile id:', err);
    }
  }

  public static getActiveProfile(): StudioProfile {
    const profiles = this.getProfiles();
    const activeId = this.getActiveProfileId();
    return profiles.find((p) => p.id === activeId) || profiles[0] || DEFAULT_PROFILES[0];
  }

  public static saveOrUpdateProfile(profile: StudioProfile): StudioProfile[] {
    const profiles = this.getProfiles();
    const index = profiles.findIndex((p) => p.id === profile.id);
    let updated: StudioProfile[];
    if (index >= 0) {
      updated = [...profiles];
      updated[index] = { ...profile, lastUsed: new Date().toISOString() };
    } else {
      updated = [...profiles, { ...profile, lastUsed: new Date().toISOString() }];
    }
    this.saveProfiles(updated);
    return updated;
  }

  public static deleteProfile(id: string): StudioProfile[] {
    const profiles = this.getProfiles().filter((p) => p.id !== id);
    if (profiles.length === 0) {
      this.saveProfiles(DEFAULT_PROFILES);
      this.setActiveProfileId(DEFAULT_PROFILES[0].id);
      return DEFAULT_PROFILES;
    }
    this.saveProfiles(profiles);
    if (this.getActiveProfileId() === id) {
      this.setActiveProfileId(profiles[0].id);
    }
    return profiles;
  }
}
