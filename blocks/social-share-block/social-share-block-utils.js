import { fetchLanguagePlaceholders } from '../../scripts/scripts.js';

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error fetching placeholders:', err);
}

/**
 * Array containing roles with associated metadata.
 * Each role object includes a id, value, title and description.
 * The title and description are fetched from language placeholders or falls back to a default description.
 */
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
    id: 'Twitter',
    value: 'Twitter',
    title: 'X (formerly Twitter)',
    icon: 'x-social-icon'
  },
].map((role) => ({
  ...role,
  ...(placeholders[`filterRole${socialLabels.id}Title`] && { title: placeholders[`filterRole${socialLabels.id}Title`] }),
  ...(placeholders[`filterRole${socialLabels.id}Icon`] && {
    icon: placeholders[`filterRole${socialLabels.id}Icon`],
  }),
}));