
import React from 'react';
import { Link } from 'react-router-dom';
import ShrineSummaryCard from '../components/ShrineSummaryCard';
import { useShrines } from '../hooks/useShrines';

export default function ShrinesPage() {
  const { data, isLoading, error } = useShrines();
  if (isLoading) return <div className="card">Loading shrines...</div>;
  if (error) return <div className="error">Failed to load shrines.</div>;
  return <div className="grid" style={{gap:16}}>
    <div><div className="muted">Relic Objectives</div><h2 style={{margin:'4px 0 0'}}>Shrines</h2></div>
    <div className="grid grid-2">
      {(data?.shrines || []).map((shrine) => <Link key={shrine.id} to={`/game/shrines/${shrine.id}`}><ShrineSummaryCard shrine={shrine} /></Link>)}
    </div>
  </div>;
}
