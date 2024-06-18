import AwardDataService from "../../scripts/data-service/award-data-service";

// Function to call fetchDataFromSource and handle the data
async function getAwardsData() {
    const dataSource = {
        url: 'https://experienceleague.adobe.com/api/awards?page_size=1000&lang=en',
      };
      const awardDataService = new AwardDataService(dataSource);
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
