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

// ✅ Email setup (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com",      // change
    pass: "your_app_password"         // change (NOT normal password)
  }
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ CONTACT ROUTE
app.post("/contact", async (req, res) => {
  try {
    // save to DB
    await Contact.create(req.body);

    // send email
    await transporter.sendMail({
      from: "yourgmail@gmail.com",
      to: "yourgmail@gmail.com",
      subject: "New Contact Message",
      text: JSON.stringify(req.body)
    });

    res.send("Saved + Email sent ✅");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error ❌");
  }
});

// ✅ GET ALL LEADS (ADMIN)
app.get("/leads", async (req, res) => {
  try {
    const data = await Contact.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});


// ✅ PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
