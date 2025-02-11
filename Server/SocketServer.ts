import { WebSocketServer, WebSocket } from 'ws'
import { ZipFile } from 'yazl'
import crypto from 'crypto'
import http from 'http'
import path from 'path'
import fs from 'fs'

import FileDownloader from './Downloader'
import Log from './Log'

import type { GalleryData } from './Types'

// Start The HTTP Server
export default (httpServer: http.Server, apiHost: string, imageHost: string): void => {
  const server = new WebSocketServer({ server: httpServer })

  server.on('connection', async (socket, req) => {
    const forwardedFor = req.headers['x-forwarded-for']
    const ip = Array.isArray(forwardedFor) ? forwardedFor[0].trim() : forwardedFor?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown'
    const url = req.url

    if (url && url.substring(0, 3) === '/g/') {
      const response: GalleryData = (await (await fetch(`${apiHost}/api/gallery/${url.substring(3)}`)).json()) as GalleryData

      if (response.error) {
        socket.close(404, 'Resource Not Found')
      } else {
        const hash = crypto.createHash('md5').update(url.substring(3)).update(Date.now().toString()).digest('hex')

        Log.info(`WS Download Start: ${response.id} - ${ip}`)
        fs.mkdirSync(path.join(__dirname, 'Cache', 'Downloads', hash), { recursive: true })

        socket.send(Buffer.concat([Buffer.from([0, 0]), Buffer.from(`Start loading the images...`)]))

        const images = response.images.pages.map((page, index) => {
          const extension = page.t === 'j' ? 'jpg' : page.t === 'g' ? 'gif' : page.t === 'w' ? 'webp' : 'png'
          return `${imageHost}/galleries/${response.media_id}/${index + 1}.${extension}`
        })

        let id = response.id
        let retry = 0
        let success = false

        while (success === false && retry < 3) {
          success = await download(images, hash, socket, id)
          if (success === false) {
            retry++
          } else {
            break
          }
        }

        if (success === true) {
          Log.info(`WS Download End: ${response.id} - ${ip}`)
          const downloadUrl = `/download/${hash}/${id}.zip`
          socket.send(Buffer.concat([Buffer.from([0, 0]), Buffer.from(`All images zipped!<br><br>Click the button below to download the zip file.`)]))
          socket.send(Buffer.concat([Buffer.from([1, 1]), Buffer.from(downloadUrl)]))
          socket.close()

          setTimeout(() => {
            fs.rmSync(path.join(__dirname, 'Cache', 'Downloads', hash), { recursive: true })
          }, 3e5)
        } else {
          Log.error(`Failed to download gallery: ${response.id}`)
          socket.send(Buffer.concat([Buffer.from([0, 0]), Buffer.from(`Failed to load images. Please report to the developer.`)]))
          socket.close(500, 'Internal Server Error')
        }
      }
    }
  })
}

async function download(images: string[], hash: string, socket: WebSocket, id: number): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const urlCount = images.length
    const concurrentDownloads = Math.min(urlCount, 16)

    try {
      const downloader = new FileDownloader({
        concurrentDownloads,
        maxRetries: 10,
        downloadDir: path.join(__dirname, 'Cache', 'Downloads', hash),
        timeout: 5000,
        debug: process.env.NODE_ENV === 'development'
      })

      downloader.on('progress', (completed, total) => {
        if (socket.readyState === socket.OPEN) {
          socket.send(Buffer.concat([Buffer.from([0, 0]), Buffer.from(`Progress: ${completed} / ${total}`)]))
        }
      })

      await downloader.download([{ urls: images }])

      if (socket.readyState === socket.OPEN) {
        socket.send(Buffer.concat([Buffer.from([0, 0]), Buffer.from(`All images loaded!<br><br>Zipping the images...`)]))

        const zipFilePath = path.join(__dirname, 'Cache', 'Downloads', hash, `${id}.zip`)

        const zipfile = new ZipFile()
        const output = fs.createWriteStream(zipFilePath)

        zipfile.outputStream.pipe(output).on('close', () => {
          resolve(true)
        })

        for (const url of images) {
          const filePath = path.join(__dirname, 'Cache', 'Downloads', hash, path.basename(url))
          zipfile.addFile(filePath, path.basename(url))
        }

        zipfile.end()

        return true
      }
    } catch (error) {
      if (socket.readyState === socket.OPEN) {
        socket.send(Buffer.concat([Buffer.from([0, 0]), Buffer.from(`Failed to download images. Please report to the developer.`)]))
        socket.close()
      }

      fs.rmSync(path.join(__dirname, 'Cache', 'Downloads', hash), { recursive: true })

      reject(error)
    }
  })
}
