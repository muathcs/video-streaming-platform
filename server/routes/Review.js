import { prisma } from "../index.js";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("req: ", req.body);
  const { review, fanuid, celebuid, event, date, name, rating } = req.body;
  try {
    const result = await prisma.review.create({
      data: {
        message: review,
        reviewer_id: fanuid,
        reviewed_id: celebuid,
        event,
        Date: date,
        reviewer_name: name,
        rating,
      },
    });
  } catch (error) {
    console.log("/reviews: ", error);
  }
});

router.put("/", async (req, res) => {
  console.log("herexxx", req.body);
  const { requestid, uid } = req.body;

  try {
    const result = await prisma.requests.update({
      where: {
        requestid: requestid,
      },
      data: {
        reqstatus: "rejected",
      },
    });

    const pendinRequests = await prisma.requests.findMany({
      where: {
        reqstatus: "pending",
        celebuid: uid,
      },
      orderBy: {
        requestid: "desc",
      },
    });

    res.status(201).send(pendinRequests);
  } catch (error) {
    console.log("revewPut: ", error);
  }
});

router.get("/", async (req, res) => {
  console.log("reqTest: ", req.query);
  const { uid } = req.query;
  try {
    const result = await prisma.review.findMany({
      where: {
        reviewed_id: uid, // for now reviewed can only be a celeb, but I chose reviewed instead of celeb incase in the future I want to add feature to allow celebs to reviews users.
      },
      orderBy: {
        Date: "asc",
      },
    });

    console.log("res: ", result);

    res.status(201).send(result);
  } catch (error) {}
});

export default router;
