// vite.config.mjs
import { defineConfig } from "file:///home/bonheur/Bureau/new/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///home/bonheur/Bureau/new/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "node:path";
import autoprefixer from "file:///home/bonheur/Bureau/new/frontend/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_dirname = "/home/bonheur/Bureau/new/frontend";
var vite_config_default = defineConfig(() => {
  return {
    base: "./",
    build: {
      outDir: "build"
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({})
          // add options if needed
        ]
      },
      preprocessorOptions: {
        scss: {
          quietDeps: true
        }
      }
    },
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.jsx?$/,
      exclude: []
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          ".js": "jsx"
        }
      }
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: "src/",
          replacement: `${path.resolve(__vite_injected_original_dirname, "src")}/`
        }
      ],
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".scss"]
    },
    server: {
      port: 3e3,
      proxy: {
        // https://vitejs.dev/config/server-options.html
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYm9uaGV1ci9CdXJlYXUvbmV3L2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9ib25oZXVyL0J1cmVhdS9uZXcvZnJvbnRlbmQvdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2JvbmhldXIvQnVyZWF1L25ldy9mcm9udGVuZC92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgYmFzZTogJy4vJyxcbiAgICBidWlsZDoge1xuICAgICAgb3V0RGlyOiAnYnVpbGQnLFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwb3N0Y3NzOiB7XG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICBhdXRvcHJlZml4ZXIoe30pLCAvLyBhZGQgb3B0aW9ucyBpZiBuZWVkZWRcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBxdWlldERlcHM6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgZXNidWlsZDoge1xuICAgICAgbG9hZGVyOiAnanN4JyxcbiAgICAgIGluY2x1ZGU6IC9zcmNcXC8uKlxcLmpzeD8kLyxcbiAgICAgIGV4Y2x1ZGU6IFtdLFxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBmb3JjZTogdHJ1ZSxcbiAgICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAgIGxvYWRlcjoge1xuICAgICAgICAgICcuanMnOiAnanN4JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6ICdzcmMvJyxcbiAgICAgICAgICByZXBsYWNlbWVudDogYCR7cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpfS9gLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGV4dGVuc2lvbnM6IFsnLm1qcycsICcuanMnLCAnLnRzJywgJy5qc3gnLCAnLnRzeCcsICcuanNvbicsICcuc2NzcyddLFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiAzMDAwLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9zZXJ2ZXItb3B0aW9ucy5odG1sXG4gICAgICB9LFxuICAgIH0sXG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVSLFNBQVMsb0JBQW9CO0FBQ3BULE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxrQkFBa0I7QUFIekIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhLE1BQU07QUFDaEMsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxRQUNQLFNBQVM7QUFBQSxVQUNQLGFBQWEsQ0FBQyxDQUFDO0FBQUE7QUFBQSxRQUNqQjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLFdBQVc7QUFBQSxRQUNiO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFFBQVE7QUFBQSxNQUNSLFNBQVM7QUFBQSxNQUNULFNBQVMsQ0FBQztBQUFBLElBQ1o7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLE9BQU87QUFBQSxNQUNQLGdCQUFnQjtBQUFBLFFBQ2QsUUFBUTtBQUFBLFVBQ04sT0FBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLElBQ2pCLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhLEdBQUcsS0FBSyxRQUFRLGtDQUFXLEtBQUssQ0FBQztBQUFBLFFBQ2hEO0FBQUEsTUFDRjtBQUFBLE1BQ0EsWUFBWSxDQUFDLFFBQVEsT0FBTyxPQUFPLFFBQVEsUUFBUSxTQUFTLE9BQU87QUFBQSxJQUNyRTtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBO0FBQUEsTUFFUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
