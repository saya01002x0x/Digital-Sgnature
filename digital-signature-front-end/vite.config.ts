import react from "@vitejs/plugin-react"
import * as path from "node:path"
import { defineConfig } from "vitest/config"
import { checker } from "vite-plugin-checker"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"
import packageJson from "./package.json" with { type: "json" }
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths(),
    checker({ typescript: true }),
    svgr(),
    tailwindcss()
  ],

  server: {
    open: true,
    port: 5556,
  },

  test: {
    root: import.meta.dirname,
    name: packageJson.name,
    environment: "jsdom",

    typecheck: {
      enabled: true,
      tsconfig: path.join(import.meta.dirname, "tsconfig.json"),
    },

    globals: true,
    watch: false,
    setupFiles: ["./src/setupTests.ts"],
  },
})
