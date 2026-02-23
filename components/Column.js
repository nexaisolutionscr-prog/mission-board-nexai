import React from 'react';
import TaskCard from './TaskCard';

const Column = ({ status, tasks = [], onUpdate }) => (
  <div className={`column ${status.toLowerCase()}`}>
    <h2>{status}</h2>
    {tasks.map(task => (
      <TaskCard key={task.id} task={task} onUpdate={onUpdate} />
    ))}
  </div>
);

export default Column;
