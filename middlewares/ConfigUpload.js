const multer = require("multer");
const path = require("path");

// je créé une constante storage qui définie la destination de fichier reçuu et son format de nom.
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// je vérifie que le fichier reçu est bien du bon type image.
const checkFileType = (file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (extName && mimeType) {
    return cb(null, true);
  }
  return cb("Seul les formats jpeg, jpg, png et gif sont autorisés");
};

// je définie le format de l'objet que je veux recevoir.
module.exports = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("photo");
