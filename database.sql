-- 1. Tabel Users (Gabungan Pelanggan, Admin, Koki, Kurir)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- Isi dengan: 'pelanggan', 'admin', 'koki', atau 'kurir'
    status_akun VARCHAR(50) DEFAULT 'aktif',
    tanggal_registrasi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Atribut khusus digabung ke sini (Single Table Inheritance)
    total_poin INT DEFAULT 0, -- Khusus Pelanggan
    level_akses VARCHAR(50),  -- Khusus Admin
    status_aktif BOOLEAN DEFAULT TRUE, -- Khusus Koki
    status_pengiriman VARCHAR(50) -- Khusus Kurir
);

-- 2. Tabel Menu
CREATE TABLE menu (
    menu_id SERIAL PRIMARY KEY,
    nama_menu VARCHAR(100) NOT NULL,
    harga DECIMAL(10, 2) NOT NULL,
    kategori VARCHAR(50),
    deskripsi TEXT,
    status_tersedia BOOLEAN DEFAULT TRUE
);

-- 3. Tabel Pesanan (Terkoneksi langsung ke tabel users)
CREATE TABLE pesanan (
    pesanan_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    tanggal_pesan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_pesanan VARCHAR(50) DEFAULT 'menunggu pembayaran', 
    total_harga DECIMAL(12, 2) NOT NULL
);

-- 4. Tabel Detail Pesanan
CREATE TABLE detail_pesanan (
    detail_id SERIAL PRIMARY KEY,
    pesanan_id INT NOT NULL REFERENCES pesanan(pesanan_id) ON DELETE CASCADE,
    menu_id INT NOT NULL REFERENCES menu(menu_id) ON DELETE CASCADE,
    jumlah INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- 5. Tabel Pembayaran
CREATE TABLE pembayaran (
    pembayaran_id SERIAL PRIMARY KEY,
    pesanan_id INT NOT NULL REFERENCES pesanan(pesanan_id) ON DELETE CASCADE,
    metode_pembayaran VARCHAR(50) NOT NULL,
    bukti_pembayaran TEXT, -- Menggunakan TEXT lebih disarankan di PostgreSQL untuk URL/Path panjang
    tanggal_bayar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_pembayaran VARCHAR(50) DEFAULT 'menunggu verifikasi'
);

-- 6. Tabel Poin (Terkoneksi langsung ke tabel users)
CREATE TABLE poin (
    poin_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    jumlah_poin INT NOT NULL,
    tanggal_perolehan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    keterangan TEXT
);