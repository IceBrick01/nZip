import { build } from 'tsup'
import path from 'path'
import fs from 'fs'

// Bundle The Scripts
export default async (): Promise<void> => {
  if (fs.existsSync(path.join(__dirname, 'Cache', 'Scripts'))) fs.rmSync(path.join(__dirname, 'Cache', 'Scripts'),{ recursive: true })

  fs.mkdirSync(path.join(__dirname, 'Cache', 'Scripts'))

  for (const fileName of fs.readdirSync(path.resolve(__dirname, '../App/Scripts'))) {
    try {
      await build({
        entry: [path.resolve(__dirname, `../App/Scripts/${fileName}`)],
        outDir: path.join(__dirname, 'Cache', 'Scripts'),

        format: 'esm',
        minify: 'terser',

        silent: true
      })
    } catch (error) {
      console.log(error)
    }
  }
}
