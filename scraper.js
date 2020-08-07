const $ = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");

const fetchURL = async (url) => {
  const result = await axios.get(url);
  const newUrl = $("iframe", result.data)["1"].attribs.src;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(newUrl);
  await page.waitFor(1000);
  const content = await page.content();
  const isFree = $(".iFrame__firstLine-right-button", content).hasClass(
    "disabled"
  );
  //console.log(isFree);
  await browser.close();
  return isFree;
};

module.exports = fetchURL;
