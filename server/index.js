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
import s3, { AWS_LINK, uploadFile } from "./s3.js";
import { createTheCelebs } from "./wikidata.js";
import { updateEmail, updatePassword } from "./fireBaseAdmin.js";

// createTheCelebs();
const app = express();

const PORT = process.env.PORT || 3001;
app.use(express.json());

app.use(
  cors({
    origin: ["https://vid-stream-cl.onrender.com", "http://localhost:5173"],
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
const upload = multer({ storage: storage });

const client = await pool.connect();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// random image key generator for s3 storage
const randomImageName = () => crypto.randomBytes(32).toString("hex");

app.post("/create-payment-intent", async (req, res) => {
  try {
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
  } catch (error) {
    console.log("/create-stripe: ", error);
  }
});

// app.get("/config", upload.single("file"), async (req, res) => {
//   res.send({
//     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
//   });
// });

app.get("/testing", async (req, res) => {
  try {
    console.log("on testing route");
    res.send("worked well, got your response, testing route");
  } catch (error) {
    console.log("/testing: ", error);
  }
});

app.get("/celebs", async (req, res) => {
  //query celeb table by category
  const { category } = req.params;

  try {
    const result = await pool.query("SELECT * FROM celeb");
    // client.release(); // Release the connection back to the pool

    const celebs = result.rows;

    res.send(celebs);
  } catch (error) {
    console.log("error/celebs: ", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/celeb/:id", async (req, res) => {
  const { id } = req.params;

  console.log("id: ", id);

  try {
    const response = await pool.query("Select * from celeb where uid = $1", [
      id,
    ]);

    const celeb = response.rows;

    res.send(celeb);
  } catch (error) {
    console.log("/celeb/id: ", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/fan/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const response = await pool.query("Select * from fan where uid = $1", [
      uid,
    ]);

    const fan = response.rows;

    res.send(fan);
  } catch (error) {
    console.log("/celeb/id: ", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/celebs/:category", async (req, res) => {
  //query celeb table by category
  let { category } = req.params;

  category = category.toLocaleLowerCase(); // to match db

  console.log("cat: ", category);

  try {
    const result = await pool.query("SELECT * FROM celeb where category = $1", [
      category,
    ]);
    // client.release(); // Release the connection back to the pool

    // console.log("res: ", result.rows);
    const celebs = result.rows;

    res.send(celebs);
  } catch (error) {
    console.log("error/celeb/cat: ", error);
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
  const { uid } = req.query;

  try {
    // this queries all the requests that match the get query uid. Basically when a fan clicks there on there requests this retrieves them
    const response = await pool.query(
      "SELECT celebmessage, requestid, message, reqtype, reqAction, timestamp1, reqstatus, celebuid from Requests WHERE fanuid = $1 ORDER BY requestid",
      [uid]
    );

    // for (const post of response.rows) {
    //   const getObjectParams = {
    //     Bucket: process.env.S3_BUCKET,
    //     Key: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/video/1705718843372-ff3ee63d6be0490373ea383f93fedc7652c6bf1aa6f35fc010aadd2d85825c53.webm",
    //   };

    //   const command = new GetObjectCommand(getObjectParams);
    //   const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // }

    //array that will be sent back to the response, it's made up of objects of the individual request + celeb info(photo, name)
    let reqAndCeleb = [];

    // when the celeb clicks on there requests, I want the individual requests to have the image of the celeb they requested and there name.
    // note: I chose not to add this info(celeb name/photo) to the request table, because it'll make it requests table messy. I have the celebuid
    // on the requests table, and that's enough to get the celeb photo/name from the code below.

    for (const req of response.rows) {
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
  const itemId = parseInt(req.params.id, 10); // Parse the id parameter as an integer

  // resize image
  // const buffer = await sharp(req.file.buffer)
  //   .resize({ height: 1920, width: 1080, fit: "contained" })
  //   .toBuffer();

  // if this if false, it means the we're sending an message text, instead of a audio, or video.
  if (!req.body.state) {
    try {
      const { celebReply } = req.body;

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

      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const sender = await uploadFile(file.buffer, key, file.mimetype);

      // const command = new PutObjectCommand(params);
      // const upload = await s3.send(command);

      // // Construct the URL of the uploaded video
      const videoUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

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

async function uploadProfileImgToS3(req, res, next) {
  let { id } = req.params;
  let { uid, imgurl } = req.body;

  console.log("uid: X:: ", id);

  if (!imgurl && id) {
    // this function checks if we're updating the img or setting it for the first time. So, if the imgurl doesn't exist but the id does this mean the account is updating the img
    // if this case
    imgurl = `profile/user(${id})`;
  }

  const file = req.file;

  console.log("file: ", file);

  if (!file) {
    //just incase the above passes because the firebase account is created beofre the user and so the id may still exist, this will quit the middle ware if an img file wasnt selected.
    console.log("its here next()");
    return next(); //insures middleware below doesn't run.
  }

  let newUrl = AWS_LINK + imgurl;

  try {
    const uploadProf = await uploadFile(file.buffer, imgurl, file.mimetype);
    req.newUrl = newUrl;

    next();
  } catch (error) {
    console.log("error ploadprofiletos3 middleware", error);
    res.send("unable to upload profile picture to s3 storage");
  }
}

app.post(
  "/createUser",
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    const { uid, imgurl, payLoad } = req.body;
    const payLoadParsed = JSON.parse(payLoad);
    const { displayname, email, description } = payLoadParsed;

    const newurl = req.newUrl;

    try {
      const result = await pool.query(
        "INSERT INTO fan(displayname, email, uid, imgurl, description) VALUES ($1, $2, $3, $4, $5)",
        [displayname, email, uid, newurl, description]
      );
      res.send("Sucess crated user");
    } catch (error) {
      console.log("error/cr/user: ", error);
    }
    try {
    } catch (error) {
      console.log("error/createUser: ", error);
    }
  }
);

app.put(
  "/update/:id",
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    const { id } = req.params;
    const payLoadParsed = JSON.parse(req.body.payLoad);
    const { displayName, followers, price, email, category, description } =
      payLoadParsed;

    const newImgUrl = req.newUrl;

    // const s3Link = AWS_LINK + im

    const { status } = req.body;

    console.log("idxx: ", id);
    if (status == "celeb") {
      console.log("isinde clebe new url: ", newImgUrl);
      const response = await pool.query(
        "Update celeb SET displayname=$1, followers=$2, price= $3, category=$4, description=$5, imgurl=$6 where uid=$7",
        [displayName, followers, price, category, description, newImgUrl, id]
      );

      res.status(201).send({ message: "account updated" });
    } else {
      console.log("omsode this: ", newImgUrl);
      console.log("id: ", id);
      const response = await pool.query(
        "Update fan SET displayname=$1, description=$2, imgurl=$3 where uid=$4",
        [displayName, description, newImgUrl, id]
      );
    }
  }
);

app.put("/update/login/email/:id", async (req, res) => {
  const { id } = req.params;
  const { email, status } = req.body;

  const { email: newEmail, password } = req.body.data;

  console.log("params: ", req.params);

  updateEmail(email, newEmail);

  if (status == "celeb") {
    try {
      const response = await pool.query(
        "UPDATE celeb SET email=$1 WHERE uid=$2",
        [newEmail, id]
      );
      res
        .status(201)
        .send({ message: "your email has been updated successfully" });
    } catch (error) {
      console.log("erorr/login/email/:id: ", error);
      res.send(error);
    }
  } else {
    try {
      const response = await pool.query(
        "UPDATE fan SET email=$1 WHERE uid=$2",
        [newEmail, id]
      );
      res
        .status(201)
        .send({ message: "your email has been updated successfully" });
    } catch (error) {
      console.log("erorr/login/email/:id: ", error);
      res.send(error);
    }
  }
});

app.put("/update/login/password/:id", async (req, res) => {
  const { id } = req.params;
  const { newPassword, confirmNewPassword } = req.body.data;

  console.log(
    "id: ",
    id,
    "newPAss: ",
    newPassword,
    "confirm: ",
    confirmNewPassword
  );

  try {
    await updatePassword(id, newPassword);
    res.status(201).send({ message: "Your password has been reset" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// notification
app.post("/notification", async (req, res) => {
  const { intended_uid, sender_uid, message } = req.body;

  console.log(
    "intend: ",
    intended_uid,
    "sender_uid: ",
    sender_uid,
    "message: ",
    message
  );

  try {
    const response = await pool.query(
      "INSERT INTO notification(intended_uid,sender_uid, message) VALUES ($1, $2, $3)",
      [intended_uid, sender_uid, message]
    );

    res.status(200).send({ message: "notification has been made" });
  } catch (error) {
    console.log("error/notification: ", error);
  }
});

app.get("/notification", async (req, res) => {
  const { data: uid } = req.query;
  console.log("this: ", uid);
  try {
    const response = await pool.query(
      "SELECT * FROM notification WHERE intended_uid = $1",
      [uid]
    );

    return res.send(response.rows);
  } catch (error) {
    console.log("get/notification: ", error);
    res.status(404).send({ message: error.message });
  }
});

app.put("/notification", async (req, res) => {
  const { uid } = req.body;
  console.log("body: ", uid);
  try {
    const response = pool.query(
      "UPDATE notification SET is_read = true WHERE intended_uid = $1 ",
      [uid]
    );
  } catch (error) {
    res.status(401).send({ message: "could not update notification table" });
  }
});

// search

app.get("/search", async (req, res) => {
  const { name } = req.query;
  console.log("name: ", name);

  if (!name) return;
  try {
    // const response = await pool.query(
    //   "select displayname, uid from celeb where document_with_idx @@ to_tsquery($1) order by ts_rank(document_with_idx, plainto_tsquery($1))",
    //   [name]
    const response = await pool.query(
      "SELECT *, ts_rank(document_with_idx, to_tsquery('simple', $1 || ':*')) AS rank FROM celeb WHERE document_with_idx @@ to_tsquery('simple', $1 || ':*') ORDER BY CASE WHEN lower(substring(displayname from 1 for 1)) = lower($1) THEN 1 ELSE 2 END, CASE WHEN lower(substring(displayname from 1 for 1)) = lower($1) THEN substring(displayname from 3) END, rank DESC",
      [name]
    );

    res.status(201).send(response.rows);

    // console.log("response: ", response.rows);
  } catch (error) {
    console.log("/search: ", error);
    res.status(401).send();
  }
});

app.put("/test", upload.single("videoFile"), async (req, res) => {});

app.post("/request", async (req, res) => {
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
app.post(
  "/createCeleb",
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    const { uid, imgurl } = req.body;

    const payload = JSON.parse(req.body.payLoad);

    // console.log("payload: ", payload);

    const {
      displayName,
      username,
      followers,
      account,
      category,
      price,
      email,
      description,
    } = payload;

    try {
      const result = await pool.query(
        "INSERT INTO celeb(displayName, username, followers, account, category, price, email, description, uid, imgurl) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [
          displayName,
          username,
          followers,
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
  }
);

app.listen(PORT, () => {
  console.log("listing on...", PORT);
});

// custom middleware functions
