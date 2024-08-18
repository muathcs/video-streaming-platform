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
    // const result = await prisma.celeb.findMany({
    //   skip: offset,
    //   take: pageSize,
    // });
    const result = await prisma.celeb.findMany({
      where: {
        completed_onboarding: true,
      },
    });
    // client.release(); // Release the connection back to the pool

    console.log("res: ", result)
    res.send(result);
  } catch (error) {
    console.log("error/celebs: ", error);
    res.status(500).json({ error: error.message });
  }
});

//recommendations
router.get("/rec/:id", async (req, res) => {
  const { id } = req.params;

  const clusterId = parseInt(id);

  console.log("idxx: ", clusterId);
  try {
    const response = await prisma.celeb.findMany({
      where: {
        cluster_id: clusterId,
      },
      take: 5,
    });

    console.log("response=== ", response);
    res.send(response);
  } catch (error) {
    console.error(error);
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

  console.log("id: ", req.params);
  console.log("Add this to the wait, ");

  try {
    const response = await prisma.celeb.findUnique({
      where: {
        uid: id,
      },
    });

    // const response = await pool.query("Select * from celeb where uid = $1", [
    //   id,
    // ]);

    res.status(201).send(response);
  } catch (error) {
    console.log("/celeb/id: ", error);
    res.status(500).json({ error: error.message });
  }
});

// this is when the celeb created an account from the form on the website, which only fills the info partially.

router.post("/createCelebPartial", async (req, res) => {
  console.log("body: ", req.body);

  const {
    displayName,
    username,
    MostPopularApp,
    category,
    email,
    MessageToUs,
    followers: f,
    account,
    uid,
  } = req.body;
  // res.status(201).send("great");

  const followers = Number(f); // turning followers to a number
  try {
    const response = await prisma.celeb.create({
      data: {
        displayname: displayName,
        account,
        category,
        uid,
        username,
        email,
        followers,
        MostPopularApp,
        MessageToUs,
      },
    });

    console.log("response: ", response);
  } catch (error) {
    console.error(error);
  }
});

// this created a celeb account.
router.post(
  "/createCeleb",
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {
    // return;

    console.log("req[]: ", req.body.info);
    console.log("file: ", req.file);

    // const payload = JSON.parse(req.body)

    const newImg = req.newUrl;

    console.log("newImg: ", newImg);

    const {
      bio,
      category,
      profilePic,
      legalName,
      displayName,
      price,
      uid,
      email,
      app,
      description,
      inviteCode,
    } = JSON.parse(req.body.info);

    console.log("price: ", price);

    try {
      // Find the invite code
      const inviteCodeRecord = await prisma.inviteCode.findUnique({
        where: { code: inviteCode },
      });

      // throw error if it doesn't exist
      if (!inviteCodeRecord || inviteCodeRecord.is_used) {
        res.status(401).send("code doesn't exist");
        throw new Error("Invalid or already used invite code");
      }

      const result = await prisma.celeb.create({
        data: {
          displayname: displayName,
          username: legalName,
          // followers: parseInt(followers),
          // account: account,
          category,
          price: parseInt(price),
          email: email,
          description: bio,
          uid: crypto.randomUUID(),
          imgurl: newImg,
          completed_onboarding: bio ? true : false,
          inviteCode: {
            connect: {
              id: inviteCodeRecord.id,
            },
          },
        },
      });

      await indexNewCeleb(uid); //indexing for text search

      console.log("done");

      res.status(201).send("Celeb account created");
    } catch (error) {
      console.log("create a celeb", error.message);
      res.status(401).send(error.message);
    }
  }
);

router.post("/custom", async (req, res) => {
  let { inviteCode } = req.body;
  console.log("after", inviteCode);
  inviteCode = inviteCode.trim();
  console.log("after", inviteCode);

  try {
    const response = await prisma.inviteCode.findUnique({
      where: {
        code: inviteCode,
      },
      select: {
        is_used: true,
      },
    });

    // if response null

    console.log("response: ", response);
    if (!response) {
      return res.status(404).json({ error: "Code doesn't exist" });
    }

    if (response.is_used) {
      // return error
      return res.status(400).json({ error: "Code has been used" });
    }

    // await prisma.inviteCode.update({
    //   where: {
    //     code: inviteCode,
    //   },
    //   data: {
    //     is_used: true,
    //   },
    // });

    return res
      .status(201)
      .json({ approve: true, message: "code has been updated" });
  } catch (error) {
    console.error(error);
    return res.status(501).send(error);
  }
});

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
