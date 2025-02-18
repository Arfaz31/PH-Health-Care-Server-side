import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const removeExtension = (filename: string) => {
  return filename.split(".").slice(0, -1).join(".");
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (_req, file) =>
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      file.fieldname +
      "-" +
      removeExtension(file.originalname),
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit to 10 MB for all files
  },
});

// Single file uploads for profilePhoto and coverImg
export const uploadSingleImage = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
]);

export const uploadIcon = upload.fields([{ name: "icon", maxCount: 1 }]);

// export const uploadMultipleImage = upload.fields([
//   { name: 'postImages', maxCount: 10 },
// ]);

// export const multerUpload = multer({ storage: storage });
