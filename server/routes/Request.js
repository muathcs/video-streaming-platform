import pool from "../db.js";
import { prisma } from "../index.js";
import express from "express";
import { upload } from "./Fan.js";
import crypto from "crypto";
import { uploadFile } from "../s3.js";
import { PayCeleb, refundFan } from "../actions/actions.js";
import { createNotification } from "./Notification.js";

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
      },
      orderBy: {
        requestid: "asc",
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

async function sendRequest(intended_uid, sender_uid, message) {
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

// create the request.
router.post("/", async (req, res) => {

  console.log("onside post requ")
  
  let {
    celebUid,
    fanUid,
    price,
    message, //
    requestAction, //
    toSomeOneElse, //
    reqType, //
    fromPerson, //
    toPerson, //
    requestid,
  } = req.body;

  price = parseInt(price);

  try {
    // create a request from the req body.

    // check if requests exists first, if it does do not make a new req.

    const reqExists = await prisma.request.findUnique({
      where: {
        requestid,
      },
    });

    if (reqExists) {
      console.log("req exists");
      return res.status(201).send("Req already exist");
    }

    const result = await prisma.request.create({
      data: {
        requestid,
        celebuid: celebUid,
        fanuid: fanUid,
        price: price,
        message: message,
        reqstatus: "pending",
        reqtype: reqType,
        timestamp1: new Date(),
        reqaction: requestAction,
        tosomeoneelse: !!toSomeOneElse,
        fromperson: fromPerson,
        toperson: toPerson,
      },
    });

    console.log("checkUID: ", celebUid)


    // update the request_num for the celeb
    const updatedCeleb = await prisma.celeb.update({
      where: {
        uid:celebUid
      },
      data: {
        request_num: {
          increment:1
        },
      },
    });

    console.log("updateCeleb: ", updatedCeleb)

    //this function creates an unread notification
    createNotification(celebUid, fanUid, "user has made a request");

    updateFanClusterIdAndTotalSpent(celebUid, fanUid, price);

    res.status(201).send("succesfully added a request");
  } catch (error) {
    res.status(401).json(error);
    console.log("/request", error.message);
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

async function updateFanClusterIdAndTotalSpent(celebUid, fanUid, price) {
  try {
    //get the cluster id of the celeb that was just reqeusted
    const getCelebCluster = await prisma.celeb.findFirst({
      where: {
        uid: celebUid,
      },
      select: {
        cluster_id: true,
      },
    });

    //destruct cluster id
    const { cluster_id } = getCelebCluster;

    //update the fan who made the request table fav_categories column, with the cluster of the id
    // const addUserFavCat = await prisma.fan.update({
    //   where: {
    //     uid: fanUid,
    //   },
    //   data: {
    //     fav_categories: cluster_id,
    //   },
    // });

    //update total spent for a specific Fan.
    // const updateTotalSpent = await prisma.fan.update({
    //   data: {
    //     total_spent: {
    //       increment: price,
    //     },
    //     num_of_requests: {
    //       increment: 1,
    //     },
    //   },
    //   where: {
    //     uid: fanUid,
    //   },
    // });
  } catch (error) {
    console.error(error);
  }
}

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

    refundFan(response.requestid, response.amount);
  } catch (error) {
    console.error(error);
  }
});

router.put("/fulfill/:id", upload.single("videoFile"), async (req, res) => {
  const itemId = req.params.id; // Parse the id parameter as an integer
  console.log("reqid: ", itemId);

  console.log("\nreqFul: ", req.file);
  const file = req.body;

  console.log("state: ", req.body);
  // if (!file) {
  //   return res.status(400).send("No file uploaded.");
  // } else {
  //   return res.status(301).send("No file uploaded.");
  // }

  // return;
  // resize image
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

      // PayCeleb(response.celebuid, response.price);

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

      // pay Celeb

      await PayCeleb();
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
