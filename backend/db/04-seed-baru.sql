USE review_kantin;

-- =====================================================================
-- 1) Bersihkan sisa uji coba sebelumnya
-- =====================================================================
DELETE FROM dbo.LIKES;
DELETE FROM dbo.FLAGS;
DELETE FROM dbo.AUDIT_LOGS;

-- Kembalikan data seed pertemuan 3 yang sempat berubah saat uji coba
UPDATE dbo.MENU_ITEMS
SET name = N'Kwetiau Goreng Spesial', price = 15000, is_available = 1
WHERE id = 1;
DELETE FROM dbo.MENU_ITEMS WHERE id > 20;
DELETE FROM dbo.STALLS     WHERE id > 10;
DELETE FROM dbo.USERS      WHERE id > 15;

-- Reset penomoran ID
DBCC CHECKIDENT ('dbo.LIKES',      RESEED, 0);
DBCC CHECKIDENT ('dbo.FLAGS',      RESEED, 0);
DBCC CHECKIDENT ('dbo.AUDIT_LOGS', RESEED, 0);
DBCC CHECKIDENT ('dbo.MENU_ITEMS', RESEED, 20);
DBCC CHECKIDENT ('dbo.STALLS',     RESEED, 10);
DBCC CHECKIDENT ('dbo.USERS',      RESEED, 15);

-- =====================================================================
-- 2) Seed LIKES (8 baris) - tidak ada user yang me-like review miliknya
-- =====================================================================
INSERT INTO dbo.LIKES (review_id, user_id) VALUES
  (2, 12), (3, 14), (5, 14), (7, 15),
  (9, 12), (10, 13), (12, 13), (16, 15);

-- Samakan like_count di REVIEWS dengan jumlah like
UPDATE dbo.REVIEWS
SET like_count = (SELECT COUNT(*) FROM dbo.LIKES l WHERE l.review_id = REVIEWS.id);

-- =====================================================================
-- 3) Seed FLAGS (8 baris)
-- =====================================================================
INSERT INTO dbo.FLAGS (review_id, reported_by, reason, status) VALUES
  (1,  15, N'Komentar kurang informatif', 'pending'),
  (4,  14, N'Rating berlebihan',          'dismissed'),
  (6,  12, N'Ulasan tidak sesuai menu',   'pending'),
  (8,  13, N'Mengandung kata kasar',      'resolved'),
  (10, 12, N'Diduga akun palsu',          'pending'),
  (11, 15, N'Promosi warung lain',        'resolved'),
  (14, 13, N'Ulasan duplikat',            'dismissed'),
  (15, 14, N'Spam',                       'pending');

-- =====================================================================
-- 4) Seed AUDIT_LOGS (8 baris)
-- =====================================================================
INSERT INTO dbo.AUDIT_LOGS (user_id, action, target_table, target_id, metadata) VALUES
  (1,  'CREATE', 'USERS',      12, N'{"email":"bagas@student.test"}'),
  (2,  'CREATE', 'MENU_ITEMS', 2,  N'{"name":"Kwetiau Kuah"}'),
  (3,  'UPDATE', 'STALLS',     3,  N'{"location":"Kantin FK"}'),
  (5,  'UPDATE', 'MENU_ITEMS', 8,  N'{"is_available":true}'),
  (12, 'CREATE', 'REVIEWS',    3,  N'{"rating":4}'),
  (14, 'LIKE',   'REVIEWS',    3,  NULL),
  (12, 'FLAG',   'REVIEWS',    6,  N'{"reason":"Ulasan tidak sesuai menu"}'),
  (1,  'UPDATE', 'FLAGS',      4,  N'{"status":"resolved"}');