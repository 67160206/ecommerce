import type { Config } from 'tailwindcss'
export default { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { brand: '#16739f', leaf: '#4c9f3a', navy: '#1e2d40' } } }, plugins: [] } satisfies Config
