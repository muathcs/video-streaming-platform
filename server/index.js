import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pool from "./db.js";
// import { dirname } from "path";
// import path from "path";
// import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get("/celebs", async (req, res) => {
  try {
    console.log("hellox11");
    const client = await pool.connect();
    console.log("hellox22");

    const result = await pool.query("SELECT * FROM celeb");
    client.release(); // Release the connection back to the pool

    console.log("hellox33");

    const celebs = result.rows;

    console.log("on line");
    console.log(celebs);
    res.send(celebs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/auth", async (req, res) => {
  console.log("req: ", req.query);
  const { email, password } = req.query;

  try {
    const login = await pool.query(
      "SELECT * FROM UserInfo WHERE email = $1 AND password = $2",
      [email, password]
    );
    console.log("login", login.rows);

    if (login.rows.length > 0) {
      console.log("user authenticated");
      res.send({ success: true });
    } else {
      console.log("failed to authenticated user");
      res.send({ success: false });
    }
  } catch (error) {
    console.log("error2: ", error.message);
  }
});

app.listen(3001, () => {
  console.log("listing...");
});
