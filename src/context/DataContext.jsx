import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

const initialState = {
  entries: [],
  filters: {
    type: 'all', // 'all', 'job', 'lead'
    status: 'all', // 'all', 'pending', 'applied', 'interview', 'rejected', 'accepted'
    timeRange: 'week' // 'week', 'month'
  }
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        entries: action.payload
      };
    case 'ADD_ENTRY':
      const newEntry = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        entries: [newEntry, ...state.entries]
      };
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map(entry =>
          entry.id === action.payload.id
            ? { ...entry, ...action.payload, updatedAt: new Date().toISOString() }
            : entry
        )
      };
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.payload)
      };
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value
        }
      };
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('freelancer-tracker-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData.entries || [] });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('freelancer-tracker-data', JSON.stringify({
      entries: state.entries
    }));
  }, [state.entries]);

  const addEntry = (entryData) => {
    dispatch({ type: 'ADD_ENTRY', payload: entryData });
  };

  const updateEntry = (id, updates) => {
    dispatch({ type: 'UPDATE_ENTRY', payload: { id, ...updates } });
  };

  const deleteEntry = (id) => {
    dispatch({ type: 'DELETE_ENTRY', payload: id });
  };

  const setFilter = (key, value) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  };

  const getFilteredEntries = () => {
    let filtered = state.entries;

    // Filter by type
    if (state.filters.type !== 'all') {
      filtered = filtered.filter(entry => entry.type === state.filters.type);
    }

    // Filter by status
    if (state.filters.status !== 'all') {
      filtered = filtered.filter(entry => entry.status === state.filters.status);
    }

    return filtered;
  };

  const getStats = () => {
    const entries = getFilteredEntries();
    const jobApplications = entries.filter(entry => entry.type === 'job').length;
    const clientLeads = entries.filter(entry => entry.type === 'lead').length;
    
    const statusCounts = entries.reduce((acc, entry) => {
      acc[entry.status] = (acc[entry.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: entries.length,
      jobApplications,
      clientLeads,
      statusCounts
    };
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state.entries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `freelancer-tracker-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Company', 'Position', 'Status', 'Contact Method', 'URL', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...state.entries.map(entry => [
        new Date(entry.createdAt).toLocaleDateString(),
        entry.type,
        entry.company || '',
        entry.position || '',
        entry.status,
        entry.contactMethod || '',
        entry.url || '',
        `"${(entry.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `freelancer-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const value = {
    ...state,
    addEntry,
    updateEntry,
    deleteEntry,
    setFilter,
    getFilteredEntries,
    getStats,
    exportData,
    exportCSV
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};