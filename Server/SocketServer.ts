import { WebSocketServer } from 'ws'
import archiver from 'archiver'
import crypto from 'crypto'
import http from 'http'
import path from 'path'
import fs from 'fs'

// Start The HTTP Server
export default (httpServer: http.Server, httpHost: string, apiHost: string): void => {
  const server = new WebSocketServer({ server: httpServer })

  server.on('connection', async (socket) => {
    if (socket.url.substring(0, 3) === '/g/') {
      const response = await (await fetch(`${apiHost}/pages/${socket.url.substring(3)}`)).json()

      if (response.status === false) socket.close(404, 'Resource Not Found')
      else {
        if (!fs.existsSync(path.join(__dirname, 'Cache', 'Downloads'))) fs.mkdirSync(path.join(__dirname, 'Cache', 'Downloads'))
        
        const hash = crypto.createHash('sha256').update(socket.url.substring(3)).update(Date.now().toString()).digest('hex')

        fs.mkdirSync(path.join(__dirname, 'Cache', 'Downloads', hash))

        let loaded: number = 0

        socket.send(Buffer.concat([
          Buffer.from([0]),
          Buffer.from(`Start loading the images...`)
        ]))

        await Promise.all(response.map(async (url: string) => {
          await downloadFile(url, path.join(__dirname, 'Cache', 'Downloads', hash, url.split('/')[5]))

          if (socket.readyState === socket.OPEN) {
            socket.send(Buffer.concat([
              Buffer.from([0, 0]),
              Buffer.from(`Progress: ${loaded + 1} / ${response.length}`)
            ]))
          }

          loaded++
        }))

        if (socket.readyState === socket.OPEN) {
          socket.send(Buffer.concat([
            Buffer.from([0, 0]),
            Buffer.from(`All images loaded!<br><br>Zipping the images...`)
          ]))

          const archive = archiver('zip')

          const id = socket.url.substring(3).split('/')[0]
          const zipFilePath = path.join(__dirname, 'Cache', 'Downloads', hash, `${id}.zip`)
          const output = fs.createWriteStream(zipFilePath)

          archive.pipe(output)

          for (const url of response) archive.file(path.join(__dirname, 'Cache', 'Downloads', hash, url.split('/')[5]), { name: url.split('/')[5] })

          archive.finalize()

          output.on('close', () => {
            if (socket.readyState === socket.OPEN) {
              const downloadUrl = `${httpHost}/download/${hash}/${id}.zip`
              socket.send(Buffer.concat([
                Buffer.from([0, 0]),
                Buffer.from(`All images zipped!<br><br>Download the zip file <a href="${downloadUrl}" target="_blank">here</a>.`)
              ]))
              socket.close()

              setTimeout(() => {
                fs.rmSync(path.join(__dirname, 'Cache', 'Downloads', hash), { recursive: true })
              }, 3e5)
            }
          })
        }
      }
    } else socket.close(404, 'Resource Not Found')
  })
}

// Download A File
async function downloadFile (url: string, filePath: string): Promise<void> {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      const chunks: Buffer[] = []

      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => {
        fs.writeFileSync(filePath, Buffer.concat(chunks))

        resolve()
      })
    })
  })
}