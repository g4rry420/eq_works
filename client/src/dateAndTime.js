import { shorterYearLabels, yearLabels } from "./mockData"

export const dateAndTime = (apiDate, shortYearLabelOrBiggerYearLabel) => {
    const receivedDate = new Date (Date.parse(apiDate));
    const month = shortYearLabelOrBiggerYearLabel ? shorterYearLabels[receivedDate.getMonth()] : yearLabels[receivedDate.getMonth()];
    const year = receivedDate.getFullYear();
    const date = receivedDate.getDate();
    const getHours = receivedDate.getHours();
    const getMinutes = receivedDate.getMinutes();
    return `${year} ${month} ${date} ${getHours}:${getMinutes}0`;
}