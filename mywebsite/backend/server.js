import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log(err));

// ✅ Schema
const ContactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", ContactSchema);

// ✅ Email setup (use your real credentials later)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ CONTACT ROUTE (FINAL CLEAN)
app.post("/contact", async (req, res) => {
  try {
    const data = req.body;

    // Save to DB
    await Contact.create(data);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "New Website Enquiry",
      text: `
Name: ${data.name}
Phone: ${data.phone}
Message: ${data.message}
      `
    });

    // ✅ IMPORTANT: return JSON
    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// ✅ GET LEADS
app.get("/leads", async (req, res) => {
  const data = await Contact.find().sort({ createdAt: -1 });
  res.json(data);
});

// ✅ PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
