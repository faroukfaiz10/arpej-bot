const $ = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");

const fetchData = async (urls) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let result = [];
  for (url of urls) {
    const content = await axios.get(url);
    const name = $("div.top > h1", content.data)["0"].children[0].data;
    const newUrl = $("iframe", content.data)["1"].attribs.src;
    await page.goto(newUrl, { waitUntil: "networkidle0" });
    const isAvailable = !(await page.evaluate(() => {
      return document
        .querySelector(".iFrame__firstLine-right-button")
        ._prevClass.includes("disabled");
    }));
    result.push({ name: name, available: isAvailable });
  }
  await browser.close();
  return result;
};

module.exports = fetchData;
