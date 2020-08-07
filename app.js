const express = require("express");
const fetchUrl = require("./scraper");
const app = express();
const port = 3000;

const urls = [
  "https://www.arpej.fr/en/residences/residence-millenium/",
  "https://www.arpej.fr/residences/residence-jean-zay/",
];

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", async (req, res) => {
  let promises = [];
  urls.forEach((url) => {
    promises.push(fetchUrl(url));
  });
  let data = await Promise.all(promises);
  res.render("index", (residences = data));
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
