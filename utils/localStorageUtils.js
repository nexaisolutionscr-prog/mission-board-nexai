export const loadTasks = () => {
  if (typeof window === 'undefined') return { jose: [], orbit: [] };
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : { jose: [], orbit: [] };
};

export const saveTasks = (tasks) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('tasks', JSON.stringify(tasks));
};
