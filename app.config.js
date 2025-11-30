module.exports = {
    expo: {
        name: "Vunes Poll",
        slug: "vunes-poll",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/vunes-logo.png",
        scheme: "vunes-poll",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        splash: {
            image: "./assets/images/vunes-logo.png",
            resizeMode: "contain",
            backgroundColor: "#1E293B"
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.vunes.poll",
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
                NSAppTransportSecurity: {
                    NSAllowsArbitraryLoads: false,
                    NSExceptionDomains: {
                        "onrender.com": {
                            NSExceptionAllowsInsecureHTTPLoads: false,
                            NSIncludesSubdomains: true,
                            NSExceptionRequiresForwardSecrecy: true,
                            NSExceptionMinimumTLSVersion: "TLSv1.2"
                        },
                        "localhost": {
                            NSExceptionAllowsInsecureHTTPLoads: true,
                            NSIncludesSubdomains: true
                        }
                    }
                }
            }
        },
        android: {
            package: "com.vunes.poll",
            adaptiveIcon: {
                backgroundColor: "#E6F4FE",
                foregroundImage: "./assets/images/android-icon-foreground.png",
                backgroundImage: "./assets/images/android-icon-background.png",
                monochromeImage: "./assets/images/android-icon-monochrome.png"
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            usesCleartextTraffic: true,
            permissions: [
                "INTERNET",
                "ACCESS_NETWORK_STATE"
            ],
            networkSecurityConfig: "./android/app/src/main/res/xml/network_security_config.xml"
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                    dark: {
                        backgroundColor: "#000000"
                    }
                }
            ]
        ],
        experiments: {
            typedRoutes: true,
            reactCompiler: true
        },
        extra: {
            apiUrl: process.env.API_URL || "http://localhost:3000",
            eas: {
                projectId: "addffad8-0636-4c23-a07e-7343df14e60d"
            }
        }
    }
};
