import * as tagsService from "./tagsService.js";

export const createTag = async (req, res, next) => {
    try{
        const tag = await tagsService.createTag(req.body);
        res.status(201).json(tag);
    }
    catch (err){
        next(err);
    }
}
