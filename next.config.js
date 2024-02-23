const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    localeDetection: false,
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en',
      },
      {
        domain: 'example.ar',
        defaultLocale: 'ar',
      },
    ],
  },
  images: {
    domains: [
      'flagcdn.com',
      "res.cloudinary.com"
    ],
  },
  env: {
    NEXTAUTH_SECRET: '2gyZ3GDw3LHZQKDhPmPDL3sjREVRXPr8',
    MAP_API_KEY: 'AIzaSyCsmWfu1AwP4oZvfYxpVpdPwFMXSWyQ-sI',
    NEXTAUTH_URL: 'http://localhost:3000/'
  },
};

module.exports = nextConfig;
// AIzaSyA6MAm8eIW4N0WKJ6yco_pUuO0qiWvqj-Y