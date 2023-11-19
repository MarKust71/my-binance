import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      include: [],
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    disabled: false,
  },
  plugins: [react(), nodePolyfills(), tsconfigPaths()],
  server: {
    port: 3000,
  },
});
