import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== ADMIN CONFIG =====
const ADMIN_EMAIL = "admin@bismi.com";
const ADMIN_PASS_HASH = bcrypt.hashSync("admin123", 8);
const SECRET = "supersecretkey";

// ===== DB =====
const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  await client.connect();
  db = client.db("mydb");
  console.log("MongoDB connected ✅");
}
connectDB();

// ===== EMAIL =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

// ===== TOKEN MIDDLEWARE =====
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token" });

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ===== ROUTES =====

// TEST
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// CONTACT FORM SAVE
app.post("/contact", async (req, res) => {
  try {
    const data = req.body;

    await db.collection("contacts").insertOne({
      ...data,
      createdAt: new Date()
    });

    // EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "New Enquiry",
      text: `
Name: ${data.name}
Phone: ${data.phone}
Message: ${data.message}
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// GET LEADS (PROTECTED)
app.get("/leads", verifyToken, async (req, res) => {
  try {
    const leads = await db
      .collection("contacts")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(leads);
  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

// DELETE LEAD
app.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("contacts").deleteOne({
      _id: new ObjectId(req.params.id)
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

// ADMIN LOGIN
app.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ error: "Invalid" });
  }

  const valid = bcrypt.compareSync(password, ADMIN_PASS_HASH);

  if (!valid) {
    return res.status(401).json({ error: "Invalid" });
  }

  const token = jwt.sign({ role: "admin" }, SECRET, {
    expiresIn: "2h"
  });

  res.json({ token });
});

// START
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
