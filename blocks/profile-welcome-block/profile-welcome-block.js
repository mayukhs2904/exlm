import { fetchLanguagePlaceholders } from '../../scripts/scripts.js';
import { fetchProfileData } from '../../scripts/profile/profile.js'

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error fetching placeholders:', err);
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

  console.log(adobeDisplayName,"name")
  console.log(industry,"indusrrry")
  console.log(roles,"role")
  console.log(interests,"interests")
  console.log(profilePicture,"pic")
  console.log(company,"company")
  console.log(communityUserName,"communityUserName")
  console.log(communityUserTitle,"communityUserTitle")
  console.log(communityUserLocation,"communityUserLocation")

export default async function decorate(block) {
    const [profileEyebrowText, profileHeading, profileDescription, profileCtaType, profileCtaText, profileCtaLink, incompleteProfileText] = block.querySelectorAll(':scope div > div');

    const profileWelcomeBlock = document.createRange().createContextualFragment(`
       <div class="profile-curated-card">
            <div class="profile-curated-card-eyebrowText">
            ${profileEyebrowText.textContent}
            </div>
            <div class="profile-curated-card-profileHeading>
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
            <button>View profile settings</button>
            </div>
       </div>
    `);
    
    block.textContent = '';
    block.append(profileWelcomeBlock);
}
