import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Moon, Sun, Plus, Loader2 } from 'lucide-react';
import Column from '../src/components/Column';
import NewTaskModal from '../src/components/NewTaskModal';
import CostTracker from '../src/components/CostTracker';
import { useKVTasks } from '../src/hooks/useKVTasks';
import useDarkMode from '../src/hooks/useDarkMode';

const Home = () => {
  const { tasks, setTasks, loading, error } = useKVTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const { isDark, toggleDarkMode } = useDarkMode();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { title: 'To Do', tasks: tasks.filter((task) => task.status === 'To Do') },
    { title: 'In Progress', tasks: tasks.filter((task) => task.status === 'In Progress') },
    { title: 'Done', tasks: tasks.filter((task) => task.status === 'Done') }
  ];

  const addTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: Date.now().toString(),
      status: newTask.status || 'To Do',
      assignee: newTask.assignee || 'none'
    };
    setTasks([...tasks, taskWithId]);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const columnTitles = ['To Do', 'In Progress', 'Done'];
    if (columnTitles.includes(over.id)) {
      if (activeTask.status !== over.id) {
        setTasks(tasks.map(task => task.id === active.id ? { ...task, status: over.id } : task ));
      }
    }

    const overTask = tasks.find(t => t.id === over.id);
    if (overTask && activeTask.status !== overTask.status) {
      setTasks(tasks.map(task => task.id === active.id ? { ...task, status: overTask.status } : task ));
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const columnTitles = ['To Do', 'In Progress', 'Done'];
    if (columnTitles.includes(over.id)) {
      if (activeTask.status !== over.id) {
        setTasks(tasks.map(task => task.id === active.id ? { ...task, status: over.id } : task ));
      }
      return;
    }

    const overTask = tasks.find(t => t.id === over.id);
    if (overTask && activeTask.status === overTask.status) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white/80 rounded-2xl shadow-xl max-w-md">
          <p className="text-rose-600 font-semibold mb-2">Error al cargar</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8 transition-all duration-500">
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <span className="text-3xl">🎯</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Mission Board</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'} en total</p>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleDarkMode} className="p-3 backdrop-blur-md bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 rounded-xl shadow-lg border border-white/20 dark:border-gray-600/50 transition-all">
                {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 font-semibold transition-all">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nueva Tarea</span>
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Cost Tracker */}
        <CostTracker />

        {/* Columns Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <Column key={column.title} column={column} setTasks={setTasks} allTasks={tasks} />
          ))}
        </motion.div>

        {/* Modal */}
        <NewTaskModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} saveTask={addTask} initialTask={{ id: '', title: '', description: '', priority: 'Low', status: 'To Do', assignee: 'none' }} />

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-blue-500 rounded-2xl p-4 shadow-2xl rotate-3 scale-105">
              <h3 className="font-semibold text-gray-900 dark:text-white">{activeTask.title}</h3>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default Home;
