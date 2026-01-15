import * as fanficsTagsService from "./fanficsTagsService.js";

export const createFanficTag = async (req, res, next) => {
    try{
        const result = await fanficsTagsService.createFanficTag({
            fanficId: req.params.fanficId,
            tagId: req.body.tag_id
        });
        res.status(201).json(result);
    }
    catch (err){
        next(err);
    }
}


export const deleteFanficTag = async (req, res, next) => {
    try{
        const result = await fanficsTagsService.deleteFanficTag({
            fanficId: req.params.fanficId,
            tagId: req.body.tag_id
        });
        res.json(result);
    }
    catch (err){
        next(err);
    }
}
