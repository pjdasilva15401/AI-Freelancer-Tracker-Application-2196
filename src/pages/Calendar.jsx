import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../context/DataContext';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths
} from 'date-fns';

const { FiChevronLeft, FiChevronRight, FiCalendar, FiBriefcase, FiUsers } = FiIcons;

const Calendar = () => {
  const { getFilteredEntries } = useData();
  const entries = getFilteredEntries();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get entries for a specific date
  const getEntriesForDate = (date) => {
    return entries.filter(entry => 
      isSameDay(new Date(entry.createdAt), date)
    );
  };

  // Get entries for selected date
  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : [];

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
    setSelectedDate(null);
  };

  const getDayActivityLevel = (date) => {
    const dayEntries = getEntriesForDate(date);
    if (dayEntries.length === 0) return 'none';
    if (dayEntries.length <= 2) return 'low';
    if (dayEntries.length <= 4) return 'medium';
    return 'high';
  };

  const getActivityColor = (level) => {
    switch (level) {
      case 'none': return 'bg-gray-100';
      case 'low': return 'bg-primary-200';
      case 'medium': return 'bg-primary-400';
      case 'high': return 'bg-primary-600';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar View</h1>
        <p className="text-gray-600">Visualize your freelance activity over time</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          {/* Calendar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SafeIcon icon={FiChevronLeft} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SafeIcon icon={FiChevronRight} />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map(date => {
                const dayEntries = getEntriesForDate(date);
                const activityLevel = getDayActivityLevel(date);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isCurrentMonth = isSameMonth(date, currentDate);

                return (
                  <motion.button
                    key={date.toISOString()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      relative p-2 h-16 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-transparent hover:border-gray-200'
                      }
                      ${!isCurrentMonth ? 'opacity-30' : ''}
                      ${isToday(date) ? 'ring-2 ring-primary-500' : ''}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className={`text-sm font-medium ${
                        isToday(date) ? 'text-primary-600' : 'text-gray-900'
                      }`}>
                        {format(date, 'd')}
                      </span>
                      {dayEntries.length > 0 && (
                        <div className={`w-2 h-2 rounded-full mt-1 ${getActivityColor(activityLevel)}`} />
                      )}
                    </div>
                    {dayEntries.length > 0 && (
                      <div className="absolute top-1 right-1 text-xs font-bold text-primary-600">
                        {dayEntries.length}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Activity Legend */}
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded bg-gray-100"></div>
                <div className="w-3 h-3 rounded bg-primary-200"></div>
                <div className="w-3 h-3 rounded bg-primary-400"></div>
                <div className="w-3 h-3 rounded bg-primary-600"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </motion.div>

        {/* Day Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCalendar} className="text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select a date'}
              </h3>
            </div>
          </div>

          <div className="p-6">
            {selectedDate ? (
              selectedDateEntries.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEntries.map(entry => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          entry.type === 'job' ? 'bg-primary-500' : 'bg-success-500'
                        }`}>
                          <SafeIcon 
                            icon={entry.type === 'job' ? FiBriefcase : FiUsers} 
                            className="text-white text-sm" 
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{entry.company}</h4>
                          {entry.position && (
                            <p className="text-sm text-gray-600">{entry.position}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                          entry.status === 'applied' ? 'bg-primary-100 text-primary-800' :
                          entry.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                          entry.status === 'rejected' ? 'bg-danger-100 text-danger-800' :
                          'bg-success-100 text-success-800'
                        }`}>
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <SafeIcon icon={FiCalendar} className="mx-auto text-3xl text-gray-400 mb-3" />
                  <p className="text-gray-600">No entries for this date</p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiCalendar} className="mx-auto text-3xl text-gray-400 mb-3" />
                <p className="text-gray-600">Click on a date to see details</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;