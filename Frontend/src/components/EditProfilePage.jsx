// File: src/components/EditProfilePage.jsx
import { useState } from "react";
import axios from "axios";
import "../profil.css";

export default function EditProfilePage({ currentUser, onNavigate, onUpdateUser }) {
  const [form, setForm] = useState({
    name: currentUser?.username || "", 
    username: currentUser?.username || "",
    city: currentUser?.lokasi || "",
    bio: currentUser?.bio || "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const initials = (form.name || "U").trim().substring(0, 2).toUpperCase();

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = { 
        username: form.username, 
        email_user: currentUser?.email_user, 
        bio: form.bio, 
        lokasi: form.city 
      };
      await axios.put(`http://localhost:3000/users/${currentUser.id_user}`, updatedData);
      
      if (onUpdateUser) onUpdateUser(updatedData);
      alert("Profil berhasil diperbarui!");
      onNavigate("dashboard"); 
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-backdrop">
      <div className="edit-profile-card">
        
        {/* Header Section */}
        <div className="edit-profile-header">
          <div>
            <h5 className="mb-1 fw-bold" style={{ color: "#212529" }}>Edit Profil</h5>
            <small className="text-secondary">Perbarui identitas publik Anda</small>
          </div>
          <button onClick={() => onNavigate("dashboard")} className="btn-close-modal">✕</button>
        </div>

        {/* Avatar Section */}
        <div className="edit-profile-avatar-section">
          <div className="edit-profile-avatar">
            {initials}
          </div>
          <div>
            <p className="mb-0 fw-bold" style={{ color: "#212529", fontSize: "1rem" }}>{form.name}</p>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-secondary text-decoration-underline" style={{ fontSize: "0.8rem" }}>
              Ganti foto profil
            </a>
          </div>
        </div>

        {/* Form Section */}
        <div className="edit-profile-form-section">
          {/* Menggunakan grid Bootstrap bawaan (row/col) untuk mengatur layout 2 kolom */}
          <div className="row g-3 mb-2">
            <div className="col-6">
              <label className="edit-form-label">Nama Lengkap</label>
              <input type="text" className="edit-form-input" value={form.name} onChange={set("name")} />
            </div>
            
            <div className="col-6">
              <label className="edit-form-label">Username</label>
              <input type="text" className="edit-form-input" value={form.username} onChange={set("username")} />
            </div>
            
            <div className="col-12 mt-3">
              <label className="edit-form-label">Lokasi</label>
              <input type="text" className="edit-form-input" value={form.city} onChange={set("city")} placeholder="Contoh: Jakarta, Indonesia" />
            </div>
            
            <div className="col-12 mt-3">
              <label className="edit-form-label">Bio / Deskripsi</label>
              <textarea className="edit-form-textarea" value={form.bio} onChange={set("bio")} rows={4} maxLength={200} placeholder="Ceritakan kesukaan kuliner Anda..." />
              <div className="text-end mt-1 text-secondary" style={{ fontSize: "0.7rem" }}>
                {form.bio.length}/200 karakter
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="edit-profile-footer">
          <small className="text-secondary" style={{ fontSize: "0.8rem" }}>Perubahan akan disimpan ke server</small>
          <div className="d-flex gap-2">
            <button onClick={() => onNavigate("dashboard")} className="btn-edit-cancel">
              Batal
            </button>
            <button onClick={handleSave} disabled={loading} className="btn-edit-save">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}