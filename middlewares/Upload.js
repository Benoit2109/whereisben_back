const upload = require("./ConfigUpload");

module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
        photo: {},
      });
    }
    if (!req.file) {
      return res.status(500).json({
        success: false,
        message: "Aucun fichier sélectionné",
        photo: {},
      });
    }
    return next();
  });
};
