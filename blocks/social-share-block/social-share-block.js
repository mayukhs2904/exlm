import { htmlToElement } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { socialOptions } from './social-share-block-utils.js';

export default function decorate(block) {

  block.textContent = '';

  function generateSocialItem(item, index, id) {
    return `
      <a href="${item.link()}" target="_blank">
        <div class="social-share-item" id="${id}${index + 1}" value="${item.value}" data-label="${item.title}">
          <span class="icon icon-${item.icon}"></span>
          <span class="social-share-name">${item.title}</span>
        </div>
      </a>
    `;
  }  

  const headerDiv = htmlToElement(`
    <div class="social-share-block" data-filter-type="${socialOptions.id}">
      <div class="social-share-title">
        SHARE ON SOCIAL
      </div>
      <div class="social-share-view">
        ${socialOptions.items.map((item, index) => generateSocialItem(item, index, socialOptions.id)).join('')}
      </div>
    </div>
  `);

  block.append(headerDiv);
  decorateIcons(block);
}
