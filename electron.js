import pkg from 'electron';
const { app, BrowserWindow } = pkg;
import solveCaptcha from './electronCaptcha.js';
import fs from "fs/promises";  // Importing from fs/promises for async/await

async function createWindow() {
    // Create the browser window with specified dimensions
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            contextIsolation: true,
        },
    });
    async function loadCookes(){
        try {
            const cookiesString = await fs.readFile('./SessionStorage/njosephson319.json', 'utf-8');
            const cookies = JSON.parse(cookiesString);
            for (const cookie of cookies) {
                await win.webContents.session.cookies.set(...cookie, 'https://google.com');
            }
            console.log("Cookies loaded successfully.");
        } catch (error) {
            console.error("Error loading cookies:", error);
        }
    }
    await loadCookes();
    return win;
}

async function demoSolve(win){
    //v3 demo
    // const captchaToken = await solveCaptcha(
    //     win,
    //     'https://www.google.com/recaptcha/api2/demo', // The URL to load the captcha
    //     'RecapV2',                                    // The captcha type ('RecapV2', 'RecapV3', or 'hCaptcha')
    //     '6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-'
    // );
    // console.log(`Captcha Token: ${captchaToken}`);
    //hCaptcha demo
    const hcaptchaToken = await solveCaptcha(
        win,
        'https://accounts.hcaptcha.com/demo', // The URL to load the captcha
        'hCaptcha',                                    // The captcha type ('RecapV2', 'RecapV3', or 'hCaptcha')
        'a5f74b19-9e45-40e0-b45d-47ff91b7a6c2'
    );
    console.log(`hcaptcha Token: ${hcaptchaToken}`)
    //V3 Captcha Demo
    const v3Token = await solveCaptcha(
        win,
        'https://2captcha.com/demo/recaptcha-v3', // The URL to load the captcha
        'RecapV3',                                    // The captcha type ('RecapV2', 'RecapV3', or 'hCaptcha')
        '6LfB5_IbAAAAAMCtsjEHEHKqcB9iQocwwxTiihJu'
    );
    console.log(`Captcha Token: ${v3Token}`);
    win.loadURL('https://google.com')
}

// Run createWindow when the app is ready
app.whenReady().then(async () => {
    createWindow().then(win => {
        demoSolve(win);
    })
     //V2 Captcha Demo
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});