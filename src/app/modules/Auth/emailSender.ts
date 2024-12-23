import nodemailer from "nodemailer";
import { config } from "../../config";

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.emailSender,
      pass: config.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: '"PH Health Care" <arfazahamed1@gmail.com>', // sender address
    to: email,
    subject: "Reset Password Link", // Subject line
    // text: "Hello world?", // plain text body
    html, // html body
  });
};

export default emailSender;
