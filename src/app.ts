import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routers/index";
import CategoryModel from "./models/category";
import axios from "axios";
dotenv.config();
const { PORT, DB_URL } = process.env;

const app = express();
app.use(cors());

app.use(express.json());

const connect = async () => {
  await mongoose
    .connect(
      "mongodb+srv://phantankk91:phanthanhdong@cluster0.svclp2s.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => console.log("Connected to MongoDB Successfuly!"))
    .catch((error) => console.error(`Error:() ${error.message}`));
};
connect();

app.use("/api", router);

app.post("/api/send-otp", async (req, res) => {
  const { otp, phoneNumber } = req.body;

  if (!otp || !phoneNumber) {
    return res.status(400).json({ message: "Missing OTP or phone number." });
  }

  const postData = JSON.stringify({
    messages: [
      {
        destinations: [{ to: phoneNumber }],
        from: "ServiceSMS",
        text: `Your OTP code is: ${otp}`,
      },
    ],
  });

  try {
    const response = await fetch(
      "https://6g8e3z.api.infobip.com/sms/2/text/advanced",
      {
        method: "POST",
        headers: {
          Authorization:
            "App 4e1b4d0c58ea81829b25e78549b1cc19-87e98a18-530c-492e-8fb9-4d15947f98ca",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: postData,
      }
    );

    if (response.ok) {
      console.log("🚀 ~ app.post ~ response:", response);
      return res.status(200).json({ message: "OTP sent successfully." });
    } else {
      console.error("Error sending message:", await response.text());
      return res.status(500).json({ message: "Failed to send OTP." });
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Failed to send OTP." });
  }
});

// Hàm API để kiểm tra mã OTP
app.post("/api/verify-otp", (req, res) => {
  const { enteredOTP, sentOTP, phoneNumber } = req.body;

  // Kiểm tra xem có đủ dữ liệu không
  if (!enteredOTP || !sentOTP || !phoneNumber) {
    return res.status(400).json({ message: "Missing data." });
  }

  // Giả sử rằng bạn đã có một hàm để kiểm tra mã OTP
  function verifyOTP(enteredOTP, sentOTP) {
    return enteredOTP === sentOTP;
  }

  // Kiểm tra xem mã OTP nhập vào có đúng không
  const isOTPValid = verifyOTP(enteredOTP, sentOTP);
  if (isOTPValid) {
    return res.status(200).json({ message: "OTP is valid." });
  } else {
    return res.status(400).json({ message: "OTP is invalid." });
  }
});

export const viteNodeApp = app;

//pnpm i @aws-sdk/client-sns
