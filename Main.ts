import path from 'path'
import fs from 'fs'

import startHttpServer from './Server/HttpServer'
import startSocket from './Server/SocketServer'
import bundle from './Server/Bundle'

import { httpHost, httpPort, apiHost, imageHost, development, version } from './Options.json'

if (!fs.existsSync(path.join(__dirname, 'Server', 'Cache'))) fs.mkdirSync(path.join(__dirname, 'Server', 'Cache'))
if (fs.existsSync(path.join(__dirname, 'Server', 'Cache', 'Downloads'))) fs.rmSync(path.join(__dirname, 'Server', 'Cache', 'Downloads'), { recursive: true })

// Start The Server
async function start (): Promise<void> {
  await bundle()

  const server = startHttpServer(httpHost, httpPort, apiHost, imageHost, version)
  startSocket(server, httpHost, apiHost)

  if (development) {
    setInterval(() => bundle(), 5000)
  }
}

start()
