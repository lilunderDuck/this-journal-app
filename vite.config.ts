import { 
  defineConfig, 
  type Plugin,
} from 'vite'
// ...
import solidPlugin from 'vite-plugin-solid'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'
import { stylex as stylexPlugin } from 'vite-plugin-stylex-dev'
import { ViteImageOptimizer as imageOptimizer } from 'vite-plugin-image-optimizer'
// ...
import tsconfig from './tsconfig.json'
import { 
  BASE_OUTPUT_DIRECTORY,
  CLIENT_OUTPUT_DIRECTORY,
  getAliasPath,
  getEsbuildConfig,
  macroPlugin,
  rollupOutputOptions
} from './config'

export default defineConfig(({ command }) => {
  const devMode = command === "serve"

  return {
    plugins: [
      optimizeCssModules() as Plugin,
      solidPlugin(),
      stylexPlugin(),
      imageOptimizer() as Plugin,
      macroPlugin
    ],
    define: {
      "isDevMode": `${devMode}`,
    },
    optimizeDeps: {
      // for some reason adding all of these packages, the error gone
      include: [
        "@tiptap/core",
        "@tiptap/extension-bubble-menu",
        "@tiptap/extension-code-block-lowlight",
        "@tiptap/extension-color",
        "@tiptap/extension-floating-menu",
        "@tiptap/extension-highlight",
        "@tiptap/extension-link",
        "@tiptap/extension-placeholder",
        "@tiptap/extension-subscript",
        "@tiptap/extension-superscript",
        "@tiptap/extension-table",
        "@tiptap/extension-table-cell",
        "@tiptap/extension-table-header",
        "@tiptap/extension-table-row",
        "@tiptap/extension-task-item",
        "@tiptap/extension-task-list",
        "@tiptap/extension-text-style",
        "@tiptap/extension-underline",
        "@tiptap/starter-kit",
      ]
    },
    server: {
      port: 1337
    },
    resolve: {
      alias: getAliasPath(tsconfig, __dirname)
    },
    ...getEsbuildConfig(devMode),
    cacheDir: `${BASE_OUTPUT_DIRECTORY}/dist`,
    build: {
      outDir: CLIENT_OUTPUT_DIRECTORY,
      rollupOptions: {
        output: rollupOutputOptions
      }
    },
    publicDir: "./frontend/public"
  }
})