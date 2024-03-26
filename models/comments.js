module.exports = (sequelize, Sequelize) =>{
    const Comments = sequelize.define('comments', {
        threadId: {
            type: Sequelize.INTEGER(120),
            field: 'thread_id',
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
            field: 'file'
        },
        replyTo:{
            type:Sequelize.STRING(150),
            field:'replyTo'
        }
    
    });

    return Comments
}