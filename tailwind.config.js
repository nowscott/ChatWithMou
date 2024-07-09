/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 添加你项目中的所有文件路径
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['LXGW WenKai', 'Consolas', 'Smiley Sans Oblique', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}