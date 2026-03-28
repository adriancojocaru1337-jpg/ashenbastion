
import React, { useState } from 'react';
import SectionPanel from '@/shared/components/SectionPanel';

const options = [
  { key:'warmaster', label:'Warmaster', text:'+8% march attack' },
  { key:'warden', label:'Warden', text:'+10% home defense' },
  { key:'harvester', label:'Harvester', text:'+10% economy' },
  { key:'spymaster', label:'Spymaster', text:'+15% scouting' },
  { key:'occultist', label:'Occultist', text:'+10% shrine effect' },
];

export default function CommanderCreateCard({ onCreate, isPending }) {
  const [name, setName] = useState('Vaelor');
  const [archetype, setArchetype] = useState('occultist');
  return <SectionPanel title="Create Commander" description="Choose a strategic archetype for your bastion.">
    <div className="grid" style={{gap:16}}>
      <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Commander name" />
      <div className="grid grid-2">
        {options.map(opt => <button key={opt.key} className="card" style={{textAlign:'left', outline: archetype===opt.key ? '2px solid #f59e0b' : 'none'}} onClick={()=>setArchetype(opt.key)}>
          <strong>{opt.label}</strong><div className="muted">{opt.text}</div>
        </button>)}
      </div>
      <button className="btn" disabled={isPending || !name.trim()} onClick={()=>onCreate({ name:name.trim(), archetype })}>{isPending ? 'Creating...' : 'Create Commander'}</button>
    </div>
  </SectionPanel>;
}
