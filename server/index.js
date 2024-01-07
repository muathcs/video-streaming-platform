import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pool from "./db.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import stripe from "stripe";

// import { dirname } from "path";
// import path from "path";
// import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const client = await pool.connect();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Specify your AWS region here
const region = "eu-west-2";
const credentials = {
  accessKeyId: "AKIAQ24MTJ6NCLEQSH4W",
  secretAccessKey: "M0H2EtwKmVFdX209kqEk1GHczAoSLe5K3Rg5Qs4N",
};
// const credentials = {
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// };

const s3 = new S3Client({ region, credentials });

(async () => {
  await s3.send(
    new PutObjectCommand({
      Body: "hello world",
      Bucket: "cy-vide-stream-imgfiles",
      Key: "my-file.txt",
    })
  );
})();

app.use(express.static("public"));
app.use(express.json());

// Use the cors middleware
app.use(cors());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  console.log("bodyZZ", req.body);
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripeInstance.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",

    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
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

app.get("/celebs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM celeb");
    // client.release(); // Release the connection back to the pool

    const celebs = result.rows;

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

app.put("/fulfill/:id", async (req, res) => {
  console.log("here I am ");
  const itemId = parseInt(req.params.id, 10); // Parse the id parameter as an integer

  const { celebReply } = req.body;

  console.log("celebReply: ", celebReply);

  try {
    const response = await pool.query(
      "UPDATE requests SET reqstatus = $1, celebmessage = $2 WHERE requestid = $3 ",
      ["fulfilled", celebReply, itemId]
    );
    res.status(200);
  } catch (error) {
    console.log("/fulfill/:id > ", error);
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

app.listen(3001, () => {
  console.log("listing on 3001...");
});
