import dotenv from "dotenv";

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_secret: process.env.RESET_PASS_TOKEN,
  reset_pass_expire_in: process.env.RESET_PASS_EXPIRES_IN,
  reset_pass_link: process.env.RESET_PASS_LINK,
  emailSender: process.env.EMAIL_SENDER,
  app_pass: process.env.APP_PASS,
};
