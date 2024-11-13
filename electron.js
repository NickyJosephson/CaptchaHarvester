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

    win.loadURL('https://google.com')
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
    // Load cookies before loading the captcha URL
    const captchaToken = await solveCaptcha(
        win,
        'https://www.google.com/recaptcha/api2/demo', // The URL to load the captcha
        'RecapV2',                                    // The captcha type ('RecapV2', 'RecapV3', or 'hCaptcha')
        '6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-'
    );
    console.log(`Captcha Token: ${captchaToken}`);
    win.loadURL('https://google.com')

    // Load a URL or a local HTML file

}

// Run createWindow when the app is ready
app.whenReady().then(() => {
    createWindow
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// On macOS, re-create a window when the dock icon is clicked
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});