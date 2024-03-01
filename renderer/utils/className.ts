export const concatClassName = (...className: Array<string | undefined | null>) => {
    return className.filter(Boolean).join(" ");
};
