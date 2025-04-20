import express from "express";
import { createClient } from "redis"; // Ensure this is installed

const redisClient = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

const app = express();
const port = 3020; // 8080 is a common default

// Middleware to parse JSON bodies
app.use(express.json());

// app.get("*", (req, res) => {
//   const host = req.headers.host;
//   const subdomain = host.split(".")[0];
//   try {
//     res.status(200).send(`
//       <!DOCTYPE html>
//       <html dir="rtl" lang="ar">
//         <head>
//           <meta charset="UTF-8" />
//           <link id="teacher-favicon" rel="icon" href="" />
//           <meta
//             name="viewport"
//             content="width=device-width,initial-scale=1viewport-fit=cover"
//           />
//           <meta name="theme-color" content="#000000" />
//           <meta name="description" content="Qashqool" />
//           <title id="teacher-title">dev teacher</title>
//           <link
//           rel="stylesheet"
//           href="https://unpkg.com/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
//           />
//           <script defer="defer" src="https://eliteacademymedia.s3.us-east-1.amazonaws.com/eliteacademymedia/qashqool/main.a75b52b8.js"></script>
//           <link href="https://eliteacademymedia.s3.us-east-1.amazonaws.com/eliteacademymedia/qashqool/main.0c91bfa9.css" rel="stylesheet" />
//           <meta name="application-name" content="&nbsp;" />
//           <meta name="msapplication-TileColor" content="#FFFFFF" />
//           <meta name="msapplication-TileImage" content="mstile-144x144.png" />

//           <!-- PWA manifest -->
//           <link rel="manifest" href="https://firebasestorage.googleapis.com/v0/b/eliteacademyeg-a7552.appspot.com/o/manifests%2F${subdomain}.json?alt=media" />

//           <!-- iOS Specific PWA Meta Tags -->
//           <meta name="apple-mobile-web-app-capable" content="yes">
//           <meta name="apple-mobile-web-app-status-bar-style" content="default">
//           <meta name="apple-mobile-web-app-title" content="Qashqool">
//           <link rel="apple-touch-icon" href="https://firebasestorage.googleapis.com/v0/b/eliteacademyeg-a7552.appspot.com/o/manifests%2Fdev-beta.png?alt=media">
//           <link
//             rel="apple-touch-icon-precomposed"
//             sizes="144x144"
//             href="https://firebasestorage.googleapis.com/v0/b/eliteacademyeg-a7552.appspot.com/o/manifests%2Fdev-beta.png?alt=media"
//           />
//           <link rel="apple-touch-startup-image" href="https://firebasestorage.googleapis.com/v0/b/eliteacademyeg-a7552.appspot.com/o/manifests%2Fdev-beta.png?alt=media">
//         </head>
//         <body>
//           <noscript>You need to enable JavaScript to run this app.</noscript>
//           <div id="root"></div>
//           <script src="https://www.youtube.com/iframe_api"></script>
//         </body>
//       </html>
//     `);
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });

app.get("/", async (req, res) => {
  try {
    // Check if "appVersion" exists in Redis
    let version = await redisClient.get("appVersion");

    if (!version) {
      // Fetch the current version from a placeholder endpoint
      const res = await fetch(
        "https://api.eliteacademyeg.com/wp-json/elite/v2/check-build-version?security_key=12d7e165e3b892bdf322f6c3117554249ffc2405"
      );
      const response = await res.json();
      version = response.data;

      // Store the version in Redis
      await redisClient.set("appVersion", version ?? 1, {
        EX: 60 * 60 * 12, // Set expiration to 12 hours
      });
    }

    const hostname = req.hostname;

    if (hostname.split(".").length > 2) {
      let tutorData = await redisClient.get(hostname);

      if (!tutorData) {
        // Fetch the current version from a placeholder endpoint
        const response = await fetch(
          "https://api.eliteacademyeg.com/wp-json/elite/v2/get-manifest?subdomain=" +
            hostname.split(".")[0]
        );
        const data = await response.json();
        tutorData = data.data;

        // Store the version in Redis
        await redisClient.set(hostname, tutorData, {
          EX: 60 * 60 * 12, // Set expiration to 12 hours
        });
      }
    }

    // Use the version to concatenate the .js and .css file URLs
    const jsFile = `https://eliteacademymedia.s3.us-east-1.amazonaws.com/qashqool_assets/prod/script-${
      version ?? 1
    }.js`;
    const cssFile = `https://eliteacademymedia.s3.us-east-1.amazonaws.com/qashqool_assets/prod/style-${
      version ?? 1
    }.css`;

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

    res.send(html);
  } catch (error) {
    console.error("Error fetching version or interacting with Redis:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to delete the "appVersion" key
app.delete("/version", async (req, res) => {
  const authHeader = req.headers["authorization"];

  if (
    !authHeader ||
    authHeader !== "Bearer 597eb92e2c6585cd60c827f354dcd7a18731be86"
  ) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    await redisClient.del("appVersion");
    res.status(200).send("appVersion key deleted");
  } catch (error) {
    console.error("Error deleting appVersion key:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Qashqool server listening on port ${port}`);
});
