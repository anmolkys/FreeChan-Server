const dbConfig = require("../config/db.config.js")
const Sequelize = require("sequelize")
const dotenv = require("dotenv")
dotenv.config();
const sequelize = new Sequelize(process.env.DB, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Boards = require("./boards.js")(sequelize, Sequelize);
db.Threads = require("./threads.js")(sequelize,Sequelize);
db.Comments = require("./comments.js")(sequelize,Sequelize);
db.Users = require("./users.js")(sequelize,Sequelize);


db.Threads.belongsTo(db.Boards, { foreignKey: 'board_id', constraints: true, as: 'boards' });
db.Boards.hasMany(db.Threads, { foreignKey: 'board_id', constraints: true, as: 'threads' });
db.Comments.belongsTo(db.Threads, { foreignKey: 'thread_id', constraints: true, as: 'threads' });
db.Threads.hasMany(db.Comments, { foreignKey: 'thread_id', constraints: true, as: 'comments' });


module.exports = db;