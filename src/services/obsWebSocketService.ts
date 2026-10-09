import OBSWebSocket from 'obs-websocket-js';
import { SceneItem, StreamStats } from '../types';

export class OBSWebSocketService {
  private obs: OBSWebSocket | null = null;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private statsInterval: number | null = null;

  // Callbacks
  public onConnectionStateChange?: (connected: boolean, error?: string) => void;
  public onSceneChange?: (sceneName: string) => void;
  public onSceneListChange?: (scenes: SceneItem[]) => void;
  public onStreamStateChange?: (isStreaming: boolean) => void;
  public onRecordStateChange?: (isRecording: boolean) => void;
  public onStatsUpdate?: (stats: Partial<StreamStats>) => void;
  public onVolumeChange?: (volumePercent: number) => void;

  constructor() {
    this.obs = new OBSWebSocket();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.obs) return;

    this.obs.on('ConnectionClosed', () => {
      this.isConnected = false;
      this.isConnecting = false;
      this.stopStatsPolling();
      this.onConnectionStateChange?.(false);
    });

    this.obs.on('CurrentProgramSceneChanged', (data: { sceneName: string }) => {
      this.onSceneChange?.(data.sceneName);
    });

    this.obs.on('StreamStateChanged', (data: { outputActive: boolean }) => {
      this.onStreamStateChange?.(data.outputActive);
    });

    this.obs.on('RecordStateChanged', (data: { outputActive: boolean }) => {
      this.onRecordStateChange?.(data.outputActive);
    });

    this.obs.on('SceneListChanged', () => {
      this.fetchScenes();
    });

