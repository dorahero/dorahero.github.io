/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Noto Sans TC"', 'sans-serif'],
            },
            colors: {
                primary: '#0ea5e9', // Sky 500
                secondary: '#6366f1', // Indigo 500
            },
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
                'glow': '0 0 20px rgba(14, 165, 233, 0.3)',
            }
        },
    },
    plugins: [],
}
