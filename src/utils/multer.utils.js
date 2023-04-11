import multer from "multer";
const pathname = new URL("../", import.meta.url);

const path =
  pathname.pathname.slice(1, pathname.pathname.length) + "public/img";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(pathname.pathname+'/public/img', 'estoy en multer')
    cb(null, path);
  },
  filename: function (req, file, cb) {
    // console.log(file);
    cb(null, file.originalname);
  },
});

const uploader = multer({
  storage,
  onError: function (err, next) {
    console.log(err);
    next();
  },
});

export default uploader;
