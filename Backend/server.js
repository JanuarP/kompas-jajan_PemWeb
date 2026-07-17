const express = require('express');
const bodyParser = require('body-parser');
const db = require('./connection');
const response = require('./response');
const cors = require('cors');
const path = require('path');
const corsOrigin = {
    origin: 'http://localhost:5173',
}

const app = express();
const port = 3000;

app.use(cors(corsOrigin));
app.use(bodyParser.json());
// Folder gambar menu ada di Frontend/public/image (bukan drive absolut milik developer tertentu),
// supaya path ini tetap benar di komputer/OS siapa pun yang menjalankan project ini.
app.use('/fotomenu', express.static(path.join(__dirname, '..', 'Frontend', 'public', 'image')));

// ============================================================
// GET - Semua Restoran
// ============================================================
app.get('/', (req, res) => {
    db.query('SELECT * FROM restoran', (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        res.json(results);
    });
});

// ============================================================
// GET - Semua Users
// ============================================================
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        res.json(results);
    });
});

// ============================================================
// GET - Semua Menu (bisa filter by id_restoran)
// ============================================================
app.get('/menu', (req, res) => {
    const id_restoran = req.query.id_restoran;
    if (id_restoran) {
        db.query('SELECT * FROM menu WHERE id_restoran = ?', [id_restoran], (err, results) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            res.json(results);
        });
    } else {
        db.query('SELECT * FROM menu', (err, results) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            res.json(results);
        });
    }
});

// ============================================================
// GET - Restoran by ID
// ============================================================
app.get('/find', (req, res) => {
    const id = req.query.id;
    db.query('SELECT * FROM restoran WHERE id_restoran = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        res.json(results);
    });
});

// ============================================================
// GET - Bookmark (filter by id_user)
// ============================================================
app.get('/bookmark', (req, res) => {
    const id_user = req.query.id_user;
    if (id_user) {
        const sql = `
            SELECT b.*, r.nama_restoran, r.alamat_restoran, r.kategori_Restoran, r.rating
            FROM bookmark b
            JOIN restoran r ON b.id_restoran = r.id_restoran
            WHERE b.id_user = ?
        `;
        db.query(sql, [id_user], (err, results) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            res.json(results);
        });
    } else {
        db.query('SELECT * FROM bookmark', (err, results) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            res.json(results);
        });
    }
});

// ============================================================
// GET - fotomenu by id_restoran
// ============================================================
app.get('/fotomenu', (req, res) => {
    const id_restoran = req.query.id_restoran;
    if (id_restoran) {
        db.query('SELECT * FROM fotomenu WHERE id_restoran = ?', [id_restoran], (err, results) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            res.json(results);
        });
    } else {
        db.query('SELECT * FROM fotomenu', (err, results) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            res.json(results);
        });
    }
});

// ============================================================
// POST - Tambah Bookmark
// ============================================================
app.post('/bookmark', (req, res) => {
    const { id_user, id_restoran } = req.body;

    if (!id_user || !id_restoran) {
        return res.status(400).json({ error: 'id_user dan id_restoran wajib diisi' });
    }

    // Cek apakah sudah di-bookmark
    const checkSql = 'SELECT * FROM bookmark WHERE id_user = ? AND id_restoran = ?';
    db.query(checkSql, [id_user, id_restoran], (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        if (results.length > 0) {
            return res.status(400).json({ error: 'Restoran sudah ada di bookmark' });
        }

        const insertSql = 'INSERT INTO bookmark (id_user, id_restoran) VALUES (?, ?)';
        db.query(insertSql, [id_user, id_restoran], (insertErr, result) => {
            if (insertErr) return res.status(500).json({ error: 'Gagal menambah bookmark' });
            res.status(201).json({ message: 'Bookmark berhasil ditambahkan!', id_bookmark: result.insertId });
        });
    });
});

// ============================================================
// DELETE - Hapus Bookmark
// ============================================================
app.delete('/bookmark', (req, res) => {
    const { id_user, id_restoran } = req.body;

    if (!id_user || !id_restoran) {
        return res.status(400).json({ error: 'id_user dan id_restoran wajib diisi' });
    }

    const sql = 'DELETE FROM bookmark WHERE id_user = ? AND id_restoran = ?';
    db.query(sql, [id_user, id_restoran], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Bookmark tidak ditemukan' });
        }
        res.json({ message: 'Bookmark berhasil dihapus!' });
    });
});

