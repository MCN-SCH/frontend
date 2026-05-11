export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },

  /* ----------------------------------
   * Global CSS
   * ---------------------------------- */
  css: ["~/assets/scss/index.scss"],

  /* ----------------------------------
   * PostCSS
   * ---------------------------------- */
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  /* ----------------------------------
   * Modules
   * ---------------------------------- */
  modules: [
    "@nuxtjs/eslint-module",
    "@pinia/nuxt",
    ["@vee-validate/nuxt", { autoImports: true }],
    "dayjs-nuxt",
    ["@vueuse/nuxt", { ssr: false }],
    "@nuxtjs/sitemap",
    "@element-plus/nuxt",
    "nuxt-telegram-auth",
    "nuxt-security",
  ],

  /* ----------------------------------
   * Element Plus
   * ---------------------------------- */
  elementPlus: {
    importStyle: "css",
  },

  /* ----------------------------------
   * Runtime Config (SECURE)
   * ---------------------------------- */
  runtimeConfig: {
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
    secretKey: process.env.NUXT_SECRET_KEY,
    public: {
      routeSecret: process.env.ROUTE_SECRET,
      timezone: process.env.TIMEZONE,
      maintenanceMode: process.env.MAINTENANCE_MODE || 'false',
      appBaseUrl: process.env.APP_BASE_URL,
      appSiteUrl: process.env.APP_SITE_URL,
      serverBaseUrl: process.env.SERVER_BASE_URL,
      serverApiUrl: process.env.SERVER_API_URL,
      apiVersion: process.env.API_VERSION,
    },
  },

  /* ----------------------------------
   * Vite
   * ---------------------------------- */
  vite: {
    server: {
      allowedHosts: true,
    },
    optimizeDeps: {
      include: ["dayjs"],
    },
  },

  /* ----------------------------------
   * App Head (GLOBAL SEO)
   * ---------------------------------- */
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      titleTemplate: "%s | MCN",
      title: "MCN",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },

        // SEO
        {
          name: "description",
          content:
            "Mobile Computing & Networking Lab, Department of Software Convergence, Soochunhyang University.",
        },
        { name: "robots", content: "index, follow" },

        // Open Graph (Facebook, Telegram)
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "MCN" },
        { property: "og:title", content: "MCN" },
        {
          property: "og:description",
          content:
            "Mobile Computing & Networking Lab, Department of Software Convergence, Soochunhyang University",
        },
        {
          property: "og:image",
          content: "/images/mcn_white.png",
        },
        {
          property: "og:url",
          content: process.env.APP_SITE_URL,
        },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "MCN" },
        {
          name: "twitter:description",
          content:
            "Mobile Computing & Networking Lab, Department of Software Convergence, Soochunhyang University",
        },
        {
          name: "twitter:image",
          content: "/images/mcn_white.png",
        },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/images/mcn_white.png" },
        { rel: "canonical", href: process.env.APP_SITE_URL },
      ],
    },
  },

  /* ----------------------------------
   * Sitemap
   * ---------------------------------- */
  sitemap: {
    hostname: process.env.APP_SITE_URL || "https://yourwebsite.com",
    gzip: true,
    exclude: ["/admin/**"],
    routes: async () => [
      "/",
      "/page-1",
      "/page-2",
      "/products/product-1",
      "/products/product-2",
    ],
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: "require-corp",
      crossOriginOpenerPolicy: "same-origin",
      crossOriginResourcePolicy: "same-origin",

      contentSecurityPolicy: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", "https:"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "connect-src": [
          "'self'",
          process.env.SERVER_API_URL || "",
        ],
      },
    },
    csrf: true,
    rateLimiter: {
      tokensPerInterval: 100,
      interval: "minute",
    },
  },


  plugins: [
  ],

  routeRules: {
    '/': {
      middleware: ['maintenance']
    },
    '/maintenance': {
      ssr: false // Optional: disable SSR for maintenance page
    }
  },

  compatibilityDate: "2024-12-07",
});
