import { useState, useMemo } from "react";

const fotoDummyData = [
  { id_menu: 3, image: "/image/AyamKampungBacem.jpeg" },
  { id_menu: 20, image: "/image/EsCincauGulaMerah.jpeg" },
  { id_menu: 25, image: "/image/GulaiKambing.jpg" },
  { id_menu: 30, image: "/image/JerukNipis.jpg" },
  { id_menu: 8, image: "/image/JerukPeras.jpg" },
  { id_menu: 11, image: "/image/KopiKlotokHitam.jpg" },
  { id_menu: 9, image: "/image/KopiTubruk.jpg" },
  { id_menu: 12, image: "/image/KopiSusuGulaAren.jpeg" },
  { id_menu: 17, image: "/image/MieRebusRempah.jpeg" },
  { id_menu: 26, image: "/image/NasiGorengKambing.jpeg" },
  { id_menu: 27, image: "/image/NasiPutih.jpg" },
  { id_menu: 1, image: "/image/NasiGudegKomplit.jpg" },
  { id_menu: 4, image: "/image/TelurPindang.jpg" },
  { id_menu: 7, image: "/image/TehManis.jpg" },
  { id_menu: 2, image: "/image/NasiGudegKrecek.jpeg" },
  { id_menu: 13, image: "/image/PisangGorengKepok.webp" },
  { id_menu: 6, image: "/image/SayurLodeh.webp" },
  { id_menu: 5, image: "/image/TahuTempeBacem.webp" },
  { id_menu: 15, image: "/image/RotiBakarCoklatKeju.jpeg" },
  { id_menu: 10, image: "/image/WedangJahe.jpg" },
  { id_menu: 14, image: "/image/SingkongGoreng.jpg" },
  { id_menu: 16, image: "/image/NasiTelurKrispi.jpg" },
  { id_menu: 18, image: "/image/TehTarik.jpg" },
  { id_menu: 19, image: "/image/WedangUwuh.jpg" },
  { id_menu: 28, image: "/image/SateAyam.jpg" },
  { id_menu: 21, image: "/image/SateKambingMuda.jpeg" },
  { id_menu: 24, image: "/image/TengklengKambing.webp" },
  { id_menu: 29, image: "/image/TehKampul.webp" },
  { id_menu: 22, image: "/image/SateBuntel.jpeg" },
  { id_menu: 23, image: "/image/TongsengKambing.jpg" }
];

function MenuCard({ item, formatRupiah }) {
  // PERBAIKAN: Langsung gunakan item.image karena dari dummyData sudah ada "/image/..."
  const imageUrl = item.image && item.image !== "🍽️" ? item.image : null;

  return (
    <article className="content-card menu-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
      
      {/* Area Gambar Menu */}
      <div style={{ width: "100%", height: "200px", backgroundColor: "#f8f9fa", position: "relative" }}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={item.name} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x200?text=Foto+Tidak+Tersedia";
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
            🍽️
          </div>
        )}
      </div>

      {/* Area Teks Menu */}
      <div className="menu-card-body" style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <div className="row-between gap-12" style={{ marginBottom: "12px" }}>
          <div>
            <span className="soft-badge" style={{ marginBottom: "8px", display: "inline-block", fontSize: "0.75rem", fontWeight: "600" }}>{item.category}</span>
            <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#212529" }}>{item.name}</h3>
          </div>
          <span className="price-text" style={{ fontSize: "1.1rem", color: "#e83e8c", fontWeight: "700" }}>{formatRupiah(item.price)}</span>
        </div>

        <p style={{ color: "#6c757d", fontSize: "0.9rem", flexGrow: 1, lineHeight: "1.5" }}>{item.description}</p>

        <div className="row-between gap-12 menu-meta" style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f1f3f5" }}>
          <div className="meta-inline">
            <span style={{ fontSize: "0.85rem", color: "#495057", fontWeight: "500" }}>⭐ {item.rating || "0.0"}</span>
          </div>
          <span className="outline-badge" style={{ fontSize: "0.75rem" }}>{item.badge}</span>
        </div>
      </div>
    </article>
  );
}

