import { fetchLanguagePlaceholders } from '../../scripts/scripts.js';
import { fetchProfileData } from '../../scripts/profile/profile.js'

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error fetching placeholders:', err);
}

function decorateButton(...buttons) {
    return buttons
    .map((div) => {
        console.log(div,"div")
      const a = div.querySelector('a');
      if (a) {
        console.log(a,"a")
        a.classList.add('button');
        // if (a.parentElement.tagName === 'EM') a.classList.add('secondary');
        // if (a.parentElement.tagName === 'STRONG') a.classList.add('primary');
        return a.outerHTML;
      }
      return '';
    })
    .join('');  
}

const profileFlags = ['exlProfile', 'communityProfile'];
const profileData = await fetchProfileData(profileFlags);

const {
    adobeDisplayName,
    industry,
    roles,
    interests,
    profilePicture,
    company,
    communityUserName,
    communityUserTitle,
    communityUserLocation,
  } = profileData;

export default async function decorate(block) {
    const [profileEyebrowText, profileHeading, profileDescription, profileCta, incompleteProfileText] = block.querySelectorAll(':scope div > div');

    console.log(profileCta,"ctaaaaaa")

    const profileWelcomeBlock = document.createRange().createContextualFragment(`
       <div class="profile-curated-card">
            <div class="profile-curated-card-eyebrowText">
            ${profileEyebrowText.textContent}
            </div>
            <div class="profile-curated-card-profileHeading">
            ${profileHeading.textContent}
            </div>
            <div class="profile-curated-card-profileDescription">
            ${profileDescription.textContent}
            </div>
        </div>
        <div class="profile-user-card">
            <div class="profile-user-card-left">
                <div class="profile-image">
                ${profilePicture}
                </div>
                <div class="profile-info">
                    <h3 class="profile-name">${adobeDisplayName}</h3>
                    <div class="profile-tag">${communityUserName}</div>
                    <div class="profile-org">${company}</div>
                </div>
                <div class="profile-title"><strong>TITLE:${communityUserTitle}</strong></div>
                <div class="profile-location"><strong>LOCATION:${communityUserLocation}</strong></div>
            </div>
            <div class="profile-user-card-right">
                <div class="profile-role"><strong>MY ROLE:${roles}</strong></div>
                <div class="profile-industry"><strong>MY INDUSTRY:${industry}</strong></div>
                <div class="profile-interests"><strong>MY INTERESTS:${interests}</strong></div>
                <div class="profile-cta">${decorateButton(profileCta)}</div>
            </div>    
       </div>
    `);
    
    block.textContent = '';
    block.append(profileWelcomeBlock);
}
