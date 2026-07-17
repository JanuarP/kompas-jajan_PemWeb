import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import RestaurantMenuPage from "./components/RestaurantMenuPage";
import RestaurantDetailPage from "./components/RestaurantDetailPage";
import ProfilePage from "./components/ProfilePage";
import AddReviewPage from "./components/AddReviewPage";
import AddRestaurant from "./components/AddRestaurant";
import Jelajahi from "./components/Jelajahi";
import EditProfilePage from "./components/EditProfilePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./khavid.css";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Kategori kuliner dengan icon FontAwesome
const CATEGORY_LIST = [
  { name: "Masakan Jawa",     icon: "fa-solid fa-bowl-rice" },
  { name: "Masakan Padang",   icon: "fa-solid fa-pepper-hot" },
  { name: "Sate",             icon: "fa-solid fa-drumstick-bite" },
  { name: "Cafe",             icon: "fa-solid fa-mug-hot" },
  { name: "Italian / Western",icon: "fa-solid fa-pizza-slice" },
  { name: "Japanese / Seafood",icon: "fa-solid fa-fish" },
  { name: "Mie & Bakso",      icon: "fa-solid fa-noodles" },
  { name: "Seafood",          icon: "fa-solid fa-shrimp" },
];

// Foto sampul per kategori (tabel `restoran` belum punya kolom gambar sendiri,
// jadi dipetakan dari kategori supaya tiap kartu tidak pakai foto generik yang sama persis).
const CATEGORY_IMAGES = {
  "Masakan Jawa": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=60",
  "Masakan Padang": "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&auto=format&fit=crop&q=60",
  "Sate": "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=600&auto=format&fit=crop&q=60",
  "Cafe": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60",
  "Italian / Western": "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=600&auto=format&fit=crop&q=60",
  "Japanese / Seafood": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&auto=format&fit=crop&q=60",
  "Mie & Bakso": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=60",
  "Seafood": "https://images.unsplash.com/photo-1560717845-968823efbee1?w=600&auto=format&fit=crop&q=60",
};
const DEFAULT_RESTO_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60";

