import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],

  safelist: [
    'fake-bold',
    'fake-semibold',
  ],

  theme: {
    extend: {
		fontFamily: {
			body: ['var(--font-body)'],
			heading: ['var(--font-heading)'],
		},
    	screens: {
			xs: '480px',     
			sm: '640px',     // 일반 스마트폰
			md: '768px',     // 태블릿
			lg: '1024px',    // 작은 노트북
			xl: '1280px',    // 일반 데스크탑
			'2xl': '1536px', // 큰 모니터 
      },
    },
  },
  plugins: [],
}

export default config
