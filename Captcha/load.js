const puppeteer = require('puppeteer');
async function loadCaptcha(page){
    var start = new Date()

      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    let solved = false;
    var captchatoken;
    await page.setRequestInterception(true)
    page.on('request', async (req) => {
      if ( req.resourceType () === 'fetch' || req.resourceType () === 'media' || req.resourceType () === 'font'  || req.resourceType() === 'text/javascript' || req.resourceType() === 'png' ){
          req.abort ()
      } else {
          req.continue ()
      }
    });
    page.on('request', async interceptedRequest => {
        //console.log('>>', interceptedRequest.method(), interceptedRequest.url())
        interceptedRequest.continue().catch(e => {})
    })
    page.on('response', async(response) =>{
        if(String(response.url()).includes('userverify')){
            console.log('got recap response')
            const recaptcharesponse = String(await response.text())
            captchatoken = ((recaptcharesponse.split(',')[1]).replace('"','')).replace('"','')
            if(captchatoken.length < 600){
                console.log('GOT SUCCESFULL RECAP RESPONSE')
                solved = true;
            }
        }
    })
    await page.setViewport({
      width: 315,
      height: 80,
    });
    await page.goto('https://lessons.zennolab.com/captchas/recaptcha/v2_simple.php?level=high')
    await page.waitForSelector('iframe[title="reCAPTCHA"]');
    console.log('captcha loaded')
    await page.click('iframe[title="reCAPTCHA"]')
    await page.click('iframe[title="reCAPTCHA"]')

    await page
        .waitForSelector('iframe[title="recaptcha challenge"]',{visible: true})
        .then(async() =>{
            console.log('full window loaded')
            await page.setViewport({
                width: 305,
                height: 500,
              });
            await page.hover('iframe[title="recaptcha challenge"]')
        })
    var end = new Date() - start
    console.log(end + 'ms')
    while(solved == false){
      await sleep(100)
    }
    console.log(captchatoken)
    console.log('succesfull solving')
    page.close()
    return captchatoken
}
module.exports = loadCaptcha