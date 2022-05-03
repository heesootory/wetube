import express from "express";

const PORT = 4000;

const app = express();  //express application을 생성

const hendleHome = (req, res) =>{
    return res.send("I still love you");
};
const hendleLogin = (req, res) =>{
    return res.send("login here!!");
};


// request 설정
app.get("/", hendleHome);
app.get("/login", hendleLogin);

// 외부로 개방
const handleListening = () => 
    console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);



