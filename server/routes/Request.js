import pool from "../db.js";
import { prisma } from "../index.js";
import express from "express";
import { upload } from "./Fan.js";
import crypto from "crypto";
import { uploadFile } from "../s3.js";

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

router.post("/", async (req, res) => {
  console.log("here");
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
  } = req.body;

  console.log("request: ", req.body);

  price = parseInt(price);
  try {
    const result = await prisma.request.create({
      data: {
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

    console.log("celebuid: ", celebUid);
    console.log("fanuid: ", fanUid);

    const getCelebCluster = await prisma.celeb.findFirst({
      where: {
        uid: celebUid,
      },
      select: {
        cluster_id: true,
      },
    });

    console.log("cluster id: ", getCelebCluster);

    const { cluster_id } = getCelebCluster;

    const addUserFavCat = await prisma.fan.update({
      where: {
        uid: fanUid,
      },
      data: {
        fav_categories: cluster_id,
      },
    });

    console.log("result: ", result);
    //update total spent for a specific Fan.
    const updateTotalSpent = await prisma.fan.update({
      data: {
        total_spent: {
          increment: price,
        },
        num_of_requests: {
          increment: 1,
        },
      },
      where: {
        uid: fanUid,
      },
    });
    // const result = await pool.query(
    //   "INSERT INTO Requests(celebUid, fanUid, price, message, reqstatus, reqtype, timeStamp1, reqaction, tosomeoneelse, fromperson, toperson) Values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
    //   [
    //     celebUid,
    //     fanUid,
    //     price,
    //     message,
    //     "pending",
    //     reqType,
    //     new Date(),
    //     requestAction,
    //     toSomeOneElse,
    //     fromPerson,
    //     toPerson,
    //   ]
    // );

    res.send("succesfully added a request");
  } catch (error) {
    console.log("/request", error.message);
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
  } catch (error) {}
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
