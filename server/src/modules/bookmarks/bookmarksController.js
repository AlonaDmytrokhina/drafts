import * as bookmarksService from "./bookmarksService.js";

export const toggleBookmark = async (req, res, next) => {
    try{
        const fanficId = req.params.fanficId;
        const data = await bookmarksService.toggleBookmark(fanficId, req.user.id);
        res.status(201).json(data);
    }
    catch (err){
        next(err);
    }
};

export const getUserBookmarks = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const data = await bookmarksService.getUserBookmarks(userId);
        res.json(data);
    }
    catch (err){
        next(err);
    }
}

