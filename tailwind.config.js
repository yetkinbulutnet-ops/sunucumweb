/** @type {import('tailwindcss').Config} */
module.exports = {
  // Koyu mod <html class="dark"> ile calisir (layout.jsx'teki no-flash scripti ayarlar)
  darkMode: 'class',
  // 7. altin kural: hover sadece gercek imlecte calissin. Dokunmatikte hover
  // sinifi tiklamadan sonra "yapisiyor"; bu bayrak hover'i (hover:hover) medyasina alir.
  future: { hoverOnlyWhenSupported: true },
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './content/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        /* ---- SEMANTIK RENKLER (acik/koyu moda gore globals.css'te degisir) ----
           Bilesenlerde bg-white/text-slate-x YERINE bunlari kullanin ki
           koyu mod tek yerden yonetilsin:
             bg-page      sayfa zemini (yumusak, goz yormayan beyaz)
             bg-surface   kart/panel zemini
             bg-surface2  vurgulu bolum zemini
             border-line  ayirici cizgiler
             text-strong  basliklar
             text-body    govde metni
             text-muted   soluk/ikincil metin                                   */
        page: 'rgb(var(--c-page) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        surface2: 'rgb(var(--c-surface2) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        strong: 'rgb(var(--c-strong) / <alpha-value>)',
        body: 'rgb(var(--c-body) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        /* marka tonlari: acik modda cok acik teal, koyu modda koyu teal */
        brandsoft: 'rgb(var(--c-brandsoft) / <alpha-value>)',
        brandtext: 'rgb(var(--c-brandtext) / <alpha-value>)',
        brandline: 'rgb(var(--c-brandline) / <alpha-value>)',
        // YESIL-BEYAZ kurumsal tema (eski corporate/primary mavileri -> emerald yesil)
        corporate: {
          50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
          400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
          800: '#065f46', 900: '#064e3b',
        },
        primary: {
          50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
          400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
          800: '#065f46', 900: '#064e3b', 950: '#022c22',
        },
        // koyu bolumler (footer vs.) -> derin yesil-antrasit
        dark: { 800: '#0f2e21', 900: '#0a2117', 950: '#05130c' },
        'custom-blue': { DEFAULT: '#059669', dark: '#047857' },
        'xhost-blue': '#10b981',
        // YENI modern tema: logo turkuazi (accent) + lacivert murekkep
        brand: {
          50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4',
          400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e',
          800: '#115e59', 900: '#134e4a',
        },
        ink: { DEFAULT: '#0f2942', 700: '#1c3a57', 600: '#33506e' },
      },
      fontFamily: {
        /* Poppins yuklenmezse (Linux, kisitli ag, eski cihaz) yerine sistem
           fontu gecsin; olcu ve satir yuksekligi kaymasin. */
        sans: [
          'Poppins',
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Noto Sans',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
        ],
      },
      boxShadow: {
        elegant: '0 10px 25px -5px rgba(6, 95, 70, 0.08), 0 8px 10px -6px rgba(6, 95, 70, 0.03)',
        card: '0 20px 25px -5px rgba(6, 95, 70, 0.10), 0 10px 10px -5px rgba(6, 95, 70, 0.04)',
      },
    },
  },
  plugins: [],
};
