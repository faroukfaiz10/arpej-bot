const express = require("express");
const bodyParser = require("body-parser");
const app = express().use(bodyParser.json());
const request = require("request");
require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const urls = [
  "https://www.arpej.fr/en/residences/residence-millenium/",
  "https://www.arpej.fr/residences/residence-jean-zay/",
];

app.listen(process.env.PORT || 1337, () => {
  console.log("webhook is listening");
  console.log(process.env.PORT || 1337);
});

async function getData(urls) {
  let promises = [];
  urls.forEach((url) => {
    promises.push(fetchUrl(url));
  });
  return await Promise.all(promises);
}

async function formatData(data) {
  let text = "";
  data.forEach((residence) => {
    text += residence.name + ": " + residence.availability + " \n ";
  });
  return text;
}


function sendMessage() {
  const data = await getData(urls);
  const response = formatData(data);
  console.log(data);
  console.log(response);
  const request_body = {
    recipient: {
      id: "3473663869365186",
    },
    message: response,
  };

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
