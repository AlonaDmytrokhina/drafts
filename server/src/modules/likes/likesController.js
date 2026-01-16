import * as likesService from "./likesService.js";

export const toggleLike = async (req, res, next) => {
    try{
        const fanficId = req.params.fanficId;
        const data = await likesService.toggleLike(fanficId, req.user.id);
        res.status(201).json(data);
    }
    catch (err){
        next(err);
    }
};

