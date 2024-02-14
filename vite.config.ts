import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /*
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    crx({ manifest }),
    solidPlugin(),
  ],
  server: {
    strictPort: true,
    hmr: {
      clientPort: 3000,
    },
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
