import express from "express";

const app = express();
const port = 3020; // 8080 is a common default

// Middleware to parse JSON bodies
app.use(express.json());

app.get("*", (req, res) => {
  const host = req.headers.host;
  const subdomain = host.split(".")[0];
  try {
    res.status(200).send(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8" />
          <link id="teacher-favicon" rel="icon" href="" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1viewport-fit=cover"
          />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="Qashqool" />
          <title id="teacher-title">dev teacher</title>
          <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
          />
          <script defer="defer" src="https://eliteacademymedia.s3.us-east-1.amazonaws.com/eliteacademymedia/qashqool/main.a75b52b8.js"></script>
          <link href="https://eliteacademymedia.s3.us-east-1.amazonaws.com/eliteacademymedia/qashqool/main.0c91bfa9.css" rel="stylesheet" />
          <meta name="application-name" content="&nbsp;" />
          <meta name="msapplication-TileColor" content="#FFFFFF" />
          <meta name="msapplication-TileImage" content="mstile-144x144.png" />
          
          <!-- PWA manifest -->
          <link rel="manifest" href="https://firebasestorage.googleapis.com/v0/b/eliteacademyeg-a7552.appspot.com/o/manifests%2F${subdomain}.json?alt=media" />
          
          <!-- iOS Specific PWA Meta Tags -->
          <meta name="apple-mobile-web-app-capable" content="yes">
          <meta name="apple-mobile-web-app-status-bar-style" content="default">
          <meta name="apple-mobile-web-app-title" content="Qashqool">
          <link rel="apple-touch-icon" href="https://firebasestorage.googleapis.com/v0/b/eliteacademyeg-a7552.appspot.com/o/manifests%2Fdev-beta.png?alt=media">
          <link
            rel="apple-touch-icon-precomposed"
            sizes="144x144"
            href="https://firebasestorage.googleapis.com/v0/b/eliteacademyeg-a7552.appspot.com/o/manifests%2Fdev-beta.png?alt=media"
          />
          <link rel="apple-touch-startup-image" href="https://firebasestorage.googleapis.com/v0/b/eliteacademyeg-a7552.appspot.com/o/manifests%2Fdev-beta.png?alt=media">
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
          <script src="https://www.youtube.com/iframe_api"></script>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Qashqool server listening on port ${port}`);
});
