/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 添加你项目中的所有文件路径
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"LXGW WenKai"', 'Consolas'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}