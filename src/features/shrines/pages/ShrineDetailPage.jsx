
import React from 'react';
import { useParams } from 'react-router-dom';
import SectionPanel from '@/shared/components/SectionPanel';
import { useShrineDetail } from '../hooks/useShrines';

export default function ShrineDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useShrineDetail(id);
  if (isLoading) return <div className="card">Loading shrine...</div>;
  if (error || !data?.shrine) return <div className="error">Failed to load shrine.</div>;
  const shrine = data.shrine;
  return <div className="grid" style={{gap:16}}>
    <div><div className="muted">Shrine Detail</div><h2 style={{margin:'4px 0 0'}}>{shrine.name}</h2></div>
    <SectionPanel title="Overview" description={shrine.description}>
      <div className="grid" style={{gap:8}}>
        <div className="card">Type: {shrine.shrine_type}</div>
        <div className="card">Difficulty: {shrine.difficulty}</div>
        <div className="card">Coords: {shrine.x}, {shrine.y}</div>
        <div className="card">{shrine.notes}</div>
      </div>
    </SectionPanel>
    <SectionPanel title="Defenders" description="Neutral forces holding the relic site.">
      <div className="grid">{(shrine.defender_summary?.troops || []).map((troop) => <div className="card" key={troop.troop_type}>{troop.troop_type}: {troop.quantity}</div>)}</div>
    </SectionPanel>
  </div>;
}
