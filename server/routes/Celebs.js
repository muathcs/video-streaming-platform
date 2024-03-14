import { prisma } from "../index.js";
import express from "express";

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

export default router;
