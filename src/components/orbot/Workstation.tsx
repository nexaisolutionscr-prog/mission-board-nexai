import { motion } from 'framer-motion';
import { Agent } from './types';
import { Terminal, Monitor, Palette, Satellite } from 'lucide-react';

interface WorkstationProps {
  agent: Agent;
}

const workstationIcons: Record<string, any> = {
  backend: Terminal,
  frontend: Monitor,
  uiux: Palette,
  orbit: Satellite,
};

const workstationLabels: Record<string, string> = {
  backend: '🖥️ Terminal / Logs / API Design',
  frontend: '💻 VS Code / Component Preview',
  uiux: '📐 Figma / Wireframes / Design System',
  orbit: '🛰️ Command Center / Orchestration',
};

export default function Workstation({ agent }: WorkstationProps) {
  const Icon = workstationIcons[agent.id] || Monitor;
  
  // Calculate position
  const isRight = agent.workstationPosition.x > 50;
  const isBottom = agent.workstationPosition.y > 50;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${agent.workstationPosition.x}%`,
        top: `${agent.workstationPosition.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Workstation glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl blur-xl"
        style={{
          backgroundColor: agent.glowColor,
          width: '180px',
          height: '120px',
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
        }}
        animate={{
          opacity: agent.status === 'WORKING' ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1],
        }}
        transition={{ repeat: Infinity, duration: 3 }}
      />

      {/* Station platform */}
      <motion.div
        className="relative w-40 h-24 rounded-xl flex flex-col items-center justify-center p-2"
        style={{
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          border: `2px solid ${agent.status === 'IDLE' ? 'rgba(148, 163, 184, 0.3)' : agent.avatarColor}40`,
          boxShadow: `0 0 30px ${agent.glowColor}30, inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Screen area */}
        <div
          className="w-32 h-12 rounded-lg flex items-center justify-center mb-1 overflow-hidden"
          style={{
            background: agent.status === 'WORKING' ? '#020617' : '#0f172a',
            border: `1px solid ${agent.avatarColor}30`,
          }}
        >
          {agent.status === 'WORKING' && agent.currentTask ? (
            <motion.div
              className="flex flex-col items-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Icon className="w-4 h-4 mb-0.5" style={{ color: agent.avatarColor }} />
              <span className="text-[8px] text-slate-400 truncate w-28 text-center">
                {agent.currentTask.description}
              </span>
            </motion.div>
          ) : (
            <Icon className="w-5 h-5 text-slate-600" />
          )}
        </div>

        {/* Status indicator strip */}
        <div
          className="w-32 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: '#1e293b' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: agent.status === 'WORKING' ? agent.avatarColor : '#475569' }}
            animate={{
              width:
                agent.status === 'WORKING' && agent.currentTask
                  ? `${agent.currentTask.progress}%`
                  : '100%',
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Label */}
        <span className="mt-1 text-[9px] text-slate-500 text-center px-1">
          {workstationLabels[agent.id]}
        </span>
      </motion.div>

      {/* Connection line to agent position (shown when agent moves) */}
      {agent.status === 'MOVING_TO_MEETING' || agent.status === 'RETURNING' ? (
        <svg
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            width: '100vw',
            height: '100vh',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.line
            x1="50%"
            y1="50%"
            x2={agent.status === 'MOVING_TO_MEETING' ? '50%' : '50%'}
            y2={agent.status === 'MOVING_TO_MEETING' ? '50%' : '50%'}
            stroke={agent.avatarColor}
            strokeWidth="2"
            strokeDasharray="5 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 0.8 }}
          />
        </svg>
      ) : null}
    </motion.div>
  );
}
