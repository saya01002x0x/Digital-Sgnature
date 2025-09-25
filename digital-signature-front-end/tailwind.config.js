/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // corePlugins: { // this fucking shit is deprecated  in fuking v4
  //   preflight: false, // Disable Tailwind's reset to prevent conflicts with Ant Design
  // },
  theme: {
    extend: {},
  },
  plugins: [],
}
