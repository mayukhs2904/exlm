import { fetchLanguagePlaceholders } from '../../scripts/scripts.js';
import { defaultProfileClient, isSignedInUser } from '../../scripts/auth/profile.js';

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

let profileData = [];
let ppsProfileData = [];
let communityProfileData = [];

const isSignedIn = await isSignedInUser();
if (isSignedIn) {
    profileData = await defaultProfileClient.getMergedProfile();
    ppsProfileData = await defaultProfileClient.getPPSProfile();
    communityProfileData = await defaultProfileClient.fetchCommunityProfileDetails();
}

const adobeDisplayName = profileData?.displayName;
const adobeFirstName = profileData?.first_name;
const industry = profileData?.industryInterests;
const roles = profileData?.role;
const interests = profileData?.interests;
const profilePicture = ppsProfileData?.images;
const company = ppsProfileData?.company;
const communityUserName = communityProfileData?.username;
const communityUserTitle = communityProfileData?.title;
const communityUserLocation = communityProfileData?.location;
const industryText = industry.length > 0 ? industry : 'Unknown';
const interestsText = interests.length > 0 ? interests.join(' | ') : 'Unknown';
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
              ${profileEyebrowText.textContent.replace('{adobeIMS.first_name}', adobeFirstName)}
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
                ${
                  profilePicture
                    ? `<img width="75" height="75" class="profile-picture" src="${profilePicture}" alt="Profile Picture" />`
                    : '<span class="icon icon-profile"></span>'
                }
                </div>
                <div class="profile-user-card-info">
                    <div class="profile-user-card-name">${adobeDisplayName}</div>
                    ${communityUserName ? `<div class="profile-user-card-tag">@${communityUserName}</div>` : ''}
                    <div class="profile-user-card-org">${company}</div>
                </div> 
              </div> 
                ${
                  hasInterests
                    ? `
                          <div class="profile-user-card-title">
                          <span class="heading">${placeholders?.title || 'TITLE: '}</span>${communityUserTitle}</div>
                          <div class="profile-user-card-location"><span class="heading">${
                            placeholders?.location || 'LOCATION: '
                          }</span>${communityUserLocation}</div>
                        `
                    : `
                          <div class="profile-user-card-incomplete">${incompleteProfileText.textContent}</div>
                        `
                }
            </div>
            <div class="profile-user-card-right">
                <div class="profile-user-card-role"><span class="heading">${
                  placeholders?.myRole || 'MY ROLE: '
                }</span>${roles.join(' | ')}</div>
                <div class="profile-user-card-industry"><span class="heading">${
                  placeholders?.myIndustry || 'MY INDUSTRY: '
                }</span>${industryText}</div>
                <div class="profile-user-card-interests"><span class="heading">${
                  placeholders?.myInterests || 'MY INTERESTS: '
                }</span>${interestsText}</div>
                <div class="profile-user-card-cta">${decorateButton(
                  profileCtaType.textContent,
                  profileCtaText.textContent,
                  profileCtaLink.textContent,
                )}</div>
            </div>    
       </div>
    `);

  block.textContent = '';
  block.append(profileWelcomeBlock);
}
