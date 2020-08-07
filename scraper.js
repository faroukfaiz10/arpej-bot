const $ = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");

const fetchUrl = async (url) => {
  const result = await axios.get(url);

  const name = $("div.top > h1", result.data)["0"].children[0].data;

  // Get new url for frame containing availability
  const newUrl = $("iframe", result.data)["1"].attribs.src;

  // The content of the page is dynamically generated
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(newUrl);
  await page.waitFor(1000);
  const content = await page.content();
  const isAvailable = $(".iFrame__firstLine-right-button", content).hasClass(
    "disabled"
  );
  await browser.close();
  //return [name, isAvailable];
  return { name: name, available: isAvailable };
};

module.exports = fetchUrl;
