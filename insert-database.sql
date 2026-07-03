-- =============================================
-- INSERT DATA (PostgreSQL)
-- =============================================

-- 1. Insert Data Users
INSERT INTO users (nama, email, password_hash, role, level_akses, status_aktif, status_pengiriman) VALUES
('Admin Utama', 'admin@resto.com', 'hashed_pass_1', 'admin', 'super-admin', NULL, NULL),
('Chef Mario', 'chef@resto.com', 'hashed_pass_2', 'koki', NULL, TRUE, NULL),
('Kurir Budi', 'kurir@resto.com', 'hashed_pass_3', 'kurir', NULL, NULL, 'tersedia'),
('John Doe', 'customer@example.com', 'hashed_pass_4', 'pelanggan', NULL, NULL, NULL);

-- 2. Insert Data Menu
INSERT INTO menu (nama_menu, harga, kategori, deskripsi, status_tersedia) VALUES
('Nasi Goreng Spesial', 25000, 'Makanan', 'Nasi goreng dengan telur, ayam, dan sayuran.', TRUE),
('Mie Goreng', 20000, 'Makanan', 'Mie goreng dengan topping ayam dan sayuran.', TRUE),
('Ayam Bakar', 30000, 'Makanan', 'Ayam bakar kecap dengan nasi dan lalapan.', TRUE),
('Sate Ayam', 28000, 'Makanan', '10 tusuk sate ayam dengan bumbu kacang.', TRUE),
('Gado-Gado', 18000, 'Makanan', 'Sayuran segar dengan bumbu kacang khas.', TRUE),
('Bakso Urat', 22000, 'Makanan', 'Bakso sapi urat dengan kuah kaldu nikmat.', TRUE),
('Soto Ayam', 20000, 'Makanan', 'Soto ayam lamongan dengan koya.', TRUE),
('Nasi Padang Rendang', 35000, 'Makanan', 'Nasi dengan rendang sapi dan pelengkap.', TRUE),
('Capcay Seafood', 27000, 'Makanan', 'Tumis sayuran dengan potongan seafood.', TRUE),
('Ikan Bakar', 40000, 'Makanan', 'Ikan nila bakar bumbu rempah.', TRUE),
('Es Teh Manis', 5000, 'Minuman', 'Teh manis dingin menyegarkan.', TRUE),
('Es Jeruk', 8000, 'Minuman', 'Perasan jeruk asli dengan es batu.', TRUE),
('Kopi Susu', 12000, 'Minuman', 'Kopi robusta dengan susu kental manis.', TRUE),
('Jus Alpukat', 15000, 'Minuman', 'Jus alpukat dengan topping cokelat.', TRUE);

-- 3. Insert Data Transaksi (Pesanan, Detail, Pembayaran, & Poin)
-- Memasukkan pesanan untuk John Doe (user_id: 4)
INSERT INTO pesanan (user_id, total_harga, status_pesanan) VALUES (4, 75000, 'menunggu pembayaran');

-- Mengisi detail pesanan berdasarkan pesanan_id 1
INSERT INTO detail_pesanan (pesanan_id, menu_id, jumlah, subtotal) VALUES 
(1, 1, 1, 25000), 
(1, 2, 1, 20000), 
(1, 3, 1, 30000);

-- Mengisi pembayaran untuk pesanan_id 1
INSERT INTO pembayaran (pesanan_id, metode_pembayaran, status_pembayaran) VALUES 
(1, 'Transfer Bank', 'menunggu verifikasi');

-- Memberikan poin untuk John Doe (user_id: 4)
INSERT INTO poin (user_id, jumlah_poin, keterangan) VALUES 
(4, 150, 'Poin dari transaksi pesanan ORD1765561688608');