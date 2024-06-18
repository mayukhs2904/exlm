import AwardDataService from "../../scripts/data-service/award-data-service";


export default async function decorate(block) {
    const adlsService = new AwardDataService();
    const cardData = await adlsService.fetchDataFromSource();
    console.log(cardData,"carddata");
}
  
