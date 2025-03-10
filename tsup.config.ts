import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./Main.ts'],
  minify: true,
  sourcemap: true,
  clean: true,
  noExternal: ['@icebrick/log', '@icebrick/nhget', '@icebrick/file-downloader', '@lightbery/scope'],
  outDir: './dist'
})
