import express from "express";
import { 
    logout, see, startGithubLogin, finishGithubLogin, getEdit, postEdit,
    getChangePassword, postChangePassword 
} from "../controllers/userController.js";
import {protectordMiddleware, publicOnlyMiddleware} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectordMiddleware, logout);
userRouter.route("/edit").all(protectordMiddleware).get(getEdit).post(postEdit);
userRouter.route("/change-password").all(protectordMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
// 로그인 여부에 상관없이 가능할듯함.
userRouter.get("/:id", see);


export default userRouter;



