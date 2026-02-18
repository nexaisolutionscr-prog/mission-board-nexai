export const loadTasks = () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : { jose: [], orbit: [] };
};

export const saveTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};