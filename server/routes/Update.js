import { prisma } from "../index.js";
import express from "express";
import multer from "multer";
import { AWS_LINK, uploadFile, uploadProfileImgToS3 } from "../s3.js";
import { updateEmail, updatePassword } from "../fireBaseAdmin.js";
import { indexNewCeleb } from "../services/celebService.js";

const router = express.Router();

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });


// update user info including profile picture
router.put(
  "/:id",
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
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

      const newImgUrl = req.newUrl || imgurl;

      const updateData = {
        displayname: displayName,
        description,
        imgurl: newImgUrl,
      };

      if (status === "celeb") {
        Object.assign(updateData, {
          followers,
          price,
          category,
        });

        await prisma.celeb.update({
          where: { uid: id },
          data: updateData,
        });
      } else {
        Object.assign(updateData, { email });

        await prisma.fan.update({
          where: { uid: id },
          data: updateData,
        });
      }

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error(`Error updating profile for user ${req.params.id}:`, error);
      res.status(500).json({ error: "An error occurred while updating the profile" });
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


// Route to handle celebrity onboarding process
router.put(
  "/celeb/onboard",
  upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "documentPic", maxCount: 1 },
    { name: "documentPicWithFace", maxCount: 1 },
  ]),
  uploadVerficationToS3,
  async (req, res) => {
    try {
      const { bio, category, price, profession, uid } = JSON.parse(req.body.onBoardData);
      const profileImg = req.profileImg;

      const updatedCeleb = await prisma.celeb.update({
        where: { uid },
        data: {
          description: bio,
          category,
          price: parseInt(price),
          completed_onboarding: true,
          imgurl: profileImg,
          // profession,
        },
      });

      await indexNewCeleb(uid);

      const stripeAccount = await createStripeCustomAccount(updatedCeleb.email, uid, updatedCeleb.displayname);

      // update stripe account id in database

      if (stripeAccount) {
        await prisma.celeb.update({
          where: {
            uid: result.uid,
          },
          data: {
            stripe_account_id: stripeAccount.id,
          },
        });
      }

      res.status(200).json({ message: "Celebrity onboarding completed successfully", celeb: updatedCeleb });
    } catch (error) {
      console.error("Error during celebrity onboarding:", error);
      res.status(500).json({ error: "An error occurred during onboarding" });
    }
  }
);


// update email
router.put("/login/email/:id", async (req, res) => {
  const { id } = req.params;
  const { email: oldEmail, status } = req.body;
  const { email: newEmail, displayName } = req.body.data;

  try {
    const updateResult = await updateEmail(oldEmail, newEmail);
    console.log("updateResult: ", updateResult);
    if (!updateResult.success) {
      console.log("updateResult: ", updateResult);
      return res.status(400).json({ message: updateResult.message });
    }


    if (status === "celeb") {
      await prisma.celeb.update({
        where: { uid: id },
        data: {
          email: newEmail,
          displayname: displayName,
        },
      });
    } else {
      await prisma.fan.update({
        where: { uid: id },
        data: { email: newEmail },
      });
    }

    res.status(201).json({ message: updateResult.message });
  } catch (error) {
    console.error(`Error updating email for ${status} with id ${id}:`, error);
    res.status(500).json({ error: "An error occurred while updating the email" });
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
