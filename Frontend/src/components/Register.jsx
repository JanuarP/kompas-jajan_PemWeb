import { useState } from 'react';
import axios from 'axios'; // 1. Import axios

export default function Register({ onRegister, onNavigate }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Yogyakarta, Indonesia');
  const [favCategory, setFavCategory] = useState('Masakan Jawa');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => { // 2. Tambahkan async
    e.preventDefault();
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('Mohon isi semua bidang yang bertanda bintang (*)!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok!');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 3. Panggil API Register ke backend Express
      const response = await axios.post('http://localhost:3000/register', {
        username: username,
        email_user: email, // Cocokkan dengan penamaan kolom di backend
        password: password
      });

      alert("Registrasi Berhasil! Silakan Login.");
      onNavigate('login'); // Arahkan pengguna ke halaman login setelah sukses daftar
      
    } catch (err) {
      // 4. Tangkap error (misal: "Email sudah terdaftar")
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
              <h2 className="visual-title">Bergabunglah dengan Komunitas Reviewer.</h2>
              <p className="visual-desc">
                Tulis ulasan jujur tentang makanan favorit Anda, beri rating untuk UMKM, dan bantu ribuan pecinta kuliner menemukan tempat jajan terbaik.
              </p>
            </div>
            <div className="visual-footer">
              <span>© 2026 KompasJajan Reviewer Platform</span>
            </div>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="form-header">
            <h2 className="form-title">Daftar Akun Baru</h2>
            <p className="form-subtitle">Buat akun reviewer kuliner Anda sekarang</p>
          </div>

          {error && <div className="auth-error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form-scrollable">
            <div className="form-row-two-col">
              <div className="form-group">
                <label htmlFor="name">Nama Lengkap *</label>
                <div className="input-wrapper">
                  <i className="fa-solid fa-user input-icon"></i>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Ridwan Nur Rahmat"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <div className="input-wrapper">
                  <span className="input-at">@</span>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ridwannurrahmad"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <div className="input-wrapper">
                <i className="fa-solid fa-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: ridwanrahmatnih@gmail.com"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-row-two-col">
              <div className="form-group">
                <label htmlFor="location">Lokasi Kota</label>
                <div className="input-wrapper">
                  <i className="fa-solid fa-map-pin input-icon"></i>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Yogyakarta, Indonesia"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="favCategory">Kategori Terfavorit</label>
                <div className="input-wrapper select-wrapper">
                  <select
                    id="favCategory"
                    value={favCategory}
                    onChange={(e) => setFavCategory(e.target.value)}
                    disabled={loading}
                  >
                    <option value="Masakan Jawa">Masakan Jawa</option>
                    <option value="Kopi & Cafe">Kopi & Cafe</option>
                    <option value="Warung Pinggir Jalan">Warung Pinggir Jalan</option>
                    <option value="Kuliner Tradisional">Kuliner Tradisional</option>
                    <option value="Seafood & Bakar">Seafood & Bakar</option>
                    <option value="Bakmi & Mie Ayam">Bakmi & Mie Ayam</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row-two-col">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <div className="input-wrapper">
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Konfirmasi Password *</label>
                <div className="input-wrapper">
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Masukkan ulang password"
                    disabled={loading}
                    required
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
            </div>

            <div className="form-actions-register">
              <label className="terms-agree">
                <input type="checkbox" required defaultChecked />
                <span>Saya menyetujui Ketentuan Layanan & Kebijakan Privasi KompasJajan</span>
              </label>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="spinner-loader"></span>
              ) : (
                <>
                  <span>Daftar Akun Reviewer</span>
                  <i className="fa-solid fa-user-plus"></i>
                </>
              )}
            </button>
          </form>

          <div className="form-footer">
            <span>Sudah memiliki akun?</span>
            <button className="auth-switch-btn" onClick={() => onNavigate('login')}>
              Masuk Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
