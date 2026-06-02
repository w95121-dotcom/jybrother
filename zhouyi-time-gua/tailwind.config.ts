import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17130f",
        paper: "#f7f2e8",
        rice: "#ede3d1",
        cinnabar: "#9d2f20",
        jade: "#2f6655",
        bronze: "#8b6f3e"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(38, 28, 18, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
