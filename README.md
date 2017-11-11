Google Lighthouse Puppeteer - Docker Image
============================================

[![latest release](https://img.shields.io/github/release/femtopixel/docker-google-lighthouse-puppeteer.svg "latest release")](http://github.com/femtopixel/docker-google-lighthouse-puppeteer/releases)
[![Docker Pulls](https://img.shields.io/docker/pulls/femtopixel/google-lighthouse-puppeteer.svg)](https://hub.docker.com/r/femtopixel/google-lighthouse-puppeteer/)
[![Docker Stars](https://img.shields.io/docker/stars/femtopixel/google-lighthouse-puppeteer.svg)](https://hub.docker.com/r/femtopixel/google-lighthouse-puppeteer/)
[![Bitcoin donation](https://github.com/jaymoulin/jaymoulin.github.io/raw/master/btc.png "Bitcoin donation")](https://m.freewallet.org/id/374ad82e/btc)
[![Litecoin donation](https://github.com/jaymoulin/jaymoulin.github.io/raw/master/ltc.png "Litecoin donation")](https://m.freewallet.org/id/374ad82e/ltc)
[![PayPal donation](https://github.com/jaymoulin/jaymoulin.github.io/raw/master/ppl.png "PayPal donation")](https://www.paypal.me/jaymoulin)
[![Beerpay donation](https://beerpay.io/femtopixel/docker-google-lighthouse-puppeteer/badge.svg "Beerpay donation")](https://beerpay.io/femtopixel/docker-google-lighthouse-puppeteer)

* [Google Chrome Headless](https://developers.google.com/web/updates/2017/04/headless-chrome) is the Google Chrome browser that can be started without graphical interface to accomplish several tasks (PDF printing, performance, automation...)
* [Google Lighthouse](https://developers.google.com/web/tools/lighthouse/) analyzes web apps and web pages, collecting modern performance metrics and insights on developer best practices.
* [Google Puppeteer](https://github.com/GoogleChrome/puppeteer) is a tool to automate tasks on a Chrome (headless) browser.

Description
-----------

The purpose of this image is to produce performance report for several pages in connected mode and in an automated way to be integrated in a CI environment.

It uses [lighthouse-batch](https://github.com/mikestead/lighthouse-batch) to be able to automate export of multiple  

Usage
-----

```
docker run --rm --name perf -it -v /path/to/your/report/folder:/home/chrome/reports -v /path/to/your/testcases/folder:/home/chrome/testcases --cap-add SYS_ADMIN femtopixel/google-lighthouse-puppeteer <name_of_the_test>  
```

with `<name_of_the_test>` the name of the test in the `testcases` folder without `.js`

### Example

```
docker run --rm --name perf -it -v /path/to/your/report/folder:/home/chrome/reports -v /path/to/your/testcases/folder:/home/chrome/testcases --cap-add SYS_ADMIN femtopixel/google-lighthouse-puppeteer my_test  
```


Usage : Improved
----------------

Using the ever-awesome [Jessie Frazelle](https://twitter.com/jessfraz) SECCOMP profile for Chrome, we don't have to use the hammer that is SYS_ADMIN:

```
wget https://raw.githubusercontent.com/jfrazelle/dotfiles/master/etc/docker/seccomp/chrome.json -O ~/chrome.json
docker run --rm --name perf -it -v /path/to/your/report/folder:/home/chrome/reports -v /path/to/your/testcases/folder:/home/chrome/testcases --security-opt seccomp=$HOME/chrome.json femtopixel/google-lighthouse-puppeteer <name_of_the_test> 
```

API (NodeJS)
---

You should create a testcase file named `whateverYouWant.js`.

This file must `module.exports` an object which must contain two methods : `connect` and `getUrls`.

### connect

This method must return a `Promise` which resolves the browser (first argument received of the method connect).

The purpose of this method is to connect the user to the browser.

### getUrls

This method must return an array of string for the url to be tested. You can put url restricted by connection since the `connect` method will grant you access.

### implementation

```js
class whateverYouWant
{
    getUrls() {
        return [
           "https://myawsome.site/admin/heavypage",
           "https://myawsome.site/admin/lightpage",
       ];
    }

    connect(browser) {
        return new Promise(async (resolve, reject) => {
            const page = await browser.newPage();
            await page.goto('https://myawesome.site/admin/authentication', {waitUntil: 'load'});
            await page.type('#login', 'admin');
            await page.type('#password', 'admin');
            await page.$eval('#form input[type=submit]', x => x.click());
            await page.waitForNavigation({waitUntil: 'networkidle'});
            resolve(browser);
        });
    }
}

module.exports = new whateverYouWant();
``` 

FAQ
---

* Using `lighthouse` in authenticated mode : https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#testing-on-a-site-with-authentication
* Error while writing files
```
  Runtime error encountered: { Error: EACCES: permission denied, open '/home/chrome/reports/myawesome_site_admin_heavypage.report.json'
  errno: -13,
  code: 'EACCES',
  syscall: 'open',
  path: '/home/chrome/reports/myawesome_site_admin_heavypage.report.json' }
```
Make sure your folder has the write right for others (`chmod o+w`)
