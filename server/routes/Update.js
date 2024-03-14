import { prisma } from "../index.js";
import express from "express";
import multer from "multer";
import { uploadProfileImgToS3 } from "../s3.js";

const router = express.Router();

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

router.put(
  "/:id",
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    const { id } = req.params;
    const payLoadParsed = JSON.parse(req.body.payLoad);
    const {
      displayName,
      followers,
      price,
      email,
      category,
      description,
      imgurl,
    } = payLoadParsed;

    const test = req.newUrl;

    const newImgUrl = req.newUrl ? req.newUrl : imgurl;

    const { status } = req.body;

    if (status == "celeb") {
      try {
        const updateCeleb = await prisma.celeb.update({
          where: {
            uid: id,
          },
          data: {
            displayname: displayName,
            followers: followers,
            price: price,
            category: category,
            description: description,
            imgurl: newImgUrl,
          },
        });

        res.status(201).send({ message: "account updated" });
      } catch (error) {
        console.log("/update:id: ", error);
      }
    } else {
      try {
        const update = await prisma.fan.update({
          where: {
            uid: id,
          },
          data: {
            displayname: displayName,
            email: email,
            description: description,
            imgurl: newImgUrl,
            fav_categories: "action", // add this to the settings page
          },
        });

        res.status(201).send({ message: "account updated" });
      } catch (error) {
        console.log("/update: ", error);
      }
    }
  }
);

router.put("/login/email/:id", async (req, res) => {
  const { id } = req.params;
  const { email, status } = req.body;

  const { email: newEmail, password } = req.body.data;

  updateEmail(email, newEmail);

  if (status == "celeb") {
    try {
      const updateCeleb = await prisma.celeb.update({
        where: {
          uid: id,
        },
        data: {
          email: newEmail,
        },
      });

      // const response = await pool.query(
      //   "UPDATE celeb SET email=$1 WHERE uid=$2",
      //   [newEmail, id]
      // );
      res
        .status(201)
        .send({ message: "your email has been updated successfully" });
    } catch (error) {
      console.log("erorr/login/email/:id: ", error);
      res.send(error);
    }
  } else {
    try {
      const updateCeleb = await prisma.fan.update({
        where: {
          uid: id,
        },
        data: {
          email: newEmail,
        },
      });
      // const response = await pool.query(
      //   "UPDATE fan SET email=$1 WHERE uid=$2",
      //   [newEmail, id]
      // );
      res
        .status(201)
        .send({ message: "your email has been updated successfully" });
    } catch (error) {
      console.log("erorr/login/email/:id: ", error);
      res.send(error);
    }
  }
});

router.put("/login/password/:id", async (req, res) => {
  const { id } = req.params;
  const { newPassword, confirmNewPassword } = req.body.data;

  try {
    await updatePassword(id, newPassword);
    res.status(201).send({ message: "Your password has been reset" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

export default router;
