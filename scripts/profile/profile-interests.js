import { decorateIcons, loadCSS } from '../lib-franklin.js';
import Dropdown from '../dropdown/dropdown.js';
import { htmlToElement, fetchLanguagePlaceholders } from '../scripts.js';
import getSolutionByName from '../../blocks/toc/toc-solutions.js';
import loadJWT from '../auth/jwt.js';
import { productExperienceEventEmitter } from '../events.js';
import { defaultProfileClient } from '../auth/profile.js';
import { sendNotice } from '../toast/toast.js';

loadCSS(`${window.hlx.codeBasePath}/scripts/profile/profile-interests.css`);

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error fetching placeholders:', err);
}

const PROFILE_UPDATED = placeholders?.profileUpdated || 'Your profile changes have been saved!';
const PROFILE_NOT_UPDATED = placeholders?.profileNotUpdated || 'Your profile changes have not been saved!';

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

// eslint-disable-next-line import/prefer-default-export
export default async function buildProductCard(element, model) {
  const { id, selected: isSelected, Name: product } = model;
  // Create card container
  const card = document.createElement('div');
  const cardContent = document.createElement('div');
  card.className = `profile-interest-card ${isSelected ? 'profile-interest-card-selected' : ''}`;
  const { class: solutionInfoClassName } = getSolutionByName(product);

  // Header
  const header = htmlToElement(`
        <div class="profile-interest-header">
            <div class="profile-interest-logo-wrapper">
                <span class="icon profile-interest-logo"></span>
                <span class="profile-interest-logo-text">${placeholders.myAdobeproduct || 'My Adobe product'}</span>
            </div>
            <h3>${product}</h3>
        </div>
    `);

  const iconEl = header.querySelector('span');
  iconEl.classList.add(`icon-${solutionInfoClassName}`);

  // Content
  const content = htmlToElement(`
        <div class="profile-interest-content">
            <label for="experience-level">${
              placeholders.selectYourExperienceLevel || 'Select your experience level'
            }</label>
        </div>
    `);

  // Checkbox
  const changeHandler = (e) => {
    const { checked } = e.target;
    if (checked) {
      card.classList.add('profile-interest-card-selected');
    } else {
      card.classList.remove('profile-interest-card-selected');
    }
    productExperienceEventEmitter.set(id, checked);
  };
  const checkboxContainer = htmlToElement(`
        <div class="profile-interest-checkbox">
            <input type="checkbox" data-name="${product}">
            <label for="${product}" class="subtext">${placeholders.selectThisProduct || 'Select this product'}</label>
        </div>`);
  const checkbox = checkboxContainer.querySelector('input');
  checkbox.checked = isSelected;
  checkbox.onchange = changeHandler;

  // Assemble card
  card.appendChild(header);
  cardContent.appendChild(content);
  cardContent.appendChild(checkboxContainer);
  card.appendChild(cardContent);

  // Add to DOM
  element.appendChild(card);

  const cardDropdown = new Dropdown(content, '', options);
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

  loadJWT()
    .then(async () => {
      defaultProfileClient
        .getMergedProfile()
        .then(async (data) => {
          if (data?.solutionLevels?.length) {
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
          } else {
            cardDropdown.updateDropdownValue('Beginner');
          }
        })
        .catch(() => {
          cardDropdown.updateDropdownValue('Beginner');
        });
    })
    .catch(() => {
      cardDropdown.updateDropdownValue('Beginner');
    });

  decorateIcons(content);
  await decorateIcons(header, 'solutions/');
}
