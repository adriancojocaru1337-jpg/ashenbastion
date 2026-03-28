export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export function doctrineLabelFromKey(doctrine) {
  const labels = {
    ember_rite: 'Ember Rite',
    warborn: 'Warborn Creed',
    stone_oath: 'Stone Oath',
    veil_path: 'Veil Path',
    harvest_covenant: 'Harvest Covenant',
  };
  return labels[doctrine] || doctrine || 'Ember Rite';
}