function StatsBox({ label, value }) {
  return (
    <div className="stats-box" style={{ background: "#fff", padding: "15px", borderRadius: "10px", border: "1px solid #f1f3f5", textAlign: "center" }}>
      <small style={{ color: "#868e96", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>{label}</small>
      <strong style={{ display: "block", fontSize: "1.5rem", color: "#212529", marginTop: "5px" }}>{value}</strong>
    </div>
  );
}

export default function RestaurantMenuPage({
  restaurant,
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  filteredMenus,
  formatRupiah,
  onOpenDetail,
  onBack,
}) {
  // Gabungkan data database dengan gambar dari folder lokal
  const menusWithImages = useMemo(() => {
    // Looping setiap menu dari database
    return filteredMenus.map((dbMenu) => {
      
      // Cari foto di dummy data yang id_menu-nya cocok dengan dbMenu.id
      const matchedFoto = fotoDummyData.find(foto => foto.id_menu === dbMenu.id);

      // Kembalikan objek menu database utuh, tapi tambahkan/timpa properti 'image'
      return {
        ...dbMenu,
        image: matchedFoto ? matchedFoto.image : null // Jika ketemu, pasang fotonya. Jika tidak, null.
      };
    });
  }, [filteredMenus]); // useMemo hanya akan menghitung ulang jika data dari database berubah

  return (
    <main className="container-shell page-spacing">
      <section className="hero-card" style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <div className="hero-copy" style={{ padding: "40px" }}>
          <span className="hero-label">Halaman daftar menu restoran</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#212529", marginBottom: "15px" }}>{restaurant?.name}</h1>
          <p style={{ color: "#495057", fontSize: "1.05rem", maxWidth: "600px" }}>
            Pilihan menu utama, minuman, dan dessert disusun dalam tampilan kartu
            modern agar pengguna mudah menelusuri item terbaik restoran.
          </p>

          <div className="meta-inline wrap" style={{ marginTop: "20px", gap: "20px" }}>
            <span style={{ fontWeight: "500" }}>📍 {restaurant.location}</span>
            <span style={{ fontWeight: "500" }}>⭐ {restaurant?.rating} dari {restaurant?.reviewCount || 0} ulasan</span>
            <span style={{ fontWeight: "500" }}>🕒 {restaurant.openHours}</span>
          </div>

          <div className="hero-actions" style={{ marginTop: "30px" }}>
            <button type="button" className="dark-btn" onClick={onOpenDetail}>
              Lihat detail restoran
            </button>
            <button type="button" className="light-btn" onClick={onBack}>
              Kembali ke Home
            </button>
          </div>
        </div>

        <div className="hero-panel" style={{ background: "#f8f9fa", padding: "30px 40px", borderTop: "1px solid #e9ecef" }}>
          <div className="panel-title" style={{ fontSize: "0.9rem", fontWeight: "700", textTransform: "uppercase", color: "#495057", marginBottom: "15px" }}>Ringkasan cepat</div>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "15px" }}>
            <StatsBox label="Total Menu" value={restaurant?.stats?.menus || 0} />
            <StatsBox label="Kategori" value={restaurant?.stats?.kategori || 0} />
            <StatsBox label="Menu Favorit" value={restaurant?.stats?.favorit || 0} />
            <StatsBox label="Estimasi Sajian" value={restaurant?.stats?.estimasi || '-'} />
          </div>
        </div>
      </section>

      <section className="toolbar-card" style={{ background: "#fff", padding: "20px 30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", marginBottom: "30px", display: "flex", gap: "30px", flexWrap: "wrap" }}>
        <div className="toolbar-block" style={{ flexGrow: 1, minWidth: "250px" }}>
          <label className="field-label" style={{ fontSize: "0.8rem", fontWeight: "600", color: "#868e96", marginBottom: "8px", display: "block" }}>Cari Menu</label>
          <input
            type="text"
            className="text-input"
            placeholder="Cari nama menu atau deskripsi..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            style={{ width: "100%", padding: "10px 15px", borderRadius: "8px", border: "1px solid #ced4da" }}
          />
        </div>

        <div className="toolbar-block">
          <label className="field-label" style={{ fontSize: "0.8rem", fontWeight: "600", color: "#868e96", marginBottom: "8px", display: "block" }}>Filter Kategori</label>
          <div className="chip-group" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? "chip-btn active" : "chip-btn"}
                onClick={() => onSelectCategory(category)}
                style={{
                  padding: "8px 16px", borderRadius: "20px", border: "1px solid #ced4da", fontSize: "0.85rem", fontWeight: "500", cursor: "pointer", transition: "all 0.2s",
                  background: selectedCategory === category ? "#212529" : "#fff",
                  color: selectedCategory === category ? "#fff" : "#495057"
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-header" style={{ marginBottom: "20px" }}>
        <div>
          <span className="section-label" style={{ color: "#e83e8c", fontWeight: "700", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Menu tersedia</span>
          <h2 style={{ fontSize: "1.75rem", color: "#212529", margin: "5px 0 0 0" }}>{menusWithImages.length} item ditemukan</h2>
        </div>
      </section>

      <section className="menu-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px", paddingBottom: "40px" }}>
        {menusWithImages.map((item) => (
          <MenuCard key={item.id} item={item} formatRupiah={formatRupiah} />
        ))}
      </section>
    </main>
  );
}