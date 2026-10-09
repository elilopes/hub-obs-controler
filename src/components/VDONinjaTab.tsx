import React, { useState } from 'react';
import { 
  Users, 
  Copy, 
  ExternalLink, 
  Mic, 
  MicOff, 
  UserX, 
  Zap, 
  MessageSquare, 
  Send, 
  Check, 
  ShieldAlert, 
  Plus, 
  Video, 
  Settings,
  Sparkles
} from 'lucide-react';
import { VDONinjaGuest } from '../types';

interface VDONinjaTabProps {
  onInjectVDONinja: (roomUrl: string) => void;
}

export const VDONinjaTab: React.FC<VDONinjaTabProps> = ({ onInjectVDONinja }) => {
  const [roomName, setRoomName] = useState('LiveHub');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Diretor', text: 'Olá convidados, iniciaremos a transmissão em 3 minutos.', time: '15:10' },
    { sender: 'Convidado #1 (Dr. Carlos)', text: 'Áudio e vídeo prontos por aqui!', time: '15:11' },
  ]);

  const [guests, setGuests] = useState<VDONinjaGuest[]>([
    {
      id: 'guest-1',
      name: 'Dr. Carlos - Especialista Convidado',
      streamId: 'vdo_guest_carlos_982',
      isMuted: false,
      isLowQuality: false,
      connectedAt: '15:04',
      resolution: '1080p 30fps',
      avatarColor: 'from-blue-600 to-cyan-600',
    },
    {
      id: 'guest-2',
      name: 'Mariana Silva - Correspondente',
      streamId: 'vdo_guest_mariana_114',
      isMuted: false,
      isLowQuality: true,
      connectedAt: '15:08',
      resolution: '720p 30fps (Modo Econômico)',
      avatarColor: 'from-purple-600 to-pink-600',
    },
  ]);

  const obsBrowserUrl = `https://vdo.ninja/?room=${roomName}&view=1&clean=1&transparent=1`;
  const directorUrl = `https://vdo.ninja/?director=${roomName}`;
  const guestInviteUrl = `https://vdo.ninja/?room=${roomName}&push=guest_${Date.now().toString().slice(-4)}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleToggleMute = (guestId: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, isMuted: !g.isMuted } : g))
    );
  };

  const handleToggleQuality = (guestId: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, isLowQuality: !g.isLowQuality } : g))
    );
  };

  const handleKickGuest = (guestId: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
  };

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    setChatLog((prev) => [
      ...prev,
      {
        sender: 'Diretor (Você)',
        text: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Room Generator & Quick Links (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Room Config & Links */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-800 text-base">VDO.Ninja Control Room</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Gere salas P2P WebRTC ultra rápidas para trazer câmeras de convidados remotos para o OBS.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-xs text-slate-700 mb-1">
                Nome da Sala / Room Name
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>

            {/* Link Card: OBS Clean Source */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-900">
                  1. Link Limpo para OBS Browser Source
                </span>
                <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.2 rounded font-mono">
                  Clean View
                </span>
              </div>
              <input
                type="text"
                readOnly
                value={obsBrowserUrl}
                className="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded text-[11px] font-mono text-slate-700 truncate"
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => copyToClipboard(obsBrowserUrl, 'obs')}
                  className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition"
                >
                  {copiedLink === 'obs' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink === 'obs' ? 'Copiado!' : 'Copiar Link OBS'}</span>
                </button>
                <button
                  onClick={() => onInjectVDONinja(obsBrowserUrl)}
                  className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold transition"
                  title="Injetar direto no OBS"
                >
                  Injetar no OBS
                </button>
              </div>
            </div>

            {/* Link Card: Guest Invite Link */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">
                  2. Link de Convite para o Convidado
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                  Push Camera
                </span>
              </div>
              <input
                type="text"
                readOnly
                value={guestInviteUrl}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-700 truncate"
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => copyToClipboard(guestInviteUrl, 'guest')}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition"
                >
                  {copiedLink === 'guest' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink === 'guest' ? 'Copiado!' : 'Copiar Link do Convidado'}</span>
                </button>
                <a
                  href={guestInviteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 flex items-center justify-center"
                  title="Abrir no Navegador"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Link Card: Director Room */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">
                  3. Painel do Diretor (Mesa Técnica)
                </span>
              </div>
              <input
                type="text"
                readOnly
                value={directorUrl}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-700 truncate"
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => copyToClipboard(directorUrl, 'director')}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center justify-center gap-1 border border-slate-200 transition"
                >
                  {copiedLink === 'director' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink === 'director' ? 'Copiado!' : 'Copiar Diretor'}</span>
                </button>
                <a
                  href={directorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 flex items-center justify-center"
                  title="Abrir Mesa do Diretor"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Right Column: Connected Guests & Remote Controls & Live Director Chat (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Connected Guests List & Remote Management */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 text-base">Convidados Conectados ({guests.length})</h2>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              WebRTC Ativo
            </span>
          </div>

          {guests.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">Nenhum convidado na sala no momento.</p>
              <p className="text-[11px] text-slate-400">Envie o link de convite para que eles entrem pela webcam.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  {/* Avatar & Guest Details */}
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-lg bg-gradient-to-tr ${guest.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow`}>
                      {guest.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{guest.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                        <span>{guest.resolution}</span>
                        <span>•</span>
                        <span>Entrou às {guest.connectedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Remote Action Buttons */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                    {/* Remote Mute */}
                    <button
                      onClick={() => handleToggleMute(guest.id)}
                      className={`p-2 rounded-lg border text-xs font-bold transition ${
                        guest.isMuted
                          ? 'bg-rose-100 border-rose-300 text-rose-700'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                      title={guest.isMuted ? 'Desmutar Convidado' : 'Mutar Convidado no OBS'}
                    >
                      {guest.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    {/* Low Quality Mode */}
                    <button
                      onClick={() => handleToggleQuality(guest.id)}
                      className={`p-2 rounded-lg border text-xs font-bold transition ${
                        guest.isLowQuality
                          ? 'bg-amber-100 border-amber-300 text-amber-700'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                      title={guest.isLowQuality ? 'Restaurar Qualidade HD' : 'Forçar Baixa Resolução (Econômico)'}
                    >
                      <Zap className="w-4 h-4" />
                    </button>

                    {/* Kick */}
                    <button
                      onClick={() => handleKickGuest(guest.id)}
                      className="p-2 rounded-lg bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition"
                      title="Desconectar / Kick Convidado"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Director Backstage Chat */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-800 text-base">Chat Interno da Produção & Ponto Remoto</h2>
          </div>

          {/* Chat Messages Box */}
          <div className="h-36 overflow-y-auto bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 mb-3 text-xs">
            {chatLog.map((msg, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800">{msg.sender}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite um recado técnico para todos os convidados..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendChat}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
