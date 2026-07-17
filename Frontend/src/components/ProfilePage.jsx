// File: src/components/ProfilePage.jsx
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../profil.css";

const monoColors = ["#212529", "#495057", "#868e96", "#ced4da", "#dee2e6"];

function StarRating({ rating }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? "#fcc419" : "#dee2e6", fontSize: "1.1rem" }}>★</span>
      ))}
    </span>
  );
}

export default function ProfilePage({ currentUser, onNavigate }) {
  const [userReviews, setUserReviews] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ulasan");

  const fetchUserData = useCallback(async () => {
    if (!currentUser?.id_user) return;
    try {
      const [reviewsRes, bookmarksRes] = await Promise.all([
        axios.get(`http://localhost:3000/ulasan/user/${currentUser.id_user}`),
        axios.get(`http://localhost:3000/bookmark?id_user=${currentUser.id_user}`)
      ]);
      setUserReviews(reviewsRes.data || []);
      setUserBookmarks(bookmarksRes.data || []);
    } catch (err) {
      console.error("Gagal mengambil profil:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  const avatarInitials = (currentUser?.username || "U").trim().substring(0, 2).toUpperCase();
  const avgRating = userReviews.length > 0 ? (userReviews.reduce((sum, r) => sum + parseFloat(r.rating || 0), 0) / userReviews.length).toFixed(1) : "0.0";
  const dummyHelpful = userReviews.length * 15 + 42; 

  const ratingDist = [5, 4, 3, 2, 1].map(star => {
    const count = userReviews.filter(r => parseInt(r.rating) === star).length;
    return { stars: star, count, pct: userReviews.length > 0 ? Math.round((count / userReviews.length) * 100) : 0 };
  });

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <div className="spinner-border mb-3" style={{ color: "#212529" }} />
        <p className="text-secondary fw-semibold">Menyiapkan profil...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        
        {/* HERO SECTION */}
        <div className="profile-hero-card">
          <div className="profile-cover"></div>
          <div className="profile-hero-body">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">{avatarInitials}</div>
              <button onClick={() => onNavigate("editProfile")} className="btn-edit-profile">
                <i className="fa-solid fa-pen me-2"></i> Edit Profil
              </button>
            </div>
            
            <h1 className="profile-name">
              {currentUser?.username} <span className="profile-username">@{currentUser?.username}</span>
            </h1>
            <div className="profile-meta">
              <span><i className="fa-solid fa-map-pin"></i> {currentUser?.lokasi || "Lokasi Belum Diatur"}</span>
              <span><i className="fa-solid fa-calendar-days"></i> Pengguna Aktif</span>
            </div>
            <p className="profile-bio">
              {currentUser?.bio || "Belum ada bio. Ayo ceritakan sedikit tentang diri Anda!"}
            </p>
          </div>
        </div>

        {/* 3 KOTAK STATISTIK */}
        <div className="stats-grid-wrapper">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{userReviews.length}</div>
            <div className="stat-label">Total Ulasan</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{avgRating}</div>
            <div className="stat-label">Rata-rata Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👍</div>
            <div className="stat-value">{dummyHelpful}</div>
            <div className="stat-label">Ulasan Terbantu</div>
          </div>
        </div>

        {/* GRID KONTEN BAWAH */}
        <div className="profile-content-grid">
          
          {/* SIDEBAR KIRI */}
          <div>
            <div className="sidebar-card">
              <h6 className="section-title-pill">Distribusi Rating</h6>
              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="dist-rating-score">{avgRating}</span>
                <div>
                  <div style={{ color: "#fcc419", letterSpacing: "2px", fontSize: "1.1rem" }}>★★★★★</div>
                  <small className="text-secondary fw-medium">{userReviews.length} ulasan total</small>
                </div>
              </div>
              {ratingDist.map((r, i) => (
                <div key={r.stars} className="d-flex align-items-center gap-3 mb-2">
                  <span className="text-secondary fw-bold" style={{ width: "20px" }}>{r.stars} ★</span>
                  <div className="flex-grow-1 rounded-pill overflow-hidden" style={{ height: 8, background: "#f1f3f5" }}>
                    <div className="h-100 rounded-pill" style={{ width: `${r.pct}%`, background: monoColors[i] }} />
                  </div>
                  <span className="text-secondary text-end fw-bold" style={{ width: "30px" }}>{r.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KONTEN KANAN (TABS) */}
          <div>
            <div className="d-flex align-items-center mb-4 border-bottom pb-3">
              <div className="profile-tabs-group">
                <button onClick={() => setActiveTab("ulasan")} className={`profile-tab-btn ${activeTab === "ulasan" ? "active" : ""}`}>
                  Ulasan ({userReviews.length})
                </button>
                <button onClick={() => setActiveTab("bookmark")} className={`profile-tab-btn ${activeTab === "bookmark" ? "active" : ""}`}>
                  Favorit ({userBookmarks.length})
                </button>
              </div>
            </div>

            {/* TAB ULASAN */}
            {activeTab === "ulasan" && (
              <div>
                {userReviews.length > 0 ? (
                  userReviews.map((r) => (
                    <div key={r.id_ulasan} className="review-item-card">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <span className="review-item-title">{r.nama_restoran || "Restoran"}</span>
                          <span className="review-item-pill">{r.kategori_Restoran || "Kategori"}</span>
                        </div>
                        <div className="text-end">
                          <StarRating rating={r.rating} />
                          <div className="text-secondary mt-1" style={{ fontSize: "0.75rem" }}>
                             {new Date(r.tanggal_ulasan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <p className="review-item-quote">"{r.judul_ulasan || "Ulasan Restoran"}"</p>
                      <p className="text-secondary mb-0" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>{r.isi_review}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 bg-white rounded-3 border">
                    <p className="text-secondary fw-semibold">Tidak ada ulasan untuk ditampilkan.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB FAVORIT */}
            {activeTab === "bookmark" && (
              <div>
                {userBookmarks.length > 0 ? (
                  userBookmarks.map((fav) => (
                    <div key={fav.id_bookmark} className="favorite-item-card d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="fav-icon-box" style={{ background: "#f8f9fa", width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginRight: "1rem" }}>🍽️</div>
                        <div>
                          <span className="review-item-title d-block mb-1">{fav.nama_restoran}</span>
                          <span className="text-secondary" style={{ fontSize: "0.8rem", fontWeight: 500 }}>{fav.kategori_Restoran} · {fav.alamat_restoran}</span>
                        </div>
                      </div>
                      <div className="text-end">
                        <div style={{ marginBottom: "0.3rem" }}>
                           <StarRating rating={fav.rating || 5} />
                        </div>
                        <span className="fw-bold fs-5" style={{ color: "#212529" }}>{fav.rating || "4.8"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 bg-white rounded-3 border">
                    <p className="text-secondary fw-semibold">Belum ada restoran yang difavoritkan.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}