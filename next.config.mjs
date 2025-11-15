/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "file-upload-outbank.s3.us-east-2.amazonaws.com",
            },
            {
                hostname: "file-upload-outbank-new.s3.us-east-1.amazonaws.com",
            },
            {
                hostname: "file-upload-outbank-new.s3.amazonaws.com",
            },
        ],
    },
};

export default nextConfig;
