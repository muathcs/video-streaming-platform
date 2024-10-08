import pool from "../db.js";
import { prisma } from "../index.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  let { name } = req.query;

  console.log("name: ", name);
  name = name.replace(/ /g, "");
  console.log("search...")

  if (!name) return;
  try {
    // const response = await pool.query(
    //   "select displayname, uid from celeb where document_with_idx @@ to_tsquery($1) order by ts_rank(document_with_idx, plainto_tsquery($1))",
    //   [name]
    // const response = await pool.query(
    //   `SELECT *, ts_rank(document_with_idx, to_tsquery('simple', $1 || ':*')) AS rank FROM public."Celeb" WHERE document_with_idx @@ to_tsquery('simple', $1 || ':*') ORDER BY CASE WHEN lower(substring(displayname from 1 for 1)) = lower($1) THEN 1 ELSE 2 END, CASE WHEN lower(substring(displayname from 1 for 1)) = lower($1) THEN substring(displayname from 3) END, rank DESC`,
    //   [name]
    // );
    const searchQuery = await prisma.$queryRaw`
    SELECT celebid, displayname, username, followers, price, rating, uid, imgurl, 
      ts_rank(document_with_idx, to_tsquery('simple', ${name} || ':*')) AS rank 
    FROM public."Celeb" 
    WHERE document_with_idx @@ to_tsquery('simple', ${name} || ':*')
    ORDER BY 
      CASE 
        WHEN lower(substring(displayname from 1 for 1)) = lower(${name}) THEN 1 
        ELSE 2 
      END, 
      CASE 
        WHEN lower(substring(displayname from 1 for 1)) = lower(${name}) 
        THEN substring(displayname from 3) 
      END, 
      rank DESC;
  `;

  console.log("search: ", searchQuery)
  

    res.status(201).send(searchQuery);

    // console.log("response: ", response.rows);
  } catch (error) {
    console.log("/search: ", error);
    res.status(401).send();
  }
});

export default router;
