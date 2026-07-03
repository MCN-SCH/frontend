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

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English' },
      { code: 'ko', language: 'ko-KR', name: '한국어' },
    ],
    defaultLocale: 'ko',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

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
   * App Head (GLOBAL SEO - ENHANCED)
   * ---------------------------------- */
  app: {
    head: {
      htmlAttrs: {
        lang: "ko",
        prefix: "og: http://ogp.me/ns#",
      },
      titleTemplate: "%s | MCN - 모바일컴퓨팅네트워킹 연구실 | 순천향대학교",
      title: "MCN 연구실",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=5.0" },

        // PRIMARY SEO - English
        {
          name: "description",
          content: "Mobile Computing & Networking Lab, Department of Software Convergence, Soonchunhyang University. 모바일컴퓨팅네트워킹 연구실 | 김석훈 교수 | 소프트웨어융합학과",
        },
        { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large" },
        { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large" },

        // KEYWORDS (English & Korean)
        { name: "keywords", content: [
            "MCN",
            "SCH",
            "Soonchunhyang University",
            "Mobile Computing",
            "Networking Lab",
            "김석훈",
            "KIM Sokhoon",
            "모바일컴퓨팅",
            "네트워킹 연구실",
            "순천향대학교",
            "순천향대",
            "소프트웨어융합학과",
            "SCH University",
            "Mobile Computing Lab",
            "Networking Research",
            "SCH Software Convergence",
            "순천향대 소프트웨어",
            "김석훈 교수",
            "Professor KIM Sokhoon",
            "이동통신 연구",
            "Wireless Networking",
            "IoT Research",
            "SCH Research Lab",
            "순천향대 컴퓨터공학",
            "SCH Computer Science",
            "5G 연구",
            "인공지능 연구",
            "AI Research",
            "모바일 네트워킹",
            "SCH AI Lab",
            "순천향대 연구실",
          ].join(", ") },

        // AUTHOR & PUBLISHER
        { name: "author", content: "MCN Lab, Soonchunhyang University" },
        { name: "publisher", content: "Soonchunhyang University" },
        { name: "copyright", content: `MCN Lab ${new Date().getFullYear()}` },

        // Open Graph (Enhanced)
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "MCN 연구실 - 순천향대학교" },
        { property: "og:title", content: "MCN 연구실 | 모바일컴퓨팅네트워킹 연구실 | Soonchunhyang University" },
        {
          property: "og:description",
          content: "Mobile Computing & Networking Lab, Department of Software Convergence, Soonchunhyang University. 모바일컴퓨팅네트워킹 연구실 | 김석훈 교수 | 소프트웨어융합학과",
        },
        {
          property: "og:image",
          content: "/images/mcn_og_image.png",
        },
        {
          property: "og:image:width",
          content: "1200",
        },
        {
          property: "og:image:height",
          content: "630",
        },
        {
          property: "og:url",
          content: process.env.APP_SITE_URL,
        },
        { property: "og:locale", content: "ko_KR" },
        { property: "og:locale:alternate", content: "en_US" },

        // Twitter Card (Enhanced)
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@MCNLab_SCH" },
        { name: "twitter:creator", content: "@MCNLab_SCH" },
        { name: "twitter:title", content: "MCN 연구실 - 모바일컴퓨팅네트워킹 연구실" },
        {
          name: "twitter:description",
          content: "Mobile Computing & Networking Lab, Department of Software Convergence, Soonchunhyang University",
        },
        {
          name: "twitter:image",
          content: "/images/mcn_twitter_card.png",
        },

        // Additional SEO
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black" },
        { name: "theme-color", content: "#0a1628" },
        { name: "referrer", content: "strict-origin-when-cross-origin" },

        // Verification for search engines
        { name: "google-site-verification", content: process.env.GOOGLE_SITE_VERIFICATION || "" },
        { name: "naver-site-verification", content: process.env.NAVER_SITE_VERIFICATION || "" },
      ],
      link: [
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/images/mcn_white.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/images/mcn_white.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/images/mcn_white.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "canonical", href: process.env.APP_SITE_URL },

        // Preconnect for performance
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },

        // RSS Feed
        { rel: "alternate", type: "application/rss+xml", title: "MCN Lab RSS Feed", href: "/feed.xml" },
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ResearchOrganization",
            "name": "MCN Lab - Mobile Computing & Networking Lab",
            "alternateName": ["모바일컴퓨팅네트워킹 연구실", "MCN"],
            "url": process.env.APP_SITE_URL,
            "logo": `${process.env.APP_SITE_URL}/images/mcn_logo.png`,
            "description": "Mobile Computing & Networking Lab, Department of Software Convergence, Soonchunhyang University",
            "foundingDate": "2000",
            "founder": {
              "@type": "Person",
              "name": "KIM Sokhoon",
              "alternateName": "김석훈",
              "jobTitle": "Professor",
              "affiliation": "Soonchunhyang University",
              "email": "skim@sch.ac.kr",
              "url": `${process.env.APP_SITE_URL}/people/professor-kim-sokhoon`,
            },
            "parentOrganization": {
              "@type": "CollegeOrUniversity",
              "name": "Soonchunhyang University",
              "alternateName": "순천향대학교",
              "url": "https://www.sch.ac.kr"
            },
            "department": {
              "@type": "Department",
              "name": "Department of Software Convergence",
              "alternateName": "소프트웨어융합학과",
              "url": "https://software.sch.ac.kr"
            },
            "sameAs": [
              "https://scholar.google.com/",
              "https://www.researchgate.net/",
              "https://github.com/",
              "https://orcid.org/"
            ],
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${process.env.APP_SITE_URL}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })
        }
      ],
    },
  },

  /* ----------------------------------
   * Sitemap (Enhanced)
   * ---------------------------------- */
  sitemap: {
    hostname: process.env.APP_SITE_URL || "https://mcn.sch.ac.kr",
    gzip: true,
    exclude: ["/admin/**", "/dashboard/**", "/maintenance"],
    routes: async () => {
      // You can fetch dynamic routes from your API here
      const staticRoutes = [
        // Main pages
        "/",
        "/about",
        "/research",
        "/publications",
        "/people",
        "/news",
        "/contact",

        // Korean pages
        "/ko",
        "/ko/about",
        "/ko/research",
        "/ko/publications",
        "/ko/people",
        "/ko/news",

        // Project pages
        "/projects/mobile-computing",
        "/projects/networking",
        "/projects/iot",
        "/projects/ai",
        "/projects/5g",

        // People
        "/people/professor-kim-sokhoon",
        "/people/researchers",
        "/people/alumni",

        // Publications by year
        "/publications/2024",
        "/publications/2023",
        "/publications/2022",
      ];

      return staticRoutes;
    },
    // Add changefreq and priority
    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
  },

  /* ----------------------------------
   * Security (ENHANCED)
   * ---------------------------------- */
  security: {
    headers: {
      // Basic Security Headers
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: "same-origin",
      crossOriginResourcePolicy: "same-origin",

      // Additional Security Headers
      xFrameOptions: "DENY",
      xXSSProtection: "1; mode=block",
      xContentTypeOptions: "nosniff",
      referrerPolicy: "strict-origin-when-cross-origin",
      permissionsPolicy: {
        geolocation: [],
        microphone: [],
        camera: [],
        payment: [],
        usb: [],
        "fullscreen": ["self"],
      },

      // Enhanced CSP with more allowlist
      contentSecurityPolicy: {
        "base-uri": ["'self'"],
        "default-src": ["'self'"],
        "img-src": [
          "'self'",
          "data:",
          "https:",
          "http://localhost:8000",
          "http://localhost:*",
          "https://*.sch.ac.kr",
          "https://*.googleapis.com",
          "https://*.gstatic.com",
          "https://*.githubusercontent.com",
        ],
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://*.googleapis.com",
          "https://*.gstatic.com",
          "https://*.sch.ac.kr",
          "https://*.googletagmanager.com",
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://*.googleapis.com",
          "https://*.gstatic.com",
        ],
        "connect-src": [
          "'self'",
          process.env.SERVER_API_URL || "",
          "http://localhost",
          "http://localhost:8000",
          "http://localhost:80",
          "http://127.0.0.1",
          "http://127.0.0.1:8000",
          "https://*.sch.ac.kr",
          "https://*.googleapis.com",
          "https://*.telegram.org",
          "wss://*.telegram.org",
        ].filter(Boolean),
        "font-src": [
          "'self'",
          "data:",
          "https://*.gstatic.com",
          "https://*.googleapis.com",
        ],
        "frame-src": [
          "'self'",
          "https://*.sch.ac.kr",
          "https://*.telegram.org",
        ],
        "media-src": ["'self'", "data:", "https:"],
        "object-src": ["'none'"],
        "worker-src": ["'self'", "blob:"],
        "manifest-src": ["'self'"],
      },
    },

    // CSRF Protection
    csrf: {
      enabled: process.env.NODE_ENV === 'production',
      cookieName: 'csrf-token',
      headerName: 'x-csrf-token',
      methodsToProtect: ['POST', 'PUT', 'DELETE', 'PATCH'],
    },

    // Rate Limiting
    rateLimiter: {
      tokensPerInterval: 100,
      interval: "minute",
      max: 1000,
      driver: "memory",
    },

    // XSS Protection
    xssValidator: {
      enabled: true,
      throwOnError: false,
      sanitizeHtmlOptions: {
        allowedTags: ['b', 'i', 'u', 'em', 'strong', 'a', 'p', 'br'],
        allowedAttributes: {
          'a': ['href', 'target'],
        },
      },
    },

    // HSTS (HTTP Strict Transport Security)
    hsts: {
      enabled: process.env.NODE_ENV === 'production',
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  },

  /* ----------------------------------
   * Route Rules
   * ---------------------------------- */
  routeRules: {
    '/': {
      swr: 3600, // Cache for 1 hour
    },
    '/maintenance': {
      ssr: false,
    },
    '/publications/**': {
      swr: 604800, // Cache for 1 week
    },
    '/research/**': {
      swr: 86400, // Cache for 1 day
    },
    '/people/**': {
      swr: 43200, // Cache for 12 hours
    },
  },

  /* ----------------------------------
   * Nitro (Performance)
   * ---------------------------------- */
  nitro: {
    compressPublicAssets: true,
    minify: true,
    routeRules: {
      '/assets/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
        },
      },
      '/images/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
        },
      },
      '/_nuxt/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
        },
      },
    },
  },

  compatibilityDate: "2024-12-07",
});
