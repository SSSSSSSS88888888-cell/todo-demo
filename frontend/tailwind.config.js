/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sansu: '#3B82F6',
        kokugo: '#EF4444',
        rika: '#10B981',
        shakai: '#F59E0B',
      },
    },
  },
  plugins: [],
};
