import { useState } from "react";
import axios from "axios";

export default function AddRestaurant({ currentUser, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    nama_restoran: "",
    alamat_restoran: "",
    kategori_restoran: "",
    deskripsi_restoran: "",
    jam_operasional: "",
    rentang_harga: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const kategoriOptions = [
    "Masakan Jawa", "Masakan Padang", "Seafood", "Sate",
    "Cafe", "Italian / Western", "Japanese / Seafood",
    "Mie & Bakso", "Bakso", "Warteg", "Lainnya"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama_restoran || !formData.alamat_restoran || !formData.kategori_restoran) {
      setError("Nama, alamat, dan kategori restoran wajib diisi!");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/addRestoran", formData);
      alert("✅ Restoran berhasil ditambahkan!");
      if (onSuccess) onSuccess();
      onBack();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Terjadi kesalahan saat menambah restoran.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-shell page-spacing">
      <section className="form-header-card">
        <div>
          <span className="hero-label">Panel Admin — Tambah Restoran</span>
          <h1>Daftarkan Restoran Baru</h1>
          <p>Lengkapi informasi restoran yang akan ditampilkan kepada seluruh pengguna KompasJajan.</p>
        </div>
        <button type="button" className="light-btn" onClick={onBack}>
          ← Kembali
        </button>
      </section>

      {error && (
        <div className="auth-error-alert" style={{ margin: '0 0 16px 0' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="content-card" style={{ maxWidth: 720, margin: '0 auto' }}>
        <span className="section-label">Informasi Restoran</span>

        <div className="field-grid" style={{ marginTop: 16 }}>
          <div>
            <label className="field-label">Nama Restoran *</label>
            <input
              className="text-input"
              type="text"
              name="nama_restoran"
              placeholder="Contoh: Warung Bu Sari"
              value={formData.nama_restoran}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="field-label">Kategori *</label>
            <select
              className="text-input"
              name="kategori_restoran"
              value={formData.kategori_restoran}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {kategoriOptions.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="field-label">Alamat Lengkap *</label>
          <input
            className="text-input"
            type="text"
            name="alamat_restoran"
            placeholder="Contoh: Jl. Malioboro No. 12, Yogyakarta"
            value={formData.alamat_restoran}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="field-label">Deskripsi Restoran</label>
          <textarea
            className="text-area"
            name="deskripsi_restoran"
            rows={4}
            placeholder="Ceritakan keunggulan restoran ini..."
            value={formData.deskripsi_restoran}
            onChange={handleChange}
          />
        </div>

        <div className="field-grid" style={{ marginTop: 16 }}>
          <div>
            <label className="field-label">Jam Operasional</label>
            <input
              className="text-input"
              type="text"
              name="jam_operasional"
              placeholder="Contoh: 08:00 - 21:00"
              value={formData.jam_operasional}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="field-label">Rentang Harga</label>
            <input
              className="text-input"
              type="text"
              name="rentang_harga"
              placeholder="Contoh: Rp 15.000 - Rp 50.000"
              value={formData.rentang_harga}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: 24 }}>
          <button type="button" className="light-btn" onClick={onBack}>
            Batal
          </button>
          <button type="submit" className="dark-btn" disabled={loading}>
            {loading ? "Menyimpan..." : "✅ Tambah Restoran"}
          </button>
        </div>
      </form>
    </main>
  );
}
