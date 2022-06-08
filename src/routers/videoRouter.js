import express from "express";
import { getEdit, watch,  postEdit , getUpload, postUpload, deleteVideo} from "../controllers/videoController.js";
import {protectordMiddleware, publicOnlyMiddleware, videoUpload} from "../middlewares";


const videoRouter = express.Router();


videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit")
    .all(protectordMiddleware)
    .get(getEdit)
    .post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete")
    .all(protectordMiddleware)
    .get(deleteVideo)
videoRouter.route("/upload")
    .all(protectordMiddleware)
    .get(getUpload)
    .post(videoUpload.fields([
        {name : "video", maxCount : 1},
        {name : "thumb", maxCount : 1},
    ]), postUpload);

export default videoRouter;