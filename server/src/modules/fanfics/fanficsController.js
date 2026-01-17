import * as fanficsService from "./fanficsService.js";

export const createFanfic = async (req, res, next) => {
    try{
        const data = await fanficsService.createFanfic(req.body, req.user.id);
        res.status(201).json(data);
    }
    catch (err){
        next(err);
    }
};

export const getAllFanfics = async (req, res, next) => {
    try{
        const data = await fanficsService.getAllFanfics();
        return res.json(data);
    }
    catch (err){
        next(err);
    }
};

export const getFanficById = async (req, res, next) => {
    try{
        const fanficId = Number(req.params.fanficId);
        const data = await fanficsService.getFanficById(fanficId);
        return res.json(data);
    }
    catch (err){
        next(err);
    }
};

export const searchFanficsByNameOrAuthor = async (req, res, next) => {
    try{
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ message: 'Query param q is required' });
        }

        const data = await fanficsService.searchFanficsByNameOrAuthor(q);

        res.json(data);
    }
    catch (err){
        next(err);
    }
};

export const searchByTags = async (req, res, next) => {
    try {
        const result = await fanficsService.searchByTags(req.body);
        res.json(result);
    } catch (e) {
        next(e);
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
