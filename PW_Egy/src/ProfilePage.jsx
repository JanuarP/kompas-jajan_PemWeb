import { useState, useEffect } from "react";

const axios = {
  get: async (url) => {
    await new Promise((r) => setTimeout(r, 600));
    return { data: mockUser };
  },
  put: async (url, data) => {
    await new Promise((r) => setTimeout(r, 800));
    return { data: { ...mockUser, ...data } };
  },
};

const mockUser = {
  id: 1,
  name: "Gilang Febrian",
  username: "@gilangfebrian",
  city: "Yogyakarta, Indonesia",
  joinDate: "Maret 2024",
  bio: "Food enthusiast & culinary explorer. Selalu mencari hidden gems kuliner lokal yang autentik. Percaya bahwa makanan terbaik ada di warung pinggir jalan.",
  avatar: "GR",
  stats: { ulasan: 29, rating: 4.7, helpful: 173 },
  ratingDist: [
    { stars: 5, count: 18, pct: 62 },
    { stars: 4, count: 8,  pct: 28 },
    { stars: 3, count: 2,  pct: 7  },
    { stars: 2, count: 1,  pct: 3  },
    { stars: 1, count: 0,  pct: 0  },
  ],
  categories: [
    { name: "Masakan Jawa", count: 9,  pct: 62 },
    { name: "Kafe & Kopi",  count: 7,  pct: 48 },
    { name: "Sate & Grill", count: 5,  pct: 34 },
    { name: "Bakmi & Mie",  count: 4,  pct: 28 },
    { name: "Lainnya",      count: 4,  pct: 28 },
  ],
};

const reviews = [
  { id: 1, restaurant: "Warung Bu Sari",     category: "Masakan Jawa",      location: "Jl. Malioboro No. 12, Yogyakarta", rating: 5, date: "2 hari lalu",   title: '"Gudeg terenak yang pernah saya coba!"',      content: "Gudegnya manis sempurna, nangkanya lembut dan meresap bumbu. Ayam kampungnya empuk banget. Pelayanan ramah dan tempatnya nyaman.", tags: ["Gudeg","Ayam Kampung","Autentik"],        helpful: 24},
  { id: 2, restaurant: "Kopi Klotok",         category: "Kafe & Kopi",       location: "Jl. Kaliurang Km 16, Sleman",      rating: 4, date: "1 minggu lalu", title: '"Suasana pinggir sawah yang bikin betah"',    content: "View sawahnya luar biasa, apalagi pas pagi hari. Kopi jossnya unik — kopi hitam dicampur arang, rasanya smoky dan bold.",        tags: ["Kopi Jos","View Sawah","Instagramable"], helpful: 41},
  { id: 3, restaurant: "Sate Pak Mul",        category: "Sate & Grill",      location: "Jl. Parangtritis No. 88, Bantul",  rating: 5, date: "2 minggu lalu", title: '"Sate kambing juara, bumbunya meresap!"',     content: "Ukuran satenya besar-besar, dagingnya empuk dan tidak bau prengus. Bumbu kacangnya kental dan gurih. Lontongnya fresh.",          tags: ["Sate Kambing","Porsi Besar","Murah Meriah"], helpful: 18},
  { id: 4, restaurant: "Bakmi Jawa Pak Rebo", category: "Bakmi & Mie",       location: "Jl. Godean No. 5, Yogyakarta",    rating: 4, date: "1 bulan lalu",  title: '"Bakmi dimasak arang, beda banget rasanya"', content: "Proses masaknya pakai arang memberi rasa yang khas dan aroma smoky. Mie-nya kenyal, kuahnya ringan tapi berasa.",               tags: ["Bakmi Arang","Tradisional","Ramai"],      helpful: 33},
  { id: 5, restaurant: "Es Dawet Ibu Hamid",  category: "Minuman & Dessert", location: "Pasar Beringharjo, Yogyakarta",    rating: 5, date: "1 bulan lalu",  title: '"Dawet paling segar se-Malioboro!"',          content: "Santan segar, gula jawa asli, cendol hijau yang kenyal. Disajikan dengan es batu serut. Harganya sangat murah untuk kualitas yang luar biasa.", tags: ["Es Dawet","Segar","Legendaris"], helpful: 57},
];

const wishlist = [
  { icon: "🏡", name: "Jejamuran Restaurant" },
  { icon: "👑", name: "Bale Raos Keraton" },
  { icon: "🌿", name: "Mediterania Cafe" },
  { icon: "☕", name: "Warung Kopi Klotok 2" },
  { icon: "🍲", name: "Soto Pak Min Klaten" },
  { icon: "🍚", name: "Nasi Liwet Bu Wongso" },
  { icon: "🐟", name: "Mangut Lele Mbah Marto" },
  { icon: "🍗", name: "Ayam Goreng Suharti" },
];

