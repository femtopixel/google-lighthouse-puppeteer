#! /usr/bin/env node
const clu = require('command-line-usage');
const cla = require('command-line-args');
const optionDefinitions = [
    {
        name: 'file',
        alias: 'f',
        typeLabel: '{underline FILE}',
        description: 'Path to your testcase {underline REQUIRED} (default option)' +
            '\n({italic example}: /home/chrome/testcases/mytestcase.js)',
        defaultOption: true,
        group: 'main',
    },
    {
        name: 'port',
        alias: 'p',
        typeLabel: '{underline PORT}',
        description: 'Chrome headless debug port ({italic default}: 9222)',
        defaultValue: 9222,
        type: Number,
        group: 'main',
    },
    {
        name: 'output_directory',
        alias: 'd',
        typeLabel: '{underline FOLDER}',
        description: 'Path to output reports' +
            '\n({italic default}: /home/chrome/reports)',
        defaultValue: '/home/chrome/reports',
        group: 'lighthouse'
    },
    {
        name: 'html',
        alias: 'w',
        description: 'Renders HTML reports alongside JSON reports',
        type: Boolean,
        group: 'lighthouse'
    },
    {
        name: 'lighthouse_params',
        alias: 'l',
        description: 'Optional parameters to pass to lighthouse' +
            '\n(https://github.com/GoogleChrome/lighthouse/#cli-options)' +
            '\n({italic example}: "--quiet --perf")',
        group: 'lighthouse'
    },
    {
        name: 'chromium_params',
        alias: 'c',
        description: 'Optional parameters to pass to chrome/chromium browser' +
            '\n(https://peter.sh/experiments/chromium-command-line-switches/)' +
            '\n({italic example}: "--no-sandbox --disable-setuid-sandbox --ssl-version-max=tls1.1")',
        group: 'main'
    },
    {
        name: 'verbose',
        alias: 'v',
        description: 'Providing this option once will show more info from Lighthouse. Providing it twice will additionally provide info from `lighthouse-batch`.',
        type: Boolean,
        multiple: true,
        group: 'main',
    },
    {
        name: 'help',
        alias: 'h',
        description: 'Print this usage guide.',
        type: Boolean,
        group: 'main',
    }
];
const definition = [
    {
        header: "Options",
        optionList: optionDefinitions,
        group: 'main',
    },
    {
        header: "Lighthouse",
        optionList: optionDefinitions,
        group: 'lighthouse',
    },
    {
        header: "Puppeteer",
        content: 'You can add your options for puppeteer by prefixing them with {bold --puppeteer-}' +
            '\n(https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)' +
            '\n\n{italic example}: "--puppeteer-ignoreHTTPSErrors --puppeteer-slowMo"'
    }
];
const usage = clu(definition);
const options = cla(optionDefinitions, {partial: true});
if (options.main.help || typeof (options.main.file) === 'undefined' || !options.main.file.length) {
    console.log(usage);
    process.exit(-1);
}
const lighthousePuppeteer = require('../lighthouse-puppeteer');
lighthousePuppeteer.exec(options.main.file, options).catch((error) => console.error(error));
