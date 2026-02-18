import { useEffect } from 'react';

function useDarkMode() {
  useEffect(() => {
    const isDarkMode = window.localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const isDarkMode = window.localStorage.getItem('darkMode') === 'true';
    window.localStorage.setItem('darkMode', (!isDarkMode).toString());
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return { toggleDarkMode };
}

export default useDarkMode;