// tailwind.config.js
const { colors } = require('./constants/colors.js')

module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.js',
    './nuxt.config.{js,ts}',
    'node_modules/element-plus/es/components/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        complementary: colors.complementary,
        dark: colors.dark,
        light: colors.light,
        success: colors.success,
        warning: colors.warning,
        textDark: colors.textDark,
        textLight: colors.textLight,
      },
    },
  },
  plugins: [],
}
