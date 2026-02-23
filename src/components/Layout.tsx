import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import useDarkMode from '../hooks/useDarkMode';

interface LayoutProps {
  children: React.ReactNode;
  activeModule?: 'dashboard' | 'asistente' | 'documentos' | 'memoria';
}

const Layout: React.FC<LayoutProps> = ({ children, activeModule = 'dashboard' }) => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-500">
      <Navigation activeModule={activeModule} isDark={isDark} toggleDarkMode={toggleDarkMode} />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-20 pb-8 px-4 md:px-8"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
