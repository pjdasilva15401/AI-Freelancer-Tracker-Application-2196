import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../context/DataContext';

const { FiDownload, FiUpload, FiTrash2, FiSettings, FiDatabase, FiFileText } = FiIcons;

const Settings = () => {
  const { entries, exportData, exportCSV } = useData();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      exportData();
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      exportCSV();
      toast.success('CSV exported successfully!');
    } catch (error) {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('freelancer-tracker-data');
      window.location.reload();
      toast.success('All data cleared successfully');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your data and preferences</p>
      </motion.div>

      <div className="space-y-8">
        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiDatabase} className="text-primary-500 text-xl" />
              <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Export Data */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportJSON}
                  disabled={isExporting || entries.length === 0}
                  className="flex items-center justify-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SafeIcon icon={FiDownload} className="text-primary-500" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Export as JSON</p>
                    <p className="text-sm text-gray-600">Complete data backup</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportCSV}
                  disabled={isExporting || entries.length === 0}
                  className="flex items-center justify-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-success-500 hover:bg-success-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SafeIcon icon={FiFileText} className="text-success-500" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Export as CSV</p>
                    <p className="text-sm text-gray-600">Spreadsheet format</p>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Data Stats */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Data Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">Job Applications</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {entries.filter(e => e.type === 'job').length}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">Client Leads</p>
                  <p className="text-2xl font-bold text-success-600">
                    {entries.filter(e => e.type === 'lead').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Clear Data */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiTrash2} className="text-red-500 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900">Clear All Data</h4>
                    <p className="text-sm text-red-700 mb-4">
                      This will permanently delete all your entries. This action cannot be undone.
                    </p>
                    <button
                      onClick={handleClearData}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* App Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiSettings} className="text-primary-500 text-xl" />
              <h2 className="text-xl font-semibold text-gray-900">About</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Freelancer Tracker</h3>
                <p className="text-sm text-gray-600">Version 1.0.0</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• AI-powered screenshot analysis</li>
                  <li>• Job application and client lead tracking</li>
                  <li>• Interactive analytics and calendar views</li>
                  <li>• Data export functionality</li>
                  <li>• Local storage for privacy</li>
                </ul>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Built with React, Tailwind CSS, and modern web technologies.
                  All data is stored locally in your browser for maximum privacy.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;