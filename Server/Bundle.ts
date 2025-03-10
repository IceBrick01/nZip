import { build } from 'tsup'
import path, { win32, posix } from 'path'
import fs from 'fs'

import Log from '@icebrick/log'

/**
 * Bundle scripts
 */
export default async (): Promise<void> => {
  if (!fs.existsSync(path.join(__dirname, './Scripts'))) return

  Log.info('Bundling Scripts...')

  if (fs.existsSync(path.join(__dirname, '../App/Scripts'))) fs.rmSync(path.join(__dirname, '../App/Scripts'), { recursive: true })

  fs.mkdirSync(path.join(__dirname, '../App/Scripts'), { recursive: true })

  for (const fileName of fs.readdirSync(path.resolve(__dirname, './Scripts'))) {
    Log.info(`Bundling ${fileName}...`)
    try {
      await build({
        entry: [path.resolve(__dirname, `./Scripts/${fileName}`).split(win32.sep).join(posix.sep)],
        outDir: path.join(__dirname, '../App/Scripts'),

        format: 'esm',
        minify: 'terser',

        silent: true,
        noExternal: [/(.*)/]
      })
      Log.success(`Bundled ${fileName}`)
    } catch (error) {
      Log.error(`Failed to bundle ${fileName}:`, error)
    }
  }

  Log.success('Bundled Scripts')
}
