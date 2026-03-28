import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import AppRouter from '@/app/router/AppRouter';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/features/auth/AuthContext';

export default function App() {
  return <QueryClientProvider client={queryClient}><AuthProvider><AppRouter /></AuthProvider></QueryClientProvider>;
}
