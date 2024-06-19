import AwardDataService from "../../scripts/data-service/award-data-service.js";
import { getConfig } from '../../scripts/scripts.js';
import { defaultProfileClient, isSignedInUser } from '../../scripts/auth/profile.js';

const { awardUrl } = getConfig();

async function getAwardsData() {
    const dataSource = {
        url: awardUrl
    };
    const awardDataService = new AwardDataService(dataSource);
    const data = await awardDataService.fetchDataFromSource();
    console.log("Data",data)
}

export async function decorateBookmark(block) {
  const isSignedIn = await isSignedInUser();
  if (isSignedIn) {
    const profileData = await defaultProfileClient.getMergedProfile();
    const skills = profileData?.skills;
    console.log(skills,"skilss")
  }
  block.append(awardsDiv);
}
getAwardsData();