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
const axios = require('axios');
const chalk = require('chalk');
const regex = /http:\/\/[\w\.]+:[0-9]+\/[\w-_]?/gm;
const init = (args) => {
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
};
const doGet = (url, count) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < count; i++) {
        const res = yield get(url);
        console.log(res.data);
    }
});
const doPost = (url, count, data) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < count; i++) {
        const res = yield post(url, data);
        console.log(res.data);
    }
});
const testUrl = (url) => {
    if (!url.match(regex))
        throw new Error('Url is not valid');
};
const get = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios.get(url);
    return res;
});
const post = (url, data) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios.post(url, data);
    return res;
});
const errorLog = (err) => {
    const eLog = chalk.red(err);
    console.log(eLog);
};
try {
    init(process.argv);
}
catch (err) {
    errorLog(err.message);
}
//# sourceMappingURL=app.js.map