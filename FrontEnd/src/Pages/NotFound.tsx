import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookX, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-indigo-600 dark:text-amber-300 mb-8"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <BookX size={120} />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-indigo-800 dark:text-amber-300 mb-4">
          404
        </h1>
        <p className="text-xl md:text-2xl text-indigo-800/80 dark:text-amber-300 mb-8">
          Oops! The page you're looking for isn't in our library.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-indigo-600 dark:bg-amber-300 text-white dark:text-gray-800 text-lg font-semibold rounded-full hover:bg-indigo-700 dark:hover:bg-amber-400 transition-all duration-300 group"
        >
          <Home className="mr-2" size={24} />
          Return Home
          <motion.span
            className="ml-2"
            initial={{ x: 0 }}
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1, repeatDelay: 0.5 }}
          >
            →
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

