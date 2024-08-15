import { prisma } from "../index.js";

function generateInviteCode(length = 5) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let inviteCode = "";

  // Ensure one number is included
  inviteCode += numbers[Math.floor(Math.random() * numbers.length)];

  // Fill the rest with letters
  for (let i = 1; i < length; i++) {
    inviteCode += letters[Math.floor(Math.random() * letters.length)];
  }

  // Shuffle the invite code to randomize the position of the number
  inviteCode = inviteCode
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return inviteCode;
}

export async function saveInviteCode() {
  const code = generateInviteCode();
  console.log("Generated Code:", code); // Outputs something like "A3JYZ" or "1BKQH"

  try {
    const response = await prisma.inviteCode.create({
      data: {
        code: code,
        is_used: false, // Default value or set based on your logic
      },
    });
    console.log("Invite code saved to database.");
  } catch (error) {
    console.error("Error saving invite code:", error);
  }
}
