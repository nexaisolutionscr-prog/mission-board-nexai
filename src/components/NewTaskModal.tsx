import React, { useState, useEffect } from 'react';
import { Task } from '../types';

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
    setTask({ id: '', title: '', description: '', priority: 'Low', status: 'To Do' });
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          {initialTask?.id ? 'Editar Tarea' : 'Nueva Tarea'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Título de la tarea"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Descripción detallada..."
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
              <select
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="Low">Baja</option>
                <option value="Medium">Media</option>
                <option value="High">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
              <select
                name="status"
                value={task.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="To Do">Por Hacer</option>
                <option value="In Progress">En Progreso</option>
                <option value="Done">Completado</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
          >
            Guardar
          </button>
          <button
            onClick={closeModal}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
