
import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import SectionPanel from '@/shared/components/SectionPanel';
import BastionPageHeader from '@/features/bastion/components/BastionPageHeader';
import TutorialPanel from '@/features/bastion/components/TutorialPanel';
import BuildingsGrid from '@/features/bastion/components/BuildingsGrid';
import BuildingDetailPanel from '@/features/bastion/components/BuildingDetailPanel';
import QueuePanel from '@/features/bastion/components/QueuePanel';
import TroopSummaryPanel from '@/features/bastion/components/TroopSummaryPanel';
import QuickActionPanel from '@/features/bastion/components/QuickActionPanel';
import { useBastionData } from '@/features/bastion/hooks/useBastionData';
import { useCommander } from '@/features/commander/hooks/useCommander';
import CommanderPanel from '@/features/commander/components/CommanderPanel';
import ActiveBlessingPanel from '@/features/shrines/components/ActiveBlessingPanel';
import { useActiveBlessing } from '@/features/shrines/hooks/useShrines';

export default function BastionPage() {
  const [selectedBuildingType, setSelectedBuildingType] = useState('lumberyard');
  const { bastion, buildings, isLoading, error } = useBastionData();
  const commanderQuery = useCommander();
  const blessingQuery = useActiveBlessing();

  const selectedBuilding = useMemo(() => {
    return buildings.find((b) => b.type === selectedBuildingType) ?? buildings[0];
  }, [buildings, selectedBuildingType]);

  if (isLoading) return <div className="card">Loading bastion...</div>;
  if (error || !bastion) return <div className="error">Failed to load bastion data.</div>;

  return <div className="grid" style={{gap:16}}>
    <BastionPageHeader bastion={bastion} />
    <TutorialPanel objectives={bastion.tutorial} />
    <div className="grid grid-2" style={{gridTemplateColumns:'minmax(0,2fr) minmax(320px,1fr)'}}>
      <div className="grid" style={{gap:16}}>
        <SectionPanel title="Buildings" description="Core production, military, and defensive structures.">
          <BuildingsGrid buildings={buildings} selectedBuildingType={selectedBuildingType} onSelectBuilding={setSelectedBuildingType} />
        </SectionPanel>
        {selectedBuilding ? <BuildingDetailPanel building={selectedBuilding} /> : null}
      </div>
      <div className="grid" style={{gap:16}}>
        <QueuePanel queues={bastion.queues} />
        <TroopSummaryPanel troops={bastion.troopSummary} />
        <QuickActionPanel />
        {!commanderQuery.isLoading ? <CommanderPanel commander={commanderQuery.data?.commander} compact /> : <div className="card">Loading commander...</div>}
        {!blessingQuery.isLoading ? <ActiveBlessingPanel blessing={blessingQuery.data?.blessing} /> : <div className="card">Loading blessing...</div>}
      </div>
    </div>
  </div>;
}
