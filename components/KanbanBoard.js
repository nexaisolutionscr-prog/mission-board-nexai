import React, { useState, useEffect } from 'react';
import { loadTasks, saveTasks } from '../utils/localStorageUtils';
import Column from './Column';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({ jose: [], orbit: [] });

  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  const handleTaskUpdate = (newTasks) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  return (
    <div className='kanban-board'>
      <Column status='Todo' />
      <Column status='InProgress' />
      <Column status='Done' />
    </div>
  );
};

export default KanbanBoard;
