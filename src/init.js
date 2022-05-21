import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = 4000;


// 외부로 개방
const handleListening = () => 
    console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);