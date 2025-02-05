import { v2 as cloudinary } from 'cloudinary';
import multer from "multer";
import streamifier from "streamifier";

cloudinary.config({
    cloud_name: "dyvdfrsx0",
    api_key: "557164443342849",
    api_secret: "MicfkonpfAkUvzoO3Ckid2dI6-M",
});

const uploadImage = (isNeeded = true) => {
    // Multer configuration
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage }).single("image");

    const uploadToCloudinary = async (req, res, next) => {
        try {
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: "Failed to upload image." });
                }

                if (!req.file && !isNeeded) {
                    return next();
                }

                if (!req.file && isNeeded) {
                    return res.status(400).json({ error: "No image file provided." });
                }

                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "Cinema" },
                    (error, result) => {
                        if (error) {
                            return res.status(500).json({ error: "Failed to upload image to Cloudinary." });
                        }
                        req.body.image = result?.secure_url;
                        next();
                    }
                );
                
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
        } catch (e) {
            res.status(500).json({ error: "Couldn't upload image." });
        }
    };
    return uploadToCloudinary;
};

export default uploadImage;