/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "file-upload-outbank.s3.us-east-2.amazonaws.com",
            },
        ],
    },
};

export default nextConfig;
