import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Barang from './pages/Barang';
import Kategori from './pages/Kategori';
import Transaksi from './pages/Transaksi';
import { Menu } from 'lucide-react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mock user untuk keperluan sistem (id tetap 1 agar transaksi lancar)
  const mockUser = { id: 1, username: 'admin', role: 'ADMIN' };

  return (
    <Router>
      <div className="app-container">
        {/* Mobile Toggle Button */}
        {isMobile && (
          <button className="nav-toggle" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
        )}

        {/* Sidebar Overlay for Mobile */}
        {isMobile && isSidebarOpen && (
          <div className="sidebar-overlay active" onClick={toggleSidebar}></div>
        )}

        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          isMobile={isMobile} 
          toggleSidebar={toggleSidebar}
          user={mockUser}
        />

        {/* Main Content */}
        <main className={`main-content ${isMobile ? 'mobile' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/barang" element={<Barang />} />
            <Route path="/kategori" element={<Kategori />} />
            <Route path="/transaksi" element={<Transaksi />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
