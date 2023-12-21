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
    const client = await pool.connect();

    const result = await pool.query("SELECT * FROM celeb");
    client.release(); // Release the connection back to the pool

    const celebs = result.rows;

    res.send(celebs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("listing...");
});
