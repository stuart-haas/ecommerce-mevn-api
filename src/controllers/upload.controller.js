const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single('file');

module.exports = {
  upload: (req, res) => {
    upload(req, res, function (err) {
      if (err) {
        return res.json({ error: true, message: 'Somethint went wrong' });
      } else {
        const { file } = req;
        var fullUrl = req.protocol + '://' + req.get('host');
        const path = `${fullUrl}/${file.path}`;
        file.path = path;
        res.json({
          success: true,
          message: `File uploaded to ${file.path}`,
          file,
        });
      }
    });
  },
};
