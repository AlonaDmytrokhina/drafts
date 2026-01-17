import * as bookmarksRepository from "./bookmarksRepository.js";

export const toggleBookmark = async (fanficId, userId) => {
    const bookmarked = await bookmarksRepository.isFanficBookmarkedByUser(fanficId, userId);

    if (bookmarked) {
        await bookmarksRepository.deleteBookmark(fanficId, userId);
        return { bookmarked: false };
    }

    await bookmarksRepository.createBookmark(fanficId, userId);
    return { bookmarked: true };
};

export const getUserBookmarks = async (userId) => {
    return await bookmarksRepository.getUserBookmarks(userId);
}