import { prisma } from "../index.js";
import express from "express";

const router = express.Router();

export async function createNotification(intended_uid, sender_uid, message) {
  try {
    const response = await prisma.notification.create({
      data: {
        intended_uid: intended_uid,
        sender_uid: sender_uid,
        message: message,
      },
    });
  } catch (error) {
    console.log("error/notification: ", error);
  }
}

// Create a new notification
router.post("/", async (req, res) => {
  const { intended_uid, sender_uid, message } = req.body;

  try {
    await createNotification(intended_uid, sender_uid, message);
    res.status(201).json({ message: "Notification has been created" });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

router.get("/", async (req, res) => {
  const { data:uid } = req.query;




  if (!uid) {
    console.log("returning ...")
    return res.status(400).json({ error: "Missing required parameter: uid" });
  }

  try {
    const response = await prisma.notification.findMany({
      where: {
        intended_uid: uid,
        // is_read: false,
      },
    });


    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
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

    if (response.count > 0) {
      res.status(200).json({ message: "Notifications updated successfully", updatedCount: response.count });
    } else {
      res.status(404).json({ message: "No notifications found for the given uid" });
    }
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).json({ message: "Could not update notification table", error: error.message });
  }
});

export default router;
