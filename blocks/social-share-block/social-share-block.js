import { htmlToElement } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { fetchLanguagePlaceholders } from '../../scripts/scripts.js';

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error fetching placeholders:', err);
}

export default function decorate(block) {
  const socialDiv = block.firstElementChild;
  const socialNetworks = socialDiv.textContent.split(',').map((network) => network.trim());

  block.textContent = '';

  const socialData = [
    {
      id: 'Facebook',
      value: 'facebook',
      icon: 'fb-social-icon',
      url: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    },
    {
      id: 'X (formerly Twitter)',
      value: 'twitter',
      icon: 'x-social-icon',
      url: `https://twitter.com/intent/tweet?url=${window.location.href}`,
    },
    {
      id: 'LinkedIn',
      value: 'linkedin',
      icon: 'li-social-icon',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`,
    },
  ];

  const headerDiv = htmlToElement(`
    <div class="social-share-block">
      <div class="social-share-title">
        ${placeholders.shareOnSocial}
      </div>
      <div class="social-share-view">
        ${socialNetworks
          .map((network) => {
            const socialInfo = socialData.find((item) => item.id === network);
              return `
              <a href="${socialInfo.url}" target="_blank">
                <div class="social-share-item">
                  <span class="icon icon-${socialInfo.icon}"></span>
                  <span class="social-share-name">${placeholders[socialInfo.value]}</span>
                </div>
              </a>`;
          })
          .join('')}
      </div>
    </div>
  `);

  block.append(headerDiv);
  decorateIcons(block);
}
