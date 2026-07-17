import { useState } from 'react';

export default function Navbar({ user, onLogout, onNavigate, onWriteReviewClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => onNavigate(user ? 'home' : 'login')}>
          <span className="brand-logo">KompasJajan</span>
          <span className="brand-divider"></span>
          <span className="brand-subtitle">REVIEWER PLATFORM</span>
        </div>

        <div className="navbar-menu">
          {user ? (
            <>
              <button className="nav-link" onClick={() => onNavigate('home')}>
                <i className="fa-solid fa-house nav-icon"></i>
                <span>Beranda</span>
              </button>
              <button className="nav-link" onClick={() => onNavigate('explore')}>
                <i className="fa-solid fa-compass nav-icon"></i>
                <span>Jelajahi</span>
              </button>
              <button className="nav-link" onClick={() => onNavigate('dashboard')}>
                <i className="fa-solid fa-circle-user nav-icon"></i>
                <span>Hai, {user.name ? user.name.split(' ')[0] : 'User'}</span>
              </button>

              <div className="nav-profile-container">
                <button
                  className="nav-avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="Profile menu"
                >
                  {user.avatar || 'U'}
                </button>

                {dropdownOpen && (
                  <div className="nav-dropdown">
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-username">@{user.username}</p>
                      {user.role === 'admin' && (
                        <span style={{ fontSize: '0.7rem', background: '#212529', color: '#fff', borderRadius: 4, padding: '1px 6px' }}>
                          👑 Admin
                        </span>
                      )}
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={() => { setDropdownOpen(false); onNavigate('dashboard'); }}>
                      <i className="fa-solid fa-circle-user dropdown-icon"></i>
                      <span>Profil Saya</span>
                    </button>
                    {user.role === 'admin' && (
                      <button className="dropdown-item" onClick={() => { setDropdownOpen(false); onNavigate('addRestoran'); }}>
                        <i className="fa-solid fa-plus dropdown-icon"></i>
                        <span>Tambah Restoran</span>
                      </button>
                    )}
                    <button className="dropdown-item dropdown-logout" onClick={() => { setDropdownOpen(false); onLogout(); }}>
                      <i className="fa-solid fa-right-from-bracket dropdown-icon"></i>
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="nav-auth-buttons">
              <button className="nav-btn-text" onClick={() => onNavigate('login')}>Masuk</button>
              <button className="nav-btn-filled" onClick={() => onNavigate('register')}>Daftar Akun</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
