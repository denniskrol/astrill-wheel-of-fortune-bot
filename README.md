# Astrill Wheel of Furtune bot
[Playwright](https://playwright.dev/) script that loads [Astrill wheel of fortune](https://www.astrill.com/wheel-of-fortune) page and clicks the 'spin' button every time it's possible

## Install
```bash
$ npm install
```
Linux only: Install dependencies
```bash
# apt install -y libnss3 libcups2 libatk1.0-0 libatspi2.0-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libatk-bridge2.0-0 libgtk-3-0 libgbm1 libxshmfence1 build-essential libx11-xcb1 libasound2
```

## Usage
```bash
$ node run.js
```

## Gettting WoF token
* Go to [Astrill wheel of fortune](https://www.astrill.com/wheel-of-fortune)
* View source
* Search for `var wofToken`. ex: `var wofToken = 'b4082c1629tc5e53bf1a160g5faf1184';`
* `b4082c1629tc5e53bf1a160g5faf1184` is your token

### Required Options
* woftoken: Token based on email address

### Optional Options
* sleep_time: Sleep time in seconds between tries. Default 60

### Example
```bash
$ node run.js --woftoken "b4082c1629tc5e53bf1a160g5faf1184"
```
