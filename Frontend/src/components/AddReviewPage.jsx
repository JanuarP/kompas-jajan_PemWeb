import { useMemo, useState } from "react";
import axios from "axios";

const recommendationOptions = ["Pelayanan", "Rasa", "Suasana", "Harga", "Kebersihan"];

export default function AddReviewPage({ restaurant, currentUser, onBack, onSubmitReview }) {
  const [form, setForm] = useState({
    content: "",
    favoriteDish: "",
    rating: 5,
    visitDate: "",
    budget: "",
    recommendation: ["Pelayanan", "Rasa"],
    id_menu: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const characterCount = useMemo(() => form.content.length, [form.content]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleRecommendation = (item) => {
    setForm((prev) => ({
      ...prev,
      recommendation: prev.recommendation.includes(item)
        ? prev.recommendation.filter((v) => v !== item)
        : [...prev.recommendation, item],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) {
      setError("Isi ulasan tidak boleh kosong!");
      return;
    }
    if (!currentUser) {
      setError("Anda harus login untuk mengirim ulasan.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/ulasan", {
        id_user: currentUser.id_user,
        id_restoran: restaurant.id_restoran,
        id_menu: form.id_menu || null,
        rating: form.rating,
        isi_review: form.content,
      });

      alert("🎉 Ulasan berhasil dikirim!");
      if (onSubmitReview) onSubmitReview(form);
      onBack();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Terjadi kesalahan saat mengirim ulasan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-shell page-spacing">
      <section className="form-header-card">
        <div>
          <span className="hero-label">Halaman menambah ulasan review</span>
          <h1>Tulis ulasan untuk {restaurant?.name}</h1>
          <p>Bagikan pengalaman jajan kamu untuk membantu pengguna lain menemukan kuliner terbaik!</p>
        </div>
        <button type="button" className="btn light-btn" onClick={onBack}>
          Kembali ke detail
        </button>
      </section>

      {error && (
        <div className="auth-error-alert" style={{ margin: '0 0 16px 0' }}>{error}</div>
      )}

      <section className="review-layout">
        <form className="content-card review-form" onSubmit={handleSubmit}>
          <span className="section-label">Form ulasan</span>

          <div className="field-grid">
            <div>
              <label className="field-label">Nama Pengulas</label>
              <input
                className="text-input"
                value={currentUser?.username || ""}
                readOnly
                style={{ background: '#f8f9fa', cursor: 'not-allowed' }}
              />
            </div>
            <div>
              <label className="field-label">Menu Favorit (Opsional)</label>
              <select
                className="text-input"
                value={form.id_menu || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const menu = restaurant?.menus?.find(m => String(m.id) === String(val));
                  setField("id_menu", val ? parseInt(val) : null);
                  setField("favoriteDish", menu?.name || "");
                }}
              >
                <option value="">-- Pilih menu (opsional) --</option>
                {(restaurant?.menus || []).map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">Rating</label>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={form.rating === star ? "star-btn active" : "star-btn"}
                  onClick={() => setField("rating", star)}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          <div className="field-grid">
            <div>
              <label className="field-label">Tanggal Kunjungan</label>
              <input
                type="date"
                className="text-input"
                value={form.visitDate}
                onChange={(e) => setField("visitDate", e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Perkiraan Pengeluaran</label>
              <input
                className="text-input"
                value={form.budget}
                onChange={(e) => setField("budget", e.target.value)}
                placeholder="Contoh: Rp 75.000"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Nilai yang Direkomendasikan</label>
            <div className="chip-group">
              {recommendationOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={form.recommendation.includes(item) ? "chip-btn active" : "chip-btn"}
                  onClick={() => toggleRecommendation(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Isi Ulasan *</label>
            <textarea
              className="text-area"
              rows={6}
              maxLength={500}
              value={form.content}
              onChange={(e) => setField("content", e.target.value)}
              placeholder="Ceritakan rasa makanan, suasana, pelayanan, dan menu yang paling Anda rekomendasikan."
              required
            />
            <div className="helper-text">{characterCount}/500 karakter</div>
          </div>

          <div className="form-actions">
            <button type="button" className="light-btn" onClick={onBack}>Batal</button>
            <button type="submit" className="dark-btn" disabled={loading}>
              {loading ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </div>
        </form>

        <aside className="content-card preview-card">
          <span className="section-label">Preview ulasan</span>
          <h3>{restaurant?.name}</h3>
          <div className="meta-inline wrap">
            <span>👤 {currentUser?.username || "User"}</span>
            <span>⭐ {form.rating}/5</span>
            {form.favoriteDish && <span>🍽 {form.favoriteDish}</span>}
          </div>
          <p style={{ marginTop: 12, color: form.content ? '#212529' : '#868e96' }}>
            {form.content || "Isi review akan tampil di panel ini agar pengguna bisa memeriksa hasil sebelum mengirim."}
          </p>

          <div className="preview-block">
            <small className="field-label">Sorotan rekomendasi</small>
            <div className="token-wrap">
              {form.recommendation.map((item) => (
                <span key={item} className="outline-badge">{item}</span>
              ))}
            </div>
          </div>

          <div className="preview-summary">
            <div className="row-between">
              <span>Tanggal kunjungan</span>
              <strong>{form.visitDate || "-"}</strong>
            </div>
            <div className="row-between">
              <span>Pengeluaran</span>
              <strong>{form.budget || "-"}</strong>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
