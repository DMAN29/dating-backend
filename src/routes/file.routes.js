import express from "express";
import { uploadFile } from "../shared/utils/upload.js";

const router = express.Router();

router.post("/upload", uploadFile, (req, res) => {
  const host = `${req.protocol}://${req.get("host")}`;
  const fileUrl = `${host}/uploads/${encodeURIComponent(req.file.filename)}`;

  return res.status(200).json({ url: fileUrl });
});

export default router;
