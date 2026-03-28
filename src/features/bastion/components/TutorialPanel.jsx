import React from 'react';
import SectionPanel from '@/shared/components/SectionPanel';

export default function TutorialPanel({ objectives = [] }) {
  return <SectionPanel title="Tutorial Objectives" description="Core tasks for the current early-game loop.">
    <div className="grid" style={{ gap: 8 }}>
      {objectives.map((objective) => <div key={objective.id} className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <strong>{objective.label}</strong>
          <span className="badge">{objective.progress}%</span>
        </div>
        <div className="muted">Reward: {objective.reward}</div>
      </div>)}
    </div>
  </SectionPanel>;
}
