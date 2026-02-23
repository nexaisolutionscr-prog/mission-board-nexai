import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Bot,
  FolderOpen,
  Brain,
  Moon,
  Sun,
  Target
} from 'lucide-react';

interface NavigationProps {
  activeModule: 'dashboard' | 'asistente' | 'documentos' | 'memoria';
  isDark: boolean;
  toggleDarkMode: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { id: 'asistente', label: 'Asistente', href: '/asistente', icon: Bot },
  { id: 'documentos', label: 'Documentos', href: '/documentos', icon: FolderOpen },
  { id: 'memoria', label: 'Memoria', href: '/memoria', icon: Brain },
];

const Navigation: React.FC<NavigationProps> = ({ activeModule, isDark, toggleDarkMode }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-b border-white/20 dark:border-gray-700/50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg"
            >
              <Target className="w-6 h-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Mission Board
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">NexAI Solutions</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden md:inline font-medium text-sm">{item.label}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2.5 backdrop-blur-md bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 rounded-xl shadow-lg border border-white/20 dark:border-gray-600/50 transition-all"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navigation;
