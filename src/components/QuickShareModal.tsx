import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Share2, Video, Tv, Radio } from 'lucide-react';

interface QuickShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickShareModal: React.FC<QuickShareModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const links = [
    {
      label: 'YouTube Live Pública',
      url: 'https://youtube.com/live/cgwr-kmv8?feature=share',
      icon: <Video className="w-4 h-4 text-red-600" />,
    },
    {
      label: 'Twitch TV Stream',
      url: 'https://twitch.tv/hub_transmissao_oficial',
      icon: <Tv className="w-4 h-4 text-purple-600" />,
    },
    {
      label: 'VDO.Ninja Sala dos Convidados',
      url: 'https://vdo.ninja/?room=LiveHub&clean=1',
      icon: <Radio className="w-4 h-4 text-blue-600" />,
    },
  ];

  const handleCopy = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Compartilhar Links da Transmissão</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-500">
            Copie rapidamente os links de acesso para espectadores, diretores e participantes:
          </p>

          <div className="space-y-3">
            {links.map((link, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={link.url}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-700 truncate"
                  />
                  <button
                    onClick={() => handleCopy(link.url, link.label)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    {copiedKey === link.label ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === link.label ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
