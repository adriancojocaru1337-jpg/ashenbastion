# Frontend integration notes

## Router additions
Add:
- `/game/commander`
- `/game/shrines`
- `/game/shrines/:id`

## Bastion page additions
Add these panels in the right sidebar:
- `CommanderPanel`
- `ActiveBlessingPanel`

Example:
```jsx
const commander = useCommander();
const blessing = useActiveBlessing();

<QueuePanel ... />
<CommanderPanel commander={commander.data?.commander} />
<ActiveBlessingPanel blessing={blessing.data?.blessing} />
<TroopSummaryPanel ... />
```

## Map page addition
When selected location is a shrine:
- show shrine bonus
- show owner
- reuse existing march setup
- send normal `POST /api/map/marches` attack against shrine map location

No special shrine-claim endpoint is required if march resolution handles shrine targets.
