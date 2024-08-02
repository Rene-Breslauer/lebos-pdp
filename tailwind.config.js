import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}', './**/*.{liquid,json}'
    ],
    theme: {
        extend: {
            container: {
                center: true,
                padding: {
                    'DEFAULT': '20px'
                }
            },
            screens: {
                md: '768px',
                lg: '1130px',
                xl: '1420px',
                '2xl': '1420px'
            },
            fontFamily: {
                heading: ['var(--font-heading-family)', ...defaultTheme.fontFamily.sans],
                body: ['var(--font-body-family)', ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                xs: ['var(--font-size-xs)', '17px'], // 12px / 17px
                sm: ['var(--font-size-sm)', '21px'], // 14px / 21px
                base: ['var(--font-size-base)', '18px'], // 16px / 18px
                lg: ['var(--font-size-lg)', '25px'], // 18px / 25px
                xl: ['var(--font-size-xl)', '28px'], // 20px / 28px
                '2xl': ['var(--font-size-2xl)', '30px'], // 24px / 30px
                '3xl': ['var(--font-size-3xl)', '36px'], // 30px / 36px
                '4xl': ['var(--font-size-4xl)', '42px'], // 34px / 42px
                '5xl': ['var(--font-size-5xl)', '36px'], // 44px / 36px
            },
            colors: {
                'white': 'rgba(var(--color-white) / <alpha-value>)',
                'black': 'rgba(var(--color-black) / <alpha-value>)',
                'primary': 'rgba(var(--color-primary) / <alpha-value>)',
                'brand': 'rgba(var(--color-brand) / <alpha-value>)',
                'green-400': 'rgba(var(--color-green-400) / <alpha-value>)',
                'gray-100': 'rgba(var(--color-gray-100) / <alpha-value>)',
                'gray-200': 'rgba(var(--color-gray-200) / <alpha-value>)',
                'gray-700': 'rgba(var(--color-gray-700) / <alpha-value>)',
                'gray-800': 'rgba(var(--color-gray-800) / <alpha-value>)',
            },
            spacing: {
                0.75: '0.1875rem', // 3px
                1.25: '0.3125rem', // 5px
                1.75: '0.4375rem', // 7px
                2.75: '0.6875rem', // 11px
                3.75: '0.9375rem', // 15px
                4.25: '1.0625rem', // 17px
                4.5: '1.125rem', // 18px
                4.75: '1.1875rem', // 19px
                5.5: '1.375rem', // 22px
                6.25: '1.5625rem', // 25px
                6.5: '1.625rem', // 26px
                7.5: '1.875rem', // 30px
                8.5: '2.125rem', // 34px
                9.5: '2.375rem', // 38px
                10.5: '2.625rem', // 42px
                12.5: '3.125rem', // 50px
                13.5: '3.375rem', // 54px
                15: '3.75rem', // 60px
                17: '4.25rem', // 68px
                18: '4.5rem', // 72px
                25: '6.25rem', // 100px
                50: '12.5rem', // 200px
                75: '18.75rem', // 300px
            },
            lineHeight: {
                4.5: '1.125rem', // 18px
            }
        },
    },
};