function getCategoryImage(category) {
  return CATEGORY_IMAGES[category] || DEFAULT_RESTO_IMAGE;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("login");
  const [fotomenus, setFotomenus] = useState([]);

  // ============================================================
  // FETCH DATA AWAL
  // ============================================================
  const fetchData = useCallback(async () => {
    try {
      const [restoRes, menuRes, reviewsRes] = await Promise.all([
        axios.get("http://localhost:3000/"),
        axios.get("http://localhost:3000/menu"),
        axios.get("http://localhost:3000/ulasan"),
        axios.get("http://localhost:3000/fotomenu").catch(() => ({ data: [] }))
      ]);
      setRestaurants(restoRes.data);
      setMenus(menuRes.data);
      setReviews(reviewsRes.data);
      setFotomenus(fotoRes.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Fetch bookmark saat user login
  useEffect(() => {
    if (!currentUser?.id_user) { setBookmarks([]); return; }
    axios.get(`http://localhost:3000/bookmark?id_user=${currentUser.id_user}`)
      .then(res => setBookmarks(res.data || []))
      .catch(() => {});
  }, [currentUser]);

  // ============================================================
  // HANDLER NAVIGASI
  // ============================================================
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentView("home");
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("login");
  };

  // ============================================================
  // HANDLER BUKA HALAMAN RESTORAN
  // ============================================================
  const handleOpenMenuPage = (restaurantDariDB) => {
    const menuSesuai = menus.filter(m => m.id_restoran === restaurantDariDB.id_restoran);
    // Ambil foto yang sesuai dengan ID restoran
    const fotoSesuai = fotomenus.filter(f => f.id_restoran === restaurantDariDB.id_restoran);

    const mappedMenus = menuSesuai.map((m, index) => {
      // Gabungkan berdasarkan urutan index karena tidak ada id_menu di tabel fotomenu
      const fotoObj = fotoSesuai[index]; 
      return {
        id: m.id_menu,
        name: m.nama_makananMinuman,
        price: parseFloat(m.harga),
        description: m.deskripsi_makananMinuman,
        category: m.kategori_makananMinuman || "Menu",
        badge: "Tersedia",
        image: fotoObj ? fotoObj.foto : null, // Memasukkan nama file foto (misal: "NasiPutih.jpg")
      };
    });

    const mappedRestaurant = {
      id_restoran: restaurantDariDB.id_restoran,
      name: restaurantDariDB.nama_restoran,
      description: restaurantDariDB.deskripsi_restoran,
      location: restaurantDariDB.alamat_restoran,
      rating: restaurantDariDB.rating || "Belum ada rating",
      priceRange: restaurantDariDB.rentang_harga || "Belum ada info harga",
      openHours: restaurantDariDB.jam_operasional || "Belum ada info jam",
      category: restaurantDariDB.kategori_Restoran,
      stats: {
        menus: mappedMenus.length,
        kategori: new Set(mappedMenus.map(m => m.category)).size,
        favorit: 0,
        estimasi: "15-20 mnt",
      },
      menus: mappedMenus,
    };
    setSelectedRestaurant(mappedRestaurant);
    setCurrentView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToDashboard = () => {
    setCurrentView("home");
    setSelectedRestaurant(null);
  };

  // ============================================================
  // HANDLER TOGGLE BOOKMARK (wishlist)
  // ============================================================
  const handleToggleWishlist = async (resto) => {
    if (!currentUser) { alert("Silakan login untuk menyimpan bookmark."); return; }

    const restoObj = restaurants.find(r => r.id_restoran === (resto.id_restoran || resto.id));
    if (!restoObj) return;

    const alreadyBookmarked = bookmarks.some(b => b.id_restoran === restoObj.id_restoran);

    try {
      if (alreadyBookmarked) {
        await axios.delete("http://localhost:3000/bookmark", {
          data: { id_user: currentUser.id_user, id_restoran: restoObj.id_restoran }
        });
        setBookmarks(prev => prev.filter(b => b.id_restoran !== restoObj.id_restoran));
      } else {
        const res = await axios.post("http://localhost:3000/bookmark", {
          id_user: currentUser.id_user,
          id_restoran: restoObj.id_restoran
        });
        setBookmarks(prev => [...prev, {
          id_bookmark: res.data.id_bookmark,
          id_user: currentUser.id_user,
          id_restoran: restoObj.id_restoran,
          nama_restoran: restoObj.nama_restoran,
          kategori_Restoran: restoObj.kategori_Restoran,
          alamat_restoran: restoObj.alamat_restoran,
          rating: restoObj.rating
        }]);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Gagal memperbarui bookmark.");
    }
  };

  // ============================================================
  // HANDLER UPDATE USER (dari ProfilePage)
  // ============================================================
  const handleUpdateUser = (updatedData) => {
    setCurrentUser(prev => ({
      ...prev,
      username: updatedData.username || prev.username,
      email: updatedData.email_user || prev.email,
      bio: updatedData.bio || prev.bio,
      lokasi: updatedData.lokasi || prev.lokasi,
    }));
  };

  // ============================================================
  // MAPPING DATA
  // ============================================================
  const mappedRestaurants = restaurants.map((r) => ({
    id: r.id_restoran,
    id_restoran: r.id_restoran,
    name: r.nama_restoran,
    location: r.alamat_restoran,
    category: r.kategori_Restoran,
    avgRating: parseFloat(r.rating) || 0,
    reviewsCount: reviews.filter(rv => rv.id_restoran === r.id_restoran).length,
    image: getCategoryImage(r.kategori_Restoran),
    nama_restoran: r.nama_restoran,
    deskripsi_restoran: r.deskripsi_restoran,
    alamat_restoran: r.alamat_restoran,
    rating: r.rating,
    rentang_harga: r.rentang_harga,
    jam_operasional: r.jam_operasional,
    kategori_Restoran: r.kategori_Restoran,
  }));

  const activeUser = currentUser ? {
    id_user: currentUser.id_user,
    name: currentUser.username || "Pengguna",
    username: currentUser.username || "user",
    avatar: (currentUser.username || "U").substring(0, 2).toUpperCase(),
    location: currentUser.lokasi || "Lokasi belum diatur",
    joined: currentUser.tanggal_akun_dibuat || "Baru saja bergabung",
    bio: currentUser.bio || "Pecinta kuliner.",
    role: currentUser.role,
    email: currentUser.email,
  } : null;

  const filteredMenus = selectedRestaurant?.menus ? selectedRestaurant.menus.filter((item) => {
    const matchesSearch = (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  const menuCategories = selectedRestaurant?.menus
    ? ["Semua", ...new Set(selectedRestaurant.menus.map(item => item.category))]
    : ["Semua"];

  const userWishlist = bookmarks;

  // ============================================================
  // RENDER KONTEN
  // ============================================================
  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div>
            <p style={{ textAlign: "center", color: "#868e96" }}>⏳ Memuat data sistem...</p>
          </div>
        </div>
      );
    }

    if (currentView === "login") {
      return <Login onLogin={handleLoginSuccess} onNavigate={handleNavigate} />;
    }

    if (currentView === "register") {
      return <Register onNavigate={handleNavigate} />;
    }

    if (currentView === "home") {
      return (
        <Home
          user={activeUser}
          reviews={reviews.filter(rv => rv.id_user === currentUser?.id_user)}
          wishlist={userWishlist}
          restaurants={mappedRestaurants}
          onNavigate={handleNavigate}
          onWriteReviewClick={() => handleNavigate("review")}
          onViewDetail={handleOpenMenuPage}
        />
      );
    }

    if (currentView === "explore") {
      return (
        <Jelajahi
          restaurants={mappedRestaurants}
          categories={CATEGORY_LIST}
          wishlist={userWishlist}
          onToggleWishlist={handleToggleWishlist}
          onWriteReviewFromExplore={() => handleNavigate("review")}
          onViewDetail={handleOpenMenuPage}
        />
      );
    }

    if (currentView === "dashboard") {
      return (
        <ProfilePage
          currentUser={currentUser}
          onNavigate={handleNavigate}
          onUpdateUser={handleUpdateUser}
        />
      );
    }

    if (currentView === "editProfile") {
      return (
        <EditProfilePage
          currentUser={currentUser}
          onNavigate={handleNavigate}
          onUpdateUser={handleUpdateUser}
        />
      );
    }

    if (currentView === "review") {
      if (!selectedRestaurant) {
        // Jika belum pilih restoran, tampilkan pilih restoran dulu
        return (
          <main className="container-shell page-spacing">
            <section className="form-header-card">
              <div>
                <span className="hero-label">Tulis Ulasan</span>
                <h1>Pilih Restoran Terlebih Dahulu</h1>
                <p>Silakan pilih restoran dari halaman Jelajahi, lalu klik tombol "Tulis Ulasan".</p>
              </div>
              <button className="light-btn" onClick={() => handleNavigate("explore")}>
                Ke Halaman Jelajahi
              </button>
            </section>
          </main>
        );
      }
      return (
        <AddReviewPage
          restaurant={selectedRestaurant}
          currentUser={currentUser}
          onBack={() => handleNavigate("detail")}
          onSubmitReview={() => {
            fetchData();
            handleNavigate("detail");
          }}
        />
      );
    }

    if (currentView === "detail" && selectedRestaurant) {
      return (
        <RestaurantDetailPage
          restaurant={selectedRestaurant}
          reviews={reviews.filter(r => r.id_restoran === selectedRestaurant.id_restoran)}
          averageRating={selectedRestaurant.rating}
          formatRupiah={formatRupiah}
          onOpenMenu={() => setCurrentView("menu")}
          onOpenReview={() => setCurrentView("review")}
          onBackDashboard={handleBackToDashboard}
        />
      );
    }

    if (currentView === "menu" && selectedRestaurant) {
      return (
        <RestaurantMenuPage
          restaurant={selectedRestaurant}
          categories={menuCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filteredMenus={filteredMenus}
          formatRupiah={formatRupiah}
          onOpenDetail={() => setCurrentView("detail")}
          onBack={handleBackToDashboard}
        />
      );
    }

    // Admin: Tambah Restoran
    if (currentView === "addRestoran") {
      if (currentUser?.role !== "admin") {
        return (
          <div style={{ padding: 40, textAlign: "center" }}>
            <h2>⛔ Akses Ditolak</h2>
            <p>Halaman ini hanya untuk admin.</p>
            <button className="dark-btn" onClick={() => handleNavigate("home")}>Kembali ke Home</button>
          </div>
        );
      }
      return (
        <AddRestaurant
          currentUser={currentUser}
          onBack={() => handleNavigate("home")}
          onSuccess={fetchData}
        />
      );
    }

    return <div style={{ padding: 40, textAlign: "center" }}>Halaman tidak ditemukan.</div>;
  };

  return (
    <div className="app-main-layout">
      <Navbar
        user={activeUser}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onWriteReviewClick={() => handleNavigate("review")}
      />
      {renderContent()}
      <Footer />
    </div>
  );
}
