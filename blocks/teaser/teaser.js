import decorateCustomButtons from '../../scripts/utils/button-utils.js';
import { isSignedInUser } from '../../scripts/auth/profile.js';

const UEAuthorMode = window.hlx.aemRoot || window.location.href.includes('.html');

export function generateTeaserDOM(props, classes) {
  console.log(props,"props")
  // Extract properties, always same order as in model, empty string if not set
  const [pictureContainer, eyebrow, title, longDescr, shortDescr, firstCta, secondCta] = props;
  const picture = pictureContainer.querySelector('picture');
  const hasShortDescr = shortDescr.textContent.trim() !== '';
  // Build DOM
  const teaserDOM = document.createRange().createContextualFragment(`
    <div class='background'>${picture ? picture.outerHTML : ''}</div>
    <div class='foreground'>
      <div class='text'>
        ${
          eyebrow.textContent.trim() !== ''
            ? `<div class='eyebrow'>${eyebrow.textContent.trim().toUpperCase()}</div>`
            : ``
        }
        <div class='title'>${title.innerHTML}</div>
        <div class='long-description'>${longDescr.innerHTML}</div>
        <div class='short-description'>${hasShortDescr ? shortDescr.innerHTML : longDescr.innerHTML}</div>
        <div class='cta'>${decorateCustomButtons(firstCta, secondCta)}</div>
      </div>
      <div class='spacer'>
      </div>
    </div>
  `);

  // set the mobile background color
  const backgroundColor = [...classes].find((cls) => cls.startsWith('bg-'));
  if (backgroundColor) {
    teaserDOM
      .querySelector('.foreground')
      .style.setProperty('--teaser-background-color', `var(--${backgroundColor.substr(3)})`);
  }

  // add final teaser DOM and classes if used as child component
  return teaserDOM;
}

export default async function decorate(block) {
  // get the first and only cell from each row
  const isSignedIn = await isSignedInUser();
  const props = [...block.children].map((row) => row.firstElementChild);
  console.log(props,"inside block")
  const variant = props[0]?.textContent?.trim();
  const hideInlineBanner = props[1]?.textContent?.trim();
  let teaserDOM;
  if(variant==='secondary' && hideInlineBanner==='true' && isSignedIn){
    teaserDOM='';
  }
  else{
    teaserDOM = generateTeaserDOM(props, block.classList);
  }
  console.log(teaserDOM,"teaserDom")
  block.textContent = '';
  if (variant) {
    block.classList.add(variant);
  }
  block.append(teaserDOM);
}