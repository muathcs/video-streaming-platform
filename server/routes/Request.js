import { prisma } from "../index.js";
import express from "express";
import { upload } from "./Fan.js";
import crypto from "crypto";
import { uploadFile } from "../s3.js";
import { PayCeleb, refundFan } from "../actions/actions.js";
import { createNotification } from "./Notification.js";
import { updateFanClusterIdAndTotalSpent } from "../services/requestService.js";

const router = express.Router();

const randomImageName = () => crypto.randomBytes(32).toString("hex");

router.get("/fanrequests", async (req, res) => {
  const { uid } = req.query;

  console.log("query: ", req.query);

  console.log("iod: ", uid);

  try {
    // this queries all the request that match the query uid. when a fan clicks  on the request this retrieves them
    const response = await prisma.request.findMany({
      where: {
        fanuid: uid,
      },
      select: {
        celebmessage: true,
        requestid: true,
        message: true,
        reqtype: true,
        reqaction: true,
        timestamp1: true,
        reqstatus: true,
        celebuid: true,
        fanuid: true,
        celebuid: true,
        fromperson: true,
        price: true,
        isReviewed:true,
      },
      orderBy: {
        timestamp1: "desc",
      },
    });

    // console.log("res: ", response);

    // const check = await pool.query(
    //   `select * from public."request" where fanuid = $1`,
    //   [uid]
    // );

    //array that will be sent back to the response, it's made up of objects of the individual request + celeb info(photo, name)
    let reqAndCeleb = [];

    // when the user clicks on the request, I want the individual requests to have the image of the celeb they requested and their name.
    // note: I chose not to add this info(celeb name/photo) to the request table.
    // on the requests table, and that's enough to get the celeb photo/name from the code below.

    if (response.length == 0) {
      return res.send(reqAndCeleb);
    }
    for (const req of response) {
      try {
        const celebNameAndPhoto = await prisma.celeb.findUnique({
          select: {
            uid: true,
            displayname: true,
            imgurl: true,
            price:true
          },
          where: {
            uid: req.celebuid,
          },
        });

        // const celebNameAndPhoto = await pool.query(
        //   "SELECT uid, displayName, imgUrl FROM celeb WHERE uid = $1 ",
        //   [req.celebuid]
        // );

        const combinedObject = {
          request: req,
          celeb: celebNameAndPhoto,
        };

        reqAndCeleb.push(combinedObject);
      } catch (error) {
        // console.log("/fanReq/map: ", error.message);
      }
    }

    // Use Promise.all to wait for all promises to be resolved
    await Promise.all(reqAndCeleb);

    // const celebUidFromRequest = response.rows

    res.send(reqAndCeleb);
  } catch (error) {
    console.log("/fanrequests: ", error);
  }
});

// create the request.
router.post("/", async (req, res) => {

  // console.log("onside post requ: ", req.body)
  
  let {
    celebuid,
    fanuid,
    price,
    message, //
    requestAction, //
    toSomeOneElse, //
    reqType, //
    fromPerson, //
    toPerson, //
    requestid,
    paymentId
  } = req.body;

  console.log("uid:TOP:: ", celebuid)

  price = parseInt(price);

  try {
    // create a request from the req body.

    // check if requests exists first, if it does do not make a new req.

    const reqExists = await prisma.request.findUnique({
      where: {
        requestid,
      },
    });



    // to prevent double charge when reloading success page. 
    if (reqExists) {
      console.log("req exists");
      return res.status(201).send("Req already exist");
    }

    console.log("before req is created!")
  
    const result = await prisma.request.create({
      data: {
        requestid: requestid,
        celebuid: celebuid,
        fanuid: fanuid,
        price: price,
        message: message || '', // Ensure message is a valid string, empty string as fallback
        reqstatus: "pending",
        reqtype: reqType,
        timestamp1: new Date(),
        reqaction: requestAction,
        tosomeoneelse: toSomeOneElse === 'true', // Explicit conversion of 'false'/'true'
        fromperson: fromPerson || '', // Ensure fromPerson is a valid string, empty string as fallback
        toperson: toPerson || '', // Ensure toPerson is a valid string, empty string as fallback
        paymentId: paymentId || '', // Ensure paymentId is valid
      },
    });

    console.log("checkUID: ", celebuid)


    // increment num of reqs a celeb has. 
    const updatedCeleb = await prisma.celeb.update({
      where: {
        uid:celebuid
      },
      data: {
        request_num: {
          increment:1
        },
      },
    });

    console.log("updateCeleb: ", updatedCeleb)

    //this function creates an unread notification
    createNotification(celebuid, fanuid, "user has made a request");

    updateFanClusterIdAndTotalSpent(celebuid, fanuid, price);

    res.status(201).send("succesfully added a request");
  } catch (error) {
    res.status(401).json(error);
    console.log("/requestxxx", error);
  }
});

