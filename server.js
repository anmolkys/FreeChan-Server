const express = require("express")
const app = express()
const server = require("http").createServer(app);
const cors = require("cors");
const dotenv = require("dotenv")
const VERSION = "1.0.0"
const db = require("./models/index")
const redis = require("redis");

const redisClient = redis.createClient();


(async()=>{
    redisClient.on('error', (err) => {
        console.log('Redis Client Error', err);
      });
      redisClient.on('ready', () => console.log('Redis is ready'));
    
      await redisClient.connect();
      await redisClient.ping();

})();


dotenv.config()

app.set("view engine","ejs");
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
});


app.get("/ping", (req, res) => {
    res.status(200).send({ message: `Server Live on Version ${VERSION}` , version : VERSION });
});


require("./routes/boards.routes")(app);
require("./routes/login.routes")(app);   


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
