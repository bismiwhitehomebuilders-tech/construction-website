import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("mydb");
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.log(err);
  }
}

connectDB();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

// TEST
app.get("/", (req, res) => {
  res.send("Server + DB working á🚀");
});

// SAVE FORM
app.post("/contact", async (req, res) => {
  try {
    const data = req.body;

    const result = await db.collection("contacts").insertOne(data);

    // 📧 SEND EMAIL
    await transporter.sendMail({
      from: "bismiwhitehomebuilders@gmail.com",
      to: "bismiwhitehomebuilders@gmail.com",
      subject: "🚀 New Website Enquiry",
      text: `
New enquiry received:

Name: ${data.name}
Phone: ${data.phone}
Message: ${data.message}
      `
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed" });
  }
});
// 👇 ADD THIS HERE
app.get("/contacts", async (req, res) => {
  try {
    const data = await db.collection("contacts").find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

