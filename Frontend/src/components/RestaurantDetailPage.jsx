import { useState, useEffect } from "react";
import axios from "axios";

function ReviewSnippet({ item }) {
  return (
    <article className="content-card review-card">
      <div className="row-between gap-12">
        <div>
          <h3>{item.username || item.nama_user || "Pengguna"}</h3>
          <small className="muted-text">{new Date(item.tanggal_ulasan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
        </div>
        <div className="rating-pill">⭐ {item.rating}/5</div>
      </div>
      <p>{item.isi_review}</p>
    </article>
  );
}

export default function RestaurantDetailPage({
  restaurant,
  reviews: initialReviews,
  averageRating,
  formatRupiah,
  onOpenMenu,
  onOpenReview,
  onBackDashboard,
}) {
  const [reviews, setReviews] = useState(initialReviews || []);

  useEffect(() => {
    if (!restaurant?.id_restoran) return;
    axios.get(`http://localhost:3000/ulasan?id_restoran=${restaurant.id_restoran}`)
      .then(res => setReviews(res.data || []))
      .catch(() => {});
  }, [restaurant?.id_restoran]);

  const signatureMenus = restaurant?.menus?.slice(0, 3) || [];
  const maxPrice = restaurant?.menus?.length > 0
    ? Math.max(...restaurant.menus.map((item) => item.price || 0))
    : 0;

  const computedRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + parseFloat(r.rating || 0), 0) / reviews.length).toFixed(1)
    : averageRating || "Belum ada rating";

  return (
    <main className="container-shell page-spacing">
      <section className="detail-banner">
        <div className="detail-banner-copy">
          <span className="hero-label">Halaman deskripsi restoran</span>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>

          <div className="meta-inline wrap">
            <span>📍 {restaurant.location}</span>
            <span>💳 {restaurant.priceRange}</span>
            <span>🕒 {restaurant.openHours}</span>
          </div>

          <div className="hero-actions">
            <button type="button" className="dark-btn" onClick={onOpenReview}>
              Tambah Ulasan
            </button>
            <button type="button" className="light-btn" onClick={onOpenMenu}>
              Lihat Menu Restoran
            </button>
            <button type="button" className="light-btn" onClick={onBackDashboard}>
              Kembali ke Home
            </button>
          </div>
        </div>

        <div className="detail-rating-box">
          <small>Rating pengunjung</small>
          <strong>{computedRating}</strong>
          <span>berdasarkan {reviews.length} ulasan</span>
        </div>
      </section>

      <section className="details-grid">
        <article className="content-card">
          <span className="section-label">Informasi utama</span>
          <div className="info-stack">
            <div className="row-between">
              <span>Kategori</span>
              <strong>{restaurant.category}</strong>
            </div>
            <div className="row-between">
              <span>Jam operasional</span>
              <strong>{restaurant.openHours || "Belum tersedia"}</strong>
            </div>
            <div className="row-between">
              <span>Rentang harga</span>
              <strong>{restaurant.priceRange || "Belum tersedia"}</strong>
            </div>
            {maxPrice > 0 && (
              <div className="row-between">
                <span>Menu termahal</span>
                <strong>{formatRupiah(maxPrice)}</strong>
              </div>
            )}
          </div>
        </article>
      </section>

      {signatureMenus.length > 0 && (
        <>
          <section className="section-header">
            <div>
              <span className="section-label">Menu signature</span>
              <h2>Sorotan menu andalan</h2>
            </div>
          </section>
          <section className="menu-grid compact">
            {signatureMenus.map((item) => (
              <article key={item.id} className="content-card compact-menu">
                <div className="row-between gap-12">
                  <div className="menu-compact-title">
                    {item.image ? (
                      <img
                        src={item.image.startsWith("/") ? item.image : `/image/${item.image}`}
                        alt={item.name}
                        className="menu-emoji small"
                        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8 }}
                        onError={(e) => { e.currentTarget.replaceWith(Object.assign(document.createElement("span"), { className: "menu-emoji small", textContent: "🍽️" })); }}
                      />
                    ) : (
                      <span className="menu-emoji small">🍽️</span>
                    )}
                    <div>
                      <h3>{item.name}</h3>
                      <small className="muted-text">{item.badge || "Tersedia"}</small>
                    </div>
                  </div>
                  <span className="price-text">{formatRupiah(item.price)}</span>
                </div>
                <p>{item.description}</p>
              </article>
            ))}
          </section>
        </>
      )}

      <section className="section-header">
        <div>
          <span className="section-label">Ulasan terbaru</span>
          <h2>Pengalaman pelanggan</h2>
        </div>
      </section>

      <section className="review-list">
        {reviews.length > 0
          ? reviews.map((item) => <ReviewSnippet key={item.id_ulasan} item={item} />)
          : <p className="muted-text">Belum ada ulasan untuk restoran ini. Jadilah yang pertama!</p>
        }
      </section>
    </main>
  );
}
