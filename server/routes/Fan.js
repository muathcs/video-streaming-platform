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
  console.log("uidx: ", req.params);
  const { uid } = req.params;

  try {
    const response = await prisma.fan.findUnique({
      where: {
        uid: uid,
      },
    });

    console.log("response: ", response);
    // console.log("uidxx:: ", uid);
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
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    try {
      const { uid, payLoad } = req.body;
      const { displayname, email, description } = JSON.parse(payLoad);
      const newurl = req.newUrl;

      const user = await prisma.fan.create({
        data: {
          displayname,
          email,
          uid,
          imgurl: newurl,
          description,
        },
      });

      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  }
);

export default router;
