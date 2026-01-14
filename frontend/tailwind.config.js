/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    bg: 'rgb(var(--color-primary-bg) / <alpha-value>)',
                    text: 'rgb(var(--color-primary-text) / <alpha-value>)',
                },
                accent: {
                    DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
                },
                brand: {
                    start: 'rgb(var(--color-brand-start) / <alpha-value>)',
                    end: 'rgb(var(--color-brand-end) / <alpha-value>)',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
