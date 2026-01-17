import * as likesRepository from "./likesRepository.js";

export const toggleLike = async (fanficId, userId) => {
    const liked = await likesRepository.isFanficLikedByUser(fanficId, userId);

    if (liked) {
        await likesRepository.deleteLike(fanficId, userId);
        return { liked: false };
    }

    await likesRepository.createLike(fanficId, userId);
    return { liked: true };
};

export const getAllLikesCount = async (fanficId) => {
    return await likesRepository.getAllFanficLikesCount(fanficId);
}

