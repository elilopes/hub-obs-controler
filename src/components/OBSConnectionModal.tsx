import React, { useState, useEffect } from 'react';
import { 
  X, 
  Server, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Check, 
  Key, 
  Shield, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Save, 
  Layers, 
  Sparkles, 
  Radio, 
  Globe, 
  Laptop
} from 'lucide-react';
import { OBSConnectionConfig, StudioProfile, ConnectionMode } from '../types';
import { ProfileManager } from '../services/profileManager';

interface OBSConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OBSConnectionConfig;
  profiles: StudioProfile[];
  onSaveProfiles: (profiles: StudioProfile[], activeId: string) => void;
  onConnect: (profile: StudioProfile) => void;
  onDisconnect: () => void;
  onTestConnection: (profile: StudioProfile) => Promise<{ success: boolean; message: string }>;
}

export const OBSConnectionModal: React.FC<OBSConnectionModalProps> = ({
  isOpen,
  onClose,
  config,
  profiles,
  onSaveProfiles,
  onConnect,
  onDisconnect,
  onTestConnection,
}) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(config.activeProfileId || profiles[0]?.id || 'profile-local-direct');
  const [profileName, setProfileName] = useState('');
  const [mode, setMode] = useState<ConnectionMode>('direct');
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState(4455);
  const [password, setPassword] = useState('@viclic2');
  const [autoConnect, setAutoConnect] = useState(false);
  const [description, setDescription] = useState('');

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Sync state when selected profile changes
  useEffect(() => {
    const prof = profiles.find((p) => p.id === selectedProfileId) || profiles[0];
    if (prof) {
      setProfileName(prof.name);
      setMode(prof.mode);
      setHost(prof.host);
      setPort(prof.port);
      setPassword(prof.password);
      setAutoConnect(prof.autoConnect);
      setDescription(prof.description || '');
      setTestResult(null);
    }
  }, [selectedProfileId, profiles]);

  if (!isOpen) return null;

  const currentProfileData: StudioProfile = {
    id: selectedProfileId,
    name: profileName,
    mode,
    host,
    port: Number(port),
    password,
    autoConnect,
    description,
    lastUsed: new Date().toISOString(),
  };

  const handleCreateNewProfile = () => {
    const newId = `profile-${Date.now()}`;
    const newProfile: StudioProfile = {
      id: newId,
      name: `Novo Estúdio #${profiles.length + 1}`,
      mode: 'direct',
      host: 'localhost',
      port: 4455,
      password: '',
      autoConnect: false,
      lastUsed: new Date().toISOString(),
      description: 'Perfil personalizado para estúdio OBS.',
    };
    const updated = ProfileManager.saveOrUpdateProfile(newProfile);
    onSaveProfiles(updated, newId);
    setSelectedProfileId(newId);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const updated = ProfileManager.deleteProfile(id);
    const nextActive = updated[0]?.id || '';
    onSaveProfiles(updated, nextActive);
    setSelectedProfileId(nextActive);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await onTestConnection(currentProfileData);
      setTestResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na conexão com o servidor WebSocket.';
      setTestResult({ success: false, message: `❌ ${msg}` });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveAndApply = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = ProfileManager.saveOrUpdateProfile(currentProfileData);
    ProfileManager.setActiveProfileId(selectedProfileId);
    onSaveProfiles(updated, selectedProfileId);
    onConnect(currentProfileData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Conexões OBS & Perfis de Estúdio</h3>
              <p className="text-xs text-slate-500">
                Configure conexões diretas via obs-websocket-js ou modo simulação local
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSaveAndApply} className="p-6 space-y-5 text-xs">
          
          {/* Profile Selector & Quick Add */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Perfil de Estúdio Selecionado</span>
              </label>
              <button
                type="button"
                onClick={handleCreateNewProfile}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200 flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Perfil</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {profiles.map((p) => {
                const isSelected = p.id === selectedProfileId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProfileId(p.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition text-left relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-white hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-900 truncate pr-2 text-xs">
                        {p.name}
                      </span>
                      {profiles.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProfile(p.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                          title="Excluir Perfil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-mono">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.mode === 'direct' ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}
                      />
                      <span>{p.mode === 'direct' ? 'OBS Direto' : 'Simulação'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connection Mode Tabs */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700">Modo de Operação da Conexão</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('direct')}
                className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition ${
                  mode === 'direct'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Radio className={`w-4 h-4 mt-0.5 ${mode === 'direct' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <h4 className="font-bold text-xs">Modo Direto (obs-websocket-js)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Comunicação WebSocket direta do navegador com o OBS Studio v5.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('simulation')}
                className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition ${
                  mode === 'simulation'
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 text-blue-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Laptop className={`w-4 h-4 mt-0.5 ${mode === 'simulation' ? 'text-blue-600' : 'text-slate-400'}`} />
                <div>
                  <h4 className="font-bold text-xs">Modo Simulação Central Hub</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ambiente de testes interativo com respostas instantâneas na interface.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nome de Identificação do Perfil</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Ex: Estúdio Principal, Igreja, OBS Remoto"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Host / IP do OBS {mode === 'direct' && '(Ex: localhost ou 192.168.1.50)'}
              </label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="localhost ou IP"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Porta WebSocket (Padrão 4455)</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                placeholder="4455"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Senha do OBS WebSocket</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoConnect}
                  onChange={(e) => setAutoConnect(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-700">
                  Conectar automaticamente a este perfil ao abrir o aplicativo
                </span>
              </label>
            </div>
          </div>

          {/* Test Result Message Box */}
          {testResult && (
            <div
              className={`p-3 rounded-lg border text-xs font-medium flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p>{testResult.message}</p>
                {!testResult.success && mode === 'direct' && (
                  <p className="text-[11px] text-slate-600 mt-1">
                    Dica: Verifique se o OBS Studio está aberto em <em>Ferramentas &gt; Configurações do servidor WebSocket</em> com a opção "Ativar servidor WebSocket" marcada na porta {port}.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition border border-slate-300 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testando Conexão...' : 'Testar Conexão OBS'}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {config.connected && (
                <button
                  type="button"
                  onClick={() => {
                    onDisconnect();
                    onClose();
                  }}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition"
                >
                  Desconectar
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar & Conectar Perfil</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
