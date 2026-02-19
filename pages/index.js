import React, { useState } from 'react';
import Column from '../src/components/Column';
import NewTaskModal from '../src/components/NewTaskModal';
import useLocalStorage from '../src/hooks/useLocalStorage';
import useDarkMode from '../src/hooks/useDarkMode';

const Home = () => {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [modalOpen, setModalOpen] = useState(false);
  const { toggleDarkMode } = useDarkMode();

  const columns = [
    { title: 'To Do', tasks: tasks.filter((task) => task.status === 'To Do') },
    { title: 'In Progress', tasks: tasks.filter((task) => task.status === 'In Progress') },
    { title: 'Done', tasks: tasks.filter((task) => task.status === 'Done') }
  ];

  const addTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: Date.now().toString(),
      status: newTask.status || 'To Do'
    };
    setTasks([...tasks, taskWithId]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Mission Board
        </h1>
        <div className="flex gap-4">
          <button
            onClick={toggleDarkMode}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            🌓
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            + Nueva Tarea
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <Column key={column.title} column={column} setTasks={setTasks} allTasks={tasks} />
        ))}
      </div>

      <NewTaskModal
        isOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        saveTask={addTask}
        initialTask={{
          id: '',
          title: '',
          description: '',
          priority: 'Low',
          status: 'To Do'
        }}
      />
    </div>
  );
};

export default Home;
