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

  const headerDiv = (options, id) => htmlToElement(`
    <div class="social-share-block" data-filter-type="${options.id}">
      <div class="social-share-title">
        SHARE ON SOCIAL
      </div>
      <div class="social-share-view">
        ${options.items.map((item, index) => generateSocialItem(item, index, id)).join('')}
      </div>
    </div>
  `);

  // Invoke headerDiv function to get the HTML element
  const headerElement = headerDiv(socialOptions, 'social-share-block');
  
  // Append the generated HTML element to the block
  block.append(headerElement);

  // Decorate icons
  decorateIcons(block);
}