function StarRating({ rating }) {
  return (
    <span className="text-sm tracking-widest">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "text-zinc-800" : "text-zinc-200"}>★</span>
      ))}
    </span>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-zinc-900 text-white text-sm px-5 py-3 rounded-full shadow-xl">
      <span className="text-green-400">✓</span>
      {message}
    </div>
  );
}

function EditProfileModal({ user, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    name:     user.name,
    username: user.username,
    city:     user.city,
    bio:      user.bio,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const initials = form.name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-zinc-100">

        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 tracking-tight">Edit Profil</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Perbarui informasi akun Anda</p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
          >✕</button>
        </div>

        <div className="px-6 pt-5 pb-2 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-800">{form.name}</p>
            <button className="text-xs text-zinc-400 hover:text-zinc-700 underline underline-offset-2 mt-0.5 transition-colors">
              Ganti foto profil
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium block mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 text-zinc-800 bg-zinc-50 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all"
                placeholder="Nama lengkap"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium block mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={set("username")}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 text-zinc-800 bg-zinc-50 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all"
                placeholder="@username"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium block mb-1.5">
              Kota
            </label>
            <input
              type="text"
              value={form.city}
              onChange={set("city")}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 text-zinc-800 bg-zinc-50 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all"
              placeholder="Kota, Negara"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium block mb-1.5">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={set("bio")}
              rows={3}
              maxLength={200}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 text-zinc-800 bg-zinc-50 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all resize-none"
              placeholder="Ceritakan sedikit tentang dirimu..."
            />
            <p className="text-[11px] text-zinc-300 mt-1 text-right">{form.bio.length}/200 karakter</p>
          </div>
        </div>

        <div className="px-6 pb-5 flex items-center justify-between">
          <p className="text-xs text-zinc-300">Perubahan akan disimpan ke server</p>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all"
            >
              Batal
            </button>
            <button
              onClick={() => onSave(form)}
              disabled={loading}
              className="px-5 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  Menyimpan...
                </>
              ) : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  const [liked, setLiked] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);

  const toggleLike = () => {
    setLiked((prev) => {
      setHelpfulCount((c) => prev ? c - 1 : c + 1);
      return !prev;
    });
  };

  return (
    <div className="bg-white border border-zinc-100 rounded-xl p-5 hover:border-zinc-300 hover:shadow-sm transition-all">
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-zinc-900 text-sm">{review.restaurant}</span>
            <span className="text-[11px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-200">
              {review.category}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">📍 {review.location}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <StarRating rating={review.rating} />
          <p className="text-[11px] text-zinc-400 mt-0.5">{review.date}</p>
        </div>
      </div>

      <p className="text-sm font-semibold text-zinc-800 italic mb-2">{review.title}</p>
      <p className="text-xs text-zinc-500 leading-relaxed mb-3">{review.content}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {review.tags.map((tag) => (
          <span key={tag} className="text-[11px] bg-zinc-50 text-zinc-600 px-2.5 py-0.5 rounded-full border border-zinc-200">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-zinc-50 text-xs text-zinc-400">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 border transition-all ${
            liked
              ? "bg-zinc-900 text-white border-zinc-900"
              : "border-zinc-200 hover:border-zinc-400 hover:text-zinc-700"
          }`}
        >
          👍 {helpfulCount} Helpful
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("ulasan");
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    axios.get("/api/user/1").then((res) => {
      setUser(res.data);
      setLoadingUser(false);
    });
  }, []);

  const handleSave = async (form) => {
    setSavingEdit(true);
    try {
      const res = await axios.put("/api/user/1", form);
      setUser((u) => ({ ...u, ...res.data }));
      setEditOpen(false);
      setToast("Profil berhasil diperbarui!");
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredReviews =
    ratingFilter === 0 ? reviews : reviews.filter((r) => r.rating === ratingFilter);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
          <p className="text-sm text-zinc-400">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const avatarInitials = user.name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">

      <nav className="bg-zinc-900 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">

            <span className="text-white font-bold tracking-tight text-lg">
              Kompas<span className="text-zinc-400">Jajan</span>
            </span>
            <span className="hidden sm:block text-[11px] text-zinc-600 border-l border-zinc-700 pl-3 uppercase tracking-widest">
              Reviewer Platform
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="text-zinc-500 hover:text-zinc-200 text-xs tracking-wide transition-colors hidden sm:block">
              Jelajahi
            </a>

            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-200 cursor-pointer hover:bg-zinc-600 transition-colors">
              {avatarInitials}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
          <div className="h-28 bg-gradient-to-r from-zinc-800 to-zinc-900 relative">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
                backgroundSize: "14px 14px",
              }}
            />
          </div>

          <div className="px-6 pb-5">

            <div className="flex items-end justify-between -mt-11 mb-5 relative z-10">
              <div className="w-20 h-20 rounded-full bg-zinc-900 border-4 border-white shadow-lg flex items-center justify-center font-bold text-2xl text-white">
                {avatarInitials}
              </div>
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 border border-zinc-200 rounded-lg text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50 transition-all mb-1"
              >
                ✏️ Edit Profil
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">{user.name}</h1>
              <span className="text-sm text-zinc-400">{user.username}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
              <span className="text-xs text-zinc-400">📍 {user.city}</span>
              <span className="text-xs text-zinc-400">📅 Bergabung {user.joinDate}</span>
            </div>
            <p className="text-sm text-zinc-500 mt-2.5 leading-relaxed max-w-lg">{user.bio}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Ulasan",  value: user.stats.ulasan,  icon: "📝" },
            { label: "Rating",  value: user.stats.rating,  icon: "⭐" },
            { label: "Helpful", value: user.stats.helpful, icon: "👍" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-zinc-100 p-4 text-center hover:shadow-sm hover:border-zinc-200 transition-all">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-zinc-900 tracking-tight">{s.value}</div>
              <div className="text-xs text-zinc-400 mt-0.5 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-start">

          <div className="w-full lg:w-64 flex-shrink-0 space-y-4">

            <div className="bg-white rounded-xl border border-zinc-100 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-zinc-900 rounded-full inline-block" />
                Distribusi Rating
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-bold text-zinc-900 tracking-tighter">{user.stats.rating}</span>
                <div>
                  <div className="text-zinc-800 tracking-widest text-sm">★★★★★</div>
                  <p className="text-xs text-zinc-400 mt-0.5">{user.stats.ulasan} ulasan total</p>
                </div>
              </div>
              <div className="space-y-2">
                {user.ratingDist.map((r, i) => (
                  <div key={r.stars} className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 w-3">{r.stars}</span>
                    <span className="text-xs text-zinc-300">★</span>
                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${r.pct}%`,
                          background: ["#18181b","#52525b","#a1a1aa","#d4d4d8","#e4e4e7"][i],
                        }}
                      />
                    </div>
                    <span className="text-xs text-zinc-400 w-4 text-right">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-zinc-100 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-zinc-900 rounded-full inline-block" />
                Kategori Favorit
              </h3>
              <div className="space-y-3">
                {user.categories.map((c, i) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-600">{c.name}</span>
                      <span className="text-zinc-400">{c.count}</span>
                    </div>
                    <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${c.pct}%`,
                          background: ["#18181b","#52525b","#a1a1aa","#d4d4d8","#e4e4e7"][i],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">

            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex bg-white border border-zinc-100 rounded-lg p-1 gap-0.5">
                {[
                  { key: "ulasan",   label: `Ulasan (${reviews.length})` },
                  { key: "wishlist", label: `Wishlist (${wishlist.length})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                      activeTab === tab.key
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "ulasan" && (
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(Number(e.target.value))}
                  className="text-xs border border-zinc-200 rounded-lg px-3 py-1.5 text-zinc-600 bg-white focus:outline-none focus:border-zinc-400 cursor-pointer"
                >
                  <option value={0}>Semua Rating</option>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>★ {r} Bintang</option>
                  ))}
                </select>
              )}
            </div>

            {activeTab === "ulasan" && (
              <div className="space-y-3">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((r) => <ReviewCard key={r.id} review={r} />)
                ) : (
                  <div className="bg-white border border-zinc-100 rounded-xl p-12 text-center">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-sm text-zinc-400">Tidak ada ulasan untuk filter ini.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="space-y-2">
                {wishlist.map((w) => (
                  <div
                    key={w.name}
                    className="bg-white border border-zinc-100 rounded-xl px-4 py-3 flex items-center justify-between hover:border-zinc-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {w.icon}
                      </div>
                      <span className="text-sm font-medium text-zinc-800">{w.name}</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 bg-zinc-50 border border-zinc-100 px-2.5 py-1 rounded-full">
                      Belum dikunjungi
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="text-center text-[11px] text-zinc-300 py-8 mt-4">
        KompasJajan © 2025 · Temukan, Nikmati, Bagikan
      </footer>

      {editOpen && (
        <EditProfileModal
          user={user}
          onSave={handleSave}
          onCancel={() => setEditOpen(false)}
          loading={savingEdit}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
