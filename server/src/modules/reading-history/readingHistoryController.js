import * as readingHistoryService from './readingHistoryService.js';

export const createReadingHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { fanficId, chapterId, readTime } = req.body;

        await readingHistoryService.recordReading({
            userId,
            fanficId,
            chapterId,
            readTime
        });

        res.status(201).json({ message: "Reading recorded" });
    } catch (err) {
        next(err);
    }
};