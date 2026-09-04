import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, LogOut, Wallet, Target, Shield, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import styles from './DashboardLayout.module.css';

export const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Overview';
      case '/dashboard/transactions': return 'Transactions';
      case '/dashboard/analytics': return 'Analytics';
      case '/dashboard/budgets': return 'Budgets';
      case '/dashboard/goals': return 'Financial Goals';
      case '/dashboard/admin': return 'Admin Portal';
      case '/dashboard/settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Wallet className={styles.logoIcon} color="var(--accent-primary)" />
          <span>Finance<span style={{color: 'var(--accent-primary)'}}>X</span></span>
        </div>
        
        <nav className={styles.nav}>
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <LayoutDashboard size={20} />
            Overview
          </NavLink>
          <NavLink 
            to="/dashboard/transactions" 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <Receipt size={20} />
            Transactions
          </NavLink>
          <NavLink 
            to="/dashboard/analytics" 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <PieChart size={20} />
            Analytics
          </NavLink>
          <NavLink 
            to="/dashboard/budgets" 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <Wallet size={20} />
            Budgets
          </NavLink>
          <NavLink 
            to="/dashboard/goals" 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <Target size={20} />
            Goals
          </NavLink>
          {user?.role === 'ADMIN' && (
            <NavLink 
              to="/dashboard/admin" 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <Shield size={20} />
              Admin
            </NavLink>
          )}
          <NavLink 
            to="/dashboard/settings" 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <Settings size={20} />
            Settings
          </NavLink>
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>{getPageTitle()}</h2>
          <div className={styles.userProfile}>
            <span className={styles.userName}>Hello, {user?.name || 'User'}</span>
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
