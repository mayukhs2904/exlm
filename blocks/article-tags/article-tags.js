import { htmlToElement } from '../../scripts/scripts.js';
import { getMetadata } from '../../scripts/lib-franklin.js';

function createTags(values) {
    let tagsHTML = '';
        values.forEach((value) => {
          tagsHTML += `<div class="article-tags-name">${value.trim()}</div>`;
        });
    return tagsHTML;
  }

export default function decorate(block) {
    const solutions = getMetadata('coveo-solution')?.split(',') || [];
    const roles = getMetadata('role')?.split(',') || [];
    const experienceLevels = getMetadata('level')?.split(',') || [];
  
    // Check if any of the lists are empty or not present
    if (solutions.length === 0 || roles.length === 0 || experienceLevels.length === 0) {
      // If any list is empty, don't show the block
      return;
    }

  const [articleTagHeading] = [...block.children].map((row) => row.firstElementChild);
  block.innerHTML = '';
  block.classList.add('article-tags');

  const headerDiv = htmlToElement(`
    <div class="article-tags-header">
      <div class="article-tags-title">
        ${articleTagHeading.innerHTML}
      </div>
      <div class="article-tags-view">
        ${createTags(solutions)}
        ${createTags(roles)}
        ${createTags(experienceLevels)}
      </div>
    </div>
  `);

  block.append(headerDiv);
}
