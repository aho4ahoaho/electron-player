export const concatClassName = (...className: Array<string | undefined | null | boolean>) => {
    return className.filter(Boolean).join(" ");
};
