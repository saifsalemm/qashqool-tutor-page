import express from "express";

const app = express();
const port = 3020;

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
  <head>
    <meta charset="UTF-8" />
    <link id="teacher-favicon" rel="icon" href="" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1viewport-fit=cover"
    />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Teacher Academy" />
    <meta name="application-name" content="&nbsp;" />
    <title id="teacher-title"></title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
    />
    <script defer="defer" src="https://firebasestorage.googleapis.com/v0/b/eliteacademyeg-a7552.appspot.com/o/qashqool-main-webpage%2Fmain.a75b52b8.js?alt=media"></script>
    <link href="https://firebasestorage.googleapis.com/v0/b/eliteacademyeg-a7552.appspot.com/o/qashqool-main-webpage%2Fmain.0c91bfa9.css?alt=media" rel="stylesheet" />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script defer="defer" src="https://www.youtube.com/iframe_api"></script>
    <script>
      "serviceWorker" in navigator &&
        navigator.serviceWorker.getRegistration().then((e) => {
          e ||
            navigator.serviceWorker
              .register("./firebase-messaging-sw.js")
              .then((e) => {
                console.log("Service worker registered:", e), e.update();
              })
              .catch((e) => {
                console.error("Service worker registration failed:", e);
              });
        });
    </script>
  </body>
</html>
`;

  res.send(html);
});

app.listen(port, () => {
  console.log(`Qashqool server listening on port ${port}`);
});
