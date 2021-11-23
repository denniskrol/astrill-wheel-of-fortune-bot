process.env.TZ = 'Asia/Hong_Kong'

const HttpsProxyAgent = require('https-proxy-agent'); // axios proxy support is broken https://github.com/axios/axios/issues/2072
const HttpProxyAgent = require('http-proxy-agent');
const playwright = require('playwright');
const yargs = require('yargs');

console.logCopy = console.log.bind(console);
console.log = function()  {
    // Timestamp to prepend
    var date = new Date();
    var dateTime = date.toLocaleTimeString('eu', {timeZone: 'Asia/Shanghai', hour12: false});

    if (arguments.length) {
        // True array copy so we can call .splice()
        var args = Array.prototype.slice.call(arguments, 0);

        // If there is a format string then... it must
        // be a string
        if (typeof arguments[0] === 'string') {
            // Prepend timestamp to the (possibly format) string
            args[0] = '[%o] ' + arguments[0];

            // Insert the timestamp where it has to be
            args.splice(1, 0, dateTime);

            // Log the whole array
            this.logCopy.apply(this, args);
        }
        else {
            // "Normal" log
            this.logCopy(dateTime, args);
        }
    }
};

console.log('Astrill Wheel of Fortune bot 0.1');

const argv = yargs
    .option('woftoken', {
        type: 'string',
        demandOption: true,
        requiresArg: true,
        description: 'WoF token',
    })
    .option('sleep_time', {
        type: 'integer',
        demandOption: false,
        default: 60,
        requiresArg: true,
        description: 'Sleep time in seconds between tries',
    })
    .help()
    .alias('help', 'h')
    .argv;

const device = {
    'viewport': {
        'width': 1920,
        'height': 900
    },
    'isMobile': false,
    'hasTouch': false,
    'ignoreHTTPSErrors': true
};

const browserOptions = {
    headless: false,
    proxy: {
        server: 'http://127.0.0.1:7890'
    }
};

const url = 'https://www.astrill.com/wheel-of-fortune/' + argv.woftoken;


(async () => {
    const browser = await playwright['chromium'].launch(browserOptions);
    const context = await browser.newContext({...device});
    let page = await context.newPage();

    try {
        await page.goto(url, {timeout: 30000});
        console.log('Loaded page');

    }
    catch (error) {
        console.log('Failed to get load page. ' + error);
    }

    while (true) {
        const spinButton = page.locator('#spin_the_wheel');
        const spinButtonCount = await spinButton.count();
        if (!spinButtonCount) {
            console.log('Cant find spin button');
        }

        let spinButtonInnerText;
        try {
            spinButtonInnerText = await spinButton.innerText();
            console.log('Spin button text: ' + spinButtonInnerText);
        }
        catch (error) {
            console.log('Failed to get innertext of button. ' + error);
        }

        if (spinButtonInnerText == 'Spin the wheel!') {
            try {
                await spinButton.click();
                console.log('Clicked button, waiting 60 seconds...');

                await page.waitForTimeout(60000);

                try {
                    console.log('Reloading page...');
                    await page.goto(url, {timeout: 30000});
                }
                catch (error) {
                    console.log('Failed to get load page. ' + error);
                }
            }
            catch (error) {
                console.log('Failed to get click button. ' + error);
            }
        }
        else {
            console.log('Cant spin, waiting ' + argv.sleep_time + ' seconds...');
        }

        await page.waitForTimeout((argv.sleep_time * 1000));
    }
})();



