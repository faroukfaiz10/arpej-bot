const puppeteer = require("puppeteer");
const url =
  "https://trouverunlogement.lescrous.fr/tools/residual/bb452681-c0f2-11ea-8c39-005056941f86/search?bounds=1.7498_49.1991_3.0674_48.199&page=1&price=60000";

const fetchUrl = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  // await page.waitForSelector("h1");
  const result = await page.evaluate(() => {
    return document.querySelector("p.Pagination")
      ? document.querySelector("p.Pagination").innerHTML
      : "";
  });
  await browser.close();
  return result.length == 0;
};

const logData = async () => {
  try {
    let freeHousing = await fetchUrl(url);
    if (freeHousing) console.log("Crous disponible");
    else console.log("-");
  } catch (err) {
    // console.error(err);
  }
};

// logData();
// setInterval(async () => {
//   try {
//     await logData();
//   } catch (err) {
//     console.error(err);
//   }
// }, 1000 * 10);

module.exports = logData;
