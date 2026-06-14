const puppeteer = require("puppeteer");

async function scrapeVITEvents() {
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();

    await page.goto(
        "https://events.vit.ac.in/Home/index",
        {
            waitUntil: "networkidle2"
        }
    );

    const content = await page.evaluate(() => {
        return document.body.innerText;
    });

    console.log(content);

    await browser.close();
}

scrapeVITEvents();