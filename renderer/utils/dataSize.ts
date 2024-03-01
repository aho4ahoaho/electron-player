export const formatDataSize = (size: number, digits: number = 2): string => {
    const units = ["", "K", "M", "G", "T", "P", "E"];
    let unitIndex = 0;
    while (size > 4096) {
        size /= 1000;
        unitIndex++;
    }
    return `${size.toFixed(digits)} ${units[unitIndex]}`;
};
