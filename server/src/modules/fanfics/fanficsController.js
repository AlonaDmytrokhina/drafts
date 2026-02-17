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
        const { search, tags, limit = 10, page = 1 } = req.query;

        let tagsArray = [];
        if (tags) {
            tagsArray = Array.isArray(tags) ? tags : [tags];
            tagsArray = tagsArray.map(Number).filter(n => !isNaN(n));
        }

        const pageSize = Number(limit);
        const currentPage = Number(page);
        const offset = (currentPage - 1) * pageSize;

        const { items, totalCount } = await fanficsService.findFanfics(userId, {
            search,
            tags: tagsArray,
            limit: pageSize,
            offset: offset,
        });

        const totalPages = Math.ceil(totalCount / pageSize);

        res.json({
            data: items,
            meta: {
                totalCount,
                totalPages,
                currentPage,
                hasNextPage: currentPage < totalPages,
                hasPreviousPage: currentPage > 1
            }
        });
    } catch (e) {
        next(e);
    }
};

