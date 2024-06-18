import AwardDataService from "../../scripts/data-service/award-data-service";

const adlsService = new AwardDataService();
const cardData = await adlsService.fetchDataFromSource();
console.log(cardData,"carddata");