import AwardDataService from "../../scripts/data-service/award-data-service";

// Function to call fetchDataFromSource and handle the data
async function getAwardsData() {
  const awardDataService = new AwardDataService();
  try {
    const data = await awardDataService.fetchDataFromSource();
    if (data) {
      console.log('Fetched data:', data);
      // Process the data as needed
    } else {
      console.log('No data received');
    }
  } catch (error) {
    console.error('Error fetching awards data:', error);
  }
}

// Call the function to fetch the data
getAwardsData();
