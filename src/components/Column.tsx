import React from 'react';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  allTasks: Task[];
}

const Column: React.FC<ColumnProps> = ({ column, setTasks, allTasks }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      setTasks(allTasks.map(task => 
        task.id === taskId ? { ...task, status: column.title } : task
      ));
    }
  };

  return (
    <div 
      className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-md min-h-[500px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">{column.title}</h2>
        <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">
          {column.tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {column.tasks.map((task: Task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            setTasks={setTasks}
            allTasks={allTasks}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
