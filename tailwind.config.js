/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 添加你项目中的所有文件路径
  ],
  theme: {
    extend: {
      textAlign: ['justify'],
      fontFamily: {
        sans: ['"霞鹜文楷"', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}