import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddEntry from './pages/AddEntry';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import { DataProvider } from './context/DataContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Freelancer Tracker</h2>
          <p className="text-gray-600">Loading your workspace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pb-20 md:pb-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddEntry />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;