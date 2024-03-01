export const formatTime = (time: number | undefined) => {
    if (!time) return "00:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};
