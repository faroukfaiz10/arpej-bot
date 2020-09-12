const logCrous = require("./crous.js");
const logArpej = require("./arpej.js");
const logStudelites = require("./studelites.js");

logCrous().then(() => {
  logArpej().then(() => {
    logStudelites();
  });
});

setInterval(async () => {
  try {
    await logCrous();
    await logArpej();
    await logStudelites();
  } catch (err) {
    // console.error(err);
  }
}, 1000 * 60);
