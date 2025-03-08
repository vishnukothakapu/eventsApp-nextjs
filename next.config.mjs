/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.module.rules.push({
            test: /\.html$/,
            use: ['html-loader'],
        });
        return config;
    },
    images:{
        domains:['google.com','lh3.googleusercontent.com','github.com'],
    }
};

export default nextConfig;
