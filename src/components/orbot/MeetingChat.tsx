import { motion, AnimatePresence } from 'framer-motion';
import { MeetingSession, Agent, MeetingMessage, AGENT_CONFIGS } from './types';
import { MessageSquare, Send, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface MeetingChatProps {
  meeting: MeetingSession | null;
  agents: Agent[];
  onClose: () => void;
  onSendMessage?: (message: string) => void;
  canSendAsCEO?: boolean;
}

export default function MeetingChat({ meeting, agents, onClose, onSendMessage, canSendAsCEO = true }: MeetingChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [meeting?.messages]);

  const handleSend = () => {
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-CR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!meeting) return null;

  return (
    <motion.div
      className="absolute bottom-4 right-4 w-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden z-50"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Consejo de Agentes
            </h3>
            <p className="text-[10px] text-slate-500">
              {meeting.topic} • {meeting.participants.length} participantes
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Participant avatars */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-800/30">
        {meeting.participants.map((agentId) => {
          const agent = agents.find(a => a.id === agentId);
          if (!agent) return null;
          return (
            <motion.div
              key={agentId}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 border-slate-700"
              style={{ 
                backgroundColor: agent.avatarColor,
                boxShadow: `0 0 10px ${agent.glowColor}`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              title={agent.name}
            >
              {agent.symbol}
            </motion.div>
          );
        })}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
      >
        <AnimatePresence>
          {meeting.messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-500 py-8"
            >
              <span className="text-2xl mb-2 block">🤫</span>
              <p className="text-sm">Los agentes están reunidos...</p>
              <p className="text-xs text-slate-600 mt-1">Esperando primer mensaje</p>
            </motion.div>
          ) : (
            meeting.messages.map((msg, index) => {
              const agent = agents.find(a => a.id === msg.agentId);
              const isCEO = msg.agentId === 'ceo';
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.agentId === 'ceo' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex gap-2 ${
                    isCEO ? 'flex-row-reverse text-right' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm border-2 border-slate-800"
                    style={{
                      backgroundColor: isCEO ? '#8B5CF6' : agent?.avatarColor || '#475569',
                    }}
                  >
                    {isCEO ? '👑' : agent?.symbol || '🤖'}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
                      isCEO
                        ? 'bg-violet-500/20 text-violet-200'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                    style={{
                      borderLeft: isCEO ? 'none' : `3px solid ${agent?.avatarColor || '#475569'}`,
                      borderRight: isCEO ? `3px solid #8B5CF6` : 'none',
                    }}
                  >
                    <p>{msg.message}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {isCEO ? 'CEO' : agent?.name || 'Agent'} • {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      {canSendAsCEO && (
        <div className="p-3 border-t border-slate-800 bg-slate-800/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribir como CEO..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim()}
              className="p-2 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
