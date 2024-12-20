import { defineConfig, type InlineConfig } from 'vite'
// ...
import { VitePluginNode as nodePlugin } from 'vite-plugin-node'
// ...
import { getEsbuildConfig, getAliasPath, internals } from './scripts/vite'
import tsconfig from './tsconfig.json'

const config = (devMode: boolean): InlineConfig => ({
  plugins: [
    // @ts-ignore
    nodePlugin({
      adapter: () => {},
      appPath: './src/entry-server.ts',
    }),
  ],
  publicDir: false,
  resolve: {
    alias: getAliasPath(tsconfig, __dirname)
  },
  ...getEsbuildConfig(devMode),
  server: {
    port: 8000
  },
  ssr: {
    target: 'node',
    noExternal: [
      "bson",
      "@hono/node-server",
      "hono"
    ],
  },
  cacheDir: internals.outDir,
  build: {
    target: 'esnext',
    outDir: internals.serverOutDir,
    minify: !devMode,
    sourcemap: devMode,
    rollupOptions: {
      treeshake: true
    }
  },
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const devMode = mode === 'development'
  
  return config(devMode)
})