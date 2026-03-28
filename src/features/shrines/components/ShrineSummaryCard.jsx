
import React from 'react';
import SectionPanel from '@/shared/components/SectionPanel';

export default function ShrineSummaryCard({ shrine }) {
  return <SectionPanel title={shrine.name} description={shrine.bonus_label || 'Relic blessing'}>
    <div className="grid" style={{gap:8}}>
      <div className="muted">Type: {shrine.shrine_type}</div>
      <div className="muted">Coords: {shrine.x}, {shrine.y}</div>
      <div className="muted">Status: {shrine.status}</div>
      {shrine.current_owner ? <div className="card">Owner: {shrine.current_owner.player_name} • {shrine.current_owner.bastion_name}</div> : <div className="card">No current owner</div>}
    </div>
  </SectionPanel>;
}
