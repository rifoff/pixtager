/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      { DEFAULT:'#0a0a0b', 2:'#111113', 3:'#18181b', 4:'#222226' },
        border:  { DEFAULT:'#27272b', 2:'#35353b' },
        txt:     { DEFAULT:'#f2efe9', 2:'#888590', 3:'#4a4850' },
        accent:  { DEFAULT:'#e8b44a', 2:'#f0c860', dim:'rgba(232,180,74,0.10)', dim2:'rgba(232,180,74,0.05)' },
        ok:      { DEFAULT:'#4caf82', dim:'rgba(76,175,130,0.10)' },
        danger:  { DEFAULT:'#e05252', dim:'rgba(224,82,82,0.08)' },
      },
      fontFamily: {
        sans:    ['var(--font-manrope)', 'system-ui'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-unbounded)', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease both',
        'marquee': 'marquee 22s linear infinite',
      },
      keyframes: {
        fadeUp:  { from:{ opacity:'0', transform:'translateY(14px)' }, to:{ opacity:'1', transform:'none' } },
        marquee: { from:{ transform:'translateX(0)' }, to:{ transform:'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
