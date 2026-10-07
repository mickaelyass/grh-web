import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import autoprefixer from 'autoprefixer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  // Charge aussi les variables non prefixees (pas de 3e argument => toutes),
  // pour pouvoir lire API_PROXY_TARGET sans l'exposer au bundle client.
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget = env.API_PROXY_TARGET || 'http://localhost:3003'

  return {
    base: './',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          // Nothing is injected here: the partials import `config` themselves
          // (`@use 'config' as *;`), which is the only safe way to share Sass
          // members without duplicating rules across every stylesheet.
          loadPaths: [path.resolve(__dirname, 'src/scss')],
          quietDeps: true,
          silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
        },
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // Le port 3000 peut etre occupe par une autre application : Vite bascule
      // alors automatiquement sur 3001, 3002... Le proxy ci-dessous rend le front
      // independant de son propre port : les appels partent de la meme origine que
      // la page, il n'y a donc plus aucune requete cross-origin ni pre-verification
      // CORS, quels que soient les ports utilises.
      proxy: {
        // API grh-api (voir VITE_API_BASE_URL=/api dans .env.development)
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
        // Socket.io : meme origine que l'app en dev, la cible reste l'API
        '/socket.io': {
          target: apiProxyTarget,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  }
})
