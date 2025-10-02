import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack: config => {
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.(".svg"))

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: false,
              ref: true,
            },
          },
        ],
      }
    )

    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: false,
              ref: true,
            },
          },
        ],
        as: "*.js",
      },
    },
  },
}

export default nextConfig
