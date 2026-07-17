import { useMemo } from 'react';

export default function Home({ user, reviews, wishlist, restaurants, onNavigate, onWriteReviewClick, onViewDetail }) {
  const topRestaurants = useMemo(() => {
    return [...restaurants]
      .filter(r => r.reviewsCount > 0)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);
  }, [restaurants]);

  const menuItems = [
    {
      icon: '🔍',
      title: 'Cari Kuliner',
      desc: 'Jelajahi dan saring restoran berdasarkan kategori atau lokasi.',
      onClick: () => onNavigate('explore'),
    },
    {
      icon: '✏️',
      title: 'Tulis Ulasan',
      desc: 'Bagikan pengalaman jajanmu untuk komunitas.',
      onClick: onWriteReviewClick,
    },
    {
      icon: '👤',
      title: 'Profil & Ulasan Saya',
      desc: 'Lihat riwayat ulasan dan daftar wishlist kamu.',
      onClick: () => onNavigate('dashboard'),
    },
  ];

  return (
    <div className="home-landing-layout">
      {/* Hero Section */}
      <section
        className="home-hero-banner"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80')",
        }}
      >
        <div className="home-hero-overlay"></div>
        <div className="home-hero-content">
          <span className="home-hero-eyebrow">Selamat Datang, {user.name ? user.name.split(' ')[0] : 'Reviewer'}</span>
          <h1>Mau Jajan Apa Hari Ini?</h1>
          <p>Temukan dan ulas kuliner terbaik di Yogyakarta bersama komunitas KompasJajan.</p>
          <button className="home-hero-cta" onClick={() => onNavigate('explore')}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Cari Kuliner Sekarang</span>
          </button>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="home-stats-strip">
        <div className="home-stats-strip-item">
          <h3>{reviews.length}</h3>
          <p>Ulasan Saya</p>
        </div>
        <div className="home-stats-strip-divider"></div>
        <div className="home-stats-strip-item">
          <h3>{wishlist.length}</h3>
          <p>Wishlist Tersimpan</p>
        </div>
        <div className="home-stats-strip-divider"></div>
        <div className="home-stats-strip-item">
          <h3>{restaurants.length}</h3>
          <p>Kuliner Terdaftar</p>
        </div>
      </div>

      {/* Menu Section */}
      <section className="home-menu-section">
        <div className="home-section-heading">
          <h2>Mulai Dari Sini</h2>
          <p>Pilih menu di bawah untuk lanjut menjelajah</p>
        </div>
        <div className="home-menu-grid">
          {menuItems.map((item, idx) => (
            <button key={idx} className="home-menu-card" onClick={item.onClick}>
              <div className="home-menu-icon">
                <i>{item.icon}</i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span className="home-menu-arrow">
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Recommendation Section */}
      {topRestaurants.length > 0 && (
        <section className="home-menu-section">
          <div className="home-section-heading">
            <h2>Rekomendasi Rating Tertinggi</h2>
            <p>Kuliner dengan penilaian terbaik dari komunitas</p>
          </div>
          <div className="home-recommend-list">
            {topRestaurants.map((resto) => (
              <button key={resto.id} className="home-recommend-item" onClick={() => onViewDetail(resto)}>
                <img
                  src={resto.image}
                  alt={resto.name}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60"; }}
                />
                <div className="home-recommend-info">
                  <h4>{resto.name}</h4>
                  <span className="home-recommend-meta">
                    <i className="fa-solid fa-star"></i> {resto.avgRating} · {resto.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
