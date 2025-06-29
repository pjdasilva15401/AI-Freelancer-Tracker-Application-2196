import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiZap, FiCheck } = FiIcons;

const AIAnalysis = ({ screenshot, onAnalysis, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      // Mock AI analysis result
      const mockResult = {
        company: 'TechCorp Inc.',
        position: 'Senior Frontend Developer',
        location: 'Remote',
        contactMethod: 'email',
        notes: 'Looking for React/Next.js expertise. Great benefits package mentioned.'
      };
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    onAnalysis(analysisResult);
  };

  const handleReject = () => {
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiZap} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Analysis</h2>
                <p className="text-gray-600">Extracting information from screenshot</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Screenshot Preview */}
          <div className="mb-6">
            <img
              src={screenshot}
              alt="Screenshot for analysis"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
            />
          </div>

          {isAnalyzing ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Screenshot</h3>
              <p className="text-gray-600">Our AI is extracting job/client details...</p>
              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <p>🔍 Scanning for company information</p>
                <p>📋 Identifying job requirements</p>
                <p>📍 Extracting location details</p>
                <p>💼 Processing contact information</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <SafeIcon icon={FiCheck} className="text-success-500" />
                  <h3 className="text-lg font-medium text-gray-900">Analysis Complete</h3>
                </div>
                <p className="text-gray-600">
                  We've extracted the following information from your screenshot:
                </p>
              </div>

              {/* Analysis Results */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <p className="text-gray-900">{analysisResult.company}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <p className="text-gray-900">{analysisResult.position}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <p className="text-gray-900">{analysisResult.location}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Method</label>
                    <p className="text-gray-900 capitalize">{analysisResult.contactMethod}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <p className="text-gray-900">{analysisResult.notes}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAccept}
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Use This Information
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Enter Manually
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIAnalysis;