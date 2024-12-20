import path from 'path'
import fs from 'fs'

import startHttpServer from './Server/HttpServer'
import startSocket from './Server/SocketServer'
import bundle from './Server/Bundle'

import { version } from './package.json'

const httpHost = process.env.HOST || 'http://localhost'
const httpPort = parseInt(process.env.PORT || '3000')
const apiHost = process.env.API_URL ? process.env.API_URL : (() => { throw new Error('API_URL is not defined') })()
const imageHost = process.env.IMAGE_URL ? process.env.IMAGE_URL : (() => { throw new Error('IMAGE_URL is not defined') })()
const analytics = process.env.ANALYTICS || ''
const development = process.env.DEV === 'true'

if (!fs.existsSync(path.join(__dirname, 'Server', 'Cache'))) fs.mkdirSync(path.join(__dirname, 'Server', 'Cache'))
if (fs.existsSync(path.join(__dirname, 'Server', 'Cache', 'Downloads'))) fs.rmSync(path.join(__dirname, 'Server', 'Cache', 'Downloads'), { recursive: true })

// Start The Server
async function start (): Promise<void> {
  await bundle()

  const server = startHttpServer(httpHost, httpPort, apiHost, imageHost, analytics, version)
  startSocket(server, apiHost, imageHost)

  if (development) {
    setInterval(() => bundle(), 5000)
  }
}

start()
