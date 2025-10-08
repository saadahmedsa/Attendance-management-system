import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/app.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "students", // folder name on Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 400, height: 400, crop: "fill" }],
  },
});

const upload = multer({ storage });

export default upload;
