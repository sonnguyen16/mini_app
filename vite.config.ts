import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import zmp from "zmp-vite-plugin";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    build: {
      outDir: "www",
    },
    root: ".",
    base: "",
    plugins: [zmp(), tsconfigPaths(), react()],
  });
};
