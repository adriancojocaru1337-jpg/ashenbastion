import React from 'react';
import SectionPanel from '@/shared/components/SectionPanel';
import { useUpgradeBuilding } from '@/features/bastion/hooks/useUpgradeBuilding';

export default function BuildingDetailPanel({ building }) {
  const upgradeMutation = useUpgradeBuilding();
  return <SectionPanel title={building.name} description="Selected building details.">
    <div className="grid" style={{ gap: 8 }}>
      <div className="card">Current: {building.currentEffect}</div>
      <div className="card">Next: {building.nextEffect}</div>
      <div className="card">Upgrade cost: Timber {building.upgradeCost?.timber || 0}, Iron {building.upgradeCost?.iron || 0}, Grain {building.upgradeCost?.grain || 0}, Ember {building.upgradeCost?.ember || 0}</div>
      <div className="card">Upgrade time: {building.upgradeTime || building.upgradeTimeSeconds ? `${building.upgradeTimeSeconds || building.upgradeTime}` : 'Instant demo update'}</div>
      {building.lockedReason ? <div className="muted">Locked: {building.lockedReason}</div> : null}
      {upgradeMutation.data?.message ? <div className="success">{upgradeMutation.data.message}</div> : null}
      <button className="btn" disabled={!building.canUpgrade || upgradeMutation.isPending} onClick={() => upgradeMutation.mutate({ buildingType: building.type })}>
        {upgradeMutation.isPending ? 'Upgrading...' : 'Upgrade Building'}
      </button>
    </div>
  </SectionPanel>;
}
