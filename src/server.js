import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();  //express application을 생성
const logger = morgan("dev");
// middleware

//controller
const home = (req, res) =>{
    console.log("I will response.");
    return res.send("hello");
};

const login = (req, res) =>{
    return res.send("login.")
}

// request 설정
app.use(logger);
app.get("/", home);
app.get("/login", login);

// 외부로 개방
const handleListening = () => 
    console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);



