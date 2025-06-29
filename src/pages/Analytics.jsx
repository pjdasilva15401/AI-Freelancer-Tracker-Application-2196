import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../context/DataContext';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';

const { FiCalendar, FiTrendingUp, FiPieChart, FiBarChart3 } = FiIcons;

const Analytics = () => {
  const { getFilteredEntries, filters, setFilter } = useData();
  const [viewType, setViewType] = useState('overview');
  const entries = getFilteredEntries();

  // Get date range based on filter
  const getDateRange = () => {
    const now = new Date();
    if (filters.timeRange === 'week') {
      return {
        start: startOfWeek(now),
        end: endOfWeek(now)
      };
    } else {
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    }
  };

  const dateRange = getDateRange();

  // Filter entries by date range
  const filteredByDate = entries.filter(entry => 
    isWithinInterval(new Date(entry.createdAt), dateRange)
  );

  // Prepare chart data
  const getTimeSeriesData = () => {
    const days = eachDayOfInterval(dateRange);
    const dailyCounts = days.map(day => {
      const dayEntries = filteredByDate.filter(entry => 
        format(new Date(entry.createdAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
      return {
        date: format(day, 'MMM dd'),
        jobs: dayEntries.filter(e => e.type === 'job').length,
        leads: dayEntries.filter(e => e.type === 'lead').length,
        total: dayEntries.length
      };
    });
    return dailyCounts;
  };

  const getStatusData = () => {
    const statusCounts = filteredByDate.reduce((acc, entry) => {
      acc[entry.status] = (acc[entry.status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));
  };

  const timeSeriesData = getTimeSeriesData();
  const statusData = getStatusData();

  // Chart options
  const lineChartOptions = {
    title: {
      text: 'Daily Activity Trend',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      bottom: 0
    },
    xAxis: {
      type: 'category',
      data: timeSeriesData.map(d => d.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Job Applications',
        type: 'line',
        data: timeSeriesData.map(d => d.jobs),
        smooth: true,
        itemStyle: { color: '#0ea5e9' }
      },
      {
        name: 'Client Leads',
        type: 'line',
        data: timeSeriesData.map(d => d.leads),
        smooth: true,
        itemStyle: { color: '#22c55e' }
      }
    ]
  };

  const pieChartOptions = {
    title: {
      text: 'Status Distribution',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: statusData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const barChartOptions = {
    title: {
      text: 'Weekly Overview',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: timeSeriesData.map(d => d.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Total Entries',
        type: 'bar',
        data: timeSeriesData.map(d => d.total),
        itemStyle: { color: '#8b5cf6' }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Insights into your freelance activity</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCalendar} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilter('timeRange', 'week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.timeRange === 'week'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setFilter('timeRange', 'month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.timeRange === 'month'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="overview">Overview</option>
              <option value="trends">Trends</option>
              <option value="status">Status Analysis</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{filteredByDate.length}</p>
            </div>
            <SafeIcon icon={FiTrendingUp} className="text-primary-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Job Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredByDate.filter(e => e.type === 'job').length}
              </p>
            </div>
            <SafeIcon icon={FiBarChart3} className="text-primary-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Client Leads</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredByDate.filter(e => e.type === 'lead').length}
              </p>
            </div>
            <SafeIcon icon={FiPieChart} className="text-success-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredByDate.length > 0 
                  ? Math.round((filteredByDate.filter(e => e.status === 'accepted').length / filteredByDate.length) * 100)
                  : 0}%
              </p>
            </div>
            <SafeIcon icon={FiTrendingUp} className="text-success-500 text-2xl" />
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts option={lineChartOptions} style={{ height: '400px' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts option={pieChartOptions} style={{ height: '400px' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts option={barChartOptions} style={{ height: '400px' }} />
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;