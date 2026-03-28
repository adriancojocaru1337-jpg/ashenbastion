import React from 'react';
import AppLogo from '@/shared/components/AppLogo';

export default function AuthCard({ title, subtitle, children }) {
  return <div className="auth-shell"><div className="auth-card"><AppLogo subtitle="First Playable Loop" /><h1>{title}</h1><p className="muted">{subtitle}</p>{children}</div></div>;
}
