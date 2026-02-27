/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: '#0a0a0c',
                    secondary: '#141417',
                    tertiary: '#1f1f23',
                },
                accent: {
                    cyan: '#06b6d4',
                    purple: '#8b5cf6',
                    glow: 'rgba(6, 182, 212, 0.4)'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
