import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: { title: string; tasks: Task[] };
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  allTasks: Task[];
}

const columnConfig: Record<string, { 
  gradient: string; 
  icon: string; 
  bgGradient: string;
  borderColor: string;
}> = {
  'To Do': {
    gradient: 'from-slate-500 to-slate-600',
    icon: '📝',
    bgGradient: 'from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50',
    borderColor: 'border-slate-200 dark:border-slate-700'
  },
  'In Progress': {
    gradient: 'from-blue-500 to-indigo-600',
    icon: '⚡',
    bgGradient: 'from-blue-50 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-800/50',
    borderColor: 'border-blue-200 dark:border-blue-700'
  },
  'Done': {
    gradient: 'from-emerald-500 to-teal-600',
    icon: '✅',
    bgGradient: 'from-emerald-50 to-teal-100 dark:from-emerald-900/50 dark:to-teal-800/50',
    borderColor: 'border-emerald-200 dark:border-emerald-700'
  }
};

const Column: React.FC<ColumnProps> = ({ column, setTasks, allTasks }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.title
  });

  const config = columnConfig[column.title] || columnConfig['To Do'];
  const taskIds = column.tasks.map(task => task.id);

  return (
    <div
      ref={setNodeRef}
      className={`
        relative
        backdrop-blur-sm bg-gradient-to-br ${config.bgGradient}
        border ${config.borderColor}
        rounded-2xl p-4
        shadow-xl
        transition-all duration-300
        min-h-[600px]
        ${isOver ? 'ring-2 ring-blue-500 ring-offset-2 scale-[1.02]' : ''}
      `}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          bg-gradient-to-r ${config.gradient}
          rounded-xl p-4 mb-4
          shadow-lg
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <h2 className="text-lg font-bold text-white">
              {column.title}
            </h2>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <span className="text-sm font-bold text-white">
              {column.tasks.length}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Drop Zone Indicator */}
      {isOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute inset-0 rounded-2xl border-4 border-dashed border-blue-500 bg-blue-500/5 pointer-events-none z-10"
        >
          <div className="flex items-center justify-center h-full">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-2xl font-semibold">
              Soltar aquí
            </div>
          </div>
        </motion.div>
      )}

      {/* Tasks */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          <AnimatePresence>
            {column.tasks.map((task: Task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                setTasks={setTasks}
                allTasks={allTasks}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>

      {/* Empty State */}
      {column.tasks.length === 0 && !isOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600"
        >
          <div className="text-6xl mb-4 opacity-50">{config.icon}</div>
          <p className="text-sm font-medium">Sin tareas</p>
        </motion.div>
      )}
    </div>
  );
};

export default Column;
