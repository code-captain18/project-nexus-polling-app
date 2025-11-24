module.exports = {
    expo: {
        name: "vunes-poll",
        slug: "vunes-poll",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "vunes-poll",
        userInterfaceStyle: "automatic",
        splash: {
            image: "./assets/images/splash.png",
            resizeMode: "contain",
            backgroundColor: "#FFFFFF"
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.vunespoll.app"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.vunespoll.app"
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router"
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            apiUrl: process.env.API_URL || "http://localhost:3000"
        }
    }
};
