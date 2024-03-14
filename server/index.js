import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pool from "./db.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import stripe from "stripe";
// import s3 from "./s3.js";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import crypto from "crypto";
import sharp from "sharp";
import s3, { AWS_LINK, uploadFile } from "./s3.js";
import { createTheCelebs } from "./wikidata.js";
import { updateEmail, updatePassword } from "./fireBaseAdmin.js";
import e from "express";
import { send } from "process";
import { celebrityNames } from "./celebName.js";
import { userInfo } from "os";
import CelebRoute from "./routes/Celebs.js";
import FanRoute from "./routes/Fan.js";
import RequestRoute from "./routes/Request.js";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

// const result = await prisma.$executeRaw`
//   UPDATE "Celeb"
//   SET document_with_idx = TO_TSVECTOR('simple', displayname);
// `;

// createTheCelebs();
const app = express();

const PORT = process.env.PORT || 3001;
app.use(express.json());

const allowedOrigins = [
  "https://vid-stream-cl.onrender.com",
  "http://localhost:5173",
  "https://195.201.26.157",
  "https://116.203.134.67",
  "https://116.203.129.16",
  "https://23.88.105.37",
  "https://128.140.8.200",
  "https://console.cron-job.org/jobs/4875267",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    maxAge: 7200,
  })
);

app.use(bodyParser.json());
app.use(express.static("public"));
// multer middleware
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const client = await pool.connect();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// random image key generator for s3 storage
const randomImageName = () => crypto.randomBytes(32).toString("hex");

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { items } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: 1400,
      currency: "eur",

      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: false,
      },
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("/create-stripe: ", error);
  }
});

// app.get("/config", upload.single("file"), async (req, res) => {
//   res.send({
//     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
//   });
// });

app.use("/celebs", CelebRoute);
app.use("/fan", FanRoute);
app.use("/request", RequestRoute);

// app.get("/celebs", async (req, res) => {
//   //query celeb table by category
//   const { category } = req.params;

//   try {
//     const result = await prisma.celeb.findMany();
//     // client.release(); // Release the connection back to the pool

//     res.send(result);
//   } catch (error) {
//     console.log("error/celebs: ", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get("/celeb/:id", async (req, res) => {
//   const { id } = req.params;

//   console.log("id: ", id);

//   try {
//     const response = await prisma.celeb.findUnique({
//       where: {
//         uid: id,
//       },
//     });
//     // const response = await pool.query("Select * from celeb where uid = $1", [
//     //   id,
//     // ]);

//     res.send(response);
//   } catch (error) {
//     console.log("/celeb/id: ", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get("/fan/:uid", async (req, res) => {
//   const { uid } = req.params;

//   try {
//     const response = await prisma.fan.findUnique({
//       where: {
//         uid: uid,
//       },
//     });
//     // const response = await pool.query(
//     //   'Select * from public."Fan" where uid = $1',
//     //   [uid]
//     // );

//     res.send(response);
//   } catch (error) {
//     console.log("/celeb/id: ", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get("/celebs/:category", async (req, res) => {
//   //query celeb table by category
//   let { category } = req.params;

//   console.log("category: ", category);

//   // category = category.toLocaleLowerCase(); // to match db

//   try {
//     const result = await prisma.celeb.findMany({
//       where: {
//         category: {
//           equals: category,
//           mode: "insensitive",
//         },
//       },
//     });

//     console.log("result: ", result);
//     // const result = await pool.query("SELECT * FROM celeb where category = $1", [
//     //   category,
//     // ]);
//     // client.release(); // Release the connection back to the pool

//     // console.log("res: ", result.rows);

//     res.send(result);
//   } catch (error) {
//     console.log("error/celeb/cat: ", error);
//     res.status(500).json({ error: error.message });
//   }
// });

//is a celeb or not
app.get("/status", async (req, res) => {
  const uid = req.query.uid;

  try {
    const result = await prisma.celeb.findUnique({
      where: {
        uid: uid,
      },
    });

    // const result = await pool.query(
    //   'SELECT * FROM public."Celeb" WHERE uid = $1',
    //   [uid]
    // );
    if (result) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.log("/status: ", error);
  }
});

