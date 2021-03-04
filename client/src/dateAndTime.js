import { shorterYearLabels, yearLabels, Days } from "./mockData"

export const dateAndTime = (apiDate, shortYearLabelOrBiggerYearLabel) => {
    const receivedDate = new Date (Date.parse(apiDate));
    const month = shortYearLabelOrBiggerYearLabel ? shorterYearLabels[receivedDate.getMonth()] : yearLabels[receivedDate.getMonth()];
    const year = receivedDate.getFullYear();
    const date = receivedDate.getDate();
    const getHours = receivedDate.getHours();
    const getMinutes = receivedDate.getMinutes();
    return `${year} ${month} ${date} ${getHours}:${getMinutes}0`;
}

export const date = (apiDate) => {
    const receivedDate = new Date (Date.parse(apiDate));
    const month = (receivedDate.getMonth() + 1).toString().length === 1 ? 
        `0${receivedDate.getMonth() + 1}` :  
        receivedDate.getMonth() + 1;
    const year = receivedDate.getFullYear();
    const dayOfMonth = (receivedDate.getDate()).toString().length === 1 ?
        `0${receivedDate.getDate()}` : 
        receivedDate.getDate();
    return `${year}-${month}-${dayOfMonth}`;
}

export const getDay = (apiDate) => {
    const receivedDate = new Date (Date.parse(apiDate));
    const day = Days[receivedDate.getDay()];
    // const month = shorterYearLabels[receivedDate.getMonth()]
    // const dayOfMonth = (receivedDate.getDate()).toString().length === 1 ?
    //     `0${receivedDate.getDate()}` : 
    //     receivedDate.getDate();
    return `${day}`;
}