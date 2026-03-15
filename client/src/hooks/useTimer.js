import { useEffect, useRef } from "react";

export default function useTimer(fanficId, chapterId, onSave) {
    const startTime = useRef(Date.now());
    const totalReadTime = useRef(0);
    const lastTick = useRef(Date.now());

    useEffect(() => {
        startTime.current = Date.now();
        lastTick.current = Date.now();
        totalReadTime.current = 0;

        const interval = setInterval(() => {
            if (document.hasFocus()) {
                const now = Date.now();
                totalReadTime.current += Math.floor((now - lastTick.current) / 1000);
            }
            lastTick.current = Date.now();
        }, 1000);

        const handleSave = () => {
            if (totalReadTime.current > 0) {
                onSave(fanficId, chapterId, totalReadTime.current);
            }
        };

        window.addEventListener("beforeunload", handleSave);

        return () => {
            clearInterval(interval);
            handleSave();
            window.removeEventListener("beforeunload", handleSave);
        };
    }, [fanficId, chapterId]);
}