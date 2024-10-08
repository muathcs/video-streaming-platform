import { prisma } from "../index.js";
import express from "express";

const router = express.Router();

router.get("/id/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const response = await prisma.fan.findUnique({
      where: {
        uid: uid,
      },
    });
    // const response = await pool.query(
    //   'Select * from public."Fan" where uid = $1',
    //   [uid]
    // );

    console.log("here: ", response);
    res.send(response);
  } catch (error) {
    console.log("/celeb/id: ", error);
    res.status(500).json({ error: error.message });
  }
});

//checks the status of the logged in user, if they're a celeb or a fan: to display appropriate components
router.get("/status", async (req, res) => {
  const uid = req.query.uid;

  if (!uid) {
    return res.status(400).send({ error: "UID is required" });
  }

  try {
    const result = await prisma.celeb.findUnique({
      where: {
        uid: uid,
      },
      select: {
        completed_onboarding: true,
      },
    });

    // const result = await pool.query(
    //   'SELECT * FROM public."Celeb" WHERE uid = $1',
    //   [uid]
    // );
    if (result) {
      console.log("true: ", result);
      res.status(200).send({
        isCeleb: true,
        completed_onboarding: result.completed_onboarding,
      });
    } else {
      console.log("false");
      res.status(200).send({ isCeleb: false });
    }
  } catch (error) {
    console.log("/status: ", error);
  }
});

export default router;
