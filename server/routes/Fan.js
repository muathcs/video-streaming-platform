import { prisma } from "../index.js";
import express from "express";

import multer from "multer";
import { uploadProfileImgToS3 } from "../s3.js";

const router = express.Router();
const storage = multer.memoryStorage();
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
router.get("/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const response = await prisma.fan.findUnique({
      where: {
        uid: uid,
      },
    });

    console.log("response: ", response);
    console.log("uidxx:: ", uid);
    // const response = await pool.query(
    //   'Select * from public."Fan" where uid = $1',
    //   [uid]
    // );

    res.send(response);
  } catch (error) {
    console.log("/celeb/id: ", error.message);
    res.status(500).json({ error: error.message });
  }
});

//creates a new row on the the Fan table
router.post(
  "/createUser",
  // upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    console.log("file: ", req.file);
    console.log("payloadxx: ", req.body);
    const { uid, payLoad } = req.body;
    const payLoadParsed = JSON.parse(payLoad);
    const { displayname, email, description } = payLoadParsed;
    console.log("creating a fan jhere: ", req.newUrl);

    const newurl = req.newUrl;

    try {
      const user = await prisma.fan.create({
        data: {
          displayname: displayname,
          email: email,
          uid: uid,
          imgurl: newurl,
          description: description,
        },
      });
      // const result = await pool.query(
      //   "INSERT INTO fan(displayname, email, uid, imgurl, description) VALUES ($1, $2, $3, $4, $5)",
      //   [displayname, email, uid, newurl, description]
      // );
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

export default router;