app.get("/dashboard", async (req, res) => {
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

// app.get("/fanrequests", async (req, res) => {
//   const { uid } = req.query;

//   try {
//     // this queries all the requests that match the get query uid. Basically when a fan clicks there on there requests this retrieves them

//     const response = await prisma.requests.findMany({
//       select: {
//         celebmessage: true,
//         requestid: true,
//         message: true,
//         reqtype: true,
//         reqaction: true,
//         timestamp1: true,
//         reqstatus: true,
//         celebuid: true,
//         fanuid: true,
//         celebuid: true,
//       },
//       where: {
//         fanuid: uid,
//       },
//       orderBy: {
//         requestid: "asc",
//       },
//     });

//     const check = await pool.query(
//       `select * from public."Requests" where fanuid = $1`,
//       [uid]
//     );
//     console.log("check: ", check.rows);
//     console.log("uid: ", uid);

//     //array that will be sent back to the response, it's made up of objects of the individual request + celeb info(photo, name)
//     let reqAndCeleb = [];

//     // when the user clicks on the requests, I want the individual requests to have the image of the celeb they requested and their name.
//     // note: I chose not to add this info(celeb name/photo) to the request table.
//     // on the requests table, and that's enough to get the celeb photo/name from the code below.

//     // console.log("res: ", response);
//     if (response.length == 0) {
//       return res.send(reqAndCeleb);
//     }
//     for (const req of response) {
//       try {
//         const celebNameAndPhoto = await prisma.celeb.findUnique({
//           select: {
//             uid: true,
//             displayname: true,
//             imgurl: true,
//           },
//           where: {
//             uid: req.celebuid,
//           },
//         });

//         // const celebNameAndPhoto = await pool.query(
//         //   "SELECT uid, displayName, imgUrl FROM celeb WHERE uid = $1 ",
//         //   [req.celebuid]
//         // );

//         const combinedObject = {
//           request: req,
//           celeb: celebNameAndPhoto,
//         };

//         reqAndCeleb.push(combinedObject);
//       } catch (error) {
//         console.log("/fanReq/map: ", error);
//       }
//     }

//     // Use Promise.all to wait for all promises to be resolved
//     await Promise.all(reqAndCeleb);

//     // const celebUidFromRequest = response.rows

//     res.send(reqAndCeleb);
//   } catch (error) {
//     console.log("/fanrequests: ", error);
//   }
// });

app.put("/fulfill/:id", upload.single("videoFile"), async (req, res) => {
  const itemId = req.params.id; // Parse the id parameter as an integer

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

//post

async function uploadProfileImgToS3(req, res, next) {
  let { id } = req.params;
  let { uid, imgurl } = req.body;

  if (!imgurl && id) {
    // this function checks if we're updating the img or setting it for the first time. So, if the imgurl doesn't exist but the id does this mean the account is updating the img
    // if this case
    imgurl = `profile/user(${id})`;
  }

  const file = req.file;

  if (!file) {
    //just incase the above passes because the firebase account is created beofre the user and so the id may still exist, this will quit the middle ware if an img file wasnt selected.
    return next(); //insures code below doesn't run.
  }

  let newUrl = AWS_LINK + imgurl;

  try {
    const uploadProf = await uploadFile(file.buffer, imgurl, file.mimetype);
    req.newUrl = newUrl;
    next();
  } catch (error) {
    console.log("error ploadprofiletos3 middleware", error);
    res.send("unable to upload profile picture to s3 storage");
  }
}

app.post(
  "/createUser",
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    const { uid, imgurl, payLoad } = req.body;
    const payLoadParsed = JSON.parse(payLoad);
    const { displayname, email, description } = payLoadParsed;

    const newurl = req.newUrl;

    try {
      const user = await prisma.fan.create({
        data: {
          displayname: displayname,
          email: email,
          uid: uid,
          imgurl: newurl,
          description: description,
        },
      });
      // const result = await pool.query(
      //   "INSERT INTO fan(displayname, email, uid, imgurl, description) VALUES ($1, $2, $3, $4, $5)",
      //   [displayname, email, uid, newurl, description]
      // );
      res.send("Sucess crated user");
    } catch (error) {
      console.log("error/cr/user: ", error);
    }
    try {
    } catch (error) {
      console.log("error/createUser: ", error);
    }
  }
);

app.put(
  "/update/:id",
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    const { id } = req.params;
    const payLoadParsed = JSON.parse(req.body.payLoad);
    const {
      displayName,
      followers,
      price,
      email,
      category,
      description,
      imgurl,
    } = payLoadParsed;

    const test = req.newUrl;

    const newImgUrl = req.newUrl ? req.newUrl : imgurl;

    const { status } = req.body;

    if (status == "celeb") {
      try {
        const updateCeleb = await prisma.celeb.update({
          where: {
            uid: id,
          },
          data: {
            displayname: displayName,
            followers: followers,
            price: price,
            category: category,
            description: description,
            imgurl: newImgUrl,
          },
        });

        res.status(201).send({ message: "account updated" });
      } catch (error) {
        console.log("/update:id: ", error);
      }
    } else {
      try {
        const update = await prisma.fan.update({
          where: {
            uid: id,
          },
          data: {
            displayname: displayName,
            email: email,
            description: description,
            imgurl: newImgUrl,
            fav_categories: "action", // add this to the settings page
          },
        });

        res.status(201).send({ message: "account updated" });
      } catch (error) {
        console.log("/update: ", error);
      }
    }
  }
);

app.put("/update/login/email/:id", async (req, res) => {
  const { id } = req.params;
  const { email, status } = req.body;

  const { email: newEmail, password } = req.body.data;

  updateEmail(email, newEmail);

  if (status == "celeb") {
    try {
      const updateCeleb = await prisma.celeb.update({
        where: {
          uid: id,
        },
        data: {
          email: newEmail,
        },
      });

      // const response = await pool.query(
      //   "UPDATE celeb SET email=$1 WHERE uid=$2",
      //   [newEmail, id]
      // );
      res
        .status(201)
        .send({ message: "your email has been updated successfully" });
    } catch (error) {
      console.log("erorr/login/email/:id: ", error);
      res.send(error);
    }
  } else {
    try {
      const updateCeleb = await prisma.fan.update({
        where: {
          uid: id,
        },
        data: {
          email: newEmail,
        },
      });
      // const response = await pool.query(
      //   "UPDATE fan SET email=$1 WHERE uid=$2",
      //   [newEmail, id]
      // );
      res
        .status(201)
        .send({ message: "your email has been updated successfully" });
    } catch (error) {
      console.log("erorr/login/email/:id: ", error);
      res.send(error);
    }
  }
});

app.put("/update/login/password/:id", async (req, res) => {
  const { id } = req.params;
  const { newPassword, confirmNewPassword } = req.body.data;

  try {
    await updatePassword(id, newPassword);
    res.status(201).send({ message: "Your password has been reset" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// notification
app.post("/notification", async (req, res) => {
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

app.get("/notification", async (req, res) => {
  const { data: uid } = req.query;
  try {
    const response = await prisma.notification.findMany({
      where: {
        intended_uid: uid,
      },
    });

    "Select * from notification WHERE intended_uid = $1 AND is_read = $2",
      [uid, false];

    return res.send(response);
  } catch (error) {
    console.log("get/notification: ", error);
    res.status(404).send({ message: error.message });
  }
});

app.put("/notification", async (req, res) => {
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

// search

app.get("/search", async (req, res) => {
  const { name } = req.query;
  console.log("name: ", name);

  if (!name) return;
  try {
    // const response = await pool.query(
    //   "select displayname, uid from celeb where document_with_idx @@ to_tsquery($1) order by ts_rank(document_with_idx, plainto_tsquery($1))",
    //   [name]
    const response = await pool.query(
      `SELECT *, ts_rank(document_with_idx, to_tsquery('simple', $1 || ':*')) AS rank FROM public."Celeb" WHERE document_with_idx @@ to_tsquery('simple', $1 || ':*') ORDER BY CASE WHEN lower(substring(displayname from 1 for 1)) = lower($1) THEN 1 ELSE 2 END, CASE WHEN lower(substring(displayname from 1 for 1)) = lower($1) THEN substring(displayname from 3) END, rank DESC`,
      [name]
    );

    console.log("search: ", response);

    res.status(201).send(response.rows);

    // console.log("response: ", response.rows);
  } catch (error) {
    console.log("/search: ", error);
    res.status(401).send();
  }
});

app.put("/test", upload.single("videoFile"), async (req, res) => {});

app.post("/request", async (req, res) => {
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

app.post("/review", async (req, res) => {
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

app.put("/review", async (req, res) => {
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

app.get("/reviews", async (req, res) => {
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

async function indexNewCeleb(uid) {
  const result = await prisma.$executeRaw`
  UPDATE "Celeb"
  SET document_with_idx = TO_TSVECTOR('simple', displayname)
  WHERE uid = ${uid};
`;
}
// this path is reached, if someone signs up as a celeb
// a different path createuser if user signs up as normal user not a celeb
app.post(
  "/createCeleb",
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    const { uid, imgurl } = req.body;

    const payload = JSON.parse(req.body.payLoad);

    const newImg = req.newUrl;

    // console.log("payload: ", payload);

    const {
      displayName,
      username,
      followers,
      account,
      category,
      price,
      email,
      description,
    } = payload;

    try {
      const result = await prisma.celeb.create({
        data: {
          displayname: displayName,
          username: username,
          followers: parseInt(followers),
          account: account,
          category: category,
          price: parseInt(price),
          email: email,
          description: description,
          uid: uid,
          imgurl: newImg,
        },
      });

      await indexNewCeleb(uid);

      res.send("Thank you");
    } catch (error) {
      console.log(error);
      res.send("Failed");
    }
  }
);

app.listen(PORT, () => {
  console.log("listing on...", PORT);
});

// custom middleware functions
