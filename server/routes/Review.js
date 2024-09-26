import { prisma } from "../index.js";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("req: ", req.body);
  const { review, fanuid, celebuid, event, date, name, rating, requestid } = req.body;

  // console.log("requestID: ", requestid)
  try {

    const {isReviewed} = await prisma.request.findUnique({
      where:{
        requestid:requestid
      },
      select:
        {
          isReviewed:true
        }
    })

    if(isReviewed){
      console.log("alreadyr review...")
      
      return res.status(201).send("You have already reviewed this request")
    }


    console.log("isReviewed: ", isReviewed)
    const result = await prisma.review.create({
      data: {
        message: review,
        reviewer_id: fanuid,
        reviewed_id: celebuid,
        requestId:requestid,
        event,
        Date: date,
        reviewer_name: name,
        rating,
      },
    });

    const updateRequest = await prisma.request.update({
      where:{
        requestid
      },
      data:{
        isReviewed:result.reviewid
      }
    })

    res.status(201).send("Request has been reviewed")
  } catch (error) {
    console.log("/reviews: ", error);
    res.status(401).send("something went wrong: ", error.message)
  }
});


router.put("/:id", async (req, res) => {

  console.log("reivew params: ", req.params)
  console.log("review body: ", req.body)
  const {id} = req.params
  const {review, rating} = req.body

  try {
    
    const response = await prisma.review.update({
      where:{
        reviewid:id
      },
      data:{
        message:review,
        rating:rating

      }
    })

    res.status(201).send()
  } catch (error) {
    
  }
})

router.put("/", async (req, res) => {
  console.log("herexxx", req.body);
  const { requestid, uid } = req.body;

  try {
    const result = await prisma.request.update({
      where: {
        requestid: requestid,
      },
      data: {
        reqstatus: "rejected",
      },
    });

    const pendinRequests = await prisma.request.findMany({
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


    res.status(201).send(result);
  } catch (error) {}
});


router.get("/:requestId", async (req, res) => {

  const {requestId} = req.params
  console.log("id:x ", requestId)
  try {
    const response = await prisma.review.findUnique({
      where:{
        requestId:requestId
      },
      select:{
        message:true,
        rating:true,

      }

    })

    console.log("response:@ ", response)
    res.status(201).json(response)
  } catch (error) {
    console.error(error)
  }
})

export default router;
