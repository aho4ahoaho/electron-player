"use client";
export const getDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) {
        return "mobile";
    }
    if (width <= 1080) {
        return "tablet";
    }
    return "desktop";
};
/*
各環境のUA
Windows Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0
Macintosh Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36
iPad Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15
Android Mozilla/5.0 (Android 10; Mobile; rv:122.0) Gecko/122.0 Firefox/122.0
iPhone Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/122.0 Mobile/15E148 Safari/605.1.15
 */
export enum SystemType {
    Windows = "Windows",
    Macintosh = "Macintosh",
    iPad = "iPad",
    Android = "Android",
    iPhone = "iPhone",
    Linux = "Linux",
    Other = "Other",
}
export const getSystemType = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Windows")) {
        return SystemType.Windows;
    }
    if (ua.includes("Android")) {
        return SystemType.Android;
    }
    if (ua.includes("iPad")) {
        //古いiPadやiOS12以前ではUAにiPadが含まれるので条件分岐は残す。
        return SystemType.iPad;
    }
    if (ua.includes("Linux")) {
        return SystemType.Linux;
    }
    if (ua.includes("iPhone")) {
        return SystemType.iPhone;
    }
    if (!ua.includes("Macintosh")) {
        return SystemType.Other;
    }
    if (navigator.maxTouchPoints > 0) {
        return SystemType.iPad;
    }
    return SystemType.Macintosh;
};
