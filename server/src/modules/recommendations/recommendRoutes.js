import { Router } from 'express';
import * as fanficsRepository from '../fanfics/fanficsRepository.js';
import { optionalAuth } from "../../middleware/authMiddleware.js";
import axios from "axios";


const router = Router();


router.get("/", optionalAuth, async (req, res) => {
    const userId = req.user?.id;

    try {

        if(!userId){
            const fanfics = await fanficsRepository.getPopular({});
            return res.json({
                data: fanfics
            });
        }

        const response = await axios.get(
            `http://localhost:8000/recommend/${userId}`
        );

        const ids = response.data.recommendations;

        let fanfics;

        if (!ids?.length){
            const fanfics = await fanficsRepository.getPopularForUser({userId});
            return res.json({
                data: fanfics
            });
        } else {
            fanfics = await fanficsRepository.findFanficsByIds({
                userId,
                ids
            });
        }

        return res.json({
            data: fanfics
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch recommendations" });
    }
});


export default router;