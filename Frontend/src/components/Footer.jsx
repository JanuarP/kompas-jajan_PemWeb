export default function Footer() {
return (
    <footer className="app-footer tripadvisor-footer">
    <div className="footer-columns-wrapper">
        <div className="footer-column">
            <h4>Tentang KompasJajan</h4>
            <span className="footer-link">Tentang Kami</span>
            <span className="footer-link">Karir & Rekrutmen</span>
            <span className="footer-link">Kebijakan Privasi</span>
            <span className="footer-link">Ketentuan Layanan</span>
            <span className="footer-link">Peta Situs</span>
        </div>
        <div className="footer-column">
            <h4>Jelajahi</h4>
            <span className="footer-link">Tulis Ulasan Kuliner</span>
            <span className="footer-link">Daftarkan UMKM Makanan</span>
            <span className="footer-link">Komunitas Reviewer</span>
            <span className="footer-link">Artikel & Inspirasi Jajan</span>
            <span className="footer-link">Pusat Bantuan</span>
        </div>
        <div className="footer-column">
            <h4>Mitra Bisnis</h4>
            <span className="footer-link">Solusi untuk Pemilik Resto</span>
            <span className="footer-link">Iklan & Promosi Mitra</span>
            <span className="footer-link">Sponsor Event Yogyakarta</span>
            <span className="footer-link">Kemitraan Kontributor</span>
        </div>
        <div className="footer-column">
            <h4>KompasJajan Group</h4>
            <span className="footer-link">Kompas Kuliner Nusantara</span>
            <span className="footer-link">Info UMKM Jogja Istimewa</span>
            <span className="footer-link">Panduan Jajan Daerah</span>
        </div>
    </div>

    <div className="footer-bottom-divider"></div>

    <div className="footer-bottom-row">
        <div className="footer-bottom-left">
            <div className="footer-logo-brand">
                <i className="fa-solid fa-compass footer-logo-icon"></i>
                <span>KompasJajan</span>
            </div>
        <p className="footer-copyright-text">
            © 2026 KompasJajan LLC. Seluruh hak cipta dilindungi. KompasJajan
            adalah platform komunitas review makanan independen. Kami tidak
            bertanggung jawab atas konten situs eksternal.
        </p>
        </div>

        <div className="footer-bottom-right">
            <div className="footer-selectors-group">
            <button className="footer-selector-btn">
                <i className="fa-solid fa-globe"></i>
                <span>Bahasa Indonesia</span>
                <i className="fa-solid fa-chevron-down arrow-down"></i>
            </button>
            <button className="footer-selector-btn">
                <span>Rp (Rupiah Indonesia)</span>
                <i className="fa-solid fa-chevron-down arrow-down"></i>
            </button>
        </div>

        <div className="footer-social-links">
            <span className="social-icon-wrapper" title="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
            </span>
            <span className="social-icon-wrapper" title="X (Twitter)">
                <i className="fa-brands fa-x-twitter"></i>
            </span>
            <span className="social-icon-wrapper" title="Instagram">
                <i className="fa-brands fa-instagram"></i>
            </span>
            <span className="social-icon-wrapper" title="YouTube">
                <i className="fa-brands fa-youtube"></i>
            </span>
        </div>
        </div>
    </div>
    </footer>
  );
}
