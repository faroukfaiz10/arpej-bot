const puppeteer = require("puppeteer");
const url =
  "https://trouverunlogement.lescrous.fr/tools/residual/bb452681-c0f2-11ea-8c39-005056941f86/search?bounds=2.1681_48.8947_2.4454_48.6977&page=1&price=60000";

const fetchUrl = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const result = await page.evaluate(() => {
    return document.querySelector("p.Pagination-indicator")
      ? document.querySelector("p.Pagination-indicator").innerText.split(" ")[0]
      : "";
  });
  await browser.close();
  return result;
};

const logData = async () => {
  try {
    let availabilities = await fetchUrl(url);
    if (availabilities) console.log(`${availabilities} availabilities`);
    else console.log("-");
  } catch (err) {
    console.error(err);
  }
};

module.exports = logData;
