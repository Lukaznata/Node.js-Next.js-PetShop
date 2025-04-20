import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        anek: ["Anek Bangla", "sans-serif"],
      },
      colors: {
        bgColorPrincipal: "#E8E8E8",
      },
    },
  },
  plugins: [],
};
export default config;
