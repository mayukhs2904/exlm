/**
 * AwardDataService class for fetching data from Award Service API.
 */
export default class AwardDataService {
    async fetchDataFromSource() {
      try {
        const urlWithParams = 'https://experienceleague.adobe.com/api/awards?page_size=1000&lang=en';
        const response = await fetch(urlWithParams, {
          method: 'GET',
        });
        const data = await response.json();
        return data;
      } catch (error) {
        /* eslint-disable no-console */
        console.error('Error fetching data', error);
        return null;
      }
    }
  }
  