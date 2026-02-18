import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join("public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${sanitized}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      // Images
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",

      // Videos
      "video/mp4",
      "video/mpeg",
      "video/quicktime",

      // PDF
      "application/pdf",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only images, videos, and PDFs are allowed"), false);
    }

    cb(null, true);
  },
}).single("file");

export const uploadFile = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;

    // 5MB limit for images & PDFs
    if (mimeType.startsWith("image/") || mimeType === "application/pdf") {
      if (fileSize > 5 * 1024 * 1024) {
        fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({ error: "Image/PDF must be less than 5MB" });
      }
    }

    // 50MB limit for videos
    if (mimeType.startsWith("video/")) {
      if (fileSize > 50 * 1024 * 1024) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Video must be less than 50MB" });
      }
    }

    next();
  });
};
