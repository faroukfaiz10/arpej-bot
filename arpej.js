const $ = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");
require("dotenv").config();

const urls = [
  "https://www.arpej.fr/en/residences/residence-millenium/",
  // "https://www.arpej.fr/residences/residence-millenium-2/",
  "https://www.arpej.fr/residences/residence-de-la-cerisaie/",
  "https://www.arpej.fr/residences/residence-victor-guerreau/",
  //"https://www.arpej.fr/residences/residence-campuseo/",
  //"https://www.arpej.fr/residences/residence-campuseo-2/",
  "https://www.arpej.fr/residences/residence-berthelot/",
  "https://www.arpej.fr/residences/residence-eugene-chevreul/",
  "https://www.arpej.fr/residences/residence-alexandre-manceau-partie-pour-etudiants/",
  "https://www.arpej.fr/residences/residence-alexandre-manceau-partie-pour-jeunes-actifs/",
];

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
    else console.log("--");
  } catch (err) {
    // console.error(err);
  }
}

module.exports = logData;
