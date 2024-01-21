import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pool from "./db.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import stripe from "stripe";
// import s3 from "./s3.js";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import crypto from "crypto";
import sharp from "sharp";
import s3, { uploadFile } from "./s3.js";

const app = express();

// Set middleware of CORS
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://video-streaming-client.onrender.com"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});
// app.use(
//   cors({
//     origin: "https://video-streaming-client.onrender.com",
//   })
// );
const PORT = process.env.PORT || 3001;
// middleware
app.use(express.json());

// app.use(
//   cors({
//     origin: "*",
//   })
// );

// app.use(corse());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", true);

//   console.log("Request received:", req.method, req.url);

//   next();
// });

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  const allowedOrigins = ["https://video-streaming-client.onrender.com"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

app.use(bodyParser.json());
app.use(express.static("public"));
// multer middleware
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const client = await pool.connect();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// random image key generator for s3 storage
const randomImageName = () => crypto.randomBytes(32).toString("hex");

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripeInstance.paymentIntents.create({
    amount: 1400,
    currency: "eur",

    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: false,
    },
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/config", async (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.get("/testing", async (req, res) => {
  console.log("working");

  res.send("worked well");
});

app.get("/celebs", async (req, res) => {
  //query celeb table by category
  const { category } = req.params;

  console.log("paramS: ", category);
  try {
    const result = await pool.query("SELECT * FROM celeb");
    // client.release(); // Release the connection back to the pool

    const celebs = result.rows;

    // console.log("celebs: ", celebs);

    res.send(celebs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/celebs/:category", async (req, res) => {
  //query celeb table by category
  const { category } = req.params;

  console.log("paramS: ", category);
  try {
    const result = await pool.query("SELECT * FROM celeb where category = $1", [
      category,
    ]);
    // client.release(); // Release the connection back to the pool

    const celebs = result.rows;

    // console.log("celebs: ", celebs);

    res.send(celebs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//is a celeb or not
app.get("/status", async (req, res) => {
  const uid = req.query.uid;

  const result = await pool.query("SELECT * FROM celeb WHERE uid = $1", [uid]);

  if (result.rows.length == 0) {
    res.send(false);
  } else {
    res.send(true);
  }
});

app.get("/dashboard", async (req, res) => {
  const uid = req.query.data;

  try {
    const response = await pool.query(
      "SELECT * from Requests WHERE reqstatus = $1 AND celebUid = $2 ORDER BY requestid DESC",
      ["pending", uid]
    );

    const requests = response.rows;

    res.send(requests);
  } catch (error) {
    console.log("/dasshboard", error);
  }
});

app.get("/fanrequests", async (req, res) => {
  const uid = req.query.data;

  try {
    // this queries all the requests that match the get query uid. Basically when a fan clicks there on there requests this retrieves them
    const response = await pool.query(
      "SELECT celebmessage, requestid, message, reqtype, reqAction, timestamp1, reqstatus, celebuid from Requests WHERE fanuid = $1 ORDER BY requestid",
      [uid]
    );

    // console.log(response.rows);

    // for (const post of response.rows) {
    //   const getObjectParams = {
    //     Bucket: process.env.S3_BUCKET,
    //     Key: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/video/1705718843372-ff3ee63d6be0490373ea383f93fedc7652c6bf1aa6f35fc010aadd2d85825c53.webm",
    //   };

    //   const command = new GetObjectCommand(getObjectParams);
    //   const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    //   console.log("here");

    //   console.log("URL: ", url);
    // }

    //array that will be sent back to the response, it's made up of objects of the individual request + celeb info(photo, name)
    let reqAndCeleb = [];

    // when the celeb clicks on there requests, I want the individual requests to have the image of the celeb they requested and there name.
    // note: I chose not to add this info(celeb name/photo) to the request table, because it'll make it requests table messy. I have the celebuid
    // on the requests table, and that's enough to get the celeb photo/name from the code below.

    for (const req of response.rows) {
      console.log("here");
      try {
        const celebNameAndPhoto = await pool.query(
          "SELECT uid, displayName, imgUrl FROM celeb WHERE uid = $1 ",
          [req.celebuid]
        );

        const combinedObject = {
          request: req,
          celeb: celebNameAndPhoto.rows[0],
        };

        reqAndCeleb.push(combinedObject);
      } catch (error) {
        console.log("/fanReq/map: ", error);
      }
    }

    // Use Promise.all to wait for all promises to be resolved
    await Promise.all(reqAndCeleb);

    // const celebUidFromRequest = response.rows

    res.send(reqAndCeleb);
  } catch (error) {
    console.log("/fanrequests: ", error);
  }
});

app.put("/fulfill/:id", upload.single("videoFile"), async (req, res) => {
  // console.log("here/fulfull: ", req.body);

  const itemId = parseInt(req.params.id, 10); // Parse the id parameter as an integer
  console.log("body", req.body);

  // resize image
  // const buffer = await sharp(req.file.buffer)
  //   .resize({ height: 1920, width: 1080, fit: "contained" })
  //   .toBuffer();

  // if this if false, it means the we're sending an message text, instead of a audio, or video.
  if (!req.body.state) {
    try {
      const { celebReply } = req.body;

      // console.log("celeb", celebReply);
      const response = await pool.query(
        "UPDATE requests SET reqstatus = $1, celebmessage = $2 WHERE requestid = $3 ",
        ["fulfilled", celebReply, itemId]
      );
      res.status(200);
      return res.status(200).send("Message Updated successful");
    } catch (error) {
      console.log("error/put/fulfill/message: ", error);
    }
  }
  const state = JSON.parse(req.body.state);

  try {
    if (state.reqtype == "video" || state.reqtype == "audio") {
      const file = req.file; // we get this file, because we're sending a form data.
      const key = `video/${Date.now()}-${randomImageName()}.webm`;

      // console.log("celebREply: ", celebReply);
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const sender = await uploadFile(file.buffer, key, file.mimetype);

      console.log("sender: ", sender);
      // const command = new PutObjectCommand(params);
      // const upload = await s3.send(command);

      // // Construct the URL of the uploaded video
      const videoUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      // console.log("here", videoUrl);
      // console.log("id: ", itemId);
      const response = await pool.query(
        "UPDATE requests SET reqstatus = $1, celebmessage = $2 WHERE requestid = $3 ",
        ["fulfilled", videoUrl, itemId]
      );

      res.status(200);
    }
  } catch (error) {
    console.log(error);
  }
  console.log("reqid: ", itemId);
});

//post

app.post("/createUser", async (req, res) => {
  const { uid, imgurl } = req.body;

  const { username, email } = req.body.payLoad;

  try {
    const result = await pool.query(
      "INSERT INTO fan(username, email, uid, imgurl) VALUES ($1, $2, $3, $4)",
      [username, email, uid, imgurl]
    );
    res.send("Sucess crated user");
  } catch (error) {
    console.log("error: ", error);
  }
  try {
  } catch (error) {}
});

//

app.put("/test", upload.single("videoFile"), async (req, res) => {
  // console.log("file:", req.file);
  // console.log("test:", req.body);
});

app.post("/request", async (req, res) => {
  console.log("body: ", req.body);

  let {
    celebUid,
    fanUid,
    price,
    message, //
    requestAction, //
    toSomeOneElse, //
    reqType, //
    fromPerson, //
    toPerson, //
  } = req.body;

  console.log("action: ", requestAction);
  console.log("toperson: ", toPerson);
  price = parseInt(price);
  try {
    const result = await pool.query(
      "INSERT INTO Requests(celebUid, fanUid, price, message, reqstatus, reqtype, timeStamp1, reqaction, tosomeoneelse, fromperson, toperson) Values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [
        celebUid,
        fanUid,
        price,
        message,
        "pending",
        reqType,
        new Date(),
        requestAction,
        toSomeOneElse,
        fromPerson,
        toPerson,
      ]
    );

    res.send("succesfully added a request");
  } catch (error) {
    console.log("/request", error.message);
  }
});

// this path is reached, if someone signs up as a celeb
// a different path createuser if user signs up as normal user not a celeb
app.post("/createCeleb", async (req, res) => {
  const { uid, imgurl } = req.body;

  const {
    displayName,
    username,
    follower,
    account,
    category,
    price,
    email,
    description,
  } = req.body.payLoad;

  try {
    const result = await pool.query(
      "INSERT INTO celeb(displayName, username, followers, account, category, price, email, description, uid, imgurl) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        displayName,
        username,
        follower,
        account,
        category,
        price,
        email,
        description,
        uid,
        imgurl,
      ]
    );
    res.send("Thank you");
  } catch (error) {
    console.log(error);
    res.send("Failed");
  }
});

app.listen(PORT, () => {
  console.log("listing on...", PORT);
});
