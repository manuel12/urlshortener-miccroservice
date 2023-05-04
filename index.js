const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const urlObjects = [];
let id = 0;

app.get("/api/shorturl/:shorturl", (req, res) => {
  console.log(req.params);

  const shortUrl = req.params.shorturl;

  const existingUrlObj = urlObjects.find((urlObject) => {
    return urlObject.shortUrl == shortUrl;
  });

  if (existingUrlObj) {
    res.redirect(existingUrlObj.originalUrl);
  }
});

app.post("/api/shorturl", (req, res) => {
  let respObj = {};
  const submittedUrl = req.body.url;
  console.log(submittedUrl);

  // Check if URL is invalid
  if (!submittedUrl.includes("http")) {
    // If url is invalid return appropriate JSON
    res.json({ error: "invalid url" });
  } else {
    const existingUrlObj = urlObjects.find(
      (urlObject) => urlObject.originalUrl === submittedUrl
    );

    if (existingUrlObj) {
      console.log(`URL ${submittedUrl} already existed on ${existingUrlObj}`);
      respObj = {
        original_url: existingUrlObj.originalUrl,
        short_url: existingUrlObj.shortUrl,
      };
    } else {
      // urlObj doesn't exists
      console.log(`URL ${submittedUrl} NOT existing, adding to array!`);

      const urlObject = {
        originalUrl: submittedUrl,
        shortUrl: id++,
      };
      urlObjects.push(urlObject);
      respObj = {
        original_url: urlObject.originalUrl,
        short_url: urlObject.shortUrl,
      };
    }

    res.json(respObj);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
