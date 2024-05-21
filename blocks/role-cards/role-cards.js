import { htmlToElement, fetchLanguagePlaceholders } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { sendNotice } from '../../scripts/toast/toast.js';
import { loadCSS } from '../../scripts/lib-franklin.js';
import { defaultProfileClient, isSignedInUser } from '../../scripts/auth/profile.js';

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error fetching placeholders:', err);
}

const displayToast = (event) => {
    var checkBox = event.target;
    const roleCardBlock = checkBox.closest('.role-cards-block');

    if (checkBox.checked) {
        console.log("true", checkBox.id)
        roleCardBlock.classList.add("highlight");
        sendNotice(`${placeholders.profileUpdated}`);
    }
    else {
        console.log("false")
        roleCardBlock.classList.remove("highlight");
    }
}

export default async function decorate(block) {
  loadCSS(`${window.hlx.codeBasePath}/scripts/toast/toast.css`);
  block.textContent = '';

  const roleCardsData = [
    {
      title: placeholders.filterRoleUserTitle,
      icon: 'business-user',
      description: placeholders.filterRoleUserDescription,
      selectionDefault: '(No selection default)'
    },
    {
      title: placeholders.filterRoleDeveloperTitle,
      icon: 'developer',
      description: placeholders.filterRoleDeveloperDescription,
      selectionDefault: ''
    },
    {
      title: placeholders.filterRoleAdminTitle,
      icon: 'admin',
      description: placeholders.filterRoleAdminDescription,
      selectionDefault: ''
    },
    {
      title: placeholders.filterRoleLeaderTitle,
      icon: 'business-leader',
      description: placeholders.filterRoleLeaderDescription,
      selectionDefault: ''
    },
  ];

  const roleCardsDiv = htmlToElement(`
    <div class="role-cards-container">
      ${roleCardsData.map((card, index) => {
        return `
        <div class="role-cards-block">
        <div class="role-cards-description">
        <span class="icon icon-${card.icon}"></span>
        <h3>${card.title}</h3>
        <p>${card.description}</p>
        </div>
        <div class="role-cards-selectiondefault">
        <p>${card.selectionDefault}</p>
        <div class="role-cards-checkbox">
        <input type="checkbox" id="selectRole-${index}">
        <label for="selectRole-${index}">Select this role</label>
        </div>
        </div>
        </div>`;
      }).join('')}
    </div>
  `);

  block.append(roleCardsDiv);
  decorateIcons(block);

  roleCardsData.map((card, index) => {
    const checkBox = document.getElementById(`selectRole-${index}`);
    checkBox.addEventListener('click', displayToast);
  })

  
  const isSignedIn = await isSignedInUser();
  if (isSignedIn) {
    const profileData = await defaultProfileClient.getMergedProfile();
    console.log(profileData,"profiledata");
  }

}
