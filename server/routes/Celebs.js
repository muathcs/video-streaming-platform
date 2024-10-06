import { prisma } from "../index.js";
import express from "express";
import { upload } from "./Fan.js";
import { uploadProfileImgToS3 } from "../s3.js";
import { createStripeCustomAccount } from "../actions/actions.js";
import { getCelebsByCategory } from "../services/celebService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  //query celeb table by category


  
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided
  const offset = (page - 1) * pageSize; // Calculate the offset based on page number and page size
  const { category } = req.params;
  console.log("celeb body: ", req.query)
  
  try {

      const result = await prisma.celeb.findMany({
        skip:offset,
        take:pageSize,
        where: {
          completed_onboarding: true,
        },
        orderBy:{
          request_num:"desc"
        }
      });
      // client.release(); // Release the connection back to the pool

    res.send(result);
  } catch (error) {
    console.log("error/celebs: ", error);
    console.log("error: ", error)
    res.status(500).json({ error: error.message });
  }
});


router.get("/:category", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  const { category } = req.params;

  try {
    const result = await getCelebsByCategory(category, page, pageSize);


    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching celebrities:", error);
    res.status(500).json({ error: error.message });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await prisma.celeb.findUnique({
      where: {
        uid: id,
      },
    });

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
    //create partial of the celeb, onboarding is completed on phone.
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
    res.status(201).send("success")

    console.log("response: ", response);
  } catch (error) {
    console.error(error);
    res.status(401).json({message:error})
  }
});

// this created a celeb account final account also create stripe account with it.
router.post(
  "/createCeleb",
  upload.single("file"),
  uploadProfileImgToS3,
  async (req, res) => {

    
    const newImg = req.newUrl;

    const {
      bio,
      category,
      legalName,
      displayName,
      price,
      uid,
      email,
      inviteCode,
    } = JSON.parse(req.body.info);

    try {
      // Find the invite code
      const inviteCodeRecord = await prisma.inviteCode.findUnique({
        where: { code: inviteCode },
      });

      // throw error if it doesn't exist
      if (!inviteCodeRecord || inviteCodeRecord.is_used) {
        return res.status(401).send("Invalid or already used invite code");
      }

      const result = await prisma.celeb.create({
        data: {
          displayname: displayName,
          username: legalName,
          category,
          price: parseInt(price),
          email: email,
          description: bio,
          uid: crypto.randomUUID(),
          imgurl: newImg,
          completed_onboarding: !!bio, // Simplified
          inviteCode: {
            connect: {
              id: inviteCodeRecord.id,
            },
          },
        },
      });

      console.log("before stripe account")

      const stripeAccount = await createStripeCustomAccount(email, result.uid, displayName);


      console.log("stripeID: ", stripeAccount.id)
      console.log("type of stripeID: ", typeof stripeAccount.id)
      if (stripeAccount) {
        await prisma.celeb.update({
          where: {
            uid: result.uid,
          },
          data: {
            stripe_account_id: stripeAccount.id,
          },
        });
      }

      await indexNewCeleb(uid); // indexing for text search

      res.status(201).send("Celeb account created");
    } catch (error) {
      console.error("Error creating celeb:", error.message);
      res.status(500).send("An error occurred while creating the celeb account.");
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
  const result = await prisma.$executeRaw`
    UPDATE "Celeb"
    SET document_with_idx = TO_TSVECTOR('simple', displayname)
    WHERE uid = ${uid};
  `;
}

export default router;
