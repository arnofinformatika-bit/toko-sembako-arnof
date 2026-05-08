import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Tags, 
  ShoppingCart, 
  LogOut, 
  Users,
  ChevronLeft,
  ChevronRight,
  Store,
  Menu
} from 'lucide-react';

function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, user: propUser }) {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = propUser || (userString ? JSON.parse(userString) : null);
  const isAdmin = user && user.role === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>

      <div className="sidebar-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ 
            background: 'var(--primary-color)', 
            padding: '0.5rem', 
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          className="logo-toggle"
        >
          <Menu size={24} />
        </button>
        {!isCollapsed && (
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)', whiteSpace: 'nowrap' }}>
            Toko<span style={{ color: 'var(--text-dark)' }}>Sembako<br/>ARNOF DWI FERDIZA</span>
          </h1>
        )}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={() => setIsMobileOpen(false)}
        >
          <LayoutDashboard size={20} /> <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/barang" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={() => setIsMobileOpen(false)}
        >
          <PackageSearch size={20} /> <span>Barang</span>
        </NavLink>
        <NavLink 
          to="/kategori" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={() => setIsMobileOpen(false)}
        >
          <Tags size={20} /> <span>Kategori</span>
        </NavLink>
        <NavLink 
          to="/transaksi" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={() => setIsMobileOpen(false)}
        >
          <ShoppingCart size={20} /> <span>Transaksi</span>
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <button 
          onClick={handleLogout} 
          className="btn btn-danger logout-btn" 
          style={{ width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
        >
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