router.get("/status/:id", async (req, res) => {
  const { id: requestId } = req.params;

  try {
    const response = await prisma.request.findUnique({
      where: {
        requestid: requestId,
      },
    });

    console.log("response: ", response.processed);

    if (response) {
      console.log("response: ", response.processed);
      const processed = response.processed;
      res.status(201).send({ processed });
    } else {
      res.status(404).send({ error: "Request not found" });
    }
  } catch (error) {
    console.log("/status/:id", error);
    res.status(401).send(error);
  }
});


router.put("/expired/:id", upload.single("videoFile"), async (req, res) => {
  const requestid = req.params.id;

  console.log("id: :: ", requestid);
  try {
    const response = await prisma.request.update({
      where: {
        requestid: requestid,
      },
      data: {
        reqstatus: "expired",
      },
    });

    const paymentId = response.paymentId
    const amount = response.price

    console.log("res: ", paymentId)

    res.status(201).send("request expired")

    refundFan(paymentId,amount );
  } catch (error) {
    console.error(error);
  }
});

router.put("/reject/:requestid", async (req, res) => {
  console.log("herexxx", req.body);
  const {  uid, rejectionMessage } = req.body;
  const {requestid} = req.params
  console.log("aprams: ", requestid)
  console.log("aprams: ", req.body)


  try {
    const result = await prisma.request.update({
      where: {
        requestid: requestid,
      },
      data: {
        reqstatus: "rejected",
        rejectionMessage:rejectionMessage
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
    res.status(500).send({error: "An error occurred while rejecting the request."})
  }
});


router.put("/fulfill/:id", upload.single("videoFile"), async (req, res) => {
  const itemId = req.params.id; // Parse the id parameter as an integer
  console.log("reqid: ", itemId);

  console.log("\nreqFul: ", req.file);
  const file = req.body;

  // const buffer = await sharp(req.file.buffer)
  //   .resize({ height: 1920, width: 1080, fit: "contained" })
  //   .toBuffer();

  // for messages not videos
  if (!req.body.state) {
    try {
      const { celebReply } = req.body;

      const response = await prisma.request.update({
        where: {
          requestid: itemId,
        },
        data: {
          reqstatus: "fulfilled",
          celebmessage: celebReply,
        },
      });

      // PayCeleb(amount, response.price);

      // const response = await pool.query(
      //   "UPDATE request SET reqstatus = $1, celebmessage = $2 WHERE requestid = $3 ",
      //   ["fulfilled", celebReply, itemId]
      // );
      res.status(200);
      return res.status(200).send("Message Updated successful");
    } catch (error) {
      console.log("error/put/fulfill/message: ", error);
    }
  }

  //video or audio
  const state = JSON.parse(req.body.state); //parse the state, which contains information about the req like requestuid, celeb and fan uid...
console.log("statex: ", state)
  try {
    if (state.reqtype == "video" || state.reqtype == "audio") {
      const file = req.file; // this contains the actual audio/video
      const key = `video/${Date.now()}-${randomImageName()}.mp4`; // this is the key/name that will be saved on AWS

      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      //upload to AWS
      const sender = await uploadFile(file.buffer, key, file.mimetype);

      //now updated the database

      // const command = new PutObjectCommand(params);
      // const upload = await s3.send(command);

      // // Construct the URL of the uploaded video
      const videoUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`; // will be saved in our db, under celebMessage of request table.

      // console.log("iditem: ::: ", itemId);

      const response = await prisma.request.update({
        where: {
          requestid: itemId, //requestid
        },
        data: {
          reqstatus: "fulfilled",
          celebmessage: videoUrl,
        },
      });

      const {stripe_account_id} = await prisma.celeb.findUnique({
        where:{
          uid:state.celebuid
        },
        select:{
          stripe_account_id:true
        }
      })

      console.log("stripe: ", stripe_account_id)

      // pay Celeb

      await PayCeleb(state.price, stripe_account_id);
      // const response = await pool.query(
      //   "UPDATE request SET reqstatus = $1, celebmessage = $2 WHERE requestid = $3 ",
      //   ["fulfilled", videoUrl, itemId]
      // );

      res.status(200);
    }
  } catch (error) {
    console.log(error);
  }
  console.log("reqid: ", itemId);
});

// this gets all the request for a specific celeb's dashboard so they can be fulfilled.
router.get("/dashboard", async (req, res) => {
  const uid = req.query.data;

  console.log("\n\n\nuid: ", uid);

  try {
    const response = await prisma.request.findMany({
      where: {
        reqstatus: "pending",
        celebuid: uid,
      },
      orderBy: {
        timestamp1: "desc",
      },
    });

    // const response = await pool.query(
    //   "SELECT * from request WHERE reqstatus = $1 AND celebUid = $2 ORDER BY requestid DESC",
    //   ["pending", uid]
    // );

    res.send(response);
  } catch (error) {
    console.log("/dasshboard", error);
  }
});

export default router;

// import { prisma } from "../index.js";
// import express from "express";

// const router = express.Router();
// export default router;