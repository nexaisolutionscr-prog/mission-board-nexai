import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, ASSIGNEES } from '../types';
import { GripVertical, AlertCircle, Clock, CheckCircle2, Trash2, Pencil, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  allTasks: Task[];
}

const priorityConfig = {
  High: {
    color: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500',
    label: 'Alta',
    icon: AlertCircle
  },
  Medium: {
    color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    label: 'Media',
    icon: Clock
  },
  Low: {
    color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    label: 'Baja',
    icon: CheckCircle2
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, setTasks, allTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({
    ...task,
    assignee: task.assignee || 'none'
  });
  
  const assignee = ASSIGNEES[task.assignee || 'none'];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.Low;
  const PriorityIcon = priority.icon;

  const handleDelete = () => {
    if (confirm('¿Eliminar esta tarea?')) {
      setTasks(allTasks.filter(t => t.id !== task.id));
    }
  };

  const handleSave = () => {
    setTasks(allTasks.map(t => t.id === task.id ? editedTask : t));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border border-white/30 dark:border-gray-700/50 rounded-2xl p-4 shadow-2xl"
      >
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          className="w-full mb-3 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          placeholder="Título"
        />
        <textarea
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          className="w-full mb-3 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm resize-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          placeholder="Descripción"
          rows={2}
        />
        <select
          value={editedTask.priority}
          onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as 'High' | 'Medium' | 'Low' })}
          className="w-full mb-3 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
        >
          <option value="High">Alta</option>
          <option value="Medium">Media</option>
          <option value="Low">Baja</option>
        </select>
        <select value={editedTask.assignee} onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value as 'jose' | 'orbit' | 'none' })} className="w-full mb-3 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" >
          <option value="jose">👤 Jose</option>
          <option value="orbit">🛰️ ORBIT</option>
          <option value="none">❓ Sin asignar</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25"
          >
            Guardar
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl font-medium transition-all"
          >
            Cancelar
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`
        group relative
        backdrop-blur-md bg-white/80 dark:bg-gray-800/80
        border border-white/20 dark:border-gray-700/50
        rounded-2xl p-4
        shadow-lg hover:shadow-2xl hover:shadow-blue-500/10
        transition-all duration-300 cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 rotate-2 scale-105 shadow-2xl ring-2 ring-blue-500/50' : ''}
      `}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Priority Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border mb-3 ${priority.color}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
        <PriorityIcon className="w-3 h-3" />
        {priority.label}
      </motion.div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 pr-6 line-clamp-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex -space-x-2">
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${assignee.color} border-2 border-white dark:border-gray-800 flex items-center justify-center`}>
            <span className="text-[10px] font-bold text-white">{assignee.avatar}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
          >
            <Pencil className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