// ============================================================
// GET - Ulasan (filter by id_restoran, atau semua)
// ============================================================
app.get('/ulasan', (req, res) => {
    const id_restoran = req.query.id_restoran;

    if (id_restoran) {
        const sql = `
            SELECT u.*, us.username 
            FROM ulasan u 
            LEFT JOIN users us ON u.id_user = us.id_user
            WHERE u.id_restoran = ?
            ORDER BY u.tanggal_ulasan DESC
        `;
        db.query(sql, [id_restoran], (err, results) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            res.json(results);
        });
    } else {
        // Ambil semua ulasan (untuk halaman profil)
        const sql = `
            SELECT u.*, r.nama_restoran, us.username
            FROM ulasan u
            LEFT JOIN restoran r ON u.id_restoran = r.id_restoran
            LEFT JOIN users us ON u.id_user = us.id_user
            ORDER BY u.tanggal_ulasan DESC
        `;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            res.json(results);
        });
    }
});

// ============================================================
// GET - Ulasan by user (untuk halaman profil)
// ============================================================
app.get('/ulasan/user/:id_user', (req, res) => {
    const { id_user } = req.params;
    const sql = `
        SELECT u.*, r.nama_restoran, r.kategori_Restoran
        FROM ulasan u
        LEFT JOIN restoran r ON u.id_restoran = r.id_restoran
        WHERE u.id_user = ?
        ORDER BY u.tanggal_ulasan DESC
    `;
    db.query(sql, [id_user], (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        res.json(results);
    });
});

// ============================================================
// POST - Login
// ============================================================
app.post('/login', (req, res) => {
    const { email_user, password } = req.body;
    const findUserSql = 'SELECT * FROM users WHERE email_user = ?';

    db.query(findUserSql, [email_user], (err, results) => {
        if (err) return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
        if (results.length === 0) return res.status(401).json({ error: 'Email atau password salah' });

        const user = results[0];
        if (user.password !== password) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        res.json({
            message: 'Login berhasil',
            user: {
                id_user: user.id_user,
                username: user.username,
                email: user.email_user,
                role: user.user_role,
                bio: user.bio || '',
                lokasi: user.lokasi || '',
                tanggal_akun_dibuat: user.tanggal_akun_dibuat
            }
        });
    });
});

// ============================================================
// POST - Register
// ============================================================
app.post('/register', (req, res) => {
    const { username, email_user, password } = req.body;
    const checkEmailSql = 'SELECT email_user FROM users WHERE email_user = ?';

    db.query(checkEmailSql, [email_user], (err, results) => {
        if (err) return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
        if (results.length > 0) return res.status(400).json({ error: 'Email sudah terdaftar' });

        const insertSql = 'INSERT INTO users (user_role, username, email_user, password, tanggal_akun_dibuat) VALUES (?, ?, ?, ?, NOW())';
        db.query(insertSql, ['customer', username, email_user, password], (insertErr, insertResult) => {
            if (insertErr) return res.status(500).json({ error: 'Gagal mendaftarkan akun' });
            res.status(201).json({ message: 'Registrasi berhasil!', id_user: insertResult.insertId });
        });
    });
});

