const express = require("express");
const bodyParser = require("body-parser");
const fetchData = require("./scraper");
const app = express().use(bodyParser.json());
const { performance } = require("perf_hooks");
require("dotenv").config();

const urls = [
  "https://www.arpej.fr/en/residences/residence-millenium/",
  "https://www.arpej.fr/residences/residence-millenium-2/",
  "https://www.arpej.fr/residences/residence-de-la-cerisaie/",
  "https://www.arpej.fr/residences/residence-victor-guerreau/",
  "https://www.arpej.fr/residences/residence-campuseo/",
  "https://www.arpej.fr/residences/residence-berthelot/",
  "https://www.arpej.fr/residences/residence-campuseo-2/",
  "https://www.arpej.fr/residences/residence-eugene-chevreul/",
  "https://www.arpej.fr/residences/residence-alexandre-manceau-partie-pour-etudiants/",
  "https://www.arpej.fr/residences/residence-alexandre-manceau-partie-pour-jeunes-actifs/",
];

app.listen(process.env.PORT || 1337, () => {
  console.log(`Server listening on port ${process.env.PORT || 1337}`);
});

async function getData(urls) {
  let data = [];
  try {
    data = await fetchData(urls);
  } catch (err) {
    console.error(err);
  }
  return data;
}

async function formatData(data) {
  let text = "";
  data.forEach((residence) => {
    text += residence.available ? residence.name + "\n" : "";
  });
  return text;
}

async function logData() {
  try {
    const data = await formatData(await getData(urls));
    if (data) console.log(data);
  } catch (err) {
    console.error(err);
  }
}

logData();

setInterval(async () => {
  try {
    await logData();
  } catch (err) {
    console.error(err);
  }
}, 1000 * 60);

//35s
