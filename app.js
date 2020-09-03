const logCrous = require("./crous/scraper-crous.js");
const logArpej = require("./arpej.js");

logCrous();
logArpej();

setInterval(async () => {
  try {
    await logCrous();
    await logArpej();
  } catch (err) {
    // console.error(err);
  }
}, 1000 * 60);
