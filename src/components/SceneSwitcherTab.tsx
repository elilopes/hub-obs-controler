import React, { useState } from 'react';
import { 
  Workflow, 
  Plus, 
  Trash2, 
  Download, 
  Play, 
  Pause, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Sparkles, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { AutomationRule, SceneItem } from '../types';

interface SceneSwitcherTabProps {
  scenes: SceneItem[];
  rules: AutomationRule[];
  onAddRule: (rule: Omit<AutomationRule, 'id'>) => void;
  onDeleteRule: (id: string) => void;
  onClearRules: () => void;
  onToggleRule: (id: string) => void;
  isMonitoring: boolean;
  onToggleMonitoring: () => void;
  onExportSwitcherConfig: () => void;
  onTriggerRule: (rule: AutomationRule) => void;
}

export const SceneSwitcherTab: React.FC<SceneSwitcherTabProps> = ({
  scenes,
  rules,
  onAddRule,
  onDeleteRule,
  onClearRules,
  onToggleRule,
  isMonitoring,
  onToggleMonitoring,
  onExportSwitcherConfig,
  onTriggerRule,
}) => {
  const [selectedCondition, setSelectedCondition] = useState('stream_start');
  const [targetScene, setTargetScene] = useState(scenes[0]?.name || 'Cena_Principal');
  const [delayMs, setDelayMs] = useState(0);

  const conditionOptions = [
    { value: 'stream_start', label: 'Ao Iniciar Transmissão (Go Live)', desc: 'Muda de cena assim que o OBS confirma o envio do fluxo RTMP' },
    { value: 'stream_stop', label: 'Ao Encerrar Transmissão', desc: 'Corta imediatamente para a cena de Encerramento' },
    { value: 'media_ended', label: 'Quando o Vídeo da Introdução Terminar', desc: 'Transição suave para o apresentador ao fim da mídia' },
    { value: 'recording_start', label: 'Ao Iniciar Gravação Local', desc: 'Muda para cena de captura otimizada' },
    { value: 'mic_silence', label: 'Silêncio no Microfone por mais de 5s', desc: 'Corta para intervalo ou tela de espera' },
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const condObj = conditionOptions.find((c) => c.value === selectedCondition);
    onAddRule({
      condition: selectedCondition,
      targetScene,
      delayMs: Number(delayMs),
      enabled: true,
      description: condObj?.label || selectedCondition,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Rules Builder & Master Monitor Switch (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Monitor Switch & Export Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 text-base">Chaveador Automático</h2>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                isMonitoring
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isMonitoring && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
              {isMonitoring ? 'Monitor Ativo' : 'Monitor Pausado'}
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Troca as cenas do OBS de forma 100% autônoma baseado em gatilhos de live, áudio e fim de vídeos.
          </p>

          <div className="space-y-3">
            <button
              onClick={onToggleMonitoring}
              className={`w-full py-2.5 rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 ${
                isMonitoring
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isMonitoring ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar Monitoramento Automático</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Ativar Monitoramento Automático</span>
                </>
              )}
            </button>

            <button
              onClick={onExportSwitcherConfig}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition border border-slate-300 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Exportar JSON para Advanced Scene Switcher</span>
            </button>
          </div>
        </div>

        {/* Add New Automation Rule */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-blue-600" />
            Cadastrar Nova Regra Condicional
          </h3>

          <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Se acontecer esta condição:
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {conditionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mudar automaticamente para a cena:
              </label>
              <select
                value={targetScene}
                onChange={(e) => setTargetScene(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              >
                {scenes.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Atraso / Delay antes de trocar (milissegundos)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={delayMs}
                onChange={(e) => setDelayMs(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Regra de Automação</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Right Column: Active Rules List (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-800 text-base">Regras Cadastradas ({rules.length})</h2>
              <p className="text-xs text-slate-500">Gatilhos avaliados ciclicamente a cada ciclo de polling do OBS.</p>
            </div>
            {rules.length > 0 && (
              <button
                onClick={onClearRules}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpar Todas
              </button>
            )}
          </div>

          {rules.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-xs text-slate-500">
              Nenhuma regra configurada. Crie uma ao lado para automatizar seu fluxo.
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-lg border transition ${
                    rule.enabled
                      ? 'bg-slate-50/80 border-slate-200'
                      : 'bg-slate-100/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Zap className={`w-4 h-4 ${rule.enabled ? 'text-blue-600' : 'text-slate-400'}`} />
                        <h4 className="font-bold text-xs text-slate-900">{rule.description}</h4>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-600 pl-6">
                        <span>Ação:</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {rule.targetScene}
                        </span>
                        {rule.delayMs > 0 && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            (+{rule.delayMs}ms)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onTriggerRule(rule)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 transition"
                        title="Simular Gatilho Imediato"
                      >
                        Testar
                      </button>

                      <button
                        onClick={() => onToggleRule(rule.id)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded transition ${
                          rule.enabled
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {rule.enabled ? 'Ativa' : 'Inativa'}
                      </button>

                      <button
                        onClick={() => onDeleteRule(rule.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
