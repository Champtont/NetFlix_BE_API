import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import fs from "fs-extra";
import createhttpErrors from "http-errors";
//import { checkblogSchema, triggerBadRequest } from "./validator.js";
import { mediaJSONPath } from "../../lib/fs-tools.js";

const { NotFound, Unauthorized, BadRequest } = createhttpErrors;

console.log("target -->", mediaJSONPath);

const mediaRouter = express.Router();

const getMedia = () => JSON.parse(fs.readFileSync(mediaJSONPath));
const writeMedia = (mediaArray) =>
  fs.writeFileSync(mediaJSONPath, JSON.stringify(mediaArray));

//post

mediaRouter.post("/", (req, res, next) => {
  try {
    console.log("REQUEST BODY: ", req.body);
    const newMedia = { ...req.body, createdAt: new Date(), imdbId: uniqid() };
    console.log("NEW MEDIA: ", newMedia);
    const mediaArray = JSON.parse(fs.readFileSync(mediaJSONPath));
    mediaArray.push(newMedia);
    fs.writeFileSync(mediaJSONPath, JSON.stringify(mediaArray));
    res.status(201).send({ imdbd: newMedia.imdbId });
  } catch (error) {
    next(error);
    console.log(error);
  }
});

//get
mediaRouter.get("/", (req, res, next) => {
  try {
    const mediaArray = getMedia();
    res.send(mediaArray);
  } catch (error) {
    next(error);
    console.log(error);
  }
});

//get single media
mediaRouter.get("/:id", (req, res, next) => {
  try {
    const allMedia = getMedia();
    const media = allMedia.find((media) => media.id === req.params.id);
    if (media) {
      res.send(media);
    } else {
      next(NotFound(`Media with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
});

export default mediaRouter;
