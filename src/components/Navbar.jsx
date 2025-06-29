import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiPlus, FiBarChart3, FiCalendar, FiSettings, FiBriefcase } = FiIcons;

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/add', icon: FiPlus, label: 'Add Entry' },
    { path: '/analytics', icon: FiBarChart3, label: 'Analytics' },
    { path: '/calendar', icon: FiCalendar, label: 'Calendar' },
    { path: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiBriefcase} className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-900">Freelancer Tracker</span>
            </Link>

            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <SafeIcon icon={item.icon} className="text-lg" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center py-2 px-3 min-w-0 flex-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500'
                }`}
              >
                <SafeIcon icon={item.icon} className="text-xl" />
              </motion.div>
              <span className={`text-xs mt-1 ${
                location.pathname === item.path
                  ? 'text-primary-700 font-medium'
                  : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 hidden md:block" />
    </>
  );
};

export default Navbar;