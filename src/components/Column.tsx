import React from 'react';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
}

const Column: React.FC<ColumnProps> = ({ column }) => {
  return (
    <div className='column bg-gray-200 p-4 rounded-lg shadow space-y-4'>
      <h2 className='text-lg font-bold'>{column.title}</h2>
      <div className='task-list space-y-2'>
        {column.tasks.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;