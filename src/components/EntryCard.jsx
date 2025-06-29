import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';

const { FiBriefcase, FiUsers, FiExternalLink, FiEdit2, FiTrash2, FiCalendar, FiMapPin } = FiIcons;

const EntryCard = ({ entry }) => {
  const { updateEntry, deleteEntry } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: entry.status,
    notes: entry.notes || ''
  });

  const statusColors = {
    pending: 'bg-warning-100 text-warning-800',
    applied: 'bg-primary-100 text-primary-800',
    interview: 'bg-purple-100 text-purple-800',
    rejected: 'bg-danger-100 text-danger-800',
    accepted: 'bg-success-100 text-success-800'
  };

  const typeColors = {
    job: 'bg-primary-500',
    lead: 'bg-success-500'
  };

  const handleSave = () => {
    updateEntry(entry.id, editData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(entry.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${typeColors[entry.type]} rounded-lg flex items-center justify-center`}>
            <SafeIcon 
              icon={entry.type === 'job' ? FiBriefcase : FiUsers} 
              className="text-white text-lg" 
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{entry.company}</h3>
            {entry.position && (
              <p className="text-sm text-gray-600">{entry.position}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
              >
                <SafeIcon icon={FiEdit2} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-danger-500 transition-colors"
              >
                <SafeIcon icon={FiTrash2} />
              </motion.button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <SafeIcon icon={FiCalendar} />
          <span>{format(new Date(entry.createdAt), 'MMM dd, yyyy')}</span>
        </div>
        {entry.location && (
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiMapPin} />
            <span>{entry.location}</span>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={editData.notes}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add notes..."
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[entry.status]}`}>
              {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
            </span>
            {entry.url && (
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-primary-500 hover:text-primary-700 transition-colors"
              >
                <SafeIcon icon={FiExternalLink} />
                <span className="text-sm">View</span>
              </a>
            )}
          </div>
          
          {entry.notes && (
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {entry.notes}
            </p>
          )}
          
          {entry.screenshot && (
            <div className="mt-3">
              <img
                src={entry.screenshot}
                alt="Screenshot"
                className="w-full h-32 object-cover rounded-lg cursor-pointer"
                onClick={() => window.open(entry.screenshot, '_blank')}
              />
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default EntryCard;