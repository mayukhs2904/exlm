import { defaultProfileClient, isSignedInUser } from '../../scripts/auth/profile.js';

export default async function decorate(block) {
  block.textContent = '';
  const isSignedIn = await isSignedInUser();
  let awardDetails = [];

  const awardsBlockDiv = document.createRange().createContextualFragment(`
    ${awardDetails.map((card)=>{
      <><h1>{card.Title}</h1><span>{card.Timestamp}</span><div>{card.Description}</div></>
    })}
  `);

  block.append(awardsBlockDiv);

  if (isSignedIn) {
    const profileData = await defaultProfileClient.getMergedProfile();
    const skills = profileData?.skills;
    const awardedSkills = skills.filter(skill => skill.award===true);
    awardDetails = awardedSkills
      .map(skill => ({
        originalTimestamp: skill.timestamp, // Keep the original timestamp for sorting
        formattedTimestamp: formatTimestampToMonthYear(skill.timestamp),
        title: skill.name,
        description: skill.description
      }))
      .sort((a, b) => new Date(a.originalTimestamp) - new Date(b.originalTimestamp)) // Sort by original timestamp
      .map(skill => ({
        Timestamp: skill.formattedTimestamp,
        Title: skill.title,
        Description: skill.description
      }));
  }

  function formatTimestampToMonthYear(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short' }; // Using 'short' month format
    const formattedMonth = date.toLocaleDateString(undefined, options).slice(0, 3).toUpperCase();
    const year = date.getFullYear();
    return `${formattedMonth} ${year}`;
  }
}