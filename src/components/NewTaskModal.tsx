import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../types';
import { X, Plus } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  closeModal: () => void;
  saveTask: (task: Task) => void;
  initialTask?: Task;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, closeModal, saveTask, initialTask }) => {
  const [task, setTask] = useState<Task>({
    id: '',
    title: '',
    description: '',
    priority: 'Low',
    status: 'To Do',
    ...initialTask
  });

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    }
  }, [initialTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!task.title.trim()) {
      alert('El título es obligatorio');
      return;
    }
    saveTask(task);
    setTask({ id: '', title: '', description: '', priority: 'Low', status: 'To Do', assignee: 'none' });
    closeModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 border border-white/20 dark:border-gray-700/50 p-6 rounded-2xl shadow-2xl max-w-md w-full"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {initialTask?.id ? 'Editar Tarea' : 'Nueva Tarea'}
                </h2>
              </div>
              
              <div className="space-y-4">
                {/* Title Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Título <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    placeholder="Ej: Revisar propuesta de cliente"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </motion.div>

                {/* Description Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    placeholder="Agrega detalles sobre esta tarea..."
                    rows={3}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </motion.div>

                {/* Priority & Status Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Prioridad
                    </label>
                    <select
                      name="priority"
                      value={task.priority}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    >
                      <option value="Low">🟢 Baja</option>
                      <option value="Medium">🟡 Media</option>
                      <option value="High">🔴 Alta</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Estado
                    </label>
                    <select
                      name="status"
                      value={task.status}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    >
                      <option value="To Do">📝 Por Hacer</option>
                      <option value="In Progress">⚡ En Progreso</option>
                      <option value="Done">✅ Completado</option>
                    </select>
                  </motion.div>
                </div>
              </div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3 mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all"
                >
                  {initialTask?.id ? 'Actualizar' : 'Crear Tarea'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold transition-all"
                >
                  Cancelar
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewTaskModal;
