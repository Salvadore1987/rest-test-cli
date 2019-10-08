"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
const chalk = require('chalk');
const regex = /http:\/\/[\w\.]+:[0-9]+\/[\w-_]?/gm;
const results = new Array();
const init = (args) => {
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
};
const doGet = (url, count) => __awaiter(void 0, void 0, void 0, function* () {
    const begin = Date.now();
    for (let i = 0; i < count; i++) {
        let result;
        try {
            let begin = Date.now();
            const res = yield _get(url);
            let end = Date.now();
            result = { error: false, success: true, answerTime: end - begin };
            infoLog(res.data);
        }
        catch (err) {
            result = { error: true, success: false, answerTime: 0 };
            errorLog(err.message);
        }
        results.push(result);
    }
    const end = Date.now();
    _printReport(count, _totalReqTime(begin, end));
});
const doPost = (url, count, data) => __awaiter(void 0, void 0, void 0, function* () {
    const begin = Date.now();
    for (let i = 0; i < count; i++) {
        let result;
        try {
            let begin = Date.now();
            const res = yield _post(url, data);
            let end = Date.now();
            result = { error: false, success: true, answerTime: end - begin };
            infoLog(res.data);
        }
        catch (err) {
            result = { error: true, success: false, answerTime: 0 };
            errorLog(err.message);
        }
        results.push(result);
    }
    const end = Date.now();
    _printReport(count, _totalReqTime(begin, end));
});
const _totalReqTime = (begin, end) => {
    return Math.round(((end - begin) * 100) / 100);
};
const _printReport = (count, totalReqTime) => {
    const res = _calculate(count, totalReqTime);
    const total = chalk.green('Total requests: ' + res.total);
    const success = chalk.yellow('Success requests: ' + res.success + '%');
    const rejected = chalk.red('Rejected requests: ' + res.rejected + '%');
    const time = Math.round(res.averageTime * 100) / 100;
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
};
const _testUrl = (url) => {
    if (!url.match(regex))
        throw new Error('Url is not valid');
};
const _get = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios.get(url);
    return res;
});
const _post = (url, data) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios.post(url, data);
    return res;
});
const _calculate = (count, totalReqTime) => {
    const report = {
        total: count,
        rejected: _allRejected(count),
        success: _allSuccess(count),
        averageTime: _average(),
        totalRequestTime: totalReqTime,
        minRequestTime: _min(),
        maxRequestTime: _max()
    };
    return report;
};
const _min = () => {
    const res = results.filter(i => i.success == true).map(i => i.answerTime).reduce((min, p) => p < min ? p : min, 0);
    return Math.round((res * 100) / 100);
};
const _max = () => {
    const res = results.filter(i => i.success == true).map(i => i.answerTime).reduce((max, p) => p > max ? p : max, 0);
    return Math.round((res * 100) / 100);
};
const _average = () => {
    const res = results.filter(i => i.success == true).map(i => i.answerTime).reduce((val, idx) => val += idx, 0);
    return (res != 0) ? res / results.filter(i => i.success).length : 0;
};
const _allRejected = (count) => {
    const res = results.filter(i => i.error == true).map(i => i).length;
    return res * 100 / count;
};
const _allSuccess = (count) => {
    const res = results.filter(i => i.success == true).map(i => i).length;
    return res * 100 / count;
};
const errorLog = (err) => {
    const eLog = chalk.red(err);
    console.log(eLog);
};
const infoLog = (msg) => {
    const iLog = chalk.blue(msg);
    console.log(iLog);
};
try {
    init(process.argv);
}
catch (err) {
    errorLog(err.message);
}
//# sourceMappingURL=app.js.map