# Connect to Database (`database.js`)
Untuk menghubungkan Node Express JS ke MySQL di **Laragon** yang diakses menggunakan phpmyadmin

# Routing System (`server.js`)
Untuk membuat rute URL website dan juga untuk memunculkan data dari database MySQL di file ini

# Standarisasi Response API (`response.js`)

Sistem *backend* ini menggunakan fungsi *helper* khusus yang terletak di `response.js` untuk membungkus (*wrap*) semua balasan (*response*) dari server. 

Tujuan utama dari file ini adalah untuk **menstandarisasi output API** sehingga aplikasi *frontend* atau pihak klien selalu menerima struktur data JSON yang konsisten, mudah ditebak, dan rapi untuk setiap *endpoint*.

### Struktur JSON Response
Setiap *endpoint* API di aplikasi ini akan selalu mengembalikan format JSON dengan struktur dasar seperti berikut:

```json
{
    "payload": {
        "status_code": 200,
        "datas": [
            // ... isi data dari database ...
        ],
        "message": "Pesan deskriptif mengenai aksi yang dilakukan"
    },
    "pagination": {
        "prev": "",
        "next": "",
        "max": ""
    }
}