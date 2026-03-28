export const bastionMock = {
  bastion: {
    name: 'Ashenbastion', doctrine: 'Ember Rite', title: 'Warden of the Bastion',
    queues: { building: { name: 'Lumberyard', targetLevel: 2, progress: 72, eta: '00:00:45' }, training: null },
    troopSummary: [
      { name:'Reaver', quantity:8, role:'Cheap raider' },
      { name:'Pikeguard', quantity:4, role:'Defensive infantry' },
      { name:'Ashbowman', quantity:0, role:'Balanced ranged' },
      { name:'Ravensworn', quantity:2, role:'Scout' }
    ],
    tutorial: [
      { id:1, label:'Upgrade Lumberyard to level 2', progress:100, reward:'+120 Timber' },
      { id:2, label:'Build Barracks', progress:55, reward:'+5 Reavers' },
      { id:3, label:'Scout a nearby ruin', progress:25, reward:'+2 Ravensworn' }
    ]
  },
  buildings: [
    { type:'keep', name:'Bastion Keep', level:1, currentEffect:'Unlocks stronger construction', nextEffect:'Raises max building caps', upgradeCost:{timber:120,iron:120,grain:80,ember:0}, upgradeTime:'2m', canUpgrade:true },
    { type:'lumberyard', name:'Lumberyard', level:1, currentEffect:'+60 Timber/hour', nextEffect:'+90 Timber/hour', upgradeCost:{timber:110,iron:80,grain:50,ember:0}, upgradeTime:'45s', canUpgrade:true },
    { type:'ironMine', name:'Iron Mine', level:1, currentEffect:'+50 Iron/hour', nextEffect:'+75 Iron/hour', upgradeCost:{timber:110,iron:80,grain:50,ember:0}, upgradeTime:'45s', canUpgrade:true },
    { type:'granary', name:'Granary Fields', level:1, currentEffect:'+55 Grain/hour', nextEffect:'+85 Grain/hour', upgradeCost:{timber:110,iron:80,grain:50,ember:0}, upgradeTime:'45s', canUpgrade:true },
    { type:'storehouse', name:'Storehouse', level:1, currentEffect:'1,500 resource capacity', nextEffect:'2,300 capacity', upgradeCost:{timber:130,iron:100,grain:70,ember:0}, upgradeTime:'1m', canUpgrade:true },
    { type:'barracks', name:'Barracks', level:0, currentEffect:'Not yet constructed', nextEffect:'Unlocks Reavers and Pikeguard', upgradeCost:{timber:140,iron:120,grain:80,ember:0}, upgradeTime:'1m', canUpgrade:true }
  ]
};
