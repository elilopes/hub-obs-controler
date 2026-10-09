import React, { useState } from 'react';
import { 
  Video, 
  Camera, 
  Sparkles, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  PlusCircle, 
  Plus, 
  Film, 
  Monitor, 
  Focus, 
  Gamepad2, 
  Save, 
  Layers, 
  Radio, 
  Sliders, 
  CheckCircle2, 
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { SceneItem } from '../types';

interface MasterControlTabProps {
  scenes: SceneItem[];
  currentScene: string;
  onSelectScene: (sceneName: string) => void;
  onCreateDefaultScenes: () => void;
  onInjectSources: (vdoUrl: string, mediaPath: string) => void;
  onTriggerMacro: (macroName: string) => void;
  onSaveReplay: () => void;
  onPTZControl: (action: 'up' | 'down' | 'left' | 'right' | 'zoom_in' | 'zoom_out' | 'reset') => void;
  ptzState: { panX: number; panY: number; zoom: number };
  isStreaming?: boolean;
}

export const MasterControlTab: React.FC<MasterControlTabProps> = ({
  scenes,
  currentScene,
  onSelectScene,
  onCreateDefaultScenes,
  onInjectSources,
  onTriggerMacro,
  onSaveReplay,
  onPTZControl,
  ptzState,
  isStreaming = false,
}) => {
  const [vdoUrl, setVdoUrl] = useState('');
  const [mediaPath, setMediaPath] = useState('C:/Transmissao/Midias/intro.mp4');
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);

  const handleCreateScenes = () => {
    setIsCreatingCollection(true);
    onCreateDefaultScenes();
    setTimeout(() => setIsCreatingCollection(false), 2000);
  };

  const handleInject = () => {
    setIsInjecting(true);
    onInjectSources(vdoUrl, mediaPath);
    setTimeout(() => setIsInjecting(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Scene Selector & Collection Builder */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Active Scene Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 text-base">Cenas do OBS Studio</h2>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
              Cena Ativa: <strong className="text-blue-600">{currentScene}</strong>
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Selecione uma cena para cortar a transmissão imediatamente pelo WebSocket v5.
          </p>

          {/* Scene Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {scenes.map((scene) => {
              const isActive = scene.name === currentScene;
              return (
                <button
                  key={scene.id}
                  onClick={() => onSelectScene(scene.name)}
                  className={`p-3.5 rounded-lg border text-left transition relative overflow-hidden flex flex-col justify-between min-h-[90px] ${
                    isActive
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {scene.type}
                    </span>
                    {isActive && (
                      <span className="flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight text-slate-900 mt-2">
                      {scene.name}
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {scene.sourcesCount} fontes configuradas
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Create Default Scene Collection Tool */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg">
            <div>
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Instalador Automático de Coleção
              </h4>
              <p className="text-[11px] text-slate-500">
                Gera a estrutura padrão de cenas (Cena_Principal, Apresentacao, Gameplay, BRB) com Move Transition.
              </p>
            </div>
            <button
              onClick={handleCreateScenes}
              disabled={isCreatingCollection}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCreatingCollection ? 'animate-spin' : ''}`} />
              <span>{isCreatingCollection ? 'Gerando Cenas...' : 'Criar Cenas Padrão'}</span>
            </button>
          </div>
        </div>

        {/* Video Source Injector (Webcam + VDO.Ninja + Media) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-800 text-base">Injetor Dinâmico de Fontes & Câmeras</h2>
          </div>

          {isStreaming && (
            <>
              <p className="text-xs text-slate-500 mt-2 mb-4">
                Injeta ou atualiza a Webcam principal, link do convidado VDO.Ninja e mídia de introdução direto na cena.
              </p>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Link da Câmera VDO.Ninja (Convidado Remoto)
                  </label>
                  <input
                    type="text"
                    placeholder="https://vdo.ninja/?view=xxxxxx"
                    value={vdoUrl}
                    onChange={(e) => setVdoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Caminho do Vídeo / Apresentação Local
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="C:/caminho/para/video.mp4"
                      value={mediaPath}
                      onChange={(e) => setMediaPath(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      onClick={() => setMediaPath('C:/Transmissao/Midias/apresentacao_oficial.mp4')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shrink-0"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Procurar</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleInject}
                    disabled={isInjecting}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <PlusCircle className={`w-4 h-4 ${isInjecting ? 'animate-spin' : ''}`} />
                    <span>{isInjecting ? 'Injetando Fontes no OBS...' : 'Injetar Fontes na Cena'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Macros & Replay Buffer */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Macros Rápidas & Ações de Transmissão</span>
          </h2>

          {isStreaming && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <button
                onClick={() => onTriggerMacro('Focar_Camera')}
                className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 text-blue-900 rounded-lg font-bold text-xs flex items-center gap-2 transition"
              >
                <Focus className="w-4 h-4 text-blue-600" />
                <span>Macro: Focar Câmera</span>
              </button>

              <button
                onClick={() => onTriggerMacro('Modo_Gameplay')}
                className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 text-emerald-900 rounded-lg font-bold text-xs flex items-center gap-2 transition"
              >
                <Gamepad2 className="w-4 h-4 text-emerald-600" />
                <span>Macro: Modo Gameplay</span>
              </button>

              <button
                onClick={onSaveReplay}
                className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 text-amber-900 rounded-lg font-bold text-xs flex items-center gap-2 transition"
              >
                <Save className="w-4 h-4 text-amber-600" />
                <span>Salvar Replay Instantâneo</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Right Column: Virtual PTZ Camera Controls & Interactive Canvas (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* PTZ Virtual Controller */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className={`flex items-center justify-between ${isStreaming ? 'mb-3' : ''}`}>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800 text-base">Controle PTZ Virtual (Pan / Tilt / Zoom)</h2>
            </div>
            {isStreaming && (
              <button
                type="button"
                onClick={() => onPTZControl('reset')}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                Resetar
              </button>
            )}
          </div>

          {isStreaming && (
            <>
              <p className="text-xs text-slate-500 mb-4">
                Ajusta o enquadramento suave e zoom da webcam via Transform/Crop do OBS WebSocket.
              </p>

              {/* Interactive PTZ Simulated Camera Viewport */}
              <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center mb-4">
                
                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 border border-slate-600">
                  <div className="border-r border-b border-slate-600"></div>
                  <div className="border-r border-b border-slate-600"></div>
                  <div className="border-b border-slate-600"></div>
                  <div className="border-r border-b border-slate-600"></div>
                  <div className="border-r border-b border-slate-600"></div>
                  <div className="border-b border-slate-600"></div>
                  <div className="border-r border-slate-600"></div>
                  <div className="border-r border-slate-600"></div>
                  <div></div>
                </div>

                {/* Virtual Simulated Camera Subject */}
                <div 
                  className="transition-transform duration-200 ease-out flex flex-col items-center justify-center"
                  style={{
                    transform: `translate(${ptzState.panX}px, ${ptzState.panY}px) scale(${ptzState.zoom})`,
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-blue-500/80 border-2 border-white/80 shadow-lg flex items-center justify-center text-white font-bold text-xs">
                    Apresentador
                  </div>
                  <span className="text-[10px] text-blue-200 mt-1 font-mono bg-black/50 px-2 py-0.5 rounded">
                    Pan: {ptzState.panX}px | Tilt: {ptzState.panY}px
                  </span>
                </div>

                {/* Target Reticle */}
                <div className="absolute w-6 h-6 border-2 border-emerald-400/80 rounded-full pointer-events-none"></div>

                {/* Zoom Badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono border border-white/20">
                  Zoom: {(ptzState.zoom * 100).toFixed(0)}%
                </div>
              </div>

              {/* D-Pad Navigation & Zoom Buttons */}
              <div className="flex flex-col items-center gap-3">
                
                {/* Pan & Tilt Joystick */}
                <div className="grid grid-cols-3 gap-2 w-44">
                  <div></div>
                  <button
                    type="button"
                    onClick={() => onPTZControl('up')}
                    className="p-3 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg border border-slate-200 flex items-center justify-center font-bold transition active:scale-95"
                    title="Inclinar para Cima (Tilt Up)"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <div></div>

                  <button
                    type="button"
                    onClick={() => onPTZControl('left')}
                    className="p-3 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg border border-slate-200 flex items-center justify-center font-bold transition active:scale-95"
                    title="Panorâmica para Esquerda (Pan Left)"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onPTZControl('reset')}
                    className="p-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg border border-slate-300 flex items-center justify-center text-xs font-bold transition active:scale-95"
                    title="Centralizar"
                  >
                    <Focus className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onPTZControl('right')}
                    className="p-3 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg border border-slate-200 flex items-center justify-center font-bold transition active:scale-95"
                    title="Panorâmica para Direita (Pan Right)"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div></div>
                  <button
                    type="button"
                    onClick={() => onPTZControl('down')}
                    className="p-3 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg border border-slate-200 flex items-center justify-center font-bold transition active:scale-95"
                    title="Inclinar para Baixo (Tilt Down)"
                  >
                    <ArrowDown className="w-5 h-5" />
                  </button>
                  <div></div>
                </div>

                {/* Zoom Controls & Presets */}
                <div className="flex items-center gap-2 w-full justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => onPTZControl('zoom_in')}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>Zoom In (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onPTZControl('zoom_out')}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </div>

                {/* PTZ Framing Presets */}
                <div className="grid grid-cols-3 gap-2 w-full pt-1">
                  <button
                    type="button"
                    onClick={() => onPTZControl('reset')}
                    className="py-1.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200"
                  >
                    Plano Aberto (1x)
                  </button>
                  <button
                    type="button"
                    onClick={() => onPTZControl('zoom_in')}
                    className="py-1.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200"
                  >
                    Médio (1.3x)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onPTZControl('zoom_in');
                      onPTZControl('zoom_in');
                    }}
                    className="py-1.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200"
                  >
                    Close-up (1.8x)
                  </button>
                </div>

              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};
