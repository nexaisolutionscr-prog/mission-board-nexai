import React from 'react';
import KanbanBoard from '../components/KanbanBoard';
import ProgressBar from '../components/ProgressBar';
import { loadTasks } from '../utils/localStorageUtils';

const Home = () => {
  const tasks = loadTasks();
  const doneTasks = tasks ? Object.values(tasks).flat().filter(t => t.status === 'Done').length : 0;
  const totalTasks = tasks ? Object.values(tasks).flat().length : 0;
  const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-center text-lg font-bold'>Mission Board</h1>
      <ProgressBar progress={progress} />
      <KanbanBoard />
    </div>
  );
};

export default Home;
