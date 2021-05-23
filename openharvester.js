const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require('fs').promises;
const openCaptcha = require('./Captcha/load')
async function open(name,proxy){
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    let proxyParams = proxy.split(':')
    let proxyString = proxyParams[0]+':'+proxyParams[1]
    let proxyArg = '--proxy-server=http://'+proxyString
    let nick = false;
    console.log(proxyArg)
    puppeteer.use(StealthPlugin())
    const width = 350
    const height = 550

    const browser = puppeteer.launch({
        executablePath: "./node_modules/puppeteer/.local-chromium/win64-869685/chrome-win/chrome.exe",
        excludeSwitches: [
            'enable-automation'
        ],
	    args: [
            '--no-sandbox',
            '--window-size=200,700',
            proxyArg,
            '--single-process',
            '--no-zygote'
        ],
        headless: false,
        defaultViewport: {
            width,
            height
        }
    }).then(async browser =>{
        const cookiesString = await fs.readFile('./SessionStorage/' + name + '.json');
        const cookies = JSON.parse(cookiesString);
        const page = await browser.newPage();
    
        await page.authenticate({
            username: String(proxyParams[2]),
            password: String(proxyParams[3])
        });
        await page.setCookie(...cookies);
        await page.setRequestInterception(true);
        page.on('request', async (req) => {
            if ( req.resourceType () === 'fetch' || req.resourceType () === 'image' || req.resourceType () === 'media' || req.resourceType () === 'font'  || req.resourceType () === 'stylesheet') {
                req.abort ()
            } else {
                req.continue ()
            }
        });
        await openCaptcha(page)
        //console.log(await page.content())
        
    })
}
module.exports = open;

open('hi','92.50.6.132:7587:C1jcGd1xqe:MFBpu5ovZl')
	    