export const mapLocationsMock = [
  { id:'loc_home', x:10, y:10, name:'Ashenbastion', type:'player_bastion', owner:{display_name:'Adrian'}, notes:'Your seat of power.' },
  { id:'loc_ruin_01', x:12, y:9, name:'Fallen Ruin', type:'ruin', difficulty:'Low', notes:'Sparse defenders. Suitable for a first raid.' },
  { id:'loc_lair_01', x:15, y:12, name:'Worg Lair', type:'beast_lair', difficulty:'Medium', notes:'Dangerous neutral target.' },
  { id:'loc_player_02', x:6, y:8, name:'Blackthorn Hold', type:'player_bastion', owner:{display_name:'Mordrail'}, notes:'A rival bastion.' }
];
export const marchTroopsMock = [
  { key:'reaver', troop_type:'reaver', name:'Reaver', available:8, speed:8, role:'Cheap raider' },
  { key:'pikeguard', troop_type:'pikeguard', name:'Pikeguard', available:4, speed:6, role:'Defensive infantry' },
  { key:'ashbowman', troop_type:'ashbowman', name:'Ashbowman', available:0, speed:7, role:'Balanced ranged' },
  { key:'ravensworn', troop_type:'ravensworn', name:'Ravensworn', available:2, speed:12, role:'Scout' }
];
