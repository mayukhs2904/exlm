import { fetchLanguagePlaceholders } from '../../scripts/scripts.js';
import { fetchProfileData } from '../../scripts/profile/profile.js';

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error fetching placeholders:', err);
}

function decorateButton(profileCtaType, profileCtaText, profileCtaLink) {
  const a = document.createElement('a');
  if (profileCtaLink) {
    a.classList.add('button');
    if (profileCtaType === 'secondary') a.classList.add('secondary');
    if (profileCtaType === 'primary') a.classList.add('primary');
    a.setAttribute('href', profileCtaLink);
    a.textContent = profileCtaText;
    return a.outerHTML;
  }
  return '';
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

const industryText = industry.length > 0 ? industry : 'Unknown';
const interestsText = interests.length > 0 ? interests.join('&nbsp;&nbsp;') : 'Unknown';
const hasInterests = interests && interests.length > 0;

export default async function decorate(block) {
  const [
    profileEyebrowText,
    profileHeading,
    profileDescription,
    profileCtaType,
    profileCtaText,
    profileCtaLink,
    incompleteProfileText,
  ] = block.querySelectorAll(':scope div > div');

  const profileWelcomeBlock = document.createRange().createContextualFragment(`
       <div class="profile-curated-card">
            <div class="profile-curated-card-eyebrowtext">
            ${profileEyebrowText.textContent}
            </div>
            <div class="profile-curated-card-heading">
            ${profileHeading.textContent}
            </div>
            <div class="profile-curated-card-description">
            ${profileDescription.textContent}
            </div>
        </div>
        <div class="profile-user-card">
            <div class="profile-user-card-left">
              <div class="profile-user-card-avatar-company-info">
                <div class="profile-user-card-avatar">
                  <img width="64" height="64" class="profile-picture" src="${profilePicture}" alt="Profile Picture" />
                </div>
                <div class="profile-user-card-info">
                    <h3 class="profile-user-card-name">${adobeDisplayName}</h3>
                    ${communityUserName ? `<div class="profile-user-card-tag">${communityUserName}</div>` : ''}
                    <div class="profile-user-card-org">${company}</div>
                </div> 
              </div> 
                ${
                  hasInterests
                    ? `
                          <div class="profile-user-card-title">${
                            placeholders?.title?.toUpperCase() || 'TITLE: '
                          } ${communityUserTitle}</div>
                          <div class="profile-user-card-location">${
                            placeholders?.location?.toUpperCase() || 'LOCATION: '
                          } ${communityUserLocation}</div>
                        `
                    : `
                          <div class="profile-user-card-incomplete">${incompleteProfileText.textContent}</div>
                        `
                }
            </div>
            <div class="profile-user-card-right">
                <div class="profile-user-card-role">${placeholders?.myRole?.toUpperCase() || 'MY ROLE: '}${roles.join(
                  '&nbsp;&nbsp;',
                )}</div>
                <div class="profile-user-card-industry">${
                  placeholders?.myIndustry?.toUpperCase() || 'MY INDUSTRY: '
                }${industryText}</div>
                <div class="profile-user-card-interests">${
                  placeholders?.myInterests?.toUpperCase() || 'MY INTERESTS: '
                }${interestsText}</div>
                <div class="profile-user-card-cta">${decorateButton(
                  profileCtaType,
                  profileCtaText.textContent,
                  profileCtaLink.textContent,
                )}</div>
            </div>    
       </div>
    `);

  block.textContent = '';
  block.append(profileWelcomeBlock);
}
