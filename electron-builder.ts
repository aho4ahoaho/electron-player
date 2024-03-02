const electronBuilderConfig = {
    appId: "net.naoki-workspace.player",
    productName: "MusicPlayer",
    copyright: "Copyright © 2024 aho4ahoaho",
    directories: {
        output: "dist",
        buildResources: "resources",
    },
    files: [
        {
            from: ".",
            filter: ["package.json", "app"],
        },
    ],
    publish: null,
    extraResources: ["./node_modules/.prisma/**", "./node_modules/@prisma/**"],
    win: {
        target: "nsis",
        icon: "build/icon.ico",
    },
    mac: {
        target: "dmg",
        icon: "build/icon.icns",
    },
    linux: {
        target: ["AppImage"],
        icon: "build/icons",
    },
};

export default electronBuilderConfig;
