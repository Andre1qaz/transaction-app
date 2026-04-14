import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>Transaction Manager</div>
      <div style={styles.links}>
        <Link to="/" style={{ ...styles.link, ...(isActive('/') ? styles.active : {}) }}>
          Daftar Transaksi
        </Link>
        <Link to="/add" style={{ ...styles.link, ...(isActive('/add') ? styles.active : {}) }}>
          + Tambah Transaksi
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e3a5f', padding: '14px 32px', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
  brand: { fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '0.5px' },
  links: { display: 'flex', gap: '24px' },
  link: { color: '#aac4e8', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.2s' },
  active: { color: '#ffffff', borderBottom: '2px solid #4da3ff', paddingBottom: '2px' },
};