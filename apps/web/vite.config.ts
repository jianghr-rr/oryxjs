import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? "3000");

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host,
    port,
  },
  preview: {
    host,
    port,
  },
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
});
