import * as chaptersService from "./chaptersService.js";

export const createChapter = async (req, res, next) => {
    try{
        const fanficId = Number(req.params.fanficId);
        const chapter = await chaptersService.createChapter(req.body, fanficId);

        res.status(201).json(chapter);
    }
    catch (err){
        next(err);
    }
};

export const getAllChapters = async (req, res, next) => {
    try {
        const fanficId = Number(req.params.fanficId);

        const chapters = await chaptersService.getAllChapters(fanficId);

        res.json(chapters);
    } catch (err) {
        next(err);
    }
};

export const getChapterById = async (req, res, next) => {
    try {
        const chapterId = Number(req.params.chapterId);
        const chapter = await chaptersService.getChapterById(chapterId);

        res.json(chapter);
    } catch (err) {
        next(err);
    }
};

export const deleteChapterById = async (req, res, next) => {
    try {
        const chapterId = Number(req.params.chapterId);
        const chapter = await chaptersService.deleteChapterById(chapterId);

        res.json(chapter);
    } catch (err) {
        next(err);
    }
};

export const deleteLastChapter = async (req, res, next) => {
    try {
        const fanficId = Number(req.params.fanficId);

        const chapters = await chaptersService.deleteLastChapter(fanficId);

        res.json(chapters);
    } catch (err) {
        next(err);
    }
};
