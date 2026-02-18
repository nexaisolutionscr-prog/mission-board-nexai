import React from 'react';
import Column from './components/Column';
import NewTaskModal from './components/NewTaskModal';
import useLocalStorage from './hooks/useLocalStorage';
import useDarkMode from './hooks/useDarkMode';
import { Task, Column as ColumnType } from './types';

const App: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [modalOpen, setModalOpen] = React.useState(false);
  useDarkMode();

  const columns: ColumnType[] = [
    { title: 'To Do', tasks: tasks.filter((task: Task) => task.status === 'To Do') },
    { title: 'In Progress', tasks: tasks.filter((task: Task) => task.status === 'In Progress') },
    { title: 'Done', tasks: tasks.filter((task: Task) => task.status === 'Done') }
  ];

  return (
    <div className='App'>
      {columns.map((column: ColumnType) => <Column key={column.title} column={column} />)}
      <NewTaskModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} saveTask={setTasks} initialTask={{ id: '', title: '', description: '', priority: 'Low', status: 'To Do' }} />
    </div>
  );
};

export default App;