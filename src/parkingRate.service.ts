
import moment from 'moment';


export enum RateName {
    EarlyBird, NightRate, WeekendRate
}

export type ResponseRateDetail = {
    name: string;
    totalPrice: number;
}

export type RateDetails = {
    name: string,
    type: string,
    totalPrice: number,
    entryFrom: string,
    entryTo: string,
    exitFrom: string,
    exitTo: string
}

let earlyBirdRateDetails: RateDetails = {
    name: 'Early Bird',
    type: 'Flat Rate',
    totalPrice: 13,
    entryFrom: '06:00:00',
    entryTo: '09:00:00',
    exitFrom: '15:30:00',
    exitTo: '23:30:00',
};

let nightRateDetails: RateDetails = {
    name: 'Night Rate',
    type: 'Flat Rate',
    totalPrice: 6,
    entryFrom: '18:00:00',
    entryTo: '23:59:59',
    exitFrom: '15:30:00',
    exitTo: '23:30:00',
}

let weekEndRateDetails: RateDetails = {
    name: 'Weekend Rate',
    type: 'Flat Rate',
    totalPrice: 10,
    entryFrom: '00:00:01',
    entryTo: '24:00:00',
    exitFrom: '',
    exitTo: '',
}

let hourlyRateDetails: RateDetails = {
    name: 'Hourly Rate',
    type: 'Flat Rate',
    totalPrice: 0,
    entryFrom: '',
    entryTo: '',
    exitFrom: '',
    exitTo: '',
}

function IsInBetween(time: string,toCheckBefore: string,toCheckAfter:string): boolean{
    let format = "HH:mm:ss";   
    let formattedTime =  moment(time, format);
    let beforeTime = moment(toCheckBefore, format);
    let afterTime = moment(toCheckAfter, format);
    if (formattedTime.isBetween(beforeTime, afterTime)) {
        return true;
    } else {
        return false;
    }
}

function determineHourlyRate(exitDateAndTime: string,entryDateAndTime: string): RateDetails{
    let timeDiff = parseInt(exitDateAndTime)-parseInt(entryDateAndTime);
    let timeDiffInMin = timeDiff/60;
    let timeDiffInHrs = parseFloat((timeDiffInMin/60).toFixed(2));
    
    if(timeDiffInHrs > 0 && timeDiffInHrs <=1){
        hourlyRateDetails.totalPrice = 5;
        return hourlyRateDetails;
    } else if (timeDiffInHrs > 1 && timeDiffInHrs <=2){
        hourlyRateDetails.totalPrice = 10;
        return hourlyRateDetails;
    }
    else if (timeDiffInHrs > 2 && timeDiffInHrs <=3){
        hourlyRateDetails.totalPrice = 15;
        return hourlyRateDetails;
    } else {
        hourlyRateDetails.totalPrice = 20;
        return hourlyRateDetails;
    }
}


function determineApplicableRate(enter: string,exit: string): RateDetails {
    let formattedEntryHours = moment(enter).format("HH:mm:ss");
    let formattedExitHours = moment(exit).format("HH:mm:ss")
    let entryDay = moment(enter).day();
    let exitDay = moment(exit).day();
    let entryDateAndTime = moment(enter).format("X");
    let exitDateAndTime = moment(exit).format("X");
    
    let ifEntryTimeInBetweenTime;
    let ifExitTimeInBetweenTime;
    let initialRateDetailObj: RateDetails = {name:'',type:'',totalPrice: 0,entryFrom:'',entryTo:'',exitFrom:'',exitTo:''};

    let earlyBird = false;
    let nightRate = false;
    let weekEndRate = false;
    if(entryDateAndTime < exitDateAndTime) { // check valid data
        if(entryDay === exitDay && entryDay !== 6 && entryDay !== 0) { // check for Early Bird
            ifEntryTimeInBetweenTime = IsInBetween(formattedEntryHours,earlyBirdRateDetails.entryFrom,earlyBirdRateDetails.entryTo);
            ifExitTimeInBetweenTime = IsInBetween(formattedExitHours,earlyBirdRateDetails.exitFrom,earlyBirdRateDetails.exitTo);
            if(ifEntryTimeInBetweenTime && ifExitTimeInBetweenTime) {
                earlyBird = true;
                return earlyBirdRateDetails;
            } 
        }
        if(entryDay !== exitDay && (exitDay === 6 || (entryDay !== 6 && entryDay !== 0))) { // check for NightRate
            ifEntryTimeInBetweenTime = IsInBetween(formattedEntryHours,nightRateDetails.entryFrom,nightRateDetails.entryTo);
            ifExitTimeInBetweenTime = IsInBetween(formattedExitHours,nightRateDetails.exitFrom,nightRateDetails.exitTo);
            if(ifEntryTimeInBetweenTime && ifExitTimeInBetweenTime) {
                nightRate = true;
                return nightRateDetails;
            } 
        }
        if((entryDay === 6  || entryDay === 0) && (exitDay === 6 || exitDay === 0)) { // check for WeekEnd
            weekEndRate = true;
            return weekEndRateDetails;
        }
        if(!earlyBird && !nightRate && !weekEndRate) { // For hourly rate
            return determineHourlyRate(exitDateAndTime,entryDateAndTime);
        }
    } else {
        return initialRateDetailObj;
    }
    return determineHourlyRate(exitDateAndTime,entryDateAndTime);
}

export function determineTypeOfRate(enter: string,exit: string): ResponseRateDetail {
    let rateDetail = determineApplicableRate(enter,exit);
    return {name: rateDetail.name,totalPrice: rateDetail.totalPrice};
   
}
