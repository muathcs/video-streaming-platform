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
import schedule from "node-schedule"
import { refundFan } from "./actions/actions.js";

async function handleExpiredRequestsAndRefunds(){
  const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

try {

  // Step 1: Find all requests that are more than 7 days old and not already expired or fulfilled
  const expiredRequests = await prisma.request.findMany({
    where: {
      reqstatus:
      
      {
        notIn: ['expired', 'fulfilled'], // Ignore requests that are already expired or fulfilled
      },
      timestamp1: {
        lte: oneWeekAgo, // Requests that are older than 7 days
      },
    },
    select: {
      requestid: true, // We only need the requestid (for initiating refunds)
      price: true,     // Assuming you also need the price for the refund logic
      fanuid: true,    // Assuming you need fan ID for refunds
      paymentId:true,
      refunded:true
    },
  });

  console.log("here2: ", expiredRequests.length)


  // Step 2: Loop through each request and handle refunds
  for (const request of expiredRequests) {
  console.log("here3")

    // Update the request status to 'expired'
    await prisma.request.update({
      where: { requestid: request.requestid },
      data: { reqstatus: 'expired' },
    });

    // console.log("amount: ", request)

    // Step 3: Initiate a refund 
    // await refundFan
    await refundFan(request.paymentId, request.price, request.refunded, request.requestid);
    // console.log(`Refund initiated for request ${request.requestid}`);
  }
} catch (error) {
  console.error('Error processing expired requests:', error);
}
}

const job = schedule.scheduleJob('*/10 * * * * *', (firedate) => {
  console.log("runnning every second: ")
  // handleExpiredRequestsAndRefunds()
})

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

// createTheCelebs();
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
