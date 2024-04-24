import { htmlToElement } from '../../scripts/scripts.js';
import facebookSvg from './icons/fb-social-icon.svg';
import linkedInSvg from './icons/li-social-icon.svg';
import twitterSvg from './icons/x-social-icon.svg';

export default function decorate(block) {
  const socialDiv = block.firstElementChild;
  const socialNetworks = socialDiv.textContent.split(',').map((network) => network.trim());

  block.textContent = '';

  const socialLinks = {
    Facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    'X (formerly Twitter)': `https://twitter.com/intent/tweet?url=${window.location.href}`,
    LinkedIn: `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`,
  };

  const socialIcons = {
    Facebook: facebookSvg,
    LinkedIn: linkedInSvg,
    'X (formerly Twitter)': twitterSvg,
  };

  // const socialIcons = {
  //   Facebook: '',
  //   LinkedIn: '',
  //   'X (formerly Twitter)': '',
  // };

  const headerDiv = htmlToElement(`
    <div class="social-share-block">
    <div class="social-share-title">
      ${'SHARE ON SOCIAL'}
    </div>
    <div class="social-share-view">
      ${socialNetworks
        .map(
          (network) => `<a href="${socialLinks[network]}">
      <div class="social-share-item">
      ${socialIcons[network] || ''}<span class="social-share-name">${network}</span>
      </div>
      </a>`,
        )
        .join('')}
    </div>
    </div>
  `);

  block.append(headerDiv);
}
