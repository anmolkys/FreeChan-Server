const boards = require("../models/boards");

module.exports = boardApp =>{
    const boardController = require("../controllers/board.controller");
    const router = require("express").Router()


    //slug - String
    //thread - Integer


    router.get("/:slug/:page",boardController.findBoardBySlugAndPage);
    router.get("/:slug",boardController.findBoardBySlug);
    router.get("/:slug/thread/:thread_id",boardController.findSingleThread);

    
    router.post("/",boardController.boardCreate);
    router.post("/:slug/thread",boardController.createThread);
    router.post("/:slug/thread/:thread_id",boardController.createComment);
    
    
    
    
    
    

    
    boardApp.use('/api/boards', router);


}