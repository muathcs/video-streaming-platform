import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pool from "./db.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import stripe from "stripe";
// import s3 from "./s3.js";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import crypto from "crypto";
import e from "express";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import CelebRoute from "./routes/Celebs.js";
import FanRoute from "./routes/Fan.js";
import RequestRoute from "./routes/Request.js";
import NotificationsRoute from "./routes/Notification.js";
import ReviewRoute from "./routes/Review.js";
import UpdateRoute from "./routes/Update.js";
import SearchRoute from "./routes/Search.js";
import UserRoute from "./routes/User.js";
// const result = await prisma.$executeRaw`
//   UPDATE "Celeb"
//   SET document_with_idx = TO_TSVECTOR('simple', displayname);
// `;

// createTheCelebs();
const app = express();

const PORT = process.env.PORT || 3001;
app.use(express.json());

const allowedOrigins = [
  "https://vid-stream-cl.onrender.com",
  "http://localhost:5173",
  "https://195.201.26.157",
  "https://116.203.134.67",
  "https://116.203.129.16",
  "https://23.88.105.37",
  "https://128.140.8.200",
  "https://console.cron-job.org/jobs/4875267",
];

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
// multer middleware
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

const client = await pool.connect();

// random image key generator for s3 storage
const randomImageName = () => crypto.randomBytes(32).toString("hex");

app.use("/celebs", CelebRoute);
app.use("/fan", FanRoute);
app.use("/request", RequestRoute);
app.use("/notification", NotificationsRoute);
app.use("/reviews", ReviewRoute);
app.use("/update", UpdateRoute);
app.use("/search", SearchRoute);
app.use("/user", UserRoute);

// app.get("/config", upload.single("file"), async (req, res) => {
//   res.send({
//     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
//   });
// });

app.listen(PORT, () => {
  console.log("listing on...", PORT);
});
