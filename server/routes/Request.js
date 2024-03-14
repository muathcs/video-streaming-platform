import pool from "../db.js";
import { prisma } from "../index.js";
import express from "express";

const router = express.Router();

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
export default router;

// import { prisma } from "../index.js";
// import express from "express";

// const router = express.Router();
// export default router;
