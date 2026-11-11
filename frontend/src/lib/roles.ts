import type { Role, Stall, User } from '../types/api';

// Aturan hak akses di frontend, disamakan dengan aturan backend Tugas 3.
// Backend tetap pemeriksa akhir; frontend hanya menyembunyikan tombol yang tidak berhak.

export const roleLabel: Record<Role, string> = {
  admin: 'Admin',
  owner: 'Pemilik warung',
  customer: 'Pelanggan',
};

// POST /stalls: owner dan admin.
export const canManageStalls = (user: User | null) =>
  user?.role === 'owner' || user?.role === 'admin';

// PUT /stalls/:id: admin semua warung, owner hanya warung miliknya.
export const canEditStall = (user: User | null, stall: Stall) =>
  user?.role === 'admin' || (user?.role === 'owner' && stall.ownerId === user.id);

// DELETE /stalls/:id: hanya admin.
export const canDeleteStall = (user: User | null) => user?.role === 'admin';