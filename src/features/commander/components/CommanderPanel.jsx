
import React from 'react';
import SectionPanel from '@/shared/components/SectionPanel';

export default function CommanderPanel({ commander, compact = false }) {
  if (!commander) {
    return <SectionPanel title="Commander" description="No commander appointed yet."><div className="muted">Create one to unlock specialization and shrine synergy.</div></SectionPanel>;
  }
  const xpToNext = commander.xp_to_next_level || commander.level * 100;
  const pct = Math.max(0, Math.min(100, Math.round((commander.xp / xpToNext) * 100)));
  return <SectionPanel title="Commander" description={compact ? 'Strategic identity' : 'Strategic identity and passive bonuses.'}>
    <div className="grid" style={{gap:12}}>
      <div><strong>{commander.name}</strong><div className="muted">{commander.archetype_label} • Level {commander.level}</div></div>
      <div>
        <div className="row" style={{justifyContent:'space-between'}}><span className="muted">XP</span><span className="muted">{commander.xp} / {xpToNext}</span></div>
        <div style={{height:8, borderRadius:999, background:'#27272a', overflow:'hidden'}}><div style={{height:'100%', width:`${pct}%`, background:'#f59e0b'}} /></div>
      </div>
      <div className="row">{(commander.bonuses || []).map((bonus) => <span key={bonus.key} className="badge">{bonus.label}</span>)}</div>
    </div>
  </SectionPanel>;
}
