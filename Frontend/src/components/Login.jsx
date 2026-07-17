import { useState } from 'react';
import axios from 'axios'; // 1. Import axios

export default function Login({ onLogin, onNavigate }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => { // 2. Tambahkan async
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Email dan Password harus diisi!');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // 3. Panggil API Login ke backend Express
      const response = await axios.post('http://localhost:3000/login', {
        email_user: identifier, // Cocokkan dengan penamaan kolom di backend
        password: password
      });

      // Jika berhasil, kirim data user ke App.jsx dan arahkan ke Dashboard
      onLogin(response.data.user);
      
    } catch (err) {
      // 4. Tangkap pesan error dari backend (misal: "Email atau password salah")
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError('Terjadi kesalahan pada server. Coba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-visual">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <div className="visual-logo">
              <i className="fa-solid fa-compass logo-icon"></i>
              <span>KompasJajan</span>
            </div>
            <div className="visual-text-group">
              <h2 className="visual-title">Temukan Cita Rasa, Bagikan Cerita.</h2>
              <p className="visual-desc">
                Platform ulasan kuliner terpercaya untuk mengeksplorasi restoran terbaik dan mendukung pertumbuhan UMKM makanan di Indonesia.
              </p>
            </div>
            <div className="visual-footer">
              <span>© 2026 KompasJajan Reviewer Platform</span>
            </div>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="form-header">
            <h2 className="form-title">Selamat Datang</h2>
            <p className="form-subtitle">Silakan masuk ke akun reviewer Anda</p>
          </div>

          {error && <div className="auth-error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="identifier">Username atau Email</label>
              <div className="input-wrapper">
                <i className="fa-solid fa-envelope input-icon"></i>
                <input
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: ridwannurrahmat"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <i className="fa-solid fa-lock input-icon"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" defaultChecked />
                <span>Ingat Saya</span>
              </label>
              <button 
                type="button" 
                className="forgot-password"
                onClick={() => alert('Fitur reset password akan segera hadir!')}
              >
                Lupa Password?
              </button>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="spinner-loader"></span>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                </>
              )}
            </button>
          </form>

          <div className="auth-demo-tip" onClick={() => {
            setIdentifier('ridwannurrahmat');
            setPassword('password123');
          }}>
            <p className="tip-title"><i className="fa-solid fa-lightbulb" style={{ marginRight: '6px' }}></i>Info Akun Demo</p>
            <p className="tip-desc">Klik di sini untuk mengisi otomatis kredensial akun dummy Ridwan Nur Rahmat.</p>
          </div>

          <div className="form-footer">
            <span>Belum memiliki akun reviewer?</span>
            <button className="auth-switch-btn" onClick={() => onNavigate('register')}>
              Daftar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
