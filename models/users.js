const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) =>{
    const Users = sequelize.define('users', {
        email: {
            type: Sequelize.STRING(150),
            allowNull: false,
            unique: true
        },
        username: {
            type: Sequelize.STRING(150),
            field: 'username',
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(150),
            field: 'password',
            allowNull: false
        }
    });

    Users.beforeCreate(async (user, options) => {
        if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    });

    Users.prototype.validPassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };


    return Users
}