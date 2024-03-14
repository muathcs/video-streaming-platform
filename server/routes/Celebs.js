import { prisma } from "../index.js";
import express from "express";
import { upload } from "./Fan.js";
import { uploadProfileImgToS3 } from "../s3.js";

const router = express.Router();

router.get("/", async (req, res) => {
  //query celeb table by category
  const { category } = req.params;

  try {
    const result = await prisma.celeb.findMany();
    // client.release(); // Release the connection back to the pool

    res.send(result);
  } catch (error) {
    console.log("error/celebs: ", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/category/:category", async (req, res) => {
  console.log("hereXXXX");
  //query celeb table by category
  let { category } = req.params;

  console.log("category: ", category);

  // category = category.toLocaleLowerCase(); // to match db

  try {
    const result = await prisma.celeb.findMany({
      where: {
        category: {
          equals: category,
          mode: "insensitive",
        },
      },
    });

    console.log("result: ", result);
    // const result = await pool.query("SELECT * FROM celeb where category = $1", [
    //   category,
    // ]);
    // client.release(); // Release the connection back to the pool

    // console.log("res: ", result.rows);

    res.send(result);
  } catch (error) {
    console.log("error/celeb/cat: ", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  console.log("id: ", id);

  try {
    const response = await prisma.celeb.findUnique({
      where: {
        uid: id,
      },
    });

    console.log("response: ", response);
    // const response = await pool.query("Select * from celeb where uid = $1", [
    //   id,
    // ]);

    res.send(response);
  } catch (error) {
    console.log("/celeb/id: ", error);
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/createCeleb",
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    const { uid, imgurl } = req.body;

    const payload = JSON.parse(req.body.payLoad);

    const newImg = req.newUrl;

    console.log("creating a celeb: ");

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

      await indexNewCeleb(uid); //indexing for text search

      res.send("Thank you");
    } catch (error) {
      console.log(error);
      res.send("Failed");
    }
  }
);

// this function adds an index to every celeb entry, this helps with the postgres text search
async function indexNewCeleb(uid) {
  const result = await prisma.$executeRaw`
    UPDATE "Celeb"
    SET document_with_idx = TO_TSVECTOR('simple', displayname)
    WHERE uid = ${uid};
  `;
}

export default router;
