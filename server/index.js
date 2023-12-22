import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pool from "./db.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// import { dirname } from "path";
// import path from "path";
// import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const client = await pool.connect();

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

  console.log("statusL:", req.query);

  const result = await pool.query("SELECT * FROM celeb WHERE uid = $1", [uid]);

  if (result.rows.length == 0) {
    res.send(false);
  } else {
    res.send(true);
  }
});

//post

app.post("/createUser", async (req, res) => {
  const { uid } = req.body;

  const { username, email } = req.body.payLoad;

  try {
    const result = await pool.query(
      "INSERT INTO fan(username, email, uid) VALUES ($1, $2, $3)",
      [username, email, uid]
    );
    res.send("Sucess crated user");
  } catch (error) {
    console.log("error: ", error);
  }
  try {
    console.log(first);
  } catch (error) {}
});
app.post("/createCeleb", async (req, res) => {
  console.log("celeb", req.body);

  const { uid } = req.body;

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

  console.log("uid: ", uid);

  try {
    const result = await pool.query(
      "INSERT INTO celeb(displayName, username, followers, account, category, price, email, description, uid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
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
      ]
    );
    console.log(req.body);
    res.send("Thank you");
  } catch (error) {
    console.log(error);
    res.send("Failed");
  }
});

app.listen(3001, () => {
  console.log("listing...");
});
