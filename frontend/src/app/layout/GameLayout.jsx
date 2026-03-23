import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ResourceBar from '@/shared/components/ResourceBar';
import { ROUTES } from '@/app/router/routes';
import { useAuth } from '@/features/auth/AuthContext';

const demoResources = { timber: 500, iron: 500, grain: 400, ember: 100 };

export default function GameLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = [{to:ROUTES.BASTION,label:'Bastion'},{to:ROUTES.MAP,label:'Map'},{to:ROUTES.REPORTS,label:'Reports'}];
  return <div>
    <ResourceBar resources={demoResources} />
    <div className="container">
      <div className="row" style={{justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
        <div className="nav row">{links.map(link => <NavLink key={link.to} to={link.to} className={({isActive})=>isActive?'active':''}>{link.label}</NavLink>)}</div>
        <div className="row" style={{alignItems:'center'}}>
          <span className="badge">{user?.username} • {user?.doctrine || 'No doctrine'}</span>
          <button className="btn secondary" onClick={()=>{logout(); navigate(ROUTES.LOGIN);}}>Logout</button>
        </div>
      </div>
      <Outlet />
    </div>
  </div>;
}
