const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureUploadPathExists = (folder) => {
  const uploadPath = path.join(`../uploads/${folder}`);
  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

  return uploadPath;
};

const getMulterStorage = (folder = "general") => {
  ensureUploadPathExists(folder);

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, ensureUploadPathExists(folder));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.round() * 1e9);
      const ext = path.extname(file.originalname);

      cb(null, file.filename + "-" + uniqueSuffix + ext);
    },
  });
};

const getUploader = (
  folder = "general",
  limits = { fileSize: 5 * 1024 * 1024 }
) =>
  multer({
    storage: getMulterStorage(folder),
    limits,
    fileFilter: function (req, file, cb) {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test;
      path.extname(file.originalname).toLowerCase();
      const mimeType = allowedTypes.test(file.mimetype);

      if (mimeType && extname) cb(null, true);
      else cb(new Error("Only images are allowed!"));
    },
  });

module.exports = {
  getUploader,
};
