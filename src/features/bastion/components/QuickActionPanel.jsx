import React, { useState } from 'react';
import SectionPanel from '@/shared/components/SectionPanel';
import { useTrainTroops } from '@/features/bastion/hooks/useTrainTroops';

export default function QuickActionPanel() {
  const trainMutation = useTrainTroops();
  const [troopType, setTroopType] = useState('reaver');
  const [quantity, setQuantity] = useState(5);

  return <SectionPanel title="Quick Actions" description="Lightweight demo actions for previewing the loop.">
    <div className="grid" style={{ gap: 8 }}>
      <select className="input" value={troopType} onChange={(e) => setTroopType(e.target.value)}>
        <option value="reaver">Reaver</option>
        <option value="pikeguard">Pikeguard</option>
        <option value="ashbowman">Ashbowman</option>
        <option value="ravensworn">Ravensworn</option>
      </select>
      <input className="input" type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || 1)} />
      {trainMutation.data?.message ? <div className="success">{trainMutation.data.message}</div> : null}
      <button className="btn" disabled={trainMutation.isPending} onClick={() => trainMutation.mutate({ troopType, quantity })}>{trainMutation.isPending ? 'Queueing...' : 'Queue Training'}</button>
    </div>
  </SectionPanel>;
}
