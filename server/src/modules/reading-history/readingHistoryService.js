import * as readingHistoryRepository from "./readingHistoryRepository.js";

const MIN_READ_TIME = 20; // сек

export const recordReading = async ({
                                        userId,
                                        fanficId,
                                        chapterId,
                                        readTime
                                    }) => {

    if (readTime < MIN_READ_TIME) {
        return;
    }

    //максимальний час
    const safeReadTime = Math.min(readTime, 60 * 60);

    await readingHistoryRepository.insertReadingEvent({
        userId,
        fanficId,
        chapterId,
        readTime: safeReadTime
    });
};