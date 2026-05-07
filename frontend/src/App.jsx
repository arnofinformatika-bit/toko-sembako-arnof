import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Barang from './pages/Barang';
import Kategori from './pages/Kategori';
import Transaksi from './pages/Transaksi';
import Login from './pages/Login';
import User from './pages/User';

import { Menu, X } from 'lucide-react';

function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="app-container">
      {/* Mobile Nav Toggle */}
      <button 
        className="nav-toggle"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <main className={`main-content animate-fade-in ${isCollapsed ? 'collapsed' : ''}`}>
        {children}
      </main>
    </div>
  );
}

const ProtectedRoute = ({ children, requiredRole }) => {
  const userString = localStorage.getItem('user');
  
  if (!userString) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole) {
    const user = JSON.parse(userString);
    if (user.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/barang" element={
          <ProtectedRoute>
            <Layout><Barang /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/kategori" element={
          <ProtectedRoute>
            <Layout><Kategori /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/transaksi" element={
          <ProtectedRoute>
            <Layout><Transaksi /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/user" element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout><User /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
