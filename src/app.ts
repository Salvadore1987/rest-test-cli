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
        _testUrl(url);
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
            const res = await _get(url);
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
    _printReport(count, _totalReqTime(begin, end));
    
}

const doPost = async (url: string, count: number, data?: any): Promise<void> => {
    const begin = Date.now();
    for (let i = 0; i < count; i++) {
        let result: IResult;
        try {
            let begin = Date.now();
            const res = await _post(url, data);
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
    _printReport(count, _totalReqTime(begin, end));
}

const _totalReqTime = (begin: number, end: number): number => {
    return Math.round(((end - begin) * 100) / 100);
}

const _printReport = (count: number, totalReqTime: number): void => {
    const res = _calculate(count, totalReqTime);
    const total = chalk.green('Total requests: ' + res.total);
    const success = chalk.yellow('Success requests: ' + res.success + '%');
    const rejected = chalk.red('Rejected requests: ' + res.rejected + '%');
    const time = Math.round(res.averageTime * 100) / 100
    const average = chalk.blue('Average requests time: ' + time + ' ms');
    const totalTime = chalk.blue('Total request time: ' + totalReqTime + ' ms');
    const minTime = chalk.green('Min request time: ' + res.minRequestTime + ' ms');
    const maxTime = chalk.red('Max request time: ' + res.maxRequestTime + ' ms');
    console.log(total);
    console.log(success);
    console.log(rejected);
    console.log(totalTime);
    console.log(average);    
    console.log(minTime);
    console.log(maxTime);
}

const _testUrl = (url: string): void => {
    if (!url.match(regex))
        throw new Error('Url is not valid');
}

const _get = async (url: string): Promise<any> => {
    const res = await axios.get(url);
    return res;
}

const _post = async (url:string, data: any): Promise<any> => {
    const res = await axios.post(url, data);
    return res;
}

const _calculate = (count: number, totalReqTime: number): IReport => {
    const report: IReport = {
        total: count, 
        rejected: _allRejected(count), 
        success: _allSuccess(count), 
        averageTime: _average(), 
        totalRequestTime: totalReqTime,
        minRequestTime: _min(),
        maxRequestTime: _max()
    };
    return report;
}

const _min = (): number => {
    const res = results.filter(i => i.success == true).map(i => i.answerTime).reduce((min, p) => p < min ? p : min, 0);
    return Math.round((res * 100) / 100);
}

const _max = (): number => {
    const res = results.filter(i => i.success == true).map(i => i.answerTime).reduce((max, p) => p > max ? p : max, 0);
    return Math.round((res * 100) / 100);
}

const _average = (): number => {
    const res = results.filter(i => i.success == true).map(i => i.answerTime).reduce((val, idx) => val += idx, 0);
    return (res != 0) ? res / results.filter(i => i.success).length : 0;
}

const _allRejected = (count: number): number => {
    const res = results.filter(i => i.error == true).map(i => i).length;
    return res * 100 / count;
}

const _allSuccess = (count: number): number => {
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
