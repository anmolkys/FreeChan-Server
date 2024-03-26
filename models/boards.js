module.exports = (sequelize, Sequelize) =>{
    const Boards = sequelize.define('boards', {
        name: {
            type: Sequelize.STRING(150),
            field: 'name',
            allowNull: false
        },
        slug: {
            type: Sequelize.STRING(150),
            field: 'slug',
            allowNull: false
        }
    });

    return Boards
}