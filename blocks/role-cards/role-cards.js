import { htmlToElement, fetchLanguagePlaceholders } from '../../scripts/scripts.js';
import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';
import { sendNotice } from '../../scripts/toast/toast.js';
import { defaultProfileClient, isSignedInUser } from '../../scripts/auth/profile.js';

loadCSS(`${window.hlx.codeBasePath}/scripts/toast/toast.css`);

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error fetching placeholders:', err);
}

const PROFILE_UPDATED = placeholders?.profileUpdated || 'Your profile changes have been saved!';
const PROFILE_NOT_UPDATED = placeholders?.profileNotUpdated || 'Your profile changes have not been saved!';
const SELECT_ROLE = placeholders?.selectRole || 'Select this role';

export default async function decorate(block) {
  block.textContent = '';
  const isSignedIn = await isSignedInUser();

  console.log(isSignedIn,"sign in")

  const roleCardsData = [
    {
      role: 'User',
      title: placeholders.filterRoleUserTitle || 'Business User',
      icon: 'business-user',
      description:
        placeholders.filterRoleUserDescription ||
        `Responsible for utilizing Adobe solutions to achieve daily job functions, complete tasks, and achieve business objectives.`,
      selectionDefault: placeholders.noSelectionDefault || '(No selection default)',
    },
    {
      role: 'Developer',
      title: placeholders.filterRoleDeveloperTitle || 'Developer',
      icon: 'developer',
      description:
        placeholders.filterRoleDeveloperDescription ||
        `Responsible for engineering Adobe solutions' implementation, integration, data-modeling, data engineering, and other technical skills.`,
      selectionDefault: '',
    },
    {
      role: 'Admin',
      title: placeholders.filterRoleAdminTitle || 'Administrator',
      icon: 'admin',
      description:
        placeholders.filterRoleAdminDescription ||
        `Responsible for the technical operations, configuration, permissions, management, and support needs of Adobe solutions.`,
      selectionDefault: '',
    },
    {
      role: 'Leader',
      title: placeholders.filterRoleLeaderTitle || 'Business Leader',
      icon: 'business-leader',
      description:
        placeholders.filterRoleLeaderDescription ||
        `Responsible for owning the digital strategy and accelerating value through Adobe solutions.`,
      selectionDefault: '',
    },
  ];

  const roleCardsDiv = htmlToElement(`
    <div class="role-cards-container">
      ${roleCardsData
        .map(
          (card, index) => `
        <div class="role-cards-block">
        <div class="role-cards-description">
        <div class="role-cards-icon">
        <span class="icon icon-${card.icon}"></span>
        <h3>${card.title}</h3>
        </div>
        <p>${card.description}</p>
        </div>
        <div class="role-cards-selectiondefault">
        ${isSignedIn ? `<p>${card.selectionDefault}</p>` : ''}
        <span class="role-cards-checkbox">
        <input name="${card.role}" type="checkbox" id="selectRole-${index}">
        <label class="subText" for="selectRole-${index}">${SELECT_ROLE}</label>
        </span>
        </div>
        </div>`,
        )
        .join('')}
    </div>
  `);

  block.append(roleCardsDiv);
  decorateIcons(block);

  if (isSignedIn) {
    console.log("hiiii");
    const profileData = await defaultProfileClient.getMergedProfile();
    const role = profileData?.role;

    role.forEach((el) => {
      const checkBox = document.querySelector(`input[name="${el}"]`);
      if (checkBox) {
        checkBox.checked = true;
        checkBox.closest('.role-cards-block').classList.toggle('highlight', checkBox.checked);
      }
    });

    console.log(profileData,'sent after refresh called');
  }

  // const currentProfile = await defaultProfileClient.getMergedProfile();
  // const updatedRoles = currentProfile.role ? [...currentProfile.role] : [];

  block.querySelectorAll('.role-cards-block').forEach(async (card) => {
    const updatedRoles = [];
    console.log(updatedRoles,"1st updated roles")
    const checkbox = card.querySelector('input[type="checkbox"]');

    card.addEventListener('click', (e) => {
      // const isLabelClicked = e.target.tagName === 'LABEL' || e.target.classList.contains('subText');
      // if (e.target !== checkbox && !isLabelClicked) {
      //   checkbox.checked = !checkbox.checked;
      //   checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      // }
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });

    checkbox.addEventListener('change', async (e) => {
      e.preventDefault();
      const isChecked = checkbox.checked;
      checkbox.closest('.role-cards-block').classList.toggle('highlight', isChecked);

      if (isSignedIn) {
        const profileKey = checkbox.getAttribute('name');

        if (isChecked) {
          if (!updatedRoles.includes(profileKey)) {
            updatedRoles.push(profileKey);
          }
          console.log(updatedRoles,"2nd")
        } else {
          // const roleIndex = updatedRoles.indexOf(profileKey);
          // if (roleIndex !== -1) {
          //   updatedRoles.splice(roleIndex, 1);
          // }
          updatedRoles.push(profileKey);
          console.log(updatedRoles,"3rd")
        }
        try {
          console.log(updatedRoles , 'sent in api');
          await defaultProfileClient.updateProfile('role', updatedRoles);
          sendNotice(PROFILE_UPDATED);
          console.log(updatedRoles , 'sent after api called');
        } catch (error) {
          console.log("error")
          sendNotice(PROFILE_NOT_UPDATED);
        }
      }
    });
  });
  
}
