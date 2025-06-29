import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../context/DataContext';
import ImageUpload from '../components/ImageUpload';
import AIAnalysis from '../components/AIAnalysis';

const { FiBriefcase, FiUsers, FiSave, FiArrowLeft } = FiIcons;

const AddEntry = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addEntry } = useData();

  const [formData, setFormData] = useState({
    type: searchParams.get('type') || 'job',
    company: '',
    position: '',
    url: '',
    location: '',
    contactMethod: '',
    status: 'pending',
    notes: '',
    screenshot: null,
    followUpDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScreenshotUpload = (screenshot) => {
    setFormData(prev => ({
      ...prev,
      screenshot
    }));
    setShowAIAnalysis(true);
  };

  const handleAIAnalysis = (analysisData) => {
    setFormData(prev => ({
      ...prev,
      ...analysisData
    }));
    setShowAIAnalysis(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.company.trim()) {
        toast.error('Company name is required');
        return;
      }

      await addEntry(formData);
      toast.success(`${formData.type === 'job' ? 'Job application' : 'Client lead'} added successfully!`);
      navigate('/');
    } catch (error) {
      toast.error('Failed to add entry');
      console.error('Error adding entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="text-xl" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Entry</h1>
              <p className="text-gray-600">Track a new opportunity or lead</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Entry Type</label>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData(prev => ({ ...prev, type: 'job' }))}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.type === 'job'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.type === 'job' ? 'bg-primary-500' : 'bg-gray-400'
                  }`}>
                    <SafeIcon icon={FiBriefcase} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Job Application</h3>
                    <p className="text-sm text-gray-600">Track job opportunities</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData(prev => ({ ...prev, type: 'lead' }))}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.type === 'lead'
                    ? 'border-success-500 bg-success-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.type === 'lead' ? 'bg-success-500' : 'bg-gray-400'
                  }`}>
                    <SafeIcon icon={FiUsers} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Client Lead</h3>
                    <p className="text-sm text-gray-600">Track potential clients</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Screenshot Upload */}
          <ImageUpload onUpload={handleScreenshotUpload} />

          {/* AI Analysis Modal */}
          {showAIAnalysis && (
            <AIAnalysis
              screenshot={formData.screenshot}
              onAnalysis={handleAIAnalysis}
              onClose={() => setShowAIAnalysis(false)}
            />
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position/Role
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter position or role"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL/Link
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Remote, City, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Method
              </label>
              <select
                name="contactMethod"
                value={formData.contactMethod}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select method</option>
                <option value="email">Email</option>
                <option value="linkedin">LinkedIn</option>
                <option value="website">Website Form</option>
                <option value="phone">Phone</option>
                <option value="referral">Referral</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Date
            </label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <SafeIcon icon={FiSave} />
              <span>{isSubmitting ? 'Adding...' : 'Add Entry'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddEntry;