const express = require("express");
const bodyParser = require("body-parser");
const fetchUrl = require("./scraper");
const app = express().use(bodyParser.json());
const request = require("request");
require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const urls = [
  "https://www.arpej.fr/en/residences/residence-millenium/",
  "https://www.arpej.fr/residences/residence-millenium-2/",
  "https://www.arpej.fr/residences/residence-victor-guerreau/",
  "https://www.arpej.fr/residences/residence-campuseo/",
  "https://www.arpej.fr/residences/residence-campuseo-2/",
  "https://www.arpej.fr/residences/residence-eugene-chevreul/",
];
/*
  "https://www.arpej.fr/residences/residence-edgar-faure/",
  "https://www.arpej.fr/residences/residence-alexandre-manceau-partie-pour-etudiants/",
  "https://www.arpej.fr/residences/residence-alexandre-manceau-partie-pour-jeunes-actifs/",
  "https://www.arpej.fr/residences/residence-porte-ditalie/",
];*/

app.listen(process.env.PORT || 1337, () => {
  console.log("webhook is listening");
  console.log(process.env.PORT || 1337);
});

async function getData(urls) {
  let promises = [];
  urls.forEach((url) => {
    promises.push(fetchUrl(url));
  });
  try {
    const data = await Promise.all(promises);
  } catch (e) {
    console.error(e);
  }
  return data;
}

async function formatData(data) {
  let text = "";
  data.forEach((residence) => {
    if (residence.available) console.log(" ** " + residence.name);
    text += residence.available ? residence.name + "\n" : "";
  });
  return text;
}

async function makeRequest(data) {
  if (data) {
    const response = { text: data };
    console.log(data);
    console.log(response);
    return (request_body = {
      recipient: {
        id: "3473663869365186",
      },
      message: response,
    });
  } else {
    return (request_body = {
      recipient: {
        id: "3473663869365186",
      },
      message: { text: "nothing to show" },
    });
  }
}

async function sendMessage() {
  try {
    const data = await formatData(await getData(urls));
  } catch (e) {
    console.error(e);
  }
  console.log(data);
  try {
    const request_body = await makeRequest(data);
  } catch (e) {
    console.error(e);
  }
  console.log(request_body);
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

setInterval(sendMessage, 1000 * 60);

app.post("/webhook", (req, res) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === "page") {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      sendMessage();
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "randomstring";

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
