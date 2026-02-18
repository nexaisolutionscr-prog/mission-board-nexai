import React from 'react';
import KanbanBoard from '../components/KanbanBoard';

const Home = () => (
  <div className='container mx-auto p-4'>
    <h1 className='text-center text-lg font-bold'>Mission Board</h1>
    <KanbanBoard />
    <ProgressBar progress={tasks.filter(task => task.status === 'Done').length / tasks.length * 100} />
  </div>
);

export default Home;