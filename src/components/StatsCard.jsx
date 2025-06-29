import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';

const StatsCard = ({ title, value, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    danger: 'from-danger-500 to-danger-600'
  };

  const bgClasses = {
    primary: 'from-primary-50 to-primary-100',
    success: 'from-success-50 to-success-100',
    warning: 'from-warning-50 to-warning-100',
    danger: 'from-danger-50 to-danger-100'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${bgClasses[color]} rounded-xl p-6 border border-gray-200 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <SafeIcon icon={icon} className="text-white text-xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;