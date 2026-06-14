const puppeteer = require("puppeteer");
const fs = require("fs");

async function collectEvents() {
    console.log("Launching browser...");

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });

    const page = await browser.newPage();

    await page.goto(
        "https://events.vit.ac.in/Home/index",
        {
            waitUntil: "networkidle2"
        }
    );

    console.log(`
========================================
Please login manually.
Solve CAPTCHA if required.
Navigate to the Upcoming Events page.
========================================
`);

    await page.waitForFunction(
        () =>
            document.body.innerText.includes("Upcoming events"),
        {
            timeout: 0
        }
    );

    console.log("Login successful!");

    await page.waitForSelector("table");

    const events = await page.evaluate(() => {

        const table = document.querySelector("table");

        if (!table) {
            return [];
        }

        const rows = Array.from(
            table.querySelectorAll("tr")
        );

        return rows
            .map(row => {

                const cols = row.querySelectorAll("td");

                if (cols.length < 5) {
                    return null;
                }

                return {
                    eventType:
                        cols[0].innerText.trim(),

                    school:
                        cols[1].innerText.trim(),

                    title:
                        cols[2].innerText.trim(),

                    startDate:
                        cols[3].innerText.trim(),

                    endDate:
                        cols[4].innerText.trim(),

                    details:
                        cols[5]
                            ? cols[5].innerText.trim()
                            : ""
                };
            })
            .filter(event =>
                event &&
                event.title &&
                event.title !== "Event Title"
            );
    });

    fs.writeFileSync(
        "events.json",
        JSON.stringify(events, null, 2)
    );

    console.log(`
========================================
Collected ${events.length} events
Saved to events.json
========================================
`);

    console.log("\nFirst 3 Events:\n");

    console.log(events.slice(0, 3));

    console.log(`
========================================
Browser kept open for debugging.
Press Ctrl+C in terminal to stop.
========================================
`);

    // Browser intentionally left open
}

collectEvents().catch(error => {
    console.error("ERROR:", error);
});