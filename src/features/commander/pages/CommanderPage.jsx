
import React from 'react';
import CommanderPanel from '../components/CommanderPanel';
import CommanderCreateCard from '../components/CommanderCreateCard';
import { useCommander, useCreateCommander } from '../hooks/useCommander';

export default function CommanderPage() {
  const { data, isLoading, error } = useCommander();
  const createMutation = useCreateCommander();

  if (isLoading) return <div className="card">Loading commander...</div>;
  if (error) return <div className="error">Failed to load commander.</div>;

  return <div className="grid" style={{gap:16}}>
    <div><div className="muted">Strategic Leadership</div><h2 style={{margin:'4px 0 0'}}>Commander</h2></div>
    {data?.commander
      ? <CommanderPanel commander={data.commander} />
      : <CommanderCreateCard onCreate={(payload)=>createMutation.mutate(payload)} isPending={createMutation.isPending} />}
  </div>;
}
