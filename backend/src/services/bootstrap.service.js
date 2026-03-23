import { withTransaction } from '../db/pool.js';
import { createPlayerProfile } from '../repositories/users.repository.js';
import { createBastionForUser, findOpenSpawnCoordinates, seedDefaultBuildingsForBastion, seedDefaultTroopsForBastion } from '../repositories/bastion.repository.js';
import { seedNeutralMapLocations } from '../repositories/map.repository.js';

async function bootstrapNewPlayerTx({ userId, displayName, doctrine = 'ember_rite', bastionName = 'Ashenbastion' }, client) {
  await createPlayerProfile({ userId, displayName, doctrine }, client);
  const spawn = await findOpenSpawnCoordinates(client);
  const bastion = await createBastionForUser({ userId, name: bastionName, x: spawn.x, y: spawn.y }, client);
  await seedDefaultBuildingsForBastion(bastion.id, client);
  await seedDefaultTroopsForBastion(bastion.id, client);
  await seedNeutralMapLocations(client);
  return { profileCreated: true, bastionId: bastion.id, coordinates: spawn };
}

export async function bootstrapNewPlayer(input, existingClient = null) {
  if (existingClient) return bootstrapNewPlayerTx(input, existingClient);
  return withTransaction((client) => bootstrapNewPlayerTx(input, client));
}
