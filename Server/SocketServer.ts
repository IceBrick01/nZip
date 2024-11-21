import { WebSocketServer } from 'ws'
import { ZipFile } from 'yazl'
import crypto from 'crypto'
import http from 'http'
import path from 'path'
import fs from 'fs'
import FileDownloader from './Downloader'

interface GalleryData {
  error?: string
  media_id: string
  images: {
    pages: Array<{ t: string }>
    cover: { t: string }
    thumbnail: { t: string }
  }
}

// Start The HTTP Server
export default (httpServer: http.Server, apiHost: string, imageHost: string): void => {
  const server = new WebSocketServer({ server: httpServer })

  server.on('connection', async (socket, req) => {
    const url = req.url

    if (url && url.substring(0, 3) === '/g/') {
      const response: GalleryData = await (await fetch(`${apiHost}/api/gallery/${url.substring(3)}`)).json()

      if (response.error) {
        socket.close(404, 'Resource Not Found')
      } else {
        const hash = crypto.createHash('sha256').update(url.substring(3)).update(Date.now().toString()).digest('hex')

        fs.mkdirSync(path.join(__dirname, 'Cache', 'Downloads', hash), { recursive: true })

        socket.send(Buffer.concat([
          Buffer.from([0, 0]),
          Buffer.from(`Start loading the images...`)
        ]))

        const images = response.images.pages.map((page, index) => {
          const extension = page.t === 'j' ? 'jpg' : page.t === 'g' ? 'gif' : page.t === 'w' ? 'webp' : 'png'
          return `${imageHost}/galleries/${response.media_id}/${index + 1}.${extension}`
        })

        const urlCount = images.length
        const concurrentDownloads = Math.min(urlCount, 16)

        const downloader = new FileDownloader({
          concurrentDownloads,
          maxRetries: 5,
          downloadDir: path.join(__dirname, 'Cache', 'Downloads', hash),
          timeout: 3000,
        })

        downloader.on('progress', (completed, total) => {
          if (socket.readyState === socket.OPEN) {
            socket.send(Buffer.concat([
              Buffer.from([0, 0]),
              Buffer.from(`Progress: ${completed} / ${total}`)
            ]))
          }
        })

        try {
          await downloader.download([{ urls: images }])

          if (socket.readyState === socket.OPEN) {
            socket.send(Buffer.concat([
              Buffer.from([0, 0]),
              Buffer.from(`All images loaded!<br><br>Zipping the images...`)
            ]))

            const id = url.substring(3).split('/')[0]
            const zipFilePath = path.join(__dirname, 'Cache', 'Downloads', hash, `${id}.zip`)

            const zipfile = new ZipFile()
            const output = fs.createWriteStream(zipFilePath)

            zipfile.outputStream.pipe(output).on('close', () => {
              if (socket.readyState === socket.OPEN) {
                const downloadUrl = `/download/${hash}/${id}.zip`
                socket.send(Buffer.concat([
                  Buffer.from([0, 0]),
                  Buffer.from(`All images zipped!<br><br>Click the button below to download the zip file.`)
                ]))
                socket.send(Buffer.concat([
                  Buffer.from([1, 1]),
                  Buffer.from(downloadUrl)
                ]))
                socket.close()

                setTimeout(() => {
                  fs.rmSync(path.join(__dirname, 'Cache', 'Downloads', hash), { recursive: true })
                }, 3e5)
              }
            })

            for (const url of images) {
              const filePath = path.join(__dirname, 'Cache', 'Downloads', hash, path.basename(url))
              zipfile.addFile(filePath, path.basename(url))
            }

            zipfile.end()
          }
        } catch (error) {
          if (socket.readyState === socket.OPEN) {
            socket.send(Buffer.concat([
              Buffer.from([0, 0]),
              Buffer.from(`Failed to download images. Please report to the developer.`)
            ]))
            socket.close()
          }

          fs.rmSync(path.join(__dirname, 'Cache', 'Downloads', hash), { recursive: true })
        }
      }
    } else {
      socket.close(404, 'Resource Not Found')
    }
  })
}