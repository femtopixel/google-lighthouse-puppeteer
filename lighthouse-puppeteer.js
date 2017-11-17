class LighthousePuppeteer {
    constructor() {
        this.DEBUG_PORT = 9222;
        this.puppeteer = require('puppeteer');
        this.lightHouseBatch = require('lighthouse-batch');
        this.defaultOptions = {
            debugPort: this.DEBUG_PORT,
            lighthouse: {
                out: '/home/chrome/reports',
                html: false,
                params: '',
                verbose: false
            },
            puppeteer: {
                args: []
            }
        };
        this.options = Object.assign({}, this.defaultOptions);
        this.browser = null;
    }

    definePuppeteerOptions(opts = []) {
        for (let name in opts) {
            if (opts[name].startsWith('--puppeteer-')) {
                const param = opts[name].replace('--puppeteer-', '');
                const nextParam = opts[name - -1];
                this.options.puppeteer[param] = nextParam && !nextParam.startsWith('--puppeteer-') ? nextParam : true;
            }
        }
        return this;
    }

    defineOptions(opts = {}) {
        if (opts.main.port) {
            this.options.debugPort = opts.main.port;
        }
        if (opts.lighthouse && opts.lighthouse.output_directory) {
            this.options.lighthouse.out = opts.lighthouse.output_directory;
        }
        if (opts.lighthouse && opts.lighthouse.html) {
            this.options.lighthouse.html = opts.lighthouse.html;
        }
        if (opts.lighthouse && opts.lighthouse.lighthouse_params) {
            this.options.lighthouse.params = opts.lighthouse.lighthouse_params;
        }
        if (!opts.main.verbose) {
            this.options.lighthouse.params += '--quiet';
        }
        if (opts.main.verbose && opts.main.verbose.length > 1) {
            this.options.lighthouse.verbose = true;
        }
        this.definePuppeteerOptions(opts._unknown || []);
        if (typeof (this.options.puppeteer.args) === 'undefined') {
            this.options.puppeteer.args = [];
        }
        this.options.puppeteer.args.push(`--remote-debugging-port=${this.options.debugPort}`);
        return this;
    }

    exec(modulePath, opts = {}) {
        return new Promise((resolveGlobal, reject) => {
            this.defineOptions(opts);
            const testcase = typeof (modulePath) === 'object' ? modulePath : require(modulePath);
            if (typeof(testcase.connect) !== 'function') {
                console.log(`${modulePath}: Module incorrectly formatted. Module should have "connect" method!`);
                process.exit(-3);
            }
            if (typeof(testcase.getUrls) !== 'function') {
                console.log(`${modulePath}: Module incorrectly formatted. Module should have "getUrls" method!`);
                process.exit(-4);
            }
            this.puppeteer.launch(this.options.puppeteer)
                .then(testcase.connect)
                .then(b => new Promise((resolve) => {
                    this.browser = b;
                    resolve(b);
                }))
                .then(b => new Promise((resolve) => {
                    const lighthouseOptions = {
                        verbose: this.options.lighthouse.verbose,
                        sites: testcase.getUrls(),
                        html: this.options.lighthouse.html,
                        out: this.options.lighthouse.out,
                        useGlobal: true,
                        params: `--port ${this.options.debugPort} ${this.options.lighthouse.params}`,
                    };
                    this.lightHouseBatch(lighthouseOptions);
                    resolve(b);
                }))
                .then(b => b.close())
                .then(b => resolveGlobal)
                .catch((err) => {
                    this.browser && this.browser.close();
                    reject(err);
                });
        });
    }
}

module.exports = new LighthousePuppeteer();
