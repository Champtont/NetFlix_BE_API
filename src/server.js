import express from "express";
import cors from "cors";
import createHttpError from "http-errors";
import listEndpoints from "express-list-endpoints";
import { join } from "path";
import filesRouter from "../src/api/files/index.js";
import mediaRouter from "./api/media/index.js";
import {
  genericErrorHandler,
  unAuthorizedHandler,
  notFoundHandler,
  badRequestHandler,
} from "./errorhandler.js";
import swagger from "swagger-ui-express";
import yaml from "yamljs";

const server = express();
const port = process.env.PORT;

//CORS

const whiteList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whiteList.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};

server.use(cors(corsOpts));
server.use(express.json());

//endpoints
server.use("/medias", mediaRouter);
server.use("/medias", filesRouter);

//Error handlers
server.use(notFoundHandler);
server.use(unAuthorizedHandler);
server.use(badRequestHandler);
server.use(genericErrorHandler);

//
server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`console is running on port: ${port}`);
});
