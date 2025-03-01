import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Configuration (Stores file in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

  const uploadImage = (isNeeded = true) => {
  return async (req, res, next) => {
    try {
      // Use multer as a middleware
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: "Failed to upload image." });
        }

        // Handle case where no file is uploaded
        if (!req.file) {
          if (isNeeded) {
            return res.status(400).json({ error: "No image file provided." });
          }
          return next();
        }

        // Upload to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "restaurant" },
          (error, result) => {
            if (error) {
              return res
                .status(500)
                .json({ error: "Failed to upload image to Cloudinary." });
            }
            req.body.image = result.secure_url; // Attach URL to req.body
            next(); // Move to next middleware
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    } catch (e) {
      res.status(500).json({ error: "Couldn't upload image." });
    }
  };
};

export default uploadImage;
