module.exports = (sequelize, Sequelize) =>{
    const Threads = sequelize.define('threads', {
        boardId: {
            type: Sequelize.INTEGER(120),
            field: 'board_id',
            allowNull: false
        },
        subject: {
            type: Sequelize.STRING(150),
            field: 'subject',
            allowNull: false
        },
        author: {
            type: Sequelize.STRING(150),
            field: 'author',
            allowNull: false,
            defaultValue: 'Anonymous'
        },
        comment: {
            type: Sequelize.STRING(1234),
            field: 'comment',
            allowNull: false
        },
        file: {
            type: Sequelize.STRING(150),
            field: 'file',
            allowNull: true
        }
    
    });

    return Threads
}