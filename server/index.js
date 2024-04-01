import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pool from "./db.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
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
import { createTheCelebs } from "./wikidata.js";
// const result = await prisma.$executeRaw`
//   UPDATE "Celeb"
//   SET document_with_idx = TO_TSVECTOR('simple', displayname);
// `;

// createTheCelebs();
const app = express();
export const prisma = new PrismaClient();

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
  "https://console.cron-job.org/jobs/4875267",
];

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

app.get("/celebs", (req, res) => {
  console.log("testing path ");
});

//Listen
app.listen(PORT, () => {
  console.log("listing on...", PORT);
});
