const express = require("express");
const cors = require("cors");
const snapsave = require("snapsave-downloader");
const Pinterest = import("@myno_21/pinterest-scraper");

const axios = require("axios");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    allowedHeaders: "*",
  })
);

router.get("/instagram", async (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== "string") {
    res.status(400).send("Please enter a valid url");
    return;
  }
  try {
    let URL = await snapsave(url);
    res.send(URL);
  } catch (e) {
    res.status(500).send("Unable to fetch video using this url");
    console.error(e);
  }
});
router.get("/twitter", async (req, res) => {
  res.send("Under Development");
});

router.get("/facebook", async (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== "string") {
    res.status(400).send("Please enter a valid url");
    return;
  }
  try {
    let URL = await snapsave(url);
    res.send(URL);
  } catch (e) {
    res.status(500).send("Unable to fetch video using this url");
    console.error(e);
  }
});
function extractPinIdFromString(str) {
  const pattern = /\/pin\/(\d+)/;
  const match = str.match(pattern);

  if (match && match[1]) {
    return match[1];
  } else {
    // Invalid string or no pin ID found
    return null;
  }
}
async function extractPinIdFromUrl(url) {
  const pattern = /\/pin\/([\w-]+)\/?|\.it\/([\w-]+)/;
  const match = url.match(pattern);
  if (url.includes("pin.it/")) {
    const data = await axios.get(url).then((res) => {
      return extractPinIdFromString(res.request._header);
    });
    return data;
  }
  if (match) {
    const pinId = match[1] || match[2];
    return pinId;
  } else {
    return null;
  }
}

router.get("/pinterest", async (req, res) => {
  const url = req.query.url ?? "";
  const postId = await extractPinIdFromUrl(url);

  if (!url || !postId) {
    res.status(400).send("Please send a valid URL");
    return;
  }

  try {
    const PinterestApi = await Pinterest;
    const response = await PinterestApi.getVideo(postId);
    res.send(response);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Internal Server Error", e });
  }
});
app.listen(PORT);

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
