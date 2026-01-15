import * as commentsRepository from "./commentsRepository.js";

export const createComment = async (content, chapterId, userId) => {
    if(!content){
        throw new Error("Content is required");
    }

    return await commentsRepository.createComment({content, chapterId, userId});
};

export const getCommentsByChapter = async (chapterId) => {
    return await commentsRepository.getCommentsByChapter(chapterId);
};

export const getCommentsByFanfic = async (fanficId) => {
    return await commentsRepository.getCommentsByFanfic(fanficId);
};

export const deleteComment = async (commentId, userId) => {
    await checkAuthor(commentId, userId);
    return await commentsRepository.deleteCommentById(commentId);
}


const checkAuthor = async (commentId, userId) => {
    const comment = await commentsRepository.getCommentById(commentId);

    if (!comment) {
        throw new Error('Comment not found');
    }

    if(comment.user_id !== userId) {
        throw new Error('You are not the author of this comment');
    }
}