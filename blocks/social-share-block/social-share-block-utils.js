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
    icon: 'fb-social-icon',
    link: () => `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
  },
  {
    id: 'LinkedIn',
    value: 'LinkedIn',
    title: 'LinkedIn',
    icon: 'li-social-icon',
    link: () => `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`
  },
  {
    id: 'X (formerly Twitter)',
    value: 'X (formerly Twitter)',
    title: 'X (formerly Twitter)',
    icon: 'x-social-icon',
    link: () => `https://twitter.com/intent/tweet?url=${window.location.href}`
  },
].map((role) => ({
  ...role,
  ...(placeholders[`filterRole${role.id}Title`] && { title: placeholders[`filterRole${role.id}Title`] }),
  ...(placeholders[`filterRole${role.id}Icon`] && {
    icon: placeholders[`filterRole${role.id}Icon`],
  }),
}));

export const socialOptions = {
  id: 'social',
  name: placeholders.filterRoleLabel || 'SocialLabels',
  items: socialLabels,
  selected: 0,
};
