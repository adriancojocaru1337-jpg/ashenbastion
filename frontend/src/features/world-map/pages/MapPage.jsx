import React, { useMemo, useState } from 'react';
import SectionPanel from '@/shared/components/SectionPanel';
import { useMapData } from '../hooks/useMapData';
import { useMarchSetup } from '../hooks/useMarchSetup';

export default function MapPage() {
  const { locations, availableTroops, isLoading, error } = useMapData();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  const filtered = useMemo(()=>{
    if (selectedFilter === 'Neutral Targets') return locations.filter(l=>l.type !== 'player_bastion');
    if (selectedFilter === 'Player Bastions') return locations.filter(l=>l.type === 'player_bastion' && l.owner);
    return locations;
  }, [locations, selectedFilter]);

  const preferredId = selectedLocationId || locations.find(l=>l.name === 'Fallen Ruin')?.id;
  const selectedLocation = useMemo(()=>filtered.find(l=>l.id===preferredId) ?? locations.find(l=>l.id===preferredId) ?? locations[0], [filtered, locations, preferredId]);
  const march = useMarchSetup({ selectedLocation, availableTroops });

  if (isLoading) return <div className="card">Loading map...</div>;
  if (error || !selectedLocation) return <div className="card">Failed to load map.</div>;

  return <div className="grid" style={{gap:16}}>
    <SectionPanel title="World Map" description="Milestone flow: select Fallen Ruin, scout it, then send your first raid. Reports appear after the march resolves in a few seconds.">
      <div className="row" style={{marginBottom:12}}>
        {['All','Neutral Targets','Player Bastions'].map(f=><button key={f} className={`btn ${selectedFilter===f?'':'secondary'}`} onClick={()=>setSelectedFilter(f)}>{f}</button>)}
      </div>
      <div className="grid grid-2">
        {filtered.map(l=><button className="card" style={{textAlign:'left', outline:selectedLocation?.id===l.id?'2px solid #f59e0b':'none'}} onClick={()=>setSelectedLocationId(l.id)} key={l.id}><strong>{l.name}</strong><div className="muted">{l.type} • {l.x},{l.y}</div><div className="muted">{l.notes}</div></button>)}
      </div>
    </SectionPanel>
    <div className="grid grid-3">
      <SectionPanel title="Location Detail" description="Choose Scout first, then Raid.">
        <strong>{selectedLocation.name}</strong>
        <div className="muted">{selectedLocation.type} • {selectedLocation.x},{selectedLocation.y}</div>
        <p>{selectedLocation.notes}</p>
        {selectedLocation.difficulty ? <div className="badge">Difficulty: {selectedLocation.difficulty}</div> : null}
        <div className="row" style={{marginTop:12}}>
          <button className={`btn ${march.marchType==='scout'?'':'secondary'}`} onClick={()=>march.setMarchType('scout')}>Scout</button>
          <button className={`btn ${march.marchType==='raid'?'':'secondary'}`} onClick={()=>march.setMarchType('raid')}>Raid</button>
          <button className={`btn ${march.marchType==='attack'?'':'secondary'}`} onClick={()=>march.setMarchType('attack')}>Attack</button>
        </div>
      </SectionPanel>
      <SectionPanel title="March Setup" description="For Scout use Ravensworn. For Raid send Reavers/Pikeguard.">
        <div className="grid">
          {availableTroops.map(t=><div className="card" key={t.key}><div><strong>{t.name}</strong> <span className="muted">available {t.available}</span></div><div className="row"><button className="btn secondary" onClick={()=>march.setTroopQuantity(t.key, (march.troopSelections[t.key]??0)-1)}>-</button><div className="card">{march.troopSelections[t.key] ?? 0}</div><button className="btn secondary" onClick={()=>march.setTroopQuantity(t.key, (march.troopSelections[t.key]??0)+1)}>+</button></div></div>)}}
        </div>
      </SectionPanel>
      <SectionPanel title="March Summary" description="Send the scout, then send your first raid.">
        <div className="card">Action: {march.marchType}</div>
        <div className="card">Units: {march.totalUnits}</div>
        <div className="card">Distance: {march.distance}</div>
        <div className="card">ETA: {march.etaMinutes ? `${march.etaMinutes} min` : '—'}</div>
        {march.submitError ? <div className="error">{march.submitError.message}</div> : null}
        {march.submitResult ? <div className="success">{march.submitResult.message} • Target: {march.submitResult.march?.target?.name} • ETA ~ {march.submitResult.march?.travel_time_seconds}s • Check Reports soon.</div> : null}
        <button className="btn" disabled={!march.totalUnits || march.isSubmitting} onClick={()=>march.submitMarch()}>{march.isSubmitting ? 'Sending...' : `Send ${march.marchType}`}</button>
      </SectionPanel>
    </div>
  </div>;
}
