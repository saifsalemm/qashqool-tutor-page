import express from "express";
import path from "path"; // Add this import

const app = express();
const port = 3020; // 8080 is a common default

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(process.cwd(), "public"))); // Static files are served first

app.get("*", async (req, res) => {
  try {
    // Fetch the current version from a placeholder endpoint
    const response1 = await fetch(
      "https://api.eliteacademyeg.com/wp-json/elite/v2/check-build-version?security_key=12d7e165e3b892bdf322f6c3117554249ffc2405"
    );
    const data1 = await response1.json();
    const version = data1.data;

    const hostname = req.hostname;

    let env = "prod";

    const isBeta = hostname == "beta.qashqool.com";
    const isDev = hostname == "dev.qashqool.com";

    if (isBeta) {
      env = "beta";
    } else if (isDev) {
      env = "dev";
    }

    let tutorData = null;

    if (hostname.split(".").length > 2 && !isBeta && !isDev) {
      // Fetch the current version from a placeholder endpoint
      const response2 = await fetch(
        "https://api.eliteacademyeg.com/wp-json/elite/v2/get-manifest?subdomain=" +
          hostname.split(".")[0]
      );
      const data2 = await response2.json();
      tutorData = data2.data;
    }

    // Use the version to concatenate the .js and .css file URLs
    const jsFile = `https://eliteacademymedia.s3.us-east-1.amazonaws.com/qashqool_assets/${env}/${
      version ?? 1
    }/script.js`;
    const cssFile = `https://eliteacademymedia.s3.us-east-1.amazonaws.com/qashqool_assets/${env}/${
      version ?? 1
    }/style.css`;

    const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
  <head>
    <meta charset="UTF-8" />
    <link id="teacher-favicon" rel="icon" href="${
      tutorData?.appleIcon ??
      "https://eliteacademymedia.s3.us-east-1.amazonaws.com/qashqool_assets/media/qashqool-favicon.ico"
    }" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1viewport-fit=cover"
    />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Teacher Academy" />
    <meta name="application-name" content="&nbsp;" />
    <title id="teacher-title">${tutorData?.name ?? "كشكول"}</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
    />
    <script defer="defer" src="${jsFile}"></script>
    <link href="${cssFile}" rel="stylesheet" />

    ${
      hostname.split(".").length > 2
        ? `<!-- PWA manifest -->
    <link rel="manifest" href="${tutorData?.manifest}" />
    
    <!-- iOS Specific PWA Meta Tags -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="${tutorData?.name}">
    <link rel="apple-touch-icon" href="${tutorData?.appleIcon}">
    <link
      rel="apple-touch-icon-precomposed"
      sizes="144x144"
      href="${tutorData?.appleIcon}"
    />
    <link rel="apple-touch-startup-image" href="${tutorData?.appleIcon}">`
        : ""
    }
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
</html>`;

    res.status(200).send(html);
  } catch (error) {
    console.error("Error fetching version or manifest:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Qashqool server listening on port ${port}`);
});
