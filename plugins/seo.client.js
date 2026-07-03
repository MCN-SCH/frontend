export default defineNuxtPlugin(() => {
  // Google Analytics (if you have)
  if (process.client && window) {
    // Add Google Analytics
    const gaId = process.env.GOOGLE_ANALYTICS_ID;
    if (gaId) {
      // Load GA script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', gaId);
    }
  }
});
