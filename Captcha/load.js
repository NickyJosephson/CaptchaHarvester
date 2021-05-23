const puppeteer = require('puppeteer');

async function loadCaptcha(page){
    await page.setViewport({
        width: 400,
        height: 100,
      });
    // page.on('request', (request) => {
    //     console.log('>>', request.method(), request.url())
    //     request.continue()
    // })
    
    // page.on('response', (response) => {
    //     console.log('<<', response.status(), response.url())
    //     if(String(response.url()).includes('https://www.google.com/recaptcha/api2/userverify?')){
    //         console.log('captcha solved')
    //     }
    // })
    page.on('request', request => {
        request_client({
          uri: request.url(),
          resolveWithFullResponse: true,
        }).then(response => {
            console.log(request.url)
        })
    });
    await page.goto('https://lessons.zennolab.com/captchas/recaptcha/v2_simple.php?level=high')
    await page.waitForSelector('iframe[title="reCAPTCHA"]');
    console.log('captcha loaded')

    await page.click('iframe[title="reCAPTCHA"]')
    await page.click('iframe[title="reCAPTCHA"]')
    await page.setViewport({
        width: 334,
        height: 514,
      });
    await page
        .waitForSelector('iframe[title="recaptcha challenge"]')
        .then(async() =>{
            console.log('full window loaded')
            //await sleep(250)
            //await page.hover('iframe[title="recaptcha challenge"]')
        })
    await page.setRequestInterception(true)


}
module.exports = loadCaptcha