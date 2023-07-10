import express from "express";
import cors from "cors";
import snapsave from "snapsave-downloader";
import * as Pinterest from "@myno_21/pinterest-scraper";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    allowedHeaders: "*",
  })
);

app.get("/instagram", async (req, res) => {
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
app.get("/twitter", async (req, res) => {
  res.send("Under Development");
});

app.get("/facebook", async (req, res) => {
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

app.get("/pinterest", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    res.status(400).send("Url is required");
  }

  // Regular expression pattern to match the post ID
  try {
    const postIdPattern = /\/pin\/(\d+)\//;

    // Extract the post ID from the URL
    const matches = url.match(postIdPattern);
    const postId = matches ? matches[1] : null;
    const response = await Pinterest.getVideo(postId);
    res.send(response);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT);

export default app;
