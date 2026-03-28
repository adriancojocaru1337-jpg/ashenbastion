import React from 'react';
import SectionPanel from '@/shared/components/SectionPanel';

export default function TroopSummaryPanel({ troops = [] }) {
  return <SectionPanel title="Troop Summary" description="Current forces available in the bastion.">
    <div className="grid" style={{ gap: 8 }}>
      {troops.map((troop) => <div key={troop.name} className="card"><strong>{troop.name}</strong><div className="muted">{troop.quantity} • {troop.role}</div></div>)}
    </div>
  </SectionPanel>;
}
