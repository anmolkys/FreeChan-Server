const express = require("express")
const app = express()
const server = require("http").createServer(app);
const cors = require("cors");
const dotenv = require("dotenv")
const VERSION = "1.0.0"
const db = require("./models/index")
const redis = require("redis");
const path = require("path")
const boardController = require("./controllers/board.controller");
dotenv.config()
const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOSTNAME,
        port: process.env.REDIS_PORT
    }
});


(async()=>{
    redisClient.on('error', (err) => {
        console.log('Redis Client Error', err);
      });
      redisClient.on('ready', () => console.log('Redis is ready'));
    
      await redisClient.connect();
      await redisClient.ping();

})();



app.set("view engine","ejs");
app.set("views",path.resolve("./views"))
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views', 'public')));

//send redis Client to the contollers
app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
});



app.get("/ping", (req, res) => {
    res.status(200).send({ message: `Server Live on Version ${VERSION}` , version : VERSION });
    const clientIP = req.ip;
    console.log(`Client IP: ${clientIP}`);
});

app.get("/",boardController.findAllBoards)


require("./routes/boards.routes")(app);

app.use((req, res, next) => {
    res.status(404).render("404.ejs")
})

//DB Sync
const PORT = process.env.PORT || 5500;
db.sequelize.sync()
    .then(() => {
        console.log("[📂] : Synced db.");
        server.listen(PORT, () => { console.log(`[☎️] : Listening on ${PORT}`) })
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });
