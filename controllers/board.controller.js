const db = require("../models/index");
const Boards = db.Boards;
const Threads = db.Threads;
const Comments = db.Comments;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv")
dotenv.config()


const key = process.env.SECRET;

exports.boardCreate = (req,res) => {
    if(req.body.key !== key){
        res.status(400).send({message:"You do not have the neccessary permissions for this"});
        return ;
    }

    const board = {
        name : req.body.name,
        slug : req.body.slug
    }
    Boards.findOne({
        where:{
            slug : req.body.slug
        }
    }).then((boardFound)=>{
        if(boardFound==null){
            Boards.create(board).then(data=>{res.send(data)}).catch(err=>{res.status(500).send({message: err || "Some error occured"})});
        }
        else{
            res.status(400).send({message:"Board Already Exists"})
        }
    })


}

// /:slug/:page


exports.findBoardBySlug = async (req, res) => {
    const slug = req.params.slug;

    // Check if data exists in Redis cache
    req.redisClient.get(slug).then((cachedBoard) => {
        if (cachedBoard) {
            //data found in cache
            res.status(200).json({ board: JSON.parse(cachedBoard) });
        } else {
            // Data not found in Redis cache, fetch from database
            Boards.findOne({
                where: {
                    slug: slug
                }
            }).then((board) => {
                if (!board) {
                    //board not found
                    res.status(404).json({ message: "Board not found" });
                    return;
                }
                //setting cache - board found
                req.redisClient.set(slug, JSON.stringify(board), 'EX', 112);
                res.status(200).json({ board: board });
            }).catch((err) => {
                //cannot query data
                res.status(500).send({message:"Internal Server Error"});
            });
        }
    }).catch((err) => {
        console.error(`Redis error: ${err}`);
        res.status(500).send("Internal Server Error");
    });
};



exports.findBoardBySlugAndPage = (req, res) => {
    Boards.findOne({
        where:{
            slug : req.params.slug
        }
    }).then((board)=>{
        if(board==null){res.status(400).send({"message":"oopsies Board does not exist"})}
        else{
            const threadsPerPage = 7
            const pages = req.params.page ? ((parseInt(req.params.page,10)) || 0) -1 : 0;
            const totalPages = 10
            const totalThreads = pages*threadsPerPage

            const threadDefined = {
                where: { board_id: board.id },
                offset: offSet,
                limit: totalThreads,
                order: "createdAt DESC",
                include: [{ model: Comments, as: "comments", limit: 5, order: "createdAt DESC" }]
            }

            if((!isNaN(req.params.page)  || req.params.page === undefined) &&(pages < totalPages)){
                Threads.findAll(threadDefined).then((threads)=>{
                    threads.pagination = {
                        nextPage: pages < totalPages - 2 ? pages + 2 : undefined
                    }
                    res.status(200).send({board: board, threads: threads});
                }).catch((err)=>{
                    res.status(500).send({ message: 'Something went wrong!' });
                });
            }else{
                res.status(400).send({message:"Request parameters incorrect"})
            }

        }

    }).catch(function(err){
        res.status(500).send({ message: 'Cannot find board , unexpected error occured' });
    });
};


// Get one thread
exports.findSingleThread = (req, res) => {
    Boards.findOne({
        where:{
            slug:req.params.slug
        }
    }).then((board)=>{
        if(board == null){
            res.status(400).send({message:"Error Loading Thread , Board not found"})
        }
        else{
            if(!isNaN(req.params.thread_id)){
                Threads.findByPk(req.params.thread_id, {include: [ {model: Comments, as: "comments", order: "createdAt ASC"}]}).then((thread)=>{
                    res.status(200).send({board:board,thread:thread});
                })
            }else{
                res.send(400).send({message:"Thread not found"})
            }
        }
    }).catch((err)=>{
        console.log(err)
        res.status(500).send({message:"Something went wrong"})
    }
)};


//Create Thread - POST

exports.createThread = (req,res) =>{

    Boards.findOne({
        where:{
            slug:req.params.slug
        }
    }).then((board)=>{
        if(board == null){
            req.status(400).send({message:"Incorrect Request , Board not found"})
        }
        else{
            const subject = req.body.subject;
            const author = req.body.author; //create at client
            const comment = req.body.comment;
            const file = req.body.fileLink || null;

            Threads.create({
                boardId:board.id,
                subject:subject,
                author:author,
                comment:comment,
                file:file
            }).then((thread)=>{
                res.status(200).send({thread:thread})
            }).catch((err)=>{
                console.log(err);
                res.status(500).send({error:"Unexpected Error Occured while Creating"})
            })

        }
    })

}

//Create Thread Comment - POST

exports.createComment = (req,res) =>{
    Boards.findOne({
        where:{
            slug:req.params.slug
        }
    }).then(board=>{
        if(board==null){
            res.status(400).send({message:"Board Not Found"});
        }
        else{
            if(!isNaN(req.params.thread_id)){
                Threads.findByPk(req.params.thread_id).then((thread)=>{
                    if(thread==null){
                        res.status(400).send({message:"Thread does not exist or was Deleted"});
                    }
                    else{
                        Comments.create({
                            threadId:req.params.thread_id,
                            author:req.body.author,
                            comment:req.body.comment,
                            file:req.body.fileLink || null,
                            replyTo:req.body.replyTo || null
                        }).then((comment)=>{
                            Threads.update({createdAt: comment.createdAt}, {where:{id: req.params.thread_id}});
                            res.status(400).send({comment:comment})
                        })
                    }
                })
            }
            else{
                res.status(500).send({message:"Unexpected error Occured"});
            }
        }
    })
}