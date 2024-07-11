import { fetchLanguagePlaceholders } from '../../scripts/scripts.js';
import { getMetadata } from '../../scripts/lib-franklin.js';

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error fetching placeholders:', err);
}

const TOPICS = placeholders?.topics || 'TOPICS:';
const CREATED_FOR = placeholders?.createdFor || 'CREATED FOR:';
const PRODUCT = placeholders?.product || 'PRODUCT:';

export default function decorate(block) {
  const coveosolutions = getMetadata('coveo-solution');
  console.log(coveosolutions,"covesol")
  const solutions = [
    ...new Set(
      coveosolutions.split(';').map((item) => {
        const parts = item.split('|');
        return parts.length > 1 ? parts[1].trim() : item.trim();
      }),
    ),
  ].join(',');
  console.log(solutions,"sol")

  const features = getMetadata('feature');
  console.log(features,"feature")
  const extractedValues = features
  .split(',')
  .map(item => {
    const parts = item.split('exl:feature/')[1].trim();
    const splitParts = parts.split('/');
    return splitParts.length > 1 ? splitParts[1] : '';
  })
  .filter(Boolean) // Remove empty values
  .join(',');
  console.log(extractedValues,"featuresnew")
  const roles = getMetadata('role');
  const experienceLevels = getMetadata('level');

  function createTagsHTML(values) {
    return values
      .split(',')
      .filter(Boolean)
      .map((value) => `<div class="article-tags-name">${value.trim()}</div>`)
      .join('');
  }

  block.textContent = '';

  const articleTags = document.createRange().createContextualFragment(`
      <div class="article-tags-product">
      <div class="article-tags-product-heading">
      ${PRODUCT}
      </div>
        ${[solutions].map(createTagsHTML).join('')}
      </div>
      <div class="article-tags-topics">
      <div class="article-tags-topics-heading">
      ${TOPICS}
      </div>
        ${[extractedValues].map(createTagsHTML).join('')}
      </div>
      <div class="article-tags-createdFor">
      <div class="article-tags-createdFor-heading">
      ${CREATED_FOR}
      </div>
        ${[roles, experienceLevels].map(createTagsHTML).join('')}
      </div>
  `);

  block.append(articleTags);
}
