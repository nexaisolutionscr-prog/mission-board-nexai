import React from 'react';

const TaskCard = () => (
  <div className='task-card'>
    <div className='task-card'>
    <p>{task.description}</p>
    <button onClick={() => onUpdate(task.id)}>Complete</button>
  </div>
  </div>
);

export default TaskCard;