    this.obs.on('SceneCreated', () => {
      this.fetchScenes();
    });
  }

  public async connect(host: string, port: number, password?: string): Promise<{ version: string; wsVersion: string }> {
    if (this.isConnected && this.obs) {
      await this.disconnect();
    }

    this.isConnecting = true;
    if (!this.obs) {
      this.obs = new OBSWebSocket();
      this.setupEventListeners();
    }

    try {
      // Build proper URL - support ws://, wss://, or raw host
      let wsUrl = host.trim();
      if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
        wsUrl = `ws://${wsUrl}:${port}`;
      } else if (!wsUrl.includes(':', wsUrl.indexOf('://') + 3)) {
        wsUrl = `${wsUrl}:${port}`;
      }

      const response = await this.obs.connect(wsUrl, password || undefined, {
        rpcVersion: 1,
      });

      this.isConnected = true;
      this.isConnecting = false;
      this.onConnectionStateChange?.(true);

      // Fetch initial data
      await this.fetchScenes();
      this.startStatsPolling();

      return {
        version: response.obsWebSocketVersion || '5.x',
        wsVersion: response.negotiatedRpcVersion?.toString() || '1',
      };
    } catch (err: unknown) {
      this.isConnected = false;
      this.isConnecting = false;
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.onConnectionStateChange?.(false, errorMsg);
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    this.stopStatsPolling();
    if (this.obs && this.isConnected) {
      try {
        await this.obs.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.onConnectionStateChange?.(false);
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public getIsConnecting(): boolean {
    return this.isConnecting;
  }

  // --- OBS Commands ---

  public async setScene(sceneName: string): Promise<void> {
    if (!this.isConnected || !this.obs) return;
    await this.obs.call('SetCurrentProgramScene', { sceneName });
  }

  public async startStream(): Promise<void> {
    if (!this.isConnected || !this.obs) return;
    await this.obs.call('StartStream');
  }

  public async stopStream(): Promise<void> {
    if (!this.isConnected || !this.obs) return;
    await this.obs.call('StopStream');
  }

  public async startRecord(): Promise<void> {
    if (!this.isConnected || !this.obs) return;
    await this.obs.call('StartRecord');
  }

  public async stopRecord(): Promise<void> {
    if (!this.isConnected || !this.obs) return;
    await this.obs.call('StopRecord');
  }

  public async saveReplayBuffer(): Promise<void> {
    if (!this.isConnected || !this.obs) return;
    try {
      await this.obs.call('SaveReplayBuffer');
    } catch (err) {
      console.warn('Replay buffer not active on OBS:', err);
    }
  }

  public async setVolume(inputName: string, volumeDb: number): Promise<void> {
    if (!this.isConnected || !this.obs) return;
    try {
      await this.obs.call('SetInputVolume', {
        inputName,
        inputVolumeDb: volumeDb,
      });
    } catch (err) {
      console.warn(`Failed to set volume for ${inputName}:`, err);
    }
  }

  public async createSceneCollection(sceneCollectionName: string): Promise<void> {
    if (!this.isConnected || !this.obs) return;
    try {
      await this.obs.call('CreateSceneCollection', { sceneCollectionName });
    } catch {
      await this.obs.call('SetCurrentSceneCollection', { sceneCollectionName });
    }
  }

  public async setTextSource(sourceName: string, text: string): Promise<boolean> {
    if (!this.isConnected || !this.obs) return false;
    try {
      await this.obs.call('SetInputSettings', {
        inputName: sourceName,
        inputSettings: { text },
        overlay: true,
      });
      return true;
    } catch (err) {
      console.warn(`Failed to update text source "${sourceName}":`, err);
      return false;
    }
  }

  public async setStreamServiceSettings(serviceType: string, server: string, key: string): Promise<boolean> {
    if (!this.isConnected || !this.obs) return false;
    try {
      await this.obs.call('SetStreamServiceSettings', {
        streamServiceType: serviceType || 'rtmp_custom',
        streamServiceSettings: {
          server,
          key,
        },
      });
      return true;
    } catch (err) {
      console.warn('Failed to update stream service settings in OBS:', err);
      return false;
    }
  }

  public async startVirtualCam(): Promise<boolean> {
    if (!this.isConnected || !this.obs) return false;
    try {
      await this.obs.call('StartVirtualCam');
      return true;
    } catch (err) {
      console.warn('Failed to start Virtual Cam on OBS:', err);
      return false;
    }
  }

  public async stopVirtualCam(): Promise<boolean> {
    if (!this.isConnected || !this.obs) return false;
    try {
      await this.obs.call('StopVirtualCam');
      return true;
    } catch (err) {
      console.warn('Failed to stop Virtual Cam on OBS:', err);
      return false;
    }
  }

  public async toggleVirtualCam(): Promise<boolean> {
    if (!this.isConnected || !this.obs) return false;
    try {
      const res = await this.obs.call('ToggleVirtualCam');
      return res.outputActive;
    } catch (err) {
      console.warn('Failed to toggle Virtual Cam on OBS:', err);
      return false;
    }
  }

  public async getVirtualCamStatus(): Promise<boolean> {
    if (!this.isConnected || !this.obs) return false;
    try {
      const res = await this.obs.call('GetVirtualCamStatus');
      return res.outputActive;
    } catch {
      return false;
    }
  }

  public async callVendor(vendorName: string, requestType: string, requestData?: Record<string, unknown>): Promise<unknown> {
    if (!this.isConnected || !this.obs) return null;
    try {
      return await this.obs.call('CallVendorRequest', {
        vendorName,
        requestType,
        requestData: requestData as any,
      });
    } catch (err) {
      console.warn(`Vendor request ${vendorName}/${requestType} failed:`, err);
      return null;
    }
  }

  public async fetchScenes(): Promise<SceneItem[]> {
    if (!this.isConnected || !this.obs) return [];
    try {
      const response = await this.obs.call('GetSceneList');
      const current = response.currentProgramSceneName;
      const scenesList = response.scenes as Array<{ sceneName: string; sceneIndex: number }>;

      const mappedScenes: SceneItem[] = scenesList.map((s, idx) => ({
        id: `obs-scene-${idx}`,
        name: s.sceneName,
        active: s.sceneName === current,
        sourcesCount: 3,
        type: s.sceneName.toLowerCase().includes('cam')
          ? 'camera'
          : s.sceneName.toLowerCase().includes('midia') || s.sceneName.toLowerCase().includes('apresentacao')
          ? 'media'
          : s.sceneName.toLowerCase().includes('vert')
          ? 'vertical'
          : 'standard',
      }));

      this.onSceneListChange?.(mappedScenes);
      if (current) this.onSceneChange?.(current);
      return mappedScenes;
    } catch {
      return [];
    }
  }

  public async setVideoSettings(fpsNumerator: number, fpsDenominator: number, baseWidth: number, baseHeight: number, outputWidth: number, outputHeight: number): Promise<boolean> {
    if (!this.isConnected || !this.obs) return false;
    try {
      await this.obs.call('SetVideoSettings', {
        fpsNumerator,
        fpsDenominator,
        baseWidth,
        baseHeight,
        outputWidth,
        outputHeight,
      });
      return true;
    } catch (err) {
      console.warn('SetVideoSettings failed:', err);
      return false;
    }
  }

  public async setInputMute(inputName: string, inputMuted: boolean): Promise<boolean> {
    if (!this.isConnected || !this.obs) return false;
    try {
      await this.obs.call('SetInputMute', { inputName, inputMuted });
      return true;
    } catch (err) {
      console.warn(`SetInputMute failed for ${inputName}:`, err);
      return false;
    }
  }

  public async setInputVolume(inputName: string, inputVolumeMul: number): Promise<boolean> {
    if (!this.isConnected || !this.obs) return false;
    try {
      await this.obs.call('SetInputVolume', { inputName, inputVolumeMul });
      return true;
    } catch (err) {
      console.warn(`SetInputVolume failed for ${inputName}:`, err);
      return false;
    }
  }

  // --- Telemetry Polling ---

  private startStatsPolling() {
    this.stopStatsPolling();
    this.statsInterval = window.setInterval(async () => {
      if (!this.isConnected || !this.obs) return;
      try {
        const stats = await this.obs.call('GetStats');
        const streamStatus = await this.obs.call('GetStreamStatus').catch(() => null);
        const recordStatus = await this.obs.call('GetRecordStatus').catch(() => null);

        this.onStatsUpdate?.({
          cpuUsage: stats.cpuUsage ?? 15,
          fps: stats.activeFps ?? 60,
          memoryUsageMb: stats.memoryUsage ?? 350,
          isStreaming: streamStatus?.outputActive ?? false,
          streamingTime: streamStatus?.outputDuration ? Math.floor(streamStatus.outputDuration / 1000) : 0,
          bitrate: streamStatus?.outputBytes ? Math.round((streamStatus.outputBytes * 8) / 1024 / (streamStatus.outputDuration / 1000 || 1)) : 6000,
          droppedFrames: streamStatus?.outputSkippedFrames ?? 0,
          totalFrames: streamStatus?.outputTotalFrames ?? 0,
          isRecording: recordStatus?.outputActive ?? false,
          recordingTime: recordStatus?.outputDuration ? Math.floor(recordStatus.outputDuration / 1000) : 0,
        });
      } catch {
        // Polling error non-blocking
      }
    }, 2000);
  }

  private stopStatsPolling() {
    if (this.statsInterval !== null) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }
}

export const obsService = new OBSWebSocketService();
