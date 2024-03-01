export const debounce = <T>(func: (...arg: T[]) => void, wait = 200) => {
    let timeout: NodeJS.Timeout | null = null;
    return (...arg: T[]) => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => func(...arg), wait);
    };
};
