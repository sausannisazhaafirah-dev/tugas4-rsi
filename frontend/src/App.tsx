import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
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
        <Route
          path="akun"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}