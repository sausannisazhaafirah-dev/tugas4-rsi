import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import ManageStallsPage from './pages/ManageStallsPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import StallDetailPage from './pages/StallDetailPage';
import StallFormPage from './pages/StallFormPage';
import StallsPage from './pages/StallsPage';

export default function App() {
  return (
    <Routes>
      {/* Halaman tanpa navbar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Halaman dengan navbar */}
      <Route element={<AppLayout />}>
        <Route index element={<StallsPage />} />
        <Route path="warung/:id" element={<StallDetailPage />} />
        <Route
          path="akun"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        {/* Kelola warung: hanya owner dan admin (customer → 403, belum login → /login) */}
        <Route
          path="kelola"
          element={
            <ProtectedRoute roles={['owner', 'admin']}>
              <ManageStallsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="kelola/baru"
          element={
            <ProtectedRoute roles={['owner', 'admin']}>
              <StallFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="kelola/:id/ubah"
          element={
            <ProtectedRoute roles={['owner', 'admin']}>
              <StallFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}