import { motion, AnimatePresence } from 'framer-motion';
import { Agent, AgentStatus, Position } from './types';
import { useEffect, useState } from 'react';

interface AgentAvatarProps {
  agent: Agent;
  isInMeeting?: boolean;
  onClick?: () => void;
}

// Status-based animations
const statusVariants: Record<AgentStatus, any> = {
  IDLE: {
    scale: 1,
    y: [0, -5, 0],
    transition: {
      y: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
    },
  },
  WORKING: {
    scale: [1, 1.05, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  },
  MOVING_TO_MEETING: {
    scale: 1.1,
    transition: { duration: 0.3 },
  },
  IN_MEETING: {
    scale: 1.15,
    transition: { duration: 0.3 },
  },
  RETURNING: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
};

// Status badge colors
const statusColors: Record<AgentStatus, string> = {
  IDLE: '#94A3B8',
  WORKING: '#10B981',
  MOVING_TO_MEETING: '#F59E0B',
  IN_MEETING: '#3B82F6',
  RETURNING: '#8B5CF6',
};

// Status labels
const statusLabels: Record<AgentStatus, string> = {
  IDLE: 'Esperando',
  WORKING: 'Trabajando',
  MOVING_TO_MEETING: 'Yendo a reunión',
  IN_MEETING: 'En reunión',
  RETURNING: 'Volviendo',
};

export default function AgentAvatar({ agent, isInMeeting = false, onClick }: AgentAvatarProps) {
  const [showSpeech, setShowSpeech] = useState(false);
  const [speechText, setSpeechText] = useState('');

  // Random speech bubbles when working
  useEffect(() => {
    if (agent.status === 'WORKING' && agent.currentTask) {
      const speeches = [
        `Optimizando ${agent.currentTask.description.toLowerCase()}...`,
        `${Math.round(agent.currentTask.progress)}% completado`,
        agent.id === 'backend' ? 'Refactorizando queries...' :
        agent.id === 'frontend' ? 'Ajustando componentes...' :
        'Refinando el diseño...',
      ];
      
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          setSpeechText(speeches[Math.floor(Math.random() * speeches.length)]);
          setShowSpeech(true);
          setTimeout(() => setShowSpeech(false), 3000);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [agent.status, agent.currentTask, agent.id]);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${agent.position.x}%`,
        top: `${agent.position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: agent.status === 'IN_MEETING' ? 50 : 20,
      }}
      animate={{
        ...statusVariants[agent.status],
        left: `${agent.position.x}%`,
        top: `${agent.position.y}%`,
        transition: {
          left: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
          top: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
          ...statusVariants[agent.status].transition,
        },
      }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      layout
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ backgroundColor: agent.glowColor }}
        animate={{
          scale: agent.status === 'IN_MEETING' ? [1, 1.3, 1] : [1, 1.1, 1],
          opacity: agent.status === 'IN_MEETING' ? [0.6, 0.8, 0.6] : [0.4, 0.6, 0.4],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      />

      {/* Avatar container */}
      <div
        className="relative flex items-center justify-center w-16 h-16 rounded-full border-4"
        style={{
          backgroundColor: agent.avatarColor,
          borderColor: statusColors[agent.status],
          boxShadow: `0 0 30px ${agent.glowColor}`,
        }}
      >
        {/* Symbol */}
        <span className="text-2xl">{agent.symbol}</span>

        {/* Status indicator */}
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900"
          style={{ backgroundColor: statusColors[agent.status] }}
          animate={{
            scale: agent.status === 'WORKING' ? [1, 1.2, 1] : 1,
          }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>

      {/* Name label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-medium text-slate-300 bg-slate-900/80 px-2 py-1 rounded-full">
          {agent.name}
        </span>
      </div>

      {/* Status label */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ 
            color: statusColors[agent.status],
            backgroundColor: `${statusColors[agent.status]}20`,
          }}
        >
          {statusLabels[agent.status]}
        </span>
      </div>

      {/* Speech bubble */}
      <AnimatePresence>
        {showSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap max-w-xs z-50"
            style={{ borderLeft: `3px solid ${agent.avatarColor}` }}
          >
            {speechText}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar (when working) */}
      {agent.status === 'WORKING' && agent.currentTask && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-20">
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: agent.avatarColor }}
              initial={{ width: 0 }}
              animate={{ width: `${agent.currentTask.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-[10px] text-slate-400 text-center block mt-1">
            {agent.currentTask.progress}%
          </span>
        </div>
      )}
    </motion.div>
  );
}
