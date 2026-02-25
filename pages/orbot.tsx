import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentAvatar from '../src/components/orbot/AgentAvatar';
import RoundTable from '../src/components/orbot/RoundTable';
import Workstation from '../src/components/orbot/Workstation';
import MeetingChat from '../src/components/orbot/MeetingChat';
import { Agent, AgentId } from '../src/components/orbot/types';
import { TaskRequest } from '../src/services/agentTaskService';

// Initial agents data
const initialAgents: Agent[] = [
  {
    id: 'backend',
    name: 'Backend Expert',
    role: 'Backend Specialist',
    status: 'IDLE',
    position: { x: 15, y: 70 },
    workstationPosition: { x: 15, y: 70 },
    avatarColor: '#8B5CF6',
    symbol: '⚙️',
    glowColor: 'rgba(139, 92, 246, 0.4)',
  },
  {
    id: 'frontend',
    name: 'Frontend Expert',
    role: 'Frontend Specialist',
    status: 'IDLE',
    position: { x: 85, y: 70 },
    workstationPosition: { x: 85, y: 70 },
    avatarColor: '#06B6D4',
    symbol: '⚛️',
    glowColor: 'rgba(6, 182, 212, 0.4)',
  },
  {
    id: 'uiux',
    name: 'UI/UX Expert',
    role: 'UI/UX Specialist',
    status: 'IDLE',
    position: { x: 50, y: 85 },
    workstationPosition: { x: 50, y: 85 },
    avatarColor: '#F59E0B',
    symbol: '🎨',
    glowColor: 'rgba(245, 158, 11, 0.4)',
  },
  {
    id: 'orbit',
    name: 'ORBIT',
    role: 'Orchestrator',
    status: 'IDLE',
    position: { x: 50, y: 25 },
    workstationPosition: { x: 50, y: 25 },
    avatarColor: '#EC4899',
    symbol: '🛰️',
    glowColor: 'rgba(236, 72, 153, 0.4)',
  },
];

// Task assignment panel component
function TaskPanel({ agentId }: { agentId: AgentId }) {
  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState<TaskRequest['type']>('CODE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsSubmitting(true);
    try {
      await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          model: agentId === 'uiux' ? 'kimi' : 'codex',
          prompt,
          taskType: taskType.toLowerCase(),
        }),
      });
      setPrompt('');
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholder = () => {
    switch (agentId) {
      case 'backend':
        return "Ej: Crea una API REST en Node.js con autenticación JWT...";
      case 'frontend':
        return "Ej: Crea un componente React con formulario validado...";
      case 'uiux':
        return "Ej: Diseña un wireframe para landing page de SaaS...";
      default:
        return "Describe la tarea...";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-20 right-4 w-80 bg-slate-900/95 border border-slate-700 rounded-xl p-4 shadow-2xl z-50"
    >
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <span>{agentId === 'backend' ? '⚙️' : agentId === 'frontend' ? '⚛️' : '🎨'}</span>
        Asignar Tarea - {agentId.charAt(0).toUpperCase() + agentId.slice(1)}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          value={taskType}
          onChange={(e) => setTaskType(e.target.value as TaskRequest['type'])}
          className="w-full p-2 bg-slate-800 text-white rounded-lg border border-slate-600 text-sm"
        >
          <option value="CODE">Código</option>
          <option value="DESIGN">Diseño</option>
          <option value="RESEARCH">Investigación</option>
          <option value="ARCHITECTURE">Arquitectura</option>
        </select>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={getPlaceholder()}
          rows={3}
          className="w-full p-3 bg-slate-800 text-white rounded-lg border border-slate-600 text-sm resize-none"
        />
        <button
          type="submit"
          disabled={isSubmitting || !prompt.trim()}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors text-sm"
        >
          {isSubmitting ? 'Enviando...' : 'Ejecutar Tarea'}
        </button>
      </form>
    </motion.div>
  );
}

export default function OrbotPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [meetingActive, setMeetingActive] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentId | null>(null);
  const [taskUpdates, setTaskUpdates] = useState<Record<string, any>>({});

  const convokeMeeting = () => {
    setMeetingActive(true);
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'IN_MEETING',
      position: { x: 50, y: 50 }
    })));
  };

  const dismissMeeting = () => {
    setMeetingActive(false);
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'IDLE',
      position: agent.workstationPosition
    })));
  };

  // Poll for agent task status
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/agents/status');
        if (res.ok) {
          const data = await res.json();
          setTaskUpdates(data.agents || {});
        }
      } catch (e) {
        // Ignore polling errors
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Demo mode - auto toggle every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMeetingActive(prev => {
        const newState = !prev;
        if (newState) {
          setAgents(agents => agents.map(agent => ({
            ...agent,
            status: 'IN_MEETING',
            position: { x: 50, y: 50 }
          })));
        } else {
          setAgents(agents => agents.map(agent => ({
            ...agent,
            status: 'IDLE',
            position: agent.workstationPosition
          })));
        }
        return newState;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-slate-950 min-h-screen overflow-hidden">
      {/* Header */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-50 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">👑 Centro de Comando</h1>
            <p className="text-slate-400 text-sm">Agent Command Center • Powered by ORBIT</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={convokeMeeting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              Convocar Mesa
            </button>
            <button
              onClick={dismissMeeting}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
            >
              Disolver
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main floor */}
      <div className="relative w-full h-screen flex items-center justify-center">
        {/* Workstations */}
        {initialAgents.map((agent) => (
          <Workstation 
            key={`workstation-${agent.id}`}
            agent={agent}
          />
        ))}

        {/* Round Table */}
        <RoundTable isActive={meetingActive} agents={agents} />

        {/* Agent Avatars */}
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            initial={false}
            animate={{
              x: `${agent.position.x - 50}vw`,
              y: `${agent.position.y - 50}vh`,
            }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <AgentAvatar agent={agent} />
          </motion.div>
        ))}

        {/* Meeting Chat */}
        {meetingActive && (
          <MeetingChat 
            meeting={{
              id: '1',
              status: 'ACTIVE',
              participants: agents.map(a => a.id),
              topic: 'Sprint Planning',
              messages: [],
              startTime: new Date(),
            }}
            agents={agents}
            onClose={dismissMeeting}
          />
        )}
      </div>

      {/* Instructions footer */}
      <motion.div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-xs text-slate-500 bg-slate-900/80 px-4 py-2 rounded-full">
          {meetingActive 
            ? '💬 Agentes en reunión • Los avatares se mueven automáticamente' 
            : '⏱️ Modo demo automático activado (cambia cada 8s)'} 
        </p>
      </motion.div>
    </div>
  );
}
