import React, { useMemo, useState } from 'react';
import SectionPanel from '@/shared/components/SectionPanel';
import { useBastionData } from '../hooks/useBastionData';
import { useUpgradeBuilding } from '../hooks/useUpgradeBuilding';
import { useNavigate } from 'react-router-dom';

export default function BastionPage() {
  const { bastion, buildings, isLoading, error } = useBastionData();
  const [selected, setSelected] = useState('lumberyard');
  const upgrade = useUpgradeBuilding();
  const navigate = useNavigate();
  const building = useMemo(()=>buildings.find(b=>b.type===selected) ?? buildings[0], [buildings, selected]);

  if (isLoading) return <div className="card">Loading bastion...</div>;
  if (error || !bastion) return <div className="card">Failed to load bastion.</div>;

  return <div className="grid" style={{gap:16}}>
    <SectionPanel title={bastion.name} description={`${bastion.title} • ${bastion.doctrine}`}>
      <div className="row" style={{marginBottom:12}}>
        <span className="badge">Step 1: Upgrade Lumberyard</span>
        <span className="badge">Step 2: Open Map</span>
        <span className="badge">Step 3: Scout Fallen Ruin</span>
        <span className="badge">Step 4: Send first raid</span>
      </div>
      <div className="row">{(bastion.tutorial || []).map(t=><div key={t.id} className="card"><div>{t.label}</div><div className="muted">{t.progress}% • {t.reward}</div></div>)}</div>
      {upgrade.data ? <div className="success" style={{marginTop:12}}>{upgrade.data.message}</div> : null}
    </SectionPanel>
    <div className="grid grid-3">
      <SectionPanel title="Buildings" description="Core production and military structures.">
        <div className="grid grid-2">
          {buildings.map(b=><button key={b.type} className="card" onClick={()=>setSelected(b.type)} style={{textAlign:'left', outline:selected===b.type?'2px solid #f59e0b':'none'}}>
            <strong>{b.name}</strong><div className="muted">Lv {b.level}</div><div>{b.currentEffect}</div>
          </button>)}
        </div>
      </SectionPanel>
      <SectionPanel title="Building Detail" description="Upgrade the Lumberyard first to complete the first milestone.">
        {building && <>
          <strong>{building.name}</strong>
          <div className="muted">Current: {building.currentEffect}</div>
          <div className="muted">Next: {building.nextEffect}</div>
          <div className="row">
            <div className="card">Timber: {building.upgradeCost.timber}</div>
            <div className="card">Iron: {building.upgradeCost.iron}</div>
            <div className="card">Grain: {building.upgradeCost.grain}</div>
            <div className="card">Ember: {building.upgradeCost.ember}</div>
          </div>
          {building.lockedReason ? <div className="error" style={{margin:'12px 0'}}>{building.lockedReason}</div> : null}
          <div className="row">
            <button className="btn" disabled={!building.canUpgrade || upgrade.isPending} onClick={()=>upgrade.mutate({buildingType: building.type})}>{upgrade.isPending?'Queuing...':'Upgrade'}</button>
            <button className="btn secondary" onClick={()=>navigate('/game/map')}>Open Map</button>
          </div>
        </>}
      </SectionPanel>
      <SectionPanel title="Queues & Garrison" description="High-signal side panel.">
        <div className="card">Building queue: {bastion.queues.building?.name ?? 'None'}</div>
        <div className="grid">{bastion.troopSummary.map(t=><div className="card" key={t.name}>{t.name}: {t.quantity} <span className="muted">{t.role}</span></div>)}</div>
      </SectionPanel>
    </div>
  </div>;
}
