import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        // icon: 'https://vitejs.dev/logo.svg',
        namespace: 'yopu-assistant',
        match: ['https://yopu.co/view/*'],
        name: "有谱么助手",
        version: '0.0.2',
        author: "Neo",
        copyright: "2026 Neo MIT 协议开源",
        description: "有谱么助手，为 有谱么 添加一些功能，如全屏看谱，防止息屏。",
        license: "MIT",
        source: "https://github.com/TacKana/yopu-Assistant",
        grant: ['unsafeWindow'],
      },
    }),
  ],
});
