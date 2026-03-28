import React from 'react';
import SectionPanel from '@/shared/components/SectionPanel';

export default function QueuePanel({ queues }) {
  return <SectionPanel title="Queues" description="Current building and troop activity.">
    <div className="grid" style={{ gap: 8 }}>
      <div className="card">Building: {queues?.building ? `${queues.building.name} • ETA ${queues.building.eta}` : 'No active upgrade'}</div>
      <div className="card">Training: {Array.isArray(queues?.training) && queues.training.length ? queues.training.map((item) => `${item.troopName} x${item.quantity}`).join(', ') : 'No active training'}</div>
    </div>
  </SectionPanel>;
}
