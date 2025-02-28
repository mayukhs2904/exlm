import decorateCustomButtons from '../../scripts/utils/button-utils.js';
import { isSignedInUser } from '../../scripts/auth/profile.js';

// eslint-disable-next-line no-unused-vars
export function generateDetailedTeaserDOM(props, classes) {
  console.log(props,"props")
  // Extract properties, always same order as in model, empty string if not set
  const [backImage, eyebrowContent, title, description, subjectImage, popSubjectImage, firstCta, secondCta] = props;
  const backPicture = backImage.querySelector('picture');
  const subjectPicture = subjectImage.querySelector('picture');

  // add classes for the different eyebrow elements
  if (eyebrowContent) {
    eyebrowContent.classList.add('eyebrow');
    [...eyebrowContent.children].forEach((p, i) => {
      // eslint-disable-next-line default-case
      switch (i) {
        case 0:
          // if first p has an image , otherwise its eyebrow title
          p.classList.add(p.firstElementChild && p.firstElementChild.tagName === 'PICTURE' ? 'logo' : 'title');
          break;
        case 1:
          // if eybrow title is already set it eyebrow subtitle, otherwise its eyebrow title
          p.classList.add(p.previousElementSibling.classList.contains('eyebrow-title') ? 'subtitle' : 'title');
          break;
        case 2:
          // third p is always sub title if existing
          p.classList.add('subtitle');
          break;
      }
    });
  }

  // Build DOM
  const teaserDOM = document.createRange().createContextualFragment(`
    <div class='background'>${backPicture ? backPicture.outerHTML : ''}</div>
    <div class='foreground${popSubjectImage?.textContent === 'true' ? ' pop-subject-image' : ''}'>
      <div class='text'>
        ${eyebrowContent.outerHTML}
        <div class='title'>${title.innerHTML}</div>
        <div class='description'>${description.innerHTML}</div>
        <div class='cta'>${decorateCustomButtons(firstCta, secondCta)}</div>
      </div>
      <div class='spacer'>
        ${subjectPicture ? subjectPicture.outerHTML : ''}
      </div>
    </div>
  `);
  // add final teaser DOM and classes if used as child component
  return teaserDOM;
}

export default async function decorate(block) {
  // get the first and only cell from each row
  const props = [...block.children].map((row) => row.firstElementChild);
  const variantValue = props[0]?.textContent.trim();
  const hideInlineBannerValue = props[1]?.textContent.trim();
  console.timeLog(variantValue,hideInlineBannerValue,"values")
  
  const teaserDOM = generateDetailedTeaserDOM(props.slice(2), block.classList);
  block.textContent = '';
  if(variantValue==='inline-banner'){
    const isSignedIn = await isSignedInUser();
    console.log(isSignedIn,"is signed in")
    if(hideInlineBannerValue==='true' && isSignedIn) {
      console.log("enter")
      block.classList.add('hide-inline-banner');
    }
    else{
      console.log("Else")
      block.classList.remove('hide-inline-banner');
    }
  }
  if (variantValue) {
    block.classList.add(`${variantValue}`);
  }
  block.append(teaserDOM);
}
