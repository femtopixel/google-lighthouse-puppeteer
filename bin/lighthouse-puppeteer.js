#! /usr/bin/env node

if (process.argv.length <= 2) {
    console.log(`Usage: ${__filename} testcase [options]`);
    process.exit(-1);
}

const fs = require('fs');
const modulePath = process.argv[2];
const opts = process.argv[3] || '{}';

if (!fs.existsSync(modulePath)) {
    console.log(`File must exists : ${modulePath}`);
    process.exit(-2);
}
const testcase = require(modulePath);
if (typeof(testcase.connect) !== 'function') {

    console.log(`${modulePath}: Module incorrectly formatted. Module should have "connect" method!`);
    process.exit(-3);
}
if (typeof(testcase.getUrls) !== 'function') {
    console.log(`${modulePath}: Module incorrectly formatted. Module should have "getUrls" method!`);
    process.exit(-4);
}

const lighthousePuppeteer = require('google-lighthouse-puppeteer');
lighthousePuppeteer(testcase, JSON.parse(opts));