// ============================================================
// POST - Tambah Restoran (Admin only)
// ============================================================
app.post('/addRestoran', (req, res) => {
    const { nama_restoran, alamat_restoran, kategori_restoran, deskripsi_restoran, jam_operasional, rentang_harga } = req.body;

    if (!nama_restoran || !alamat_restoran || !kategori_restoran) {
        return res.status(400).json({ error: 'Nama, alamat, dan kategori restoran wajib diisi' });
    }

    const checkSql = 'SELECT nama_restoran FROM restoran WHERE nama_restoran = ?';
    db.query(checkSql, [nama_restoran], (checkErr, checkResults) => {
        if (checkErr) return res.status(500).json({ error: 'Internal Server Error' });
        if (checkResults.length > 0) return res.status(400).json({ error: 'Nama restoran sudah terdaftar' });

        const insertSql = `
            INSERT INTO restoran (nama_restoran, alamat_restoran, kategori_Restoran, deskripsi_restoran, jam_operasional, rentang_harga) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertSql, [nama_restoran, alamat_restoran, kategori_restoran, deskripsi_restoran || '', jam_operasional || '', rentang_harga || ''], (insertErr, results) => {
            if (insertErr) return res.status(500).json({ error: 'Gagal menambah restoran' });
            res.status(201).json({ message: 'Restoran berhasil ditambahkan!', id_restoran: results.insertId });
        });
    });
});

// ============================================================
// POST - Tambah Ulasan
// ============================================================
app.post('/ulasan', (req, res) => {
    const { id_user, id_restoran, id_menu, rating, isi_review } = req.body;

    if (!id_user || !id_restoran || !rating || !isi_review) {
        return res.status(400).json({ error: 'Data tidak lengkap. Harap isi id_user, id_restoran, rating, dan isi_review.' });
    }

    // id_menu boleh null (ulasan untuk restoran umum)
    const insertSql = `
        INSERT INTO ulasan (id_user, id_restoran, id_menu, rating, isi_review, tanggal_ulasan) 
        VALUES (?, ?, ?, ?, ?, NOW())
    `;
    db.query(insertSql, [id_user, id_restoran, id_menu || null, rating, isi_review], (err, result) => {
        if (err) {
            console.error('Database error saat menyimpan ulasan:', err);
            return res.status(500).json({ error: 'Terjadi kesalahan saat memproses ulasan' });
        }

        // Update rata-rata rating restoran secara otomatis
        const updateRatingSql = `
            UPDATE restoran 
            SET rating = (SELECT AVG(rating) FROM ulasan WHERE id_restoran = ?)
            WHERE id_restoran = ?
        `;
        db.query(updateRatingSql, [id_restoran, id_restoran], () => {});

        res.status(201).json({ message: 'Ulasan berhasil disimpan!', id_ulasan: result.insertId });
    });
});

// ============================================================
// PUT - Update Restoran (Admin)
// ============================================================
app.put('/restoran/:id_restoran', (req, res) => {
    const { id_restoran } = req.params;
    const { nama_restoran, alamat_restoran, kategori_restoran, deskripsi_restoran, jam_operasional, rentang_harga } = req.body;

    if (!nama_restoran || !alamat_restoran) {
        return res.status(400).json({ error: 'Nama dan alamat restoran wajib diisi!' });
    }

    const sql = `
        UPDATE restoran 
        SET nama_restoran = ?, alamat_restoran = ?, kategori_Restoran = ?, deskripsi_restoran = ?, jam_operasional = ?, rentang_harga = ?
        WHERE id_restoran = ?
    `;
    db.query(sql, [nama_restoran, alamat_restoran, kategori_restoran, deskripsi_restoran, jam_operasional, rentang_harga, id_restoran], (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Data restoran tidak ditemukan.' });
        res.status(200).json({ message: 'Data restoran berhasil diperbarui!' });
    });
});

// ============================================================
// PUT - Update Ulasan
// ============================================================
app.put('/ulasan/:id_ulasan', (req, res) => {
    const { id_ulasan } = req.params;
    const { id_user, rating, isi_review, id_menu } = req.body;

    if (!id_user || !rating || !isi_review) {
        return res.status(400).json({ error: 'Data tidak lengkap.' });
    }

    const updateSql = `
        UPDATE ulasan 
        SET rating = ?, isi_review = ?, id_menu = ?, tanggal_ulasan = NOW() 
        WHERE id_ulasan = ? AND id_user = ?
    `;
    db.query(updateSql, [rating, isi_review, id_menu || null, id_ulasan, id_user], (err, result) => {
        if (err) return res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui ulasan' });
        if (result.affectedRows === 0) return res.status(403).json({ error: 'Ulasan tidak ditemukan atau tidak punya izin.' });
        res.status(200).json({ message: 'Ulasan berhasil diperbarui!' });
    });
});

// ============================================================
// PUT - Update Profil User
// ============================================================
app.put('/users/:id_user', (req, res) => {
    const { id_user } = req.params;
    const { username, email_user, bio, lokasi } = req.body;

    if (!username || !email_user) {
        return res.status(400).json({ error: 'Username dan email wajib diisi!' });
    }

    const sql = `
        UPDATE users 
        SET username = ?, email_user = ?, bio = ?, lokasi = ?
        WHERE id_user = ?
    `;
    db.query(sql, [username, email_user, bio || null, lokasi || null, id_user], (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Data user tidak ditemukan.' });
        res.status(200).json({ message: 'Data profil berhasil diperbarui!' });
    });
});

// ============================================================
// DELETE - Hapus Restoran (Admin)
// ============================================================
app.delete('/delete', (req, res) => {
    const { id_restoran } = req.body;
    const sql = 'DELETE FROM restoran WHERE id_restoran = ?';
    db.query(sql, [id_restoran], (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        res.json({ message: 'Restoran berhasil dihapus!', results });
    });
});

// ============================================================
// DELETE - Hapus Ulasan
// ============================================================
app.delete('/ulasan/:id_ulasan', (req, res) => {
    const { id_ulasan } = req.params;
    const { id_user } = req.body;

    const sql = 'DELETE FROM ulasan WHERE id_ulasan = ? AND id_user = ?';
    db.query(sql, [id_ulasan, id_user], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        if (result.affectedRows === 0) return res.status(403).json({ error: 'Ulasan tidak ditemukan atau tidak punya izin.' });
        res.json({ message: 'Ulasan berhasil dihapus!' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
