import { fetchLanguagePlaceholders } from '../../scripts/scripts.js';

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  console.error('Error fetching placeholders:', err);
}

const socialLabels = [
  {
    id: 'Facebook',
    value: 'Facebook',
    title: 'Facebook',
    icon: 'fb-social-icon'
  },
  {
    id: 'LinkedIn',
    value: 'LinkedIn',
    title: 'LinkedIn',
    icon: 'li-social-icon'
  },
  {
    id: 'X (formerly Twitter)',
    value: 'X (formerly Twitter)',
    title: 'X (formerly Twitter)',
    icon: 'x-social-icon'
  },
].map((role) => ({
  ...role,
  ...(placeholders[`filterRole${role.id}Title`] && { title: placeholders[`filterRole${role.id}Title`] }),
  ...(placeholders[`filterRole${role.id}Icon`] && {
    icon: placeholders[`filterRole${role.id}Icon`],
  }),
}));


export const socialOptions = {
    id: 'el_role',
    name: placeholders.filterRoleLabel || 'SocialLabels',
    items: socialLabels,
    selected: 0,
  };