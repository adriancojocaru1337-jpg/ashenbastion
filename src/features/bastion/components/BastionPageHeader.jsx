import React from 'react';

export default function BastionPageHeader({ bastion }) {
  return <div className="card">
    <div className="muted">{bastion.doctrine}</div>
    <h2 style={{ margin: '4px 0 8px' }}>{bastion.name}</h2>
    <div className="muted">{bastion.title}</div>
  </div>;
}
