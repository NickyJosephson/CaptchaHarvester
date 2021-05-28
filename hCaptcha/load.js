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
        if(String(response.url()).includes('checkcaptcha')){
            try{
                console.log('got recap response')
                let recap = await response.text()
                const recaptcharesponse = JSON.parse(recap)
                if(recaptcharesponse.pass == true){
                    console.log('GOT SUCCESFULL RECAP RESPONSE')
                    captchatoken = recaptcharesponse.generated_pass_UUID
                    solved = true;
                }
            }catch(error){
                console.log(error)
            }
        }
    })

    await page.goto('https://lessons.zennolab.com/captchas/hcaptcha/?level=easy')
    await page.waitForSelector('.h-captcha')
    console.log('hcaptcha loaded')
    await page.hover('.h-captcha')
    while(solved == false){
        await sleep(100)
      }
    console.log(captchatoken)
    console.log('succesfull solving')
    page.close()
    return captchatoken
    
}
module.exports = loadCaptcha