import { defaultProfileClient, isSignedInUser } from '../../scripts/auth/profile.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { fetchLanguagePlaceholders } from '../../scripts/scripts.js';

let placeholders = {};
try {
  placeholders = await fetchLanguagePlaceholders();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error fetching placeholders:', err);
}

const COMPLETED = placeholders?.completed || 'COMPLETED';
const NO_AWARDS_YET = placeholders?.noAwardsYet || 'No awards yet! Start exploreing experiemce league to discover what you can earn.'

export default async function decorate(block) {
  block.textContent = '';
  const isSignedIn = await isSignedInUser();
  let awardDetails = [];

  // if (isSignedIn) {
    const profileData = await defaultProfileClient.getMergedProfile();
    // const skills = profileData?.skills;
    const skills=[
      {
          "name": "The Basics",
          "description": "Explore the basics of AEM Assets, including navigation, how assets are organized and modeled, along with basic operations such as create, update and delete.",
          "id": "ExperienceManager-U-1-2020.1.assets",
          "award": false,
          "timestamp": "2024-06-19T06:52:42.477Z"
      },
      {
          "name": "Collaboration",
          "description": "Learn about AEM Assets' collaboration features that facilitate a seamless asset workflow, from conception, to review through revision.",
          "id": "ExperienceManager-U-2-2020.1.assets",
          "award": true,
          "timestamp": "2021-06-19T06:53:04.759Z"
      },
      {
          "name": "Search and Discovery",
          "description": "Explore how AEM makes searching and organizing assets for discovery easy with Omnisearch and Collections.",
          "id": "ExperienceManager-U-3-2020.1.assets",
          "award": true,
          "timestamp": "2022-06-19T06:53:19.127Z"
      },
      {
          "name": "AEM Assets Fundamentals for Business Users",
          "description": "Learn how to use assets and media in AEM Assets.",
          "id": "award:ExperienceManager-U-1-2020.1.assets",
          "award": false,
          "timestamp": "2023-06-19T06:53:25.964Z"
      },
      {
          "name": "Asset Use",
          "description": "Learn how to download assets and their renditions.",
          "id": "ExperienceManager-U-4-2020.1.assets",
          "award": false,
          "timestamp": "2024-06-19T06:53:25.967Z"
      }
    ];
    const awardedSkills = skills.filter(skill => skill.award===true);
    awardDetails = awardedSkills
      .map(skill => ({
        originalTimestamp: skill.timestamp,
        formattedTimestamp: formatTimestampToMonthYear(skill.timestamp),
        title: skill.name,
        description: skill.description
      }))
      .sort((a, b) => new Date(a.originalTimestamp) - new Date(b.originalTimestamp))
      .slice(-3)
      .map(skill => ({
        Timestamp: skill.formattedTimestamp,
        Title: skill.title,
        Description: skill.description
      }));

      if(awardDetails.length){
      const awardsBlockDiv = document.createRange().createContextualFragment(
        `<div class="awards-block-parent">
        ${awardDetails.map(card =>
            `<div class="awards-block-card">
              <div class="awards-block-details">
              <div class="awards-block-title">${card.Title}</div>
              <div class="awards-block-time">${COMPLETED} ${card.Timestamp}</div>
              <div class="awards-block-description">${card.Description}</div>
              </div>
              <span class="icon icon-book"></span>
            </div>`
        ).join('')}
      </div>`);
      block.append(awardsBlockDiv);
    }
    else {
    const awardsBlockEmptyDiv = document.createRange().createContextualFragment(`
      <div class="awards-block-no-awards">
        ${NO_AWARDS_YET}
      </div>
    `);
    block.append(awardsBlockEmptyDiv);
    }
    decorateIcons(block);
  
    function formatTimestampToMonthYear(timestamp) {
      const date = new Date(timestamp);
      const options = { year: 'numeric', month: 'short' };
      const formattedMonth = date.toLocaleDateString(undefined, options).slice(0, 3).toUpperCase();
      const year = date.getFullYear();
      return `${formattedMonth} ${year}`;
    }
  }