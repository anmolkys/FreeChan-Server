const boards = require("../models/boards");



module.exports = boardApp =>{
    const boardController = require("../controllers/board.controller");
    const router = require("express").Router()
    const { authenticateToken } = require("../middleware/jwt.auth")



    router.use(authenticateToken);

    router.get("/:slug/:page", authenticateToken ,boardController.findBoardBySlugAndPage);
    router.get("/:slug", authenticateToken ,boardController.findBoardBySlug);
    router.get("/:slug/thread/:thread_id", authenticateToken ,boardController.findSingleThread);

    router.post("/", authenticateToken ,boardController.boardCreate);
    router.post("/:slug/thread", authenticateToken ,boardController.createThread);
    router.post("/:slug/thread/:thread_id", authenticateToken ,boardController.createComment);
    
    
    
    
    
    

    
    boardApp.use('/api/boards', router);


}