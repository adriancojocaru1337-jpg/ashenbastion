import React from 'react';

export default function BuildingsGrid({ buildings = [], selectedBuildingType, onSelectBuilding }) {
  return <div className="grid grid-2">
    {buildings.map((building) => <button key={building.type} className="card" style={{ textAlign: 'left', outline: selectedBuildingType === building.type ? '2px solid #f59e0b' : 'none' }} onClick={() => onSelectBuilding(building.type)}>
      <strong>{building.name}</strong>
      <div className="muted">Level {building.level}</div>
      <div className="muted">{building.currentEffect}</div>
    </button>)}
  </div>;
}
