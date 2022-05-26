import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import {localsMiddleware} from "./middlewares";

const app = express();  //express application을 생성
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); 
app.use(logger);
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret : process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized: false,
    // cookie: {
    //     maxAge: 20000,
    // },
    store: MongoStore.create({mongoUrl : process.env.DB_URL })
}))

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"))
app.use("/static", express.static("assets"))
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);


export default app;


// app.use((req, res, next) => {
//     req.sessionStore.all((error, sessions) =>{
//         console.log(sessions);
//         next();
//     })
// })

// app.get("/add-one", (req, res, next) =>{
//     req.session.potato += 1;
//     return res.send(`${req.session.id}\n${req.session.potato}`);
// });








