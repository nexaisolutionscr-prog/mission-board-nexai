import React, { useState } from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  allTasks: Task[];
}

const TaskCard: React.FC<TaskCardProps> = ({ task, setTasks, allTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const priorityColors = {
    High: 'bg-red-100 text-red-800 border-red-300',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Low: 'bg-green-100 text-green-800 border-green-300'
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

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
      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md border-2 border-blue-400">
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          className="w-full mb-2 p-2 border rounded dark:bg-gray-600 dark:text-white"
          placeholder="Título"
        />
        <textarea
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          className="w-full mb-2 p-2 border rounded dark:bg-gray-600 dark:text-white text-sm"
          placeholder="Descripción"
          rows={2}
        />
        <select
          value={editedTask.priority}
          onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
          className="w-full mb-2 p-2 border rounded dark:bg-gray-600 dark:text-white"
        >
          <option value="High">Alta</option>
          <option value="Medium">Media</option>
          <option value="Low">Baja</option>
        </select>
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Guardar</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-move border border-gray-200 dark:border-gray-600"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 dark:text-white flex-1">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority as keyof typeof priorityColors] || 'bg-gray-100'}`}>
          {task.priority}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{task.description}</p>
      <div className="flex gap-2 justify-end">
        <button 
          onClick={() => setIsEditing(true)}
          className="text-blue-600 dark:text-blue-400 text-xs hover:underline"
        >
          Editar
        </button>
        <button 
          onClick={handleDelete}
          className="text-red-600 dark:text-red-400 text-xs hover:underline"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
