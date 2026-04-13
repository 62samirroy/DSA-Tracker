// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#FFFFFF',
                'dark-1': '#06141B',
                'dark-2': '#11212D',
                'dark-3': '#253745',
                'dark-4': '#4A5C6A',
                'dark-5': '#9BA8AB',
                'dark-6': '#CCD0CF',
                'success': '#10B981',
                'warning': '#F59E0B',
                'danger': '#EF4444',
                'info': '#3B82F6',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'scale-up': 'scaleUp 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                scaleUp: {
                    '0%': { transform: 'scale(0.95)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
}