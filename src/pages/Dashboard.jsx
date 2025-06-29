import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../context/DataContext';
import EntryCard from '../components/EntryCard';
import StatsCard from '../components/StatsCard';

const { FiPlus, FiBriefcase, FiUsers, FiTrendingUp, FiClock } = FiIcons;

const Dashboard = () => {
  const { getFilteredEntries, getStats } = useData();
  const entries = getFilteredEntries();
  const stats = getStats();
  const recentEntries = entries.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Track your freelance opportunities and progress</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Entries"
          value={stats.total}
          icon={FiTrendingUp}
          color="primary"
        />
        <StatsCard
          title="Job Applications"
          value={stats.jobApplications}
          icon={FiBriefcase}
          color="success"
        />
        <StatsCard
          title="Client Leads"
          value={stats.clientLeads}
          icon={FiUsers}
          color="warning"
        />
        <StatsCard
          title="Pending"
          value={stats.statusCounts.pending || 0}
          icon={FiClock}
          color="danger"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/add?type=job">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg hover:from-primary-100 hover:to-primary-200 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center mr-4">
                  <SafeIcon icon={FiBriefcase} className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add Job Application</h3>
                  <p className="text-sm text-gray-600">Track a new job opportunity</p>
                </div>
              </motion.div>
            </Link>
            <Link to="/add?type=lead">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-lg hover:from-success-100 hover:to-success-200 transition-colors"
              >
                <div className="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center mr-4">
                  <SafeIcon icon={FiUsers} className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add Client Lead</h3>
                  <p className="text-sm text-gray-600">Track potential client outreach</p>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Recent Entries */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Entries</h2>
              <Link
                to="/add"
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="mr-2" />
                Add Entry
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentEntries.length > 0 ? (
              <div className="space-y-4">
                {recentEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SafeIcon icon={FiBriefcase} className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
                <p className="text-gray-600 mb-6">Start tracking your freelance opportunities</p>
                <Link
                  to="/add"
                  className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="mr-2" />
                  Add Your First Entry
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;