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

//get requests
app.get("/auth", async (req, res) => {
  const { email, password } = req.query;

  console.log("email: ", email);
  console.log("password: ", password);
  try {
    const login = await pool.query(
      "SELECT * FROM UserInfo WHERE email = $1 AND password = $2 ",
      [email, password]
    );

    if (login.rows.length > 0) {
      const userid = login.rows[0].userid;
      console.log("user authenticated");
      res.send({ success: true, userid: userid });
    } else {
      console.log("failed to authenticated user");
      res.send({ success: false });
    }
  } catch (error) {
    console.log("error2x: ", error.message);
  }
});

// post requests:
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const login = await pool.query(
      "INSERT INTO UserInfo (email, username, password, celeb) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, username, password, false]
    );

    // Extract the userid from the inserted row
    const insertedUserId = login.rows[0].userid;
    const imageKey = `profile/user(${insertedUserId})`;
    // Perform the UPDATE query to update the imageKey with the userid
    await pool.query("UPDATE UserInfo SET imgKey = $1 WHERE userid = $2", [
      imageKey,
      insertedUserId,
    ]);

    console.log("signUPID", login.rows[0].userid);

    res.send({ sucessful: true, userid: login.rows[0].userid });
  } catch (error) {
    console.log("errror/register: ", error.message);
    res.send("failed to signup");
  }
});
app.listen(3001, () => {
  console.log("listing...");
});
