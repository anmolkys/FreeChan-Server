const db = require("../models/index");
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const CryptoJS = require("crypto-js");
const Users = db.Users;
const Op = db.Sequelize.Op;
dotenv.config()


key = process.env.ACCESS_TOKEN_SECRET
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({ where: { username: username } });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const accessToken = jwt.sign({user:username}, key, { expiresIn: '1h', algorithm: 'HS256' });
        res.status(200).send({token:accessToken})
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.signup = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const existingUser = await Users.findOne({
            where: {
                [Op.or]: [{ email: email }, { username: username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already exists' });
        }

        const newUser = await Users.create({ email, username, password });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};