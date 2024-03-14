import pool from "../db.js";
import { prisma } from "../index.js";
import express from "express";
import { upload } from "./Fan.js";
import crypto from "crypto";

const router = express.Router();

const randomImageName = () => crypto.randomBytes(32).toString("hex");

router.get("/fanrequests", async (req, res) => {
  console.log("hereFXX");
  const { uid } = req.query;

  try {
    // this queries all the requests that match the get query uid. Basically when a fan clicks there on there requests this retrieves them

    const response = await prisma.requests.findMany({
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
      },
      where: {
        fanuid: uid,
      },
      orderBy: {
        requestid: "asc",
      },
    });

    const check = await pool.query(
      `select * from public."Requests" where fanuid = $1`,
      [uid]
    );
    console.log("check: ", check.rows);
    console.log("uid: ", uid);

    //array that will be sent back to the response, it's made up of objects of the individual request + celeb info(photo, name)
    let reqAndCeleb = [];

    // when the user clicks on the requests, I want the individual requests to have the image of the celeb they requested and their name.
    // note: I chose not to add this info(celeb name/photo) to the request table.
    // on the requests table, and that's enough to get the celeb photo/name from the code below.

    // console.log("res: ", response);
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
        console.log("/fanReq/map: ", error);
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

  price = parseInt(price);
  try {
    const result = await prisma.requests.create({
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

router.put("/fulfill/:id", upload.single("videoFile"), async (req, res) => {
  const itemId = req.params.id; // Parse the id parameter as an integer

  console.log("on this one now");

  // resize image
  // const buffer = await sharp(req.file.buffer)
  //   .resize({ height: 1920, width: 1080, fit: "contained" })
  //   .toBuffer();

  // if this if false, it means the we're sending an message text, instead of a audio, or video.

  if (!req.body.state) {
    try {
      const { celebReply } = req.body;

      const response = await prisma.requests.update({
        where: {
          requestid: itemId,
        },
        data: {
          reqstatus: "fulfilled",
          celebmessage: celebReply,
        },
      });

      // const response = await pool.query(
      //   "UPDATE requests SET reqstatus = $1, celebmessage = $2 WHERE requestid = $3 ",
      //   ["fulfilled", celebReply, itemId]
      // );
      res.status(200);
      return res.status(200).send("Message Updated successful");
    } catch (error) {
      console.log("error/put/fulfill/message: ", error);
    }
  }
  const state = JSON.parse(req.body.state);

  try {
    if (state.reqtype == "video" || state.reqtype == "audio") {
      const file = req.file; // we get this file, because we're sending a form data.
      const key = `video/${Date.now()}-${randomImageName()}.webm`;

      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const sender = await uploadFile(file.buffer, key, file.mimetype);

      // const command = new PutObjectCommand(params);
      // const upload = await s3.send(command);

      // // Construct the URL of the uploaded video
      const videoUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      // console.log("iditem: ::: ", itemId);

      const response = await prisma.requests.update({
        where: {
          requestid: itemId,
        },
        data: {
          reqstatus: "fulfilled",
          celebmessage: videoUrl,
        },
      });
      // const response = await pool.query(
      //   "UPDATE requests SET reqstatus = $1, celebmessage = $2 WHERE requestid = $3 ",
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
  try {
    const response = await prisma.requests.findMany({
      where: {
        reqstatus: "pending",
        celebuid: uid,
      },
      orderBy: {
        requestid: "desc",
      },
    });
    // const response = await pool.query(
    //   "SELECT * from Requests WHERE reqstatus = $1 AND celebUid = $2 ORDER BY requestid DESC",
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
