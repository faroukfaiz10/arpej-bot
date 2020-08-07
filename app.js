const express = require("express");
const fetchURL = require("./scraper");
const app = express();
const port = 3000;

const url = "https://www.arpej.fr/en/residences/residence-millenium/";

app.get("/", async (req, res) => {
  const text = await fetchURL(url);
  res.send(text);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
