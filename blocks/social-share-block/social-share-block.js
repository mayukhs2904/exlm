import { htmlToElement } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const socialDiv = block.firstElementChild;
  const socialNetworks = socialDiv.textContent.split(',').map((network) => network.trim());

  block.textContent = '';

  const socialIcons = [
    {
      id: "Facebook",
      value: 'Facebook',
      icon: "fb-social-icon",
      link: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
    },
    {
      id: "Twitter",
      value: 'Twitter',
      icon: "x-social-icon",
      link: `https://twitter.com/intent/tweet?url=${window.location.href}`
    },
    {
      id: "LinkedIn",
      value: 'LinkedIn',
      icon: "li-social-icon",
      link: `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`
    }
  ];

  const getObjectById = (obj, ID) => {
    return obj.find((option) => option.id === ID);
  };

  const headerDiv = htmlToElement(`
    <div class="social-share-block">
      <div class="social-share-title">
        SHARE ON SOCIAL
      </div>
      <div class="social-share-view">
        ${socialNetworks.map((network) => `
          <a href="${getObjectById(socialIcons, network).link}" target="_blank">
            <div class="social-share-item">
              <span class="icon icon-${getObjectById(socialIcons, network).icon}"></span>
              <span class="social-share-name">${network}</span>
            </div>
          </a>`).join('')}
      </div>
    </div>
  `);

  block.append(headerDiv);
  decorateIcons(block);
}
