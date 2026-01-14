import * as commentsService from "./commentsService.js";

export const createComment = async (req, res, next) => {
    try{
        const chapterId = Number(req.params.chapterId);

        const data = await commentsService.createComment(req.body.content, chapterId, req.user.id);
        res.status(201).json(data);
    }
    catch (err){
        next(err);
    }
};

export const getCommentsByChapter = async (req, res, next) => {
    try{
        const chapterId = Number(req.params.chapterId);

        const data = await commentsService.getCommentsByChapter(chapterId);
        res.json(data);
    }
    catch (err){
        next(err);
    }
};

export const getCommentsByFanfic = async (req, res, next) => {
    try{
        const fanficId = Number(req.params.fanficId);

        const data = await commentsService.getCommentsByFanfic(fanficId);
        return res.json(data);
    }
    catch (err){
        next(err);
    }
};

export const deleteComment = async (req, res, next) => {
    try{
        const commentId = Number(req.params.commentId);

        const data = await commentsService.deleteComment(commentId, req.user.id);
        return res.json(data);
    }
    catch (err){
        next(err);
    }
};