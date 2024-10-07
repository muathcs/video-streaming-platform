import admin from "firebase-admin";
import { readFileSync } from "fs";
import { celebrityNames } from "./celebName.js";

const serviceAccount = JSON.parse(
  readFileSync("./serviceAccount/serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export async function updateEmail(email, newEmail) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { email: newEmail });
    console.log(`Email successfully updated from ${email} to ${newEmail}`);
    return { success: true, message: "Email updated successfully" };
  } catch (error) {
    console.error("Error updating email:", error);
    return { success: false, message: error.message };
  }
}

export async function updatePassword(uid, newPassword) {
  try {
    await admin.auth().updateUser(uid, {
      password: newPassword,
    });

    console.log("Password successfully updated");
  } catch (error) {
    console.log("Could not update password:", error);
    throw error;
  }
}

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

export async function getUID(email) {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    return uid;
    return userUIDs;
  } catch (error) {
    console.error("Error listing users:", error.message, "email: ", email);
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
    const deletePromises = users.map((user) => {
      if (user.email != "muath@gmail.com") {
        admin.auth().deleteUser(user.uid);
      }
    });
    await Promise.all(deletePromises);

    console.log("All users deleted successfully.");
  } catch (error) {
    console.error("Error deleting users:", error);
  }
}

// Function to create users
async function createFirebaseUser(email, password) {
  try {
    // const email = celebName.replace(/\s+/g, "-").toLowerCase() + "@gmail.com";
    // const password = password;

    // Create user with email and password
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    return userRecord;

    console.log(`User created: ${userRecord.uid} - ${email}`);
  } catch (error) {
    console.error("Error creating users:", error);
  }
}

// Function to update email and uid
// async function updateEmailAndUid() {
//   try {
//     // Fetch data from PostgreSQL
//     const result = await pool.query("SELECT * FROM celeb");
//     const celebs = result.rows;

//     // Loop through each celeb
//     for (const celeb of celebs) {
//       const oldEmail = celeb.email;
//       const newEmail = oldEmail.replace(/\s+/g, "-");

//       // Update email in PostgreSQL
//       await pool.query("UPDATE celeb SET email = $1 WHERE celebid = $2", [
//         newEmail,
//         celeb.celebid,
//       ]);

//       // Fetch Firebase user by email
//       console.log("old email: ", newEmail);
//       const userRecord = await admin.auth().getUserByEmail(newEmail);

//       // Update UID in PostgreSQL
//       await pool.query("UPDATE celeb SET uid = $1 WHERE uid = $2", [
//         userRecord.uid,
//         celeb.uid,
//       ]);

//       console.log(
//         `Updated celeb: ${celeb.name}, Email: ${oldEmail} -> ${newEmail}, UID: ${userRecord.uid}`
//       );
//     }

//     console.log("Update process complete.");
//   } catch (error) {
//     console.error("Error updating email and UID:", error);
//   } finally {
//     // Close the PostgreSQL pool
//     // await pool.end();
//   }
// }
// Function to update email and uid
async function updatePhotoUrl(uid, imgurl) {
  try {
    const urlPattern = /^(http|https):\/\//;
    if (!urlPattern.test(imgurl)) {
      console.log("wrong patter");
      return;
    }

    const userRecord = await admin.auth().updateUser(uid, {
      photoURL: imgurl,
    });

    console.log("img uploaded");
  } catch (error) {
    console.error("Error updating profile picture:", error);
  }
}

export { getAllUserUIDs, updatePhotoUrl, createFirebaseUser };

// deleteAllUsers();
