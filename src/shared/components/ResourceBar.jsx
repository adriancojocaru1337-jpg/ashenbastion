import React from 'react';
import AppLogo from './AppLogo';
export default function ResourceBar({ resources }) {
  return <div style={{borderBottom:'1px solid #27272a', position:'sticky', top:0, background:'#0a0a0a', zIndex:10}}>
    <div className="container row" style={{justifyContent:'space-between', alignItems:'center'}}>
      <AppLogo />
      <div className="row">
        <div className="card">Timber: {resources.timber}</div>
        <div className="card">Iron: {resources.iron}</div>
        <div className="card">Grain: {resources.grain}</div>
        <div className="card">Ember: {resources.ember}</div>
      </div>
    </div>
  </div>;
}
