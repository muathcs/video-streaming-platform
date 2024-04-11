import { prisma } from "../index.js";
import express from "express";
import { upload } from "./Fan.js";
import { uploadProfileImgToS3 } from "../s3.js";

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("paramszz: ", req.query);
  //query celeb table by category

  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided
  const offset = (page - 1) * pageSize; // Calculate the offset based on page number and page size
  const { category } = req.params;

  // console.log("react nativex", req.query);

  try {
    const result = await prisma.celeb.findMany({
      skip: offset,
      take: pageSize,
    });
    // const result = await prisma.celeb.findMany();
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

  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided
  const offset = (page - 1) * pageSize; // Calculate the offset based on page number and page size

  console.log("category: ", category);

  // category = category.toLocaleLowerCase(); // to match db

  try {
    const result = await prisma.celeb.findMany({
      skip: offset,
      take: pageSize,
      where: {
        category: {
          equals: category,
          mode: "insensitive",
        },
      },
    });

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

    console.log("creating a cleeb");

    const payload = JSON.parse(req.body.payLoad);

    const newImg = req.newUrl;

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
export async function indexNewCeleb(uid) {
  console.log("indexinggggggggggggggggggggggg");
  const result = await prisma.$executeRaw`
    UPDATE "Celeb"
    SET document_with_idx = TO_TSVECTOR('simple', displayname)
    WHERE uid = ${uid};
  `;
}

export default router;
