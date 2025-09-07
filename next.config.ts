import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    webpack: (
        config
    ) => {
        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.('.svg'),
        )

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: {not: [...fileLoaderRule.resourceQuery.not, /url/]}, // exclude if *.svg?url
                use: ['@svgr/webpack'],
            },
        )

        fileLoaderRule.exclude = /\.svg$/i

        // Important: return the modified config
        return config
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: 'preset-default',
                                        params: {
                                            overrides: {
                                                removeViewBox: false,
                                            },
                                        },
                                    },
                                    'removeDimensions',
                                ],
                            },
                        },
                    },
                ],
                as: '*.js',
            },
        },
    },
};

export default nextConfig;