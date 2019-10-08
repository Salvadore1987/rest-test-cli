import { IResult } from "./IResult";
import { IReport } from "./IReport";

const axios = require('axios');
const chalk = require('chalk');

const regex = /http:\/\/[\w\.]+:[0-9]+\/[\w-_]?/gm;
const results = new Array<IResult>();

const init = (args: string[]): void => {
    if (args.length < 5)
        throw new Error('No valid args count');
    else {
        const method = args[2].toUpperCase();
        const count = parseInt(args[3]);
        const url = args[4];
        testUrl(url);
        if (method == 'GET')
            doGet(url, count);
        if (method == 'POST')
            doPost(url, count, args[5]);
    }
}

const doGet = async (url: string, count: number): Promise<void> => {
    const begin = Date.now();
    for (let i = 0; i < count; i++) {
        let result: IResult;
        try {
            let begin = Date.now();
            const res = await get(url);
            let end = Date.now();
            result = {error: false, success: true, answerTime: end - begin}
            infoLog(res.data);
        } catch (err) {
            result = {error: true, success: false, answerTime: 0}
            errorLog(err.message);
        }
        results.push(result);
    }
    const end = Date.now();
    const totalReqTime = Math.round(((end - begin) * 100) / 100);
    printReport(count, totalReqTime);
    
}

const printReport = (count: number, totalReqTime: number): void => {
    const res = calculate(count, totalReqTime);
    const total = chalk.green('Total requests: ' + res.total);
    const success = chalk.yellow('Success requests: ' + res.success + '%');
    const rejected = chalk.red('Rejected requests: ' + res.rejected + '%');
    const time = Math.round(res.avverageTime * 100) / 100
    const average = chalk.blue('Average requests time: ' + time + ' ms');
    const totalTime = chalk.blue('Total request time: ' + totalReqTime + ' ms');
    const minTime = chalk.green('Min request time: ' + res.minRequestTime + ' ms');
    const maxTime = chalk.red('Max request time: ' + res.maxRequestTime + ' ms');
    console.log(total);
    console.log(success);
    console.log(rejected);
    console.log(average);
    console.log(totalTime);
    console.log(minTime);
    console.log(maxTime);
}

const doPost = async (url: string, count: number, data?: any): Promise<void> => {
    const begin = Date.now();
    for (let i = 0; i < count; i++) {
        let result: IResult;
        try {
            let begin = Date.now();
            const res = await post(url, data);
            let end = Date.now();
            result = {error: false, success: true, answerTime: end - begin}
            infoLog(res.data);
        } catch (err) {
            result = {error: true, success: false, answerTime: 0}
            errorLog(err.message);
        }      
        results.push(result);  
    }
    const end = Date.now();
    const totalReqTime = Math.round(((end - begin) * 100) / 100);
    printReport(count, totalReqTime);
}

const testUrl = (url: string): void => {
    if (!url.match(regex))
        throw new Error('Url is not valid');
}

const get = async (url: string): Promise<any> => {
    const res = await axios.get(url);
    return res;
}

const post = async (url:string, data: any): Promise<any> => {
    const res = await axios.post(url, data);
    return res;
}

const calculate = (count: number, totalReqTime: number): IReport => {
    const report: IReport = {
        total: count, 
        rejected: allRejected(count), 
        success: allSuccess(count), 
        avverageTime: average(), 
        totalRequestTime: totalReqTime,
        minRequestTime: min(),
        maxRequestTime: max()
    };
    return report;
}

const min = (): number => {
    const res = results.filter(i => i.success == true).map(i => i.answerTime).reduce((min, p) => p < min ? p : min);
    return Math.round((res * 100) / 100);
}

const max = (): number => {
    const res = results.filter(i => i.success == true).map(i => i.answerTime).reduce((max, p) => p > max ? p : max);
    return Math.round((res * 100) / 100);
}

const average = (): number => {
    const res = results.filter(i => i.success == true).map(i => i.answerTime).reduce((val, idx) => val += idx);
    return res / results.filter(i => i.success).length;
}

const allRejected = (count: number): number => {
    const res = results.filter(i => i.error == true).map(i => i).length;
    return res * 100 / count;
}

const allSuccess = (count: number): number => {
    const res = results.filter(i => i.success == true).map(i => i).length;
    return res * 100 / count;
}

const errorLog = (err: Error): void => {
    const eLog = chalk.red(err);
    console.log(eLog);
} 

const infoLog = (msg: string): void => {
    const iLog = chalk.blue(msg);
    console.log(iLog);
}

try {
    init(process.argv);
} catch (err) {
    errorLog(err.message);
}
