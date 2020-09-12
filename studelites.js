const $ = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");

const urls = [
  "https://www.studelites.com/en/paris/residence-etudiante-garibaldi-b-issy-moulineaux.html",
  "https://www.studelites.com/en/paris/residence-etudiante-tocqueville-sceaux.html",
];

const unavailabilityMessage =
  "Les disponibilités ne sont pas encore ouvertes pour la période demandée. Nous vous conseillons de consulter à nouveau cette page ultérieurement";

const fetchData = async (urls) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let result = [];
  for (url of urls) {
    let content = await axios.get(url);
    const name = $("div.info > h1 > span", content.data)["0"].children[0].data;
    const scriptContent = await $("#adeleiFrame", content.data)["0"].children[3]
      .children[0].data; // Script generating Iframe
    const newUrl = scriptContent
      .split("\n")
      [scriptContent.split("\n").length - 4].split("'")[3];

    await page.goto(newUrl, { waitUntil: "networkidle0" });
    const message = await page.evaluate(() => {
      return document.querySelector("p").innerText;
    });
    result.push({ name, available: message != unavailabilityMessage });
  }
  await browser.close();
  return result;
};

async function formatData(data) {
  let text = "";
  data.forEach((residence) => {
    text += residence.available ? residence.name + "\n" : "";
  });
  return text;
}

async function logData() {
  try {
    const data = await formatData(await fetchData(urls));
    if (data) console.log(data);
    else console.log("---");
  } catch (err) {
    // console.error(err);
  }
}

module.exports = logData;
