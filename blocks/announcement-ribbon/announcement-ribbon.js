import { decorateIcons } from '../../scripts/lib-franklin.js';

function decorateButtons(...buttons) {
  return buttons
    .map((button) => {
      const link = button?.querySelector('a');
      if (link) {
        link.classList.add('button');
        if (link.parentElement.tagName === 'EM') link.classList.add('secondary');
        if (link.parentElement.tagName === 'STRONG') link.classList.add('primary');
        return link.outerHTML;
      }
      return '';
    })
    .join('');
}

// Function to hide a  ribbon and update session storage
function hideRibbon(block) {
  block.style.display = 'none';
  sessionStorage.setItem(`hideRibbonBlock`, 'true');
}

// Function to check session storage and hide the ribbon if it was previously closed
function isRibbonHidden() {
  return sessionStorage.getItem('hideRibbonBlock') === 'true';
}

export default async function decorate(block) {
  if (isRibbonHidden()) {
    block.style.display = 'none';
    return;
  }
  const [image, heading, description, hexcode, firstCta, secondCta] = [...block.children].map((row) => row.firstElementChild);

  heading?.classList.add('ribbon-heading');
  description?.classList.add('ribbon-description');
  const bgColorCls = [...block.classList].find((cls) => cls.startsWith('bg-'));
  const bgColor = bgColorCls ? `var(--${bgColorCls.substr(3)})` : `#${hexcode.innerHTML}`;

  const ribbonDom = document.createRange().createContextualFragment(`
  <div class="ribbon-image" style="background-color : ${bgColor}">
  ${image ? image.outerHTML : ''}
  </div>
  <div class="ribbon-content-container">
    <div class="ribbon-default-content">
      ${heading ? heading.outerHTML : ''}
      ${description ? description.outerHTML : ''}
    </div>
    <div class="ribbon-button-container">
      ${decorateButtons(firstCta, secondCta)}
    </div>
    </div>
    <span class="icon icon-close-black"></span>
  `);

  block.textContent = '';
  block.append(ribbonDom);

  decorateIcons(block);

  // Add close button functionality
  const closeIcon = block.querySelector('.icon-close-black');
  if (closeIcon && !window.location.href.includes('.html')) {
    closeIcon.addEventListener('click', () => hideRibbon(block));
  }
}
