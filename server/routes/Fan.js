import { prisma } from "../index.js";
import express from "express";

const router = express.Router();

router.get("/:uid", async (req, res) => {
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

    res.send(response);
  } catch (error) {
    console.log("/celeb/id: ", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
