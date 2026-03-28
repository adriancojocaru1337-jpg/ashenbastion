import React, { useState } from 'react';
import SectionPanel from '@/shared/components/SectionPanel';
import { useReports } from '../hooks/useReports';

function renderPayload(report) {
  const payload = report.payload_json || {};
  if (report.report_type === 'scout') {
    return <div className="grid" style={{gap:8}}>
      <div className="card">Target: {payload.target?.name} • {payload.target?.type}</div>
      <div className="card">Difficulty: {payload.target?.difficulty || 'Unknown'}</div>
      <div className="card">Notes: {payload.target?.notes || '—'}</div>
      <div className="card">Defenders: {(payload.defenders || []).map(d => `${d.name} x${d.quantity}`).join(', ') || 'None seen'}</div>
      <div className="card">Returned scouts: {(payload.survivors || []).map(s => `${s.troop_type} x${s.quantity_survived}`).join(', ') || 'None'}</div>
    </div>;
  }
  return <div className="grid" style={{gap:8}}>
    <div className="card">Outcome: {payload.outcome || '—'}</div>
    <div className="card">Target: {payload.target?.name} • {payload.target?.type}</div>
    <div className="card">Loot applied to bastion: Timber {payload.loot?.timber || 0}, Iron {payload.loot?.iron || 0}, Grain {payload.loot?.grain || 0}, Ember {payload.loot?.ember || 0}</div>
    <div className="card">Survivors returned: {(payload.survivors || []).map(s => `${s.troop_type} x${s.quantity_survived}`).join(', ') || 'None'}</div>
    <div className="card">Defenders: {(payload.defenders || []).map(s => `${s.name} x${s.quantity}`).join(', ') || 'None'}</div>
  </div>;
}

export default function ReportsPage() {
  const { reports, isLoading, error } = useReports();
  const [selectedId, setSelectedId] = useState(null);
  const selected = reports.find(r => r.id === selectedId) || reports[0];

  if (isLoading) return <div className="card">Loading reports...</div>;
  if (error) return <div className="card">Failed to load reports.</div>;

  return <div className="grid" style={{gap:16}}>
    <SectionPanel title="Reports" description="Scouting, march resolution, troop returns, and raid results appear here after marches resolve.">
      {!reports.length ? <div className="muted">No reports yet. Send a scout or raid from the Map page and wait a few seconds.</div> : null}
      <div className="grid grid-2">
        <div className="grid">
          {reports.map(report => <button key={report.id} className="card" style={{textAlign:'left', outline:selected?.id===report.id?'2px solid #f59e0b':'none'}} onClick={()=>setSelectedId(report.id)}>
            <strong>{report.title}</strong>
            <div className="muted">{report.report_type} • {new Date(report.created_at).toLocaleString()}</div>
            <div>{report.summary}</div>
          </button>)}
        </div>
        <div>
          {selected ? <SectionPanel title={selected.title} description={selected.summary}>{renderPayload(selected)}</SectionPanel> : <div className="card">Select a report.</div>}
        </div>
      </div>
    </SectionPanel>
  </div>;
}
