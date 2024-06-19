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

export default async function decorate(block) {
  const isSignedIn = await isSignedInUser();
  console.log(isSignedIn,"issigned")
  if (isSignedIn) {
    const profileData = await defaultProfileClient.getMergedProfile();
    console.log(profileData,"profiledata")
    const skills = profileData?.skills;
    console.log(skills,"skilss")
  }
  block.append(awardsDiv);
}
getAwardsData();