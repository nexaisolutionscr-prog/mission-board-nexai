import { motion } from 'framer-motion';
import { Users, XCircle, Play, RotateCcw, MessageSquare } from 'lucide-react';

interface ControlPanelProps {
  onConvokeMeeting: () => void;
  onDismissMeeting: () => void;
  onStartDemo: () => void;
  onReset: () => void;
  isMeetingActive: boolean;
  isDemoRunning: boolean;
}

export default function ControlPanel({
  onConvokeMeeting,
  onDismissMeeting,
  onStartDemo,
  onReset,
  isMeetingActive,
  isDemoRunning,
}: ControlPanelProps) {
  return (
    <motion.div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl">
        {/* Title */}
        <div className="px-4 border-r border-slate-700">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Panel CEO
          </span>
        </div>

        {/* Main Actions */}
        {!isMeetingActive ? (
          <motion.button
            onClick={onConvokeMeeting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Convocar Mesa Redonda</span>
          </motion.button>
        ) : (
          <motion.button
            onClick={onDismissMeeting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Disolver Reunión</span>
          </motion.button>
        )}

        {/* Divider */}
        <div className="w-px h-8 bg-slate-700 mx-1" />

        {/* Demo Controls */}
        <motion.button
          onClick={onStartDemo}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isDemoRunning}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-colors ${
            isDemoRunning
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>{isDemoRunning ? 'Demo activo...' : 'Demo Automático'}</span>
        </motion.button>

        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </motion.button>
      </div>

      {/* Instructions */}
      <motion.div
        className="text-center mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-[10px] text-slate-500">
          {isMeetingActive
            ? '💬 Chat abierto para discusión • Click en Disolver para finalizar'
            : '👆 Click en Convocar para reunir agentes • Demo para ver automatización'}
        </p>
      </motion.div>
    </motion.div>
  );
}
