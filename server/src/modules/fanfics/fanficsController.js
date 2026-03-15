import * as fanficsService from "./fanficsService.js";


export const createFanfic = async (req, res) => {
    try {
        const userId = req.user.id;
        const image_url = req.file
            ? `/uploads/covers/${req.file.filename}`
            : null;
        const fanfic = await fanficsService.createFanfic(req.body, userId, image_url);
        res.status(201).json(fanfic);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const getFanficById = async (req, res, next) => {
    try{
        const userId = req.user?.id;
        const fanficId = Number(req.params.fanficId);
        const data = await fanficsService.getFanficById(fanficId, userId);
        return res.json(data);
    }
    catch (err){
        next(err);
    }
};


export const patchFanfic = async (req, res, next) => {
    try{
        const fanficId = Number(req.params.fanficId);
        const userId = req.user.id;
        const data = await fanficsService.patchFanfic(fanficId, userId, req.body);
        return res.json(data);
    }
    catch (err){
        next(err);
    }
}

export const deleteFanfic = async (req, res, next) => {
    try{
        const fanficId = Number(req.params.fanficId);
        const userId = req.user.id;
        const data = await fanficsService.deleteFanfic(fanficId, userId);
        res.json(data);
    }
    catch (err){
        next(err);
    }
}


export const findFanfics = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const result = await fanficsService.findFanfics(userId, req.query);
        res.json(result);
    } catch (e) {
        next(e);
    }
};

