import admin from "firebase-admin";
import { readFileSync } from "fs";
import { celebrityNames } from "./celebName.js";
import pool from "./db.js";

const serviceAccount = JSON.parse(
  readFileSync("./serviceAccount/serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function getAllUserUIDs() {
  try {
    const userRecords = await admin.auth().listUsers();
    const userUIDs = userRecords.users.map((user) => user.uid);
    return userUIDs;
  } catch (error) {
    console.error("Error listing users:", error);
    throw error;
  }
}

// Function to delete all users
async function deleteAllUsers() {
  try {
    // Get the list of all users
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users;

    // Delete each user
    const deletePromises = users.map((user) =>
      admin.auth().deleteUser(user.uid)
    );
    await Promise.all(deletePromises);

    console.log("All users deleted successfully.");
  } catch (error) {
    console.error("Error deleting users:", error);
  }
}

// Function to create users
async function createFirebaseUsers() {
  try {
    const createUserPromises = celebrityNames.map(async (celebName) => {
      const email = celebName.replace(/\s+/g, "-").toLowerCase() + "@gmail.com";
      const password = email;

      // Create user with email and password
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });

      console.log(`User created: ${userRecord.uid} - ${email}`);
    });

    await Promise.all(createUserPromises);
  } catch (error) {
    console.error("Error creating users:", error);
  }
}

// Function to update email and uid
async function updateEmailAndUid() {
  try {
    // Fetch data from PostgreSQL
    const result = await pool.query("SELECT * FROM celeb");
    const celebs = result.rows;

    // Loop through each celeb
    for (const celeb of celebs) {
      const oldEmail = celeb.email;
      const newEmail = oldEmail.replace(/\s+/g, "-");

      // Update email in PostgreSQL
      await pool.query("UPDATE celeb SET email = $1 WHERE celebid = $2", [
        newEmail,
        celeb.celebid,
      ]);

      // Fetch Firebase user by email
      console.log("old email: ", newEmail);
      const userRecord = await admin.auth().getUserByEmail(newEmail);

      // Update UID in PostgreSQL
      await pool.query("UPDATE celeb SET uid = $1 WHERE uid = $2", [
        userRecord.uid,
        celeb.uid,
      ]);

      console.log(
        `Updated celeb: ${celeb.name}, Email: ${oldEmail} -> ${newEmail}, UID: ${userRecord.uid}`
      );
    }

    console.log("Update process complete.");
  } catch (error) {
    console.error("Error updating email and UID:", error);
  } finally {
    // Close the PostgreSQL pool
    await pool.end();
  }
}
// Function to update email and uid
async function updatePhotoUrl() {
  try {
    // Fetch data from PostgreSQL
    const result = await pool.query("SELECT * FROM celeb");
    const celebs = result.rows;

    // Loop through each celeb
    for (const celeb of celebs) {
      const email = celeb.email;

      console.log(celeb.celebid);
      const urlPattern = /^(http|https):\/\//;
      if (!urlPattern.test(celeb.imgurl)) {
        throw new Error("Invalid URL format for photoURL");
      } else {
        console.log("all good");
      }

      const userRecord = await admin.auth().updateUser(celeb.uid, {
        photoURL: celeb.imgurl,
      });

      console.log("sucess");
    }

    console.log("Update process complete.");
  } catch (error) {
    console.error("Error updating email and UID:", error);
  } finally {
    // Close the PostgreSQL pool
    await pool.end();
  }
}

// Call the function to create users
// createFirebaseUsers();

updatePhotoUrl();

export { getAllUserUIDs };
