import { fetchLanguagePlaceholders } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { sendNotice } from '../../scripts/toast/toast.js';
import { defaultProfileClient, isSignedInUser } from '../../scripts/auth/profile.js';
import Dropdown from '../../scripts/dropdown/dropdown.js';

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error fetching placeholders:', err);
}

const options = [
  {
    value: 'Beginner',
    title: placeholders.profileExpLevelBeginner || 'Beginner',
  },
  {
    value: 'Intermediate',
    title: placeholders.profileExpLevelIntermediate || 'Intermediate',
  },
  {
    value: 'Advanced',
    title: placeholders.profileExpLevelExperienced || 'Experienced',
  },
];

const PROFILE_UPDATED = placeholders?.profileUpdated || 'Your profile changes have been saved!';
const PROFILE_NOT_UPDATED = placeholders?.profileNotUpdated || 'Your profile changes have not been saved!';
const SELECT_ROLE = placeholders?.selectRole || 'Select this role';

export default async function decorate(block) {
  const isSignedIn = await isSignedInUser();
  const [roleAndIndustryTitle, roleAndIndustryDescription] = block.querySelectorAll(':scope div > div');
 
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

  const roleCardsDiv = document.createRange().createContextualFragment(`
    <div class="role-industry-holder">
      <div class="role-industry-heading">
        <div class="role-industry-title">${roleAndIndustryTitle.innerHTML}</div>
        <div class="role-industry-description">${roleAndIndustryDescription.innerHTML}</div>
      </div>
      
    </div>
    <div class="role-cards-holder">
    ${roleCardsData
      .map(
        (card, index) => `
            <div class="role-cards-item">
              <div class="role-cards-description">
                <div class="role-cards-title">
                  <span class="icon icon-${card.icon}"></span>
                  <h3>${card.title}</h3>
                </div>
                <p>${card.description}</p>
              </div>
              <div class="role-cards-default-selection">
                ${isSignedIn ? `<p>${card.selectionDefault}</p>` : ''}
                <span class="role-cards-checkbox">
                  <input name="${card.role}" type="checkbox" id="selectRole-${index}">
                  <label class="subText" for="selectRole-${index}">${SELECT_ROLE}</label>
                </span>
              </div>
            </div>`
      )
      .join('')}
  </div>
`);

  block.textContent = '';
  block.append(roleCardsDiv);

  const cardDropdown = new Dropdown(roleCardsDiv,'',options);
  cardDropdown.handleOnChange(async (level) => {
    const profileData = await defaultProfileClient.getMergedProfile();
    const { solutionLevels = [] } = profileData;
    const newSolutionItems = solutionLevels.filter((solution) => !`${solution}`.includes(id));
    newSolutionItems.push(`${id}:${level}`);
    defaultProfileClient
      .updateProfile('solutionLevels', newSolutionItems, true)
      .then(() => sendNotice(PROFILE_UPDATED))
      .catch(() => sendNotice(PROFILE_NOT_UPDATED));
  });

  loadJWT().then(async () => {
    defaultProfileClient
      .getMergedProfile()
      .then(async (data) => {
        if (data.solutionLevels?.length) {
          const currentSolutionLevel = data.solutionLevels.find((solutionLevelInfo) =>
            `${solutionLevelInfo}`.includes(id),
          );
          if (currentSolutionLevel) {
            const [, selectedOption] = currentSolutionLevel.split(':') || [undefined, 'Beginner'];
            if (selectedOption) {
              cardDropdown.updateDropdownValue(selectedOption);
            }
          } else {
            cardDropdown.updateDropdownValue('Beginner');
          }
        }
      })
      .catch(() => {
        cardDropdown.updateDropdownValue('Beginner');
      });
  });

  decorateIcons(block);

  if (isSignedIn) {
    const profileData = await defaultProfileClient.getMergedProfile();
    const role = profileData?.role;

    role.forEach((el) => {
      const checkBox = document.querySelector(`input[name="${el}"]`);
      if (checkBox) {
        checkBox.checked = true;
        checkBox.closest('.role-cards-item').classList.toggle('role-cards-highlight', checkBox.checked);
      }
    });
  }

  block.querySelectorAll('.role-cards-item').forEach((card) => {
    const updatedRoles = [];
    const checkbox = card.querySelector('input[type="checkbox"]');

    card.addEventListener('click', (e) => {
      const isLabelClicked = e.target.tagName === 'LABEL' || e.target.classList.contains('subText');
      if (e.target !== checkbox && !isLabelClicked) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    checkbox.addEventListener('change', (e) => {
      e.preventDefault();
      const isChecked = checkbox.checked;
      checkbox.closest('.role-cards-item').classList.toggle('role-cards-highlight', isChecked);

      if (isSignedIn) {
        const profileKey = checkbox.getAttribute('name');
        updatedRoles.push(profileKey);
        defaultProfileClient
          .updateProfile('role', updatedRoles)
          .then(() => sendNotice(PROFILE_UPDATED))
          .catch(() => sendNotice(PROFILE_NOT_UPDATED));
      }
    });
  });
}
