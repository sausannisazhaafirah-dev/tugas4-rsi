USE review_kantin;

-- Semua akun seed memakai password: rahasia123
-- Nilai di bawah adalah hash bcrypt (cost 10) dari "rahasia123",
-- jadi password asli tidak pernah tersimpan di database.
UPDATE dbo.USERS
SET password_hash = N'$2b$10$ht.02ZQLOX.TbCUbl.6et.eeJi.IHE1erp7p9oPWhWY5ZCF8KgwBq';

SELECT id, name, email, role, LEFT(password_hash, 20) AS awal_hash
FROM dbo.USERS
ORDER BY id;