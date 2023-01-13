import express from "express";
import { pipeline } from "stream";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import multer from "multer";
import { extname } from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { getMedia, writeMedia } from "../../lib/fs-tools.js";

const filesRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "Netflix/moviePosters",
    },
  }),
}).single("poster");

filesRouter.post("/:id/poster", cloudinaryUploader, async (req, res, next) => {
  try {
    console.log(req.file);
    const url = req.file.path;
    const allMedia = await getMedia();

    const index = allMedia.findIndex((media) => media.id === req.params.id);
    if (index !== -1) {
      const oldMedia = allMedia[index];
      const mediaPoster = { ...oldMedia, poster: url };
      const updatedMedia = {
        ...oldMedia,
        mediaPoster,
        updatedAt: new Date(),
      };

      allMedia[index] = updatedMedia;

      await writeMedia(allMedia);
    }
    res.send("File uploaded");
  } catch (error) {
    next(error);
  }
});

filesRouter.get("/:id/pdf", async (req, res, next) => {
  res.setHeader("Content-Disposition", "attachment; filename=test.pdf");

  const allMedia = await getMedia();
  const source = getPDFReadableStream(allMedia);
  const destination = res;
  pipeline(source, destination, (err) => {
    if (err) console.log(err);
    else console.log("stream ended successfully");
  });
});

export default filesRouter;
