import { useState, useMemo } from 'react';

export default function Jelajahi({ restaurants: exploreRestaurants, categories: categoryList, wishlist, onToggleWishlist, onWriteReviewFromExplore, onViewDetail }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'ulasan', 'alphabetical'

  const categories = useMemo(() => ["Semua Kategori", ...categoryList.map(c => c.name)], [categoryList]);
  const categoryIcons = useMemo(() => {
    const map = { "Semua Kategori": "fa-solid fa-utensils" };
    categoryList.forEach(c => { map[c.name] = c.icon; });
    return map;
  }, [categoryList]);

  const sortRestaurants = (list) => {
    return [...list].sort((a, b) => {
      if (sortBy === 'rating') {
        return b.avgRating - a.avgRating;
      } else if (sortBy === 'ulasan') {
        return b.reviewsCount - a.reviewsCount;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  };

  // Menyaring dan mengurutkan data restoran berdasarkan input pencarian, kategori, dan opsi sorting
  const filteredAndSortedRestaurants = useMemo(() => {
    const list = exploreRestaurants.filter(resto => {
      const matchesSearch = resto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            resto.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Semua Kategori" || resto.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    return sortRestaurants(list);
  }, [exploreRestaurants, searchQuery, selectedCategory, sortBy]);

  // Daftar semua tempat kuliner tanpa filter kategori (hanya terpengaruh pencarian)
  const allRestaurantsSorted = useMemo(() => {
    const list = exploreRestaurants.filter(resto =>
      resto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resto.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return sortRestaurants(list);
  }, [exploreRestaurants, searchQuery, sortBy]);

  return (
    <div className="explore-page-layout">
      {/* TripAdvisor-style Hero Banner */}
      <div className="explore-banner-hero tripadvisor-hero">
        <div className="explore-banner-overlay"></div>
        <div className="explore-banner-content">
          <h1>Mau Jajan Kuliner ke Mana?</h1>
          <p>Temukan rekomendasi kuliner legendaris & UMKM terfavorit berdasarkan review tepercaya.</p>
          
          <div className="tripadvisor-search-container">
            <i className="fa-solid fa-magnifying-glass search-icon-large"></i>
            <input 
              type="text" 
              placeholder="Cari gudeg, sate klatak, kafe wfh, atau jalan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn-submit">Cari</button>
          </div>
        </div>
      </div>

      {/* TripAdvisor-style Category Selector (Round Circle Buttons with Captions) */}
      <div className="tripadvisor-categories-section">
        <div className="categories-grid-wrapper">
          {categories.map((cat, i) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={i}
                className={`tripadvisor-cat-btn ${isSelected ? 'active-cat-btn' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <div className="cat-icon-circle">
                  <i className={categoryIcons[cat] || "fa-solid fa-utensils"}></i>
                </div>
                <span className="cat-btn-label">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section: Hasil saringan kategori terpilih */}
      {selectedCategory !== "Semua Kategori" && (
        <>
          <div className="explore-section-header">
            <div>
              <h2>{selectedCategory}</h2>
              <p className="section-subtitle">Menampilkan tempat kuliner dalam kategori ini</p>
            </div>
          </div>

          <div className="explore-results-summary-row">
            <span>Menampilkan <strong>{filteredAndSortedRestaurants.length}</strong> tempat kuliner kategori {selectedCategory}</span>
          </div>

          {filteredAndSortedRestaurants.length > 0 ? (
            <div className="explore-grid-container">
              {filteredAndSortedRestaurants.map((resto) => (
                <RestoCard
                  key={resto.id}
                  resto={resto}
                  isWishlisted={wishlist.some(item => item.restaurantName === resto.name)}
                  onToggleWishlist={onToggleWishlist}
                  onWriteReviewFromExplore={onWriteReviewFromExplore}
                  onViewDetail={onViewDetail}
                />
              ))}
            </div>
          ) : (
            <div className="explore-empty-state-container">
              <i className="fa-solid fa-compass empty-icon-spinning"></i>
              <h3>Kuliner Tidak Ditemukan</h3>
              <p>Coba ubah kata kunci pencarian Anda atau pilih kategori kuliner yang berbeda.</p>
              <button className="reset-explore-filters-btn" onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua Kategori');
              }}>
                Reset Pencarian
              </button>
            </div>
          )}
        </>
      )}

      {/* Section: Semua Tempat Kuliner (semua kategori, tidak terpengaruh filter kategori) */}
      <div className="explore-section-header margin-top-lg">
        <div>
          <h2>Semua Tempat Kuliner</h2>
          <p className="section-subtitle">Menampilkan seluruh tempat kuliner dari semua kategori</p>
        </div>

        <div className="explore-sort-controls">
          <label htmlFor="sort-select"><i className="fa-solid fa-sliders"></i> Urutkan:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="explore-sort-select"
          >
            <option value="rating">Rating Tertinggi</option>
            <option value="ulasan">Ulasan Terbanyak</option>
            <option value="alphabet">Nama A-Z</option>
          </select>
        </div>
      </div>

      <div className="explore-results-summary-row">
        <span>Menampilkan <strong>{allRestaurantsSorted.length}</strong> tempat kuliner terbaik</span>
      </div>

      {allRestaurantsSorted.length > 0 ? (
        <div className="explore-grid-container">
          {allRestaurantsSorted.map((resto) => (
            <RestoCard
              key={resto.id}
              resto={resto}
              isWishlisted={wishlist.some(item => item.restaurantName === resto.name)}
              onToggleWishlist={onToggleWishlist}
              onWriteReviewFromExplore={onWriteReviewFromExplore}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      ) : (
        <div className="explore-empty-state-container">
          <i className="fa-solid fa-compass empty-icon-spinning"></i>
          <h3>Kuliner Tidak Ditemukan</h3>
          <p>Coba ubah kata kunci pencarian Anda.</p>
          <button className="reset-explore-filters-btn" onClick={() => setSearchQuery('')}>
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
}

function RestoCard({ resto, isWishlisted, onToggleWishlist, onWriteReviewFromExplore, onViewDetail }) {
  const ratingRoundVal = Math.round(resto.avgRating);

  return (
    <article className="explore-restaurant-card">
      <div className="explore-card-image-box">
        <img
          src={resto.image}
          alt={resto.name}
          className="explore-card-img cursor-pointer"
          onClick={() => onViewDetail(resto)}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60"; }}
        />
        <div className="explore-image-overlay" onClick={() => onViewDetail(resto)}></div>

        <span className="explore-card-category-badge">{resto.category}</span>

        <button
          className={`explore-wishlist-toggle-btn ${isWishlisted ? 'wishlisted-active' : ''}`}
          onClick={() => onToggleWishlist(resto)}
          title={isWishlisted ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
        >
          {isWishlisted ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}
        </button>
      </div>

      <div className="explore-card-details-body">
        <div className="explore-card-title-rating-row">
          <h3 className="explore-resto-title-text cursor-pointer" onClick={() => onViewDetail(resto)}>{resto.name}</h3>
          <div className="tripadvisor-rating-row">
            <div className="tripadvisor-circles">
              {[1, 2, 3, 4, 5].map((circle) => (
                <span
                  key={circle}
                  className={`rating-circle ${circle <= ratingRoundVal ? 'circle-filled' : 'circle-empty'}`}
                ></span>
              ))}
            </div>
            <span className="tripadvisor-rating-count">
              {resto.reviewsCount > 0 ? `${resto.avgRating} (${resto.reviewsCount})` : 'Belum ada ulasan'}
            </span>
          </div>
        </div>

        <div className="explore-location-row-meta">
          <i className="fa-solid fa-map-pin pin-pink"></i>
          <span>{resto.location}</span>
        </div>

        <div className="explore-card-actions-footer">
          <button
            className={`explore-btn-add-wishlist ${isWishlisted ? 'btn-wishlisted-grey' : ''}`}
            onClick={() => onToggleWishlist(resto)}
          >
            {isWishlisted ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}
            <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
          </button>

          <button
            className="explore-btn-write-review"
            onClick={() => onWriteReviewFromExplore(resto.name)}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Tulis Ulasan</span>
          </button>
        </div>
      </div>
    </article>
  );
}
