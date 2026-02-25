import { motion } from 'framer-motion';
import { MeetingSession, Agent, MEETING_POSITIONS } from './types';
import AgentAvatar from './AgentAvatar';
import { Users } from 'lucide-react';

interface RoundTableProps {
  meeting?: MeetingSession | null;
  agents: Agent[];
  isActive: boolean;
}

export default function RoundTable({ meeting, agents, isActive }: RoundTableProps) {
  const meetingAgents = agents.filter(agent => 
    agent.status === 'IN_MEETING' || agent.status === 'MOVING_TO_MEETING'
  );

  return (
    <motion.div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isActive ? 1 : 0.8,
        opacity: isActive ? 1 : 0.3,
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Table glow when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            width: '300px',
            height: '300px',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
      )}

      {/* Table base */}
      <motion.div
        className="relative w-48 h-48 rounded-full flex items-center justify-center"
        style={{
          background: isActive
            ? 'linear-gradient(145deg, #1e293b, #0f172a)'
            : 'linear-gradient(145deg, #0f172a, #020617)',
          border: isActive
            ? '3px solid rgba(59, 130, 246, 0.5)'
            : '2px solid rgba(148, 163, 184, 0.2)',
          boxShadow: isActive
            ? '0 0 50px rgba(59, 130, 246, 0.3), inset 0 0 30px rgba(59, 130, 246, 0.1)'
            : '0 0 20px rgba(0, 0, 0, 0.5)',
        }}
        whileHover={isActive ? { scale: 1.02 } : {}}
      >
        {/* Inner pattern */}
        <div
          className="absolute inset-2 rounded-full border-2 border-dashed opacity-30"
          style={{
            borderColor: isActive ? '#3B82F6' : '#475569',
          }}
        />

        {/* Center icon or content */}
        <div className="text-center z-10">
          {isActive ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-1" />
              <span className="text-xs text-blue-300 font-medium">
                {meeting?.topic || 'Reunión activa'}
              </span>
            </motion.div>
          ) : (
            <div className="text-slate-600">
              <span className="text-2xl">🪑</span>
              <span className="block text-xs mt-1">Mesa de Consejo</span>
            </div>
          )}
        </div>

        {/* Chair positions indicator */}
        {isActive && meetingAgents.map((agent, index) => {
          const angle = (index * (360 / meetingAgents.length)) - 90;
          const radius = 110;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <motion.div
              key={agent.id}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: agent.avatarColor,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            />
          );
        })}
      </motion.div>

      {/* Meeting status indicator */}
      {isActive && meeting && (
        <motion.div
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-xs text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/30">
            {meeting.participants.length} agentes reunidos • {meeting.messages.length} mensajes
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
