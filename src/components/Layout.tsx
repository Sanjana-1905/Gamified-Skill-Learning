import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <BookOpen className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Gamified Skill Learning</span>
              </div>
            </div>
            {user && (
              <nav className="flex items-center space-x-6">
                <DarkModeToggle />
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <span className="text-base font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 capitalize">{user.role}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-semibold">Logout</span>
                </motion.button>
              </nav>
            )}
          </div>
        </div>
      </header>
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 min-h-[70vh] transition-colors duration-300">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default Layout;