# CAPTCHA Harvester


A robust and efficient tool for collecting and solving CAPTCHA challenges in web applications. This harvester is designed to assist developers in bypassing CAPTCHA challenges ethically and legally by integrating with third-party services or self-solving mechanisms.


## Table of Contents
1. [Usage](#usage)
2. [Parameters](#parameters)
3. [Examples](#examples)


## Usage
1. ```bash
    nmp start

## Parameters

When using the CAPTCHA harvester, you need to define the following parameters to ensure proper functionality. Here's an explanation of each:

1. **URL** (`url`):
   - The URL where the CAPTCHA is hosted.
   - Example: `'https://2captcha.com/demo/cloudflare-turnstile'`
   - **Purpose:** Specifies the page or endpoint the harvester should interact with to load and solve the CAPTCHA.

2. **Captcha Type** (`captcha_type`):
   - The type of CAPTCHA you want to solve. Supported types include:
     - `'RecapV2'`: Google reCAPTCHA v2.
     - `'RecapV3'`: Google reCAPTCHA v3.
     - `'hCaptcha'`: hCaptcha.
     - `'cloudflare'`: Cloudflare Turnstile CAPTCHA.
   - Example: `'cloudflare'`
   - **Purpose:** Ensures the harvester uses the correct solving method based on the CAPTCHA type.

3. **Site Key** (`site_key`):
   - The site key required to solve the CAPTCHA. This key is typically visible in the webpage's HTML source.
   - Example: `'0x4AAAAAAAVrOwQWPlm3Bnr5'`
   - **Purpose:** Identifies the CAPTCHA to the solving service.
4. **Session**
    -Ensure to define the filepath for the saved google session cookies you want to use in the load cookies function.
---
