const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const fs = require('fs').promises;
const openCaptcha = require('./hCaptcha/load')
async function open(name,proxy){
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    let proxyParams = proxy.split(':')
    let proxyString = proxyParams[0]+':'+proxyParams[1]
    let proxyArg = '--proxy-server=http://'+proxyString
    let nick = false;
    console.log(proxyArg)
    const width = 450
    const height = 550
    const browser = puppeteer.launch({
        //executablePath: "./node_modules/puppeteer/.local-chromium/win64-869685/chrome-win/chrome.exe",
        // excludeSwitches: [
        //     'enable-automation'
        // ],
	    args: [
            '--window-size=450,700',
            proxyArg,
            //'--single-process',
            //'--no-zygote',
            '--no-sandbox',
            '--disable-site-isolation-trials',
            '--no-first-run',
            '--disable-blink-features=AutomationControlled',
            '--disable-sync',
            '--no-default-browser-check',
        ],
        headless: false,
        ignoreDefaultFlags: true,
        // defaultViewport: {
        //     width,
        //     height
        // }
    }).then(async browser =>{
        const cookiesString = await fs.readFile('./SessionStorage/' + name + '.json');
        const cookies = JSON.parse(cookiesString);
        const page = await browser.newPage();
    
        await page.authenticate({
            username: String(proxyParams[2]),
            password: String(proxyParams[3])
        });
        await page.setCookie(...cookies);

        await openCaptcha(page)
    })
}
module.exports = open;
open('njosephson319','92.50.6.132:7587:C1jcGd1xqe:MFBpu5ovZl')
	    