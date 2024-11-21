import fs from "fs/promises";  // Importing from fs/promises for async/await
import pkg from 'electron';
const { app, BrowserWindow } = pkg;

async function generateSession(win) {
    // Load the Google login page
    await win.loadURL('https://accounts.google.com/signin');

    return new Promise((resolve, reject) => {
        const session = win.webContents.session;
        const maxWaitTime = 5 * 60 * 1000; // 5 minutes
        const startTime = Date.now();

        const intervalId = setInterval(async () => {
            try {
                const cookies = await session.cookies.get({ domain: '.google.com' });
                const isLoggedIn = cookies.some(cookie =>
                    ['SID', 'HSID', 'SSID', 'APISID', 'SAPISID'].includes(cookie.name)
                );

                if (isLoggedIn) {
                    clearInterval(intervalId);

                    // Save cookies to a JSON file
                    await fs.writeFile('./SessionStorage/njosephson319.json', JSON.stringify(cookies), 'utf-8');
                    console.log('Cookies saved successfully.');
                    resolve();
                } else if (Date.now() - startTime > maxWaitTime) {
                    // Timeout
                    console.error('Login timed out.');
                    clearInterval(intervalId);
                    reject(new Error('Login timed out.'));
                }
            } catch (error) {
                console.error('Error checking cookies:', error);
                clearInterval(intervalId);
                reject(error);
            }
        }, 2000);

        win.on('closed', () => {
            console.error('Window was closed before login completed.');
            clearInterval(intervalId);
            reject(new Error('Window was closed before login completed.'));
        });
    });
}