import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } =
  fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
console.log("DATA FOLDER PATH: ", dataFolderPath);

export const mediaJSONPath = join(dataFolderPath, "media.json");

export const getMedia = () => readJSON(mediaJSONPath);
export const writeMedia = (mediaArray) => writeJSON(mediaJSONPath, mediaArray);

export const getMediaJsonReadableStrem = () => createReadStream(mediaJSONPath);
export const getPDFWritableStream = () =>
  createWriteStream(join(dataFolderPath, fileName));

//need to add a save path for movie posters
//export and use here... idk if this breaks stuff
