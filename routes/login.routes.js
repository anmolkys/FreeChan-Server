const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config();

module.exports = loginApp =>{
    const loginController = require("../controllers/login.controller");
    const router = require("express").Router()

    router.post("/login", loginController.login);
    router.post('/signup', loginController.signup);

    loginApp.use('/api', router);
}