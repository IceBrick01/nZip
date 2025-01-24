import { build } from 'tsup'
import path, { win32, posix } from 'path'
import fs from 'fs'

import Log from './Log'

// Bundle The Scripts
export default async (): Promise<void> => {
  Log.info('Bundling Scripts...')

  if (fs.existsSync(path.join(__dirname, 'Cache', 'Scripts'))) fs.rmSync(path.join(__dirname, 'Cache', 'Scripts'), { recursive: true })

  fs.mkdirSync(path.join(__dirname, 'Cache', 'Scripts'), { recursive: true })

  for (const fileName of fs.readdirSync(path.resolve(__dirname, '../App/Scripts'))) {
    Log.info(`Bundling ${fileName}...`)
    try {
      await build({
        entry: [path.resolve(__dirname, `../App/Scripts/${fileName}`).split(win32.sep).join(posix.sep)],
        outDir: path.join(__dirname, 'Cache', 'Scripts'),

        format: 'esm',
        minify: 'terser',

        silent: true
      })
      Log.success(`Bundled ${fileName}`)
    } catch (error) {
      Log.error(`Failed to bundle ${fileName}:`, error)
    }
  }

  Log.success('Bundled Scripts')
}
