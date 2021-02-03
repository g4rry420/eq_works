const cache = require('memory-cache');
const moment = require("moment");


const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_WINDOW_REQUEST_COUNT = 10;
const WINDOW_LOG_INTERVAL_IN_SECONDS = 30;

exports.rateLimiter = (req, res, next) => {
    try {
        const record = cache.get(req.connection.remoteAddress);
        const currentRequestTime = moment();
        if(record === null || !record) {
            // console.log("I am called")
            let newRecord = [];
            let requestLog = {
                requestTimeStamp: currentRequestTime.unix(),
                tokens: 10
            }
            newRecord.push(requestLog);
            cache.put(req.connection.remoteAddress, JSON.stringify(newRecord));
            // console.log("NEW ", cache.get(req.connection.remoteAddress))
            next();
        }else{
            // if record is found, parse the value of record it's value and calculate number of tokens has available.
            let data = JSON.parse(record);
            let lastRecordedData = data[data.length - 1];
            // console.log((lastRecordedData.requestTimeStamp + 60 ) > currentRequestTime.unix());

            //if the stored value of last request has not elapsed the timestamp of 60
            if((data[data.length - 1].requestTimeStamp + 60 ) > currentRequestTime.unix()){
                // the last record in the request should have the token greater then 0 and equal to or less than 10
                if(lastRecordedData.tokens > 0 && lastRecordedData.tokens <=10 ){
                    lastRecordedData.tokens--;
                    data[data.length - 1] = lastRecordedData;
                    cache.put(req.connection.remoteAddress, JSON.stringify(data));
                    // console.log("NEW Data AT 34 ", cache.get(req.connection.remoteAddress))
                    next();
                }else{
                    res.status(429).json({
                        error: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_SECONDS} seconds limit!`
                    })
                }
            }else{
                cache.del(req.connection.remoteAddress);
                let newData = [];
                newData.push({ requestTimeStamp:  currentRequestTime.unix(), tokens: 10});
                cache.put(req.connection.remoteAddress, JSON.stringify(newData));
                // console.log("NEW Data AT 43 ", cache.get(req.connection.remoteAddress))
                next();
            }
        }

    } catch (error) {
        next(error)
    }
}

// exports.rateLimiter = (req, res, next) => {
//     try {
//         const record = cache.get(req.connection.remoteAddress)
//         const currentRequestTime = moment();

//         if(record === null || !record){
//             console.log("I am called")
//             let newRecord = [];
//             let requestLog = {
//                 requestTimeStamp: currentRequestTime.unix(),
//                 requestCount: 1
//             }
//             newRecord.push(requestLog)
//             cache.put(req.connection.remoteAddress, JSON.stringify(newRecord));
//             console.log("NEW Data AT Last ", cache.get(req.connection.remoteAddress))
//             next();
//         }else {
//             // if record is found, parse it's value and calculate number of requests users has made wirhin the last window
//             let data = JSON.parse(record);
//             let windowStartTimestamp = moment().subtract(WINDOW_SIZE_IN_SECONDS, "seconds").unix();
//             console.log("windowStartTimestamp ", windowStartTimestamp)
//             let requestsWithinWindow = data.filter(entry => {
//                 // console.log("entry.requestTimeStamp ", entry.requestTimeStamp, "windowStartTimestamp ", windowStartTimestamp);
//                 return entry.requestTimeStamp > windowStartTimestamp;
//             });
//             console.log('requestsWithinWindow', requestsWithinWindow, "data ", data);

//             let totalWindowRequestsCount = requestsWithinWindow.reduce((acc, entry) => acc + entry.requestCount, 0);
//             console.log("totalWindowRequestsCount ", totalWindowRequestsCount, "MAX_WINDOW_REQUEST_COUNT", MAX_WINDOW_REQUEST_COUNT);

//             // if number of requests made is greater than or equal to the desired maximum, return error
//             if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
                // res.status(429).json({
                //     error: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_SECONDS} seconds limit!`
                // })
//             }else {
//                 // if number of requests made is lesser than allowed maximum, log new entry
//                 let lastRequestLog = data[data.length - 1];
//                 let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
//                     .subtract(WINDOW_LOG_INTERVAL_IN_SECONDS, "seconds").unix()

//                 //  if interval has not passed since last request log, increment counter
//                 console.log(lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp)
//                 if(lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp){
                    // lastRequestLog.requestCount ++;
                    // data[data.length - 1] = lastRequestLog;
//                 }else {
//                     //  if interval has passed, log new entry for current user and timestamp
//                     data.push({ requestTimeStamp: currentRequestTime.unix(), requestCount: 1 });
//                 }
//                 cache.put(req.connection.remoteAddress, JSON.stringify(data));
//                 console.log("NEW Data AT Last ", cache.get(req.connection.remoteAddress))
//                 next()
//             }
//         }

//     } catch (error) {
//         next(error)
//     }
// }