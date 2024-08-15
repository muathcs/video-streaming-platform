import { prisma } from "../index.js";
import express from "express";
import multer from "multer";
import { AWS_LINK, uploadFile, uploadProfileImgToS3 } from "../s3.js";
import { updateEmail, updatePassword } from "../fireBaseAdmin.js";

const router = express.Router();

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

router.put(
  "/:id",
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    console.log("response: ", req.body);
    const { id } = req.params;
    const payLoadParsed = JSON.parse(req.body.payLoad);

    console.log("payload: ", payLoadParsed);
    console.log("uid: ", req.params);
    console.log("file: ", req.file);

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

    console.log("newURL: ", newImgUrl);

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
          },
        });

        res.status(201).send({ message: "account updated" });
      } catch (error) {
        console.log("/update: ", error);
      }
    }
  }
);

// uploadImgVerification

async function uploadVerficationToS3(req, res, next) {
  const files = req.files;
  const id = "2309afsjhkl2x";
  try {
    for (const file in files) {
      console.log("FILE: ", files[file][0].originalname);

      const fileName = files[file][0];

      if (
        fileName.originalname == "documentPic" ||
        fileName.originalname == "documentPicWithFace"
      ) {
        console.log("inside: ", fileName.mimetype);

        let imgUrl = `verification/user(${id})-${fileName.originalname}`;

        if (fileName.originalname == "documentPic") {
          console.log("original Name: ", fileName.originalname);
          req.documentPic = AWS_LINK + imgUrl;
        } else {
          req.documentPicWithFace = AWS_LINK + imgUrl;
        }

        // await uploadFile(fileName.buffer, imgUrl, fileName.mimetype);
      } else if (fileName.originalname == "profilePic") {
        let imgUrl = `profile/user(${id})`;
        req.profileImg = AWS_LINK + imgUrl;
        console.log("here: imgurl");
        await uploadFile(fileName.buffer, imgUrl, fileName.mimetype);
      }
    }

    next();

    // console.log("reqzzzx: ", req.files);
  } catch (error) {
    console.error(error.message);
  }
}
//
router.put(
  "/celeb/onboard",
  upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "documentPic", maxCount: 1 },
    { name: "documentPicWithFace", maxCount: 1 },
  ]),
  uploadVerficationToS3,
  // uploadProfileImgToS3,
  async (req, res) => {
    const check = req.files;
    const body = req.body;
    const withFace = req.documentPicWithFace;
    const { bio, category, price, profession, uid } = JSON.parse(
      req.body.onBoardData
    );

    console.log("uid: : ", category);
    console.log("check: ", req.body.onBoardData);
    console.log("info: ", req.body.info);

    console.log("DocFace: ", withFace);

    // console.log("FirstOne ", check.documentPicWithFace);
    // console.log("FirstTwo ", check.profileImg);
    // console.log("FirstThree ", check.profileImg);
    // console.log("body: ", body.info);
    const profileImg = req.profileImg;
    try {
      const response = await prisma.celeb.update({
        where: {
          uid: uid,
        },
        data: {
          description: bio,
          category: category,
          price: price,
          completed_onboarding: true,
          imgurl: profileImg,
        },
      });
      res.status(201).send("great");
      // console.log(first)
    } catch (error) {
      console.error(error.message);
      res.status(401).send("fail");
    }
  }
);

router.put("/login/email/:id", async (req, res) => {
  console.log("emailS:: ", req.body);
  const { id } = req.params;
  const { email, status } = req.body;

  // let newEmail;

  const { email: newEmail, password, displayName } = req.body.data;

  updateEmail(email, newEmail);

  if (status == "celeb") {
    try {
      const updateCeleb = await prisma.celeb.update({
        where: {
          uid: id,
        },
        data: {
          email: newEmail,
          displayname: displayName,
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

  console.log("pass: ", req.body);

  try {
    const response = await updatePassword(id, newPassword);
    res.status(201).send({ message: "Your password has been reset" });
    console.log("succefully ");
  } catch (error) {
    console.log("error updating password: ", error);
    res.status(400).send({ message: error });
  }
});

export default router;
