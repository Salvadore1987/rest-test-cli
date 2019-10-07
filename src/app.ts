const axios = require('axios');
const chalk = require('chalk');

const regex = /http:\/\/[\w\.]+:[0-9]+\/[\w-_]?/gm;

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
    for (let i = 0; i < count; i++) {
        const res = await get(url);
        console.log(res.data);
    }
}

const doPost = async (url: string, count: number, data?: any): Promise<void> => {
    for (let i = 0; i < count; i++) {
        const res = await post(url, data);
        console.log(res.data);
    }
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

const errorLog = (err: Error): void => {
    const eLog = chalk.red(err);
    console.log(eLog);
} 

try {
    init(process.argv);
} catch (err) {
    errorLog(err.message);
}
