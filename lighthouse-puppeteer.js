const DEBUG_PORT = 9222;
const puppeteer = require('puppeteer');
const lightHouse = require('lighthouse-batch');
const defaultOptions = {
    debugPort:DEBUG_PORT,
    lighthouse: {
        params:'',
        useGlobal:true,
        out:'/home/chrome/reports',
        html:true,
        verbose:false,
    }
};
var browser;

module.exports = (modulePath, opts={}) => {
    const options = Object.assign({}, defaultOptions, opts);
    const testcase = typeof (modulePath) === 'object' ? modulePath : require(modulePath);
    if (typeof(testcase.connect) !== 'function') {

        console.log(`${modulePath}: Module incorrectly formatted. Module should have "connect" method!`);
        process.exit(-3);
    }
    if (typeof(testcase.getUrls) !== 'function') {
        console.log(`${modulePath}: Module incorrectly formatted. Module should have "getUrls" method!`);
        process.exit(-4);
    }
    puppeteer.launch({args: [`--remote-debugging-port=${options.debugPort}`]})
        .then(testcase.connect)
        .then(b => new Promise((resolve, reject) => {
            browser = b;
            resolve(b);
        }))
        .then(b => new Promise((resolve, reject) => {
            const options = {
                verbose: options.lighthouse.verbose,
                sites: testcase.getUrls(),
                html: options.lighthouse.html,
                out: options.lighthouse.out,
                useGlobal: options.lighthouse.useGlobal,
                params: `--port ${debugPort} ${options.lighthouse.params}`,
            };
            lightHouse(options);
            resolve(b);
        }))
        .then(b => b.close())
        .catch(() => browser.close());
};
