const express = require("express")
const app = express()
const server = require("http").createServer(app);
const cors = require("cors");
const dotenv = require("dotenv")
const VERSION = "1.0.0"
const db = require("./models/index")
dotenv.config()


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/ping", (req, res) => {
    res.status(200).send({ message: `Server Live on Version ${VERSION}` });
});


//Routes
//1) Boards
    // 1) POST /api/boards - create board
    // 2) GET /api/boards/:slug/:page - get Board and paginated pages
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

