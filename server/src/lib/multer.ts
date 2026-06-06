import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, ext);

    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = (now.toTimeString().split(" ")[0] ?? "").replace(/:/g, "-");

    const filename = `${date}_${time}_${originalName}${ext}`;

    cb(null, filename);
  },
});

const filefilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format File tidak diizinkan. gunakan jpg/png"));
  }
};

const upload = multer({
  storage,
  fileFilter: filefilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
