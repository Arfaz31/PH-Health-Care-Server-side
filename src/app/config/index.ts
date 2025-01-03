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
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  store_id: process.env.STORE_ID,
  store_pass: process.env.STORE_PASS,
  success_url: process.env.SUCCESS_URL,
  fail_url: process.env.FAIL_URL,
  cancel_url: process.env.CANCEL_URL,
  ssl_payment_api: process.env.SSL_PAYMENT_API,
  ssl_validation_api: process.env.SSL_VALIDATION_API,
};
