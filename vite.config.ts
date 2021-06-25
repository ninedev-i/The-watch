import vue from '@vitejs/plugin-vue';
import {UserConfig} from 'vite';
import dotenv from 'dotenv';
import {join} from 'path';

dotenv.config({ path: join(__dirname, '.env') });
const root = join(__dirname, 'src/render');

const config: UserConfig = {
  root,
  resolve: {
    alias: {
      '/@': root,
    }
  },
  base: './',
  build: {
    outDir: join('../../dist/render'),
    emptyOutDir: true
  },
  server: {
    // @ts-ignore
    port: +process.env.PORT,
  },
  plugins: [
    vue()
  ],
  optimizeDeps: {
    // @ts-ignore
    auto: true,
    exclude: [
      'electron-is-dev',
      'electron-store',
    ]
  },
};

export default config;
