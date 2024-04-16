import { prisma } from "../index.js";
import express from "express";

const router = express.Router();

// notification
router.post("/", async (req, res) => {
  const { intended_uid, sender_uid, message } = req.body;

  try {
    const response = await prisma.notification.create({
      data: {
        intended_uid: intended_uid,
        sender_uid: sender_uid,
        message: message,
      },
    });
    // const response = await pool.query(
    //   'INSERT INTO public."Notification"(intended_uid,sender_uid, message) VALUES ($1, $2, $3)',
    //   [intended_uid, sender_uid, message]
    // );

    res.status(200).send({ message: "notification has been made" });
  } catch (error) {
    console.log("error/notification: ", error);
  }
});

router.get("/", async (req, res) => {
  const { data: uid } = req.query;
  try {
    const response = await prisma.notification.findMany({
      where: {
        intended_uid: uid,
        is_read: false,
      },
    });

    // "Select * from notification WHERE intended_uid = $1 AND is_read = $2",
    //   [uid, false];

    return res.send(response);
  } catch (error) {
    console.log("get/notification: ", error);
    res.status(404).send({ message: error.message });
  }
});

router.put("/", async (req, res) => {
  const { uid } = req.body;

  console.log("uid: ", uid);

  try {
    const response = await prisma.notification.updateMany({
      where: {
        intended_uid: uid,
      },
      data: {
        is_read: true,
      },
    });
    // const response = pool.query(
    //   "UPDATE notification SET is_read = true WHERE intended_uid = $1 ",
    //   [uid]
    // );
  } catch (error) {
    res.status(401).send({ message: "could not update notification table" });
  }
});

export default router;
