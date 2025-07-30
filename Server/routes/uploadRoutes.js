const express = require("express");
const upload = require("../config/multerConfig");
const bucket = require("../config/firebaseConfig");

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const blob = bucket.file(`images/${req.file.originalname}`);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  blobStream.on("error", (error) => {
    res.status(500).send(error);
  });

  blobStream.on("finish", async () => {
    const url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res.status(200).send({ imageUrl: url });
  });

  blobStream.end(req.file.buffer);
});

module.exports = router;
