import pkg from "electron";
const { app, BrowserWindow, session, net } = pkg;

async function getCaptchaHtml(solverType, sitekey, url){
    switch (solverType) {
        case "RecapV2":
            return `
            <html>
                <head>
                    <title>Captcha Harvester</title>
                    <link rel="shortcut icon" href="https://www.gstatic.com/recaptcha/admin/favicon.ico" type="image/x-icon"/>
                </head>
                <body style="background-color: #303030;">
                    <form action="/submit" method="POST">
                        <div class="g-recaptcha form-field" data-sitekey="${sitekey}" data-callback="sub" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
                    </form>
                    <script src="https://www.google.com/recaptcha/api.js?hl=en"></script>
                </body>
            </html>`;
        case "RecapV3":
            return `
            <html>
                <head>
                    <title>Captcha Harvester</title>
                    <link rel="shortcut icon" href="https://www.gstatic.com/recaptcha/admin/favicon.ico" type="image/x-icon"/>
                </head>
                <body style="background-color: #303030;">
                    <script src="https://www.google.com/recaptcha/api.js?render=${sitekey}"></script>
                    <script>
                        grecaptcha.ready(function() {
                            grecaptcha.execute('${sitekey}');
                        });
                    </script>
                </body>
            </html>`;
        case "hCaptcha":
            return `
            <html>
                <head>
                    <title>hCaptcha</title>
                    <meta charset="utf-8" />
                    <script src="https://hcaptcha.com/1/api.js" async defer></script>
                </head>
                <body>
                    <div class="h-captcha" data-sitekey="${sitekey}" data-callback="solvedCallback"></div>
                </body>
            </html>`;
        case 'cloudflare':
            return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cloudflare Turnstile Demo</title>

                <!-- Cloudflare Turnstile API -->
                <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?" defer="" async=""></script>
            </head>
            <body>
                <div id="parent">
                    <div class="turnstile_container">
                        <div class="turnstile">
                            <!-- CAPTCHA container with dynamic sitekey -->
                            <div id="cf-turnstile" class="cf-turnstile" data-sitekey="${sitekey}"></div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `
        default:
            throw new Error("Unsupported captcha type");
    }
}

export default async function solveCaptcha(captchaWindow, url, solverType = "RecapV2", sitekey = "your-sitekey-here") {
   
    let htmlBody = await getCaptchaHtml(solverType, sitekey, url);
    const ses = captchaWindow.webContents.session;

    //setup intercept promise
    const setupIntercept = new Promise((resolve) => {
        ses.protocol.interceptBufferProtocol("https", (req, callback) => {
            if (req.url === url) {
                callback(Buffer.from(htmlBody, "utf8"));
                ses.protocol.uninterceptProtocol("https");
                resolve("done");
            } else {
                const urlSwitch = req.url.replace("https", "http");
                req.url = urlSwitch;
                const request = net.request(req);
                request.on("response", (res) => {
                    const chunks = [];

                    res.on("data", (chunk) => {
                        chunks.push(Buffer.from(chunk));
                    });

                    res.on("end", async () => {
                        const file = Buffer.concat(chunks);
                        callback(file);
                    });
                });
                if (req.uploadData) {
                    req.uploadData.forEach((part) => {
                        if (part.bytes) {
                            request.write(part.bytes);
                        } else if (part.file) {
                            request.write(fs.readFileSync(part.file));
                        }
                    });
                }
                request.end();
            }
        });
    });

    await captchaWindow.loadURL(url);
    await setupIntercept;
    //setup actual token catching promise - 
    const catchCaptchaToken = new Promise((resolve) => {
        ses.protocol.interceptBufferProtocol("https", (req, callback) => {
            console.log('checking')
            const urlSwitch = req.url.replace("https", "http");
            req.url = urlSwitch;
            const request = net.request(req);
            request.on("response", (res) => {
                const chunks = [];
                res.on("data", (chunk) => {
                    chunks.push(Buffer.from(chunk));
                });
                res.on("end", async () => {
                    const file = Buffer.concat(chunks);
                    switch (solverType) {
                        case "RecapV2":
                            if (req.url.includes("userverify")) {
                                const responseArray = JSON.parse(String.fromCharCode(...file).split("]}'")[1]);
                                if (responseArray.length > 7) {
                                    callback(file);
                                    ses.protocol.uninterceptProtocol("https");
                                    resolve(responseArray[1]);
                                } else {
                                    callback(file);
                                }
                            } else {
                                callback(file);
                            }
                            break;
                        case "RecapV3":
                            if (req.url.includes("reload?k")) {
                                const responseArray = JSON.parse(String.fromCharCode(...file).split("]}'")[1]);
                                if (responseArray.length > 7) {
                                    callback(file);
                                    ses.protocol.uninterceptProtocol("https");
                                    resolve(responseArray[1]);
                                } else {
                                    callback(file);
                                }
                            } else {
                                callback(file);
                            }
                            break;
                        case "hCaptcha":
                            if (req.url.includes("hcaptcha.com/checkcaptcha")) {
                                callback(file);
                                const response = JSON.parse(String.fromCharCode(...file));
                                if(response.pass == true){
                                    ses.protocol.uninterceptProtocol("https");
                                    resolve(response);
                                } else {
                                    console.log("hCaptcha not passed, retrying...");
                                }
                            } else {
                                callback(file);
                            }
                            break;
                        default:
                            callback(file);
                            break;
                    }
                });
            });
            if (req.uploadData) {
                req.uploadData.forEach((part) => {
                    if (part.bytes) {
                        request.write(part.bytes);
                    } else if (part.file) {
                        request.write(fs.readFileSync(part.file));
                    }
                });
            }
            request.end();
        });
    });
    return await catchCaptchaToken;
}