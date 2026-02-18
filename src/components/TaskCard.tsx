import React from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className='task-card bg-white p-3 rounded-lg shadow hover:shadow-md transition duration-200 ease-in-out'>
      <h3 className='text-md font-semibold'>{task.title}</h3>
      <p className='text-sm'>{task.description}</p>
      <span className='badge' style={{ backgroundColor: task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'yellow' : 'green' }}>{task.priority}</span>
    </div>
  );
};

export default TaskCard;