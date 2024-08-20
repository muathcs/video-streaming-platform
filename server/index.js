import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import CelebRoute from "./routes/Celebs.js";
import FanRoute from "./routes/Fan.js";
import RequestRoute from "./routes/Request.js";
import NotificationsRoute from "./routes/Notification.js";
import ReviewRoute from "./routes/Review.js";
import UpdateRoute from "./routes/Update.js";
import SearchRoute from "./routes/Search.js";
import UserRoute from "./routes/User.js";
import StripeRoute from "./routes/Stripe.js";
import { createTheCelebs } from "./wikidata.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// import ReactDomServer from "react-dom/server.js";
// import { StaticRouter } from "react-router-dom/server";
// import App from "../client/src/App.tsx";

// const result = await prisma.$executeRaw`
//   UPDATE "Celeb"
//   SET document_with_idx = TO_TSVECTOR('simple', displayname);
// `;

console.log("here");
const app = express();

export const prisma = new PrismaClient();

createTheCelebs();
// saveInviteCode();

const PORT = process.env.PORT || 3001;
app.use(express.json());

const allowedOrigins = [
  "https://vid-stream-cl.onrender.com",
  "http://localhost:5173",
  "http://localhost:8081",
  "http:// 10.0.2.2:8000/",
  "https://195.201.26.157",
  "https://116.203.134.67",
  "https://116.203.129.16",
  "https://23.88.105.37",
  "https://128.140.8.200",
  "192.168.0.16",
  "https://console.cron-job.org/jobs/4875267",
  "aws-0-eu-central-1.pooler.supabase.com",
];

console.log("__", __dirname);
const clientDir = path.join(__dirname, "../../client/dist");

app.use(express.static(clientDir));

// app.get("/*", async (req, res) => {
//   fs.readFile(
//     path.resolve("../client/dist/index.html"),
//     "utf-8",
//     (err, data) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send("some error happened");
//       }

//       const html = ReactDomServer.renderToString(
//         <StaticRouter location={req.url}>
//           <App />
//         </StaticRouter>
//       );
//       return res.send(
//         data.replace(`<div id="root"></div>`, `<div id="root>${html}</div>`)
//       );
//     }
//   );
// });

// app.use((req, res, next) => {
//   let router = Router.create({ location: req.url, routes: routes });

//   router.run((Handler, state) => {
//     let html = React.renderToString(<Handler />);
//     return res.render("react_page", { html: html });
//   });
// });
//middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    maxAge: 7200,
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));

//function for image upload
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

// routes
app.use("/celebs", CelebRoute);
app.use("/fan", FanRoute);
app.use("/request", RequestRoute);
app.use("/notification", NotificationsRoute);
app.use("/reviews", ReviewRoute);
app.use("/update", UpdateRoute);
app.use("/search", SearchRoute);
app.use("/user", UserRoute);
app.use("/stripe", StripeRoute);

// Catch-all route to serve the client app
app.get("/*", function (req, res) {
  res.sendFile(path.join(clientDir, "index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

//Listen
app.listen(PORT, () => {
  console.log("listing on...", PORT);
});
