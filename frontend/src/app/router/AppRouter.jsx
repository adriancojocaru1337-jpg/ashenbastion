import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GameLayout from '@/app/layout/GameLayout';
import BastionPage from '@/features/bastion/pages/BastionPage';
import MapPage from '@/features/world-map/pages/MapPage';
import ReportsPage from '@/features/reports/pages/ReportsPage';
import { ROUTES } from './routes';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import { useAuth } from '@/features/auth/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isBooting } = useAuth();
  if (isBooting) return <div className="auth-shell"><div className="auth-card">Loading session...</div></div>;
  return isAuthenticated ? children : <Navigate to={ROUTES.REGISTER} replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated, isBooting } = useAuth();
  if (isBooting) return <div className="auth-shell"><div className="auth-card">Loading session...</div></div>;
  return isAuthenticated ? <Navigate to={ROUTES.BASTION} replace /> : children;
}

export default function AppRouter() {
  return <BrowserRouter>
    <Routes>
      <Route path={ROUTES.REGISTER} element={<GuestRoute><RegisterPage/></GuestRoute>} />
      <Route path={ROUTES.LOGIN} element={<GuestRoute><LoginPage/></GuestRoute>} />
      <Route element={<ProtectedRoute><GameLayout/></ProtectedRoute>}>
        <Route path={ROUTES.BASTION} element={<BastionPage/>} />
        <Route path={ROUTES.MAP} element={<MapPage/>} />
        <Route path={ROUTES.REPORTS} element={<ReportsPage/>} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.REGISTER} replace />} />
    </Routes>
  </BrowserRouter>;
}
