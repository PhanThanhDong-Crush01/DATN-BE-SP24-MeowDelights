import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "phantankk91@gmail.com",
    pass: "Pt2003@@@",
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (req: any, res: any) => {
  try {
    const userEmail = req.body.email; // Lấy địa chỉ email từ request body, bạn cần thay đổi phần này tùy thuộc vào cách bạn gửi email trong ứng dụng của mình

    const otp = generateOTP();
    const mailOptions = {
      from: "phantankk91@gmail.com",
      to: userEmail,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Gửi mã OTP cho bạn thành công",
    });
  } catch (error) {
    console.error(`Error sending OTP email: ${error.message}`);
    if (error.code === "EAUTH") {
      return res.status(401).json({
        message:
          "Invalid email credentials. Please check your email and password.",
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const verifyMailOTP = async (req: any, res: any) => {
  try {
    const userOTP = req.body.otp; // Lấy OTP từ request body, bạn cần thay đổi phần này tùy thuộc vào cách bạn lấy OTP từ người dùng trong ứng dụng của mình
    const inputOTP = req.body.inputOTP; // Lấy OTP mà người dùng nhập từ request body, bạn cần thay đổi phần này tùy thuộc vào cách bạn nhận input từ người dùng trong ứng dụng của mình

    if (userOTP === inputOTP) {
      return res.status(201).json({
        message: "Mã OTP bạn nhập đã đúng",
      });
    } else {
      return res.status(400).json({
        message: "Mã OTP bạn nhập không chính xác",
      });
    }
  } catch (error) {
    console.error(`Error in create otp item: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
