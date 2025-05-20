// src/scripts/createAdmin.ts
import "dotenv/config";
import dbConnect from "../src/lib/dbConnect";
import User from "../src/models/User";
import { hash } from "bcryptjs";

async function createAdmin() {
  await dbConnect();

  const adminEmail = "";
  const adminPassword = "";
  const name = "";
  // Check if admin already exists
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log("⚠️ Admin already exists:", adminEmail);
    return;
  }

  const hashedPassword = await hash(adminPassword, 12);

  await User.create({
    name: name,
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Admin account created:", adminEmail);
}

createAdmin().catch((err) => {
  console.error("❌ Failed to create admin:", err);
  process.exit(1);
});
