import { decorateIcons } from '../../scripts/lib-franklin.js';
import decorateCustomButtons from '../../scripts/utils/button-utils.js';
import { defaultProfileClient, isSignedInUser } from '../../scripts/auth/profile.js';
import { getPathDetails } from '../../scripts/scripts.js';

const STORAGE_KEY = 'hide-ribbon-block';
const ribbonStore = {
  /**
   * Removes the entry matching the page path and ribbon id from the store.
   * @param {string} pagePath
   * @param {string} position
   */
  remove: (pagePath, position) => {
    const existingStore = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const updatedStore = existingStore.filter((entry) => {
      return !(entry.pagePath === pagePath && entry.position === position);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStore));
  },
  /**
   * @param {string} pagePath
   * @param {string} position
   * @param {string} id
   * @param {boolean} dismissed
   */
  set: (pagePath, position, id, dismissed) => {
    const existingStore = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const updatedStore = [...existingStore, { pagePath, position, id, dismissed }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStore));
  },
  /**
   * Retrieves the entry matching the page path and ribbon id from the store.
   * @param {string} pagePath
   * @param {string} position
   * @param {string} id
   * @returns {{pagePath: string, id: string, dismissed: boolean} | null}
   */
  get: (pagePath, position) => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const entries = JSON.parse(storedData);
      return entries.find((entry) => entry.pagePath === pagePath && entry.position === position) || null;
    }
    return null;
  },
};

// Function to hide a ribbon and update the key in the browser storage
function hideRibbon(block, pagePath, ribbonPosition, ribbonId) {
  block.parentElement.remove();
  ribbonStore.set(pagePath, ribbonPosition, ribbonId, true);
}

async function decorateRibbon({
  block,
  image,
  heading,
  description,
  pagePath,
  ribbonPosition,
  ribbonId,
  dismissable,
  hexcode,
  firstCta,
  secondCta,
}) {
  if (block.classList.contains('internal-banner')) {
    const UEAuthorMode = window.hlx.aemRoot || window.location.href.includes('.html');
    let displayBlock = false;

    if (UEAuthorMode) {
      displayBlock = true;
    } else {
      const isSignedIn = await isSignedInUser();
      if (isSignedIn) {
        try {
          const profile = await defaultProfileClient.getMergedProfile();
          displayBlock = profile?.email?.includes('@adobe.com');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch profile:', error);
        }
      }
    }

    if (!displayBlock) {
      block.parentElement.remove();
    }
  }

  heading?.classList.add('ribbon-heading');
  description?.classList.add('ribbon-description');
  let bgColorVariable;
  const classes = block.classList;
  const backgroundColorClass = [...classes].find((cls) => cls.startsWith('bg-'));
  if (backgroundColorClass) {
    const bgSpectrumColor = backgroundColorClass.substr(3); // Remove 'bg-' prefix
    bgColorVariable = `var(--${bgSpectrumColor})`; // Use the CSS variable
  } else {
    bgColorVariable = `#${hexcode.innerHTML}`; // Use the hex code directly
  }

  const dismissButton = `<span class="icon icon-close-black"></span>`;

  const ribbonDom = document.createRange().createContextualFragment(`
  <div class="ribbon-image">
  ${image ? image.outerHTML : ''}
  </div>
  <div class="ribbon-content-container">
    <div class="ribbon-default-content">
      ${heading ? heading.outerHTML : ''}
      ${description ? description.outerHTML : ''}
    </div>
    <div class="ribbon-button-container">
      ${decorateCustomButtons(firstCta, secondCta)}
    </div>
    </div>
    ${dismissable ? dismissButton : ''}
  `);

  block.textContent = '';
  block.append(ribbonDom);
  block.style.backgroundColor = bgColorVariable;

  const icon = block.querySelector('.icon');
  if (icon) {
    if (block.classList.contains('dark')) {
      // If dark class is present, change the icon to light
      icon.classList.remove('icon-close-black');
      icon.classList.add('icon-close-light');
    } else {
      // Otherwise default icon
      icon.classList.remove('icon-close-light');
      icon.classList.add('icon-close-black');
    }
  }
  decorateIcons(block);

  // Add close button functionality
  ['.icon-close-black', '.icon-close-light'].forEach((selectedIcon) => {
    const closeIcon = block.querySelector(selectedIcon);
    if (closeIcon && !window.location.href.includes('.html')) {
      closeIcon.addEventListener('click', () => hideRibbon(block, pagePath, ribbonPosition, ribbonId));
    }
  });
}

export default async function decorate(block) {
  const [image, heading, description, hexcode, idElem, firstCta, secondCta] = [...block.children].map(
    (row) => row.firstElementChild,
  );
  const classes = block.classList;
  const ribbonPositionClass = [...classes].find((cls) => cls.startsWith('position-'));
  const { lang } = getPathDetails();
  const dismissable = block.classList.contains('dismissable');
  const url = window.location.href;
  const pagePath = url.includes(`/${lang}/`) 
  ? `/${url.split(`/${lang}/`)[1]}` 
  : '';
  const ribbonPosition = ribbonPositionClass?.substr(9);
  const ribbonId = idElem?.textContent?.trim();
  const ribbonState = ribbonStore.get(pagePath, ribbonPosition);

  if (dismissable && ribbonState && ribbonState.pagePath === pagePath && ribbonState.position === ribbonPosition && ribbonState.id === ribbonId && ribbonState.dismissed) {
    block.remove(); // remove the banner section if it was dismissed
  } 
 else {
    if(dismissable && ribbonState && ribbonState.pagePath === pagePath && ribbonState.position === ribbonPosition && ribbonState.id !== ribbonId && ribbonState.dismissed) {
      ribbonStore.remove(pagePath, ribbonPosition); //re-authoring case
    }
    decorateRibbon({
      block,
      image,
      heading,
      description,
      pagePath,
      ribbonPosition,
      ribbonId,
      dismissable,
      hexcode,
      firstCta,
      secondCta,
    });
  }
}
