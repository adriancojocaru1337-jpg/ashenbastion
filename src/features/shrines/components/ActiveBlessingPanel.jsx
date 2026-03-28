
import React from 'react';
import SectionPanel from '@/shared/components/SectionPanel';

export default function ActiveBlessingPanel({ blessing }) {
  if (!blessing) {
    return <SectionPanel title="Active Blessing" description="No relic blessing currently active."><div className="muted">Capture a shrine to gain a temporary global bonus.</div></SectionPanel>;
  }
  return <SectionPanel title="Active Blessing" description="Relic shrine bonus currently affecting your bastion.">
    <div className="grid" style={{gap:8}}>
      <strong>{blessing.shrine_name}</strong>
      <div className="badge" style={{display:'inline-block'}}>{blessing.bonus_label}</div>
      <div className="muted">Expires: {new Date(blessing.expires_at).toLocaleString()}</div>
    </div>
  </SectionPanel>;
}
