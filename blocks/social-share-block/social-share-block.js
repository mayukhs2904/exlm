import { htmlToElement } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { socialOptions } from './social-share-block-utils.js';

export default function decorate(block) {
  const socialDiv = block.firstElementChild;
  const socialNetworks = socialDiv.textContent.split(',').map((network) => network.trim());

  block.textContent = '';

  const headerDiv = htmlToElement(`
    <div class="social-share-block">
      <div class="social-share-title">
        SHARE ON SOCIAL
      </div>
      <div class="social-share-view">
        ${socialNetworks.map((network) => {
          const label = socialOptions.items.find((item) => item.id === network);
          const iconClass = label ? label.icon : 'default-social-icon';
          const link = getSocialLink(network); // Get the social link dynamically
          return `<a href="${link}" target="_blank">
            <div class="social-share-item">
              <span class="icon icon-${iconClass}"></span>
              <span class="social-share-name">${network}</span>
            </div>
          </a>`;
        }).join('')}
      </div>
    </div>
  `);

  block.append(headerDiv);
  decorateIcons(block);

  function getSocialLink(network) {
    switch (network) {
      case 'Facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
      case 'X (formerly Twitter)':
        return `https://twitter.com/intent/tweet?url=${window.location.href}`;
      case 'LinkedIn':
        return `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`;
      default:
        return '#'; // Default to '#' if network is not recognized
    }
  }
}
