const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require('fs').promises;
//loadCaptcha = require('./Captcha/load')
async function login(name,proxy){
    async function checkLogin(url){
        if(url == 'https://youtube.com'){
            return false
        }else{
            return true
        }
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    let proxyParams = proxy.split(':')
    let proxyString = proxyParams[0]+':'+proxyParams[1]
    let proxyArg = '--proxy-server=http://'+proxyString
    let nick = false;
    console.log(proxyArg)
    puppeteer.use(StealthPlugin())
    const browser = puppeteer.launch({
        //executablePath: "./node_modules/puppeteer/.local-chromium/win64-869685/chrome-win/chrome.exe",
        excludeSwitches: [
            'enable-automation'
        ],
	    args: [
            '--no-sandbox',
            '--window-size=400,700',
            proxyArg
        ],
        headless: false
    }).then(async browser =>{
        //const cookiesString = await fs.readFile('./cookies.json');
        //const cookies = JSON.parse(cookiesString);
        const page = await browser.newPage();
        await page.authenticate({
            username: String(proxyParams[2]),
            password: String(proxyParams[3])
        });
        //await page.setCookie(...cookies);
        await page.goto('https://youtube.com');
        await page.waitForSelector('input[type="email"]');
        console.log('email phase entered')
        await page.waitForSelector('input[type="password"]');
        console.log('password phase entered')
        while(String(page.url()).includes('accounts.google')){
            console.log('not logged in')
            await sleep(2500)
        }
        const cookies = await page.cookies();
        if(JSON.stringify(cookies).includes('LOGIN_INFO')){
            await fs.writeFile("./SessionStorage/" + name + ".json", JSON.stringify(cookies, null, 2));
        }else{
            console.log('error saving login information')
        }
        await browser.close()
        return(cookies)     
    })
}
module.exports = login;
	    