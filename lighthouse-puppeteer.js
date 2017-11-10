if (process.argv.length <= 2) {
    console.log(`Usage: ${__filename} testcase`);
    process.exit(-1);
}

const fs = require('fs');
const modulePath = `./testcases/${process.argv[2]}.js`;

if (!fs.existsSync(modulePath)) {
    console.log(`File must exists : ${modulePath}`);
    process.exit(-2);
}

const DEBUG_PORT = 9222;
const puppeteer = require('puppeteer');
const lightHouse = require('lighthouse-batch');
const testcase = require(modulePath);

if (typeof(testcase.connect) !== 'function') {
    console.log(`${modulePath}: Module incorrectly formatted. Module should have "connect" method!`);
    process.exit(-3);
}
if (typeof(testcase.getUrls) !== 'function') {
    console.log(`${modulePath}: Module incorrectly formatted. Module should have "getUrls" method!`);
    process.exit(-4);
}

var browser;

puppeteer.launch({args: [`--remote-debugging-port=${DEBUG_PORT}`]})
    .then(testcase.connect)
    .then(b => new Promise((resolve, reject) => {
        browser = b;
        resolve(b);
    }))
    .then(b => new Promise((resolve, reject) => {
        const options = {
            verbose: false,
            sites: testcase.getUrls(),
            html: true,
            out: '/home/chrome/reports',
            useGlobal: true,
            params: `--port ${DEBUG_PORT}`,
        };
        lightHouse(options);
        resolve(b);
    }))
    .then(b => b.close())
    .catch(() => browser.close());
