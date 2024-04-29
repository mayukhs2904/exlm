import { htmlToElement } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { socialLabels } from './social-share-block-utils.js'; // Import social labels from the utility file

export default function decorate(block) {
  const socialDiv = block.firstElementChild;
  const socialNetworks = socialDiv.textContent.split(',').map((network) => network.trim());

  block.textContent = '';

  // Generate social links dynamically
  const socialLinks = {};
  socialLabels.forEach((label) => {
    socialLinks[label.id] = `https://www.${label.id.toLowerCase()}.com/sharer/sharer.php?u=${window.location.href}`;
  });

  // Generate social icons dynamically
  const socialIcons = {};
  socialLabels.forEach((label) => {
    socialIcons[label.id] = label.icon;
  });

  const headerDiv = htmlToElement(`
    <div class="social-share-block">
      <div class="social-share-title">
        SHARE ON SOCIAL
      </div>
      <div class="social-share-view">
        ${socialNetworks
          .map((network) => `<a href="${socialLinks[network]}" target="_blank">
            <div class="social-share-item">
              <span class="icon ${socialIcons[network]}"></span>
              <span class="social-share-name">${network}</span>
            </div>
          </a>`)
          .join('')}
      </div>
    </div>
  `);

  block.append(headerDiv);
  decorateIcons(block);
}
