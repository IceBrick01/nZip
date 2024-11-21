import express from 'express'
import http from 'http'
import path from 'path'
import fs from 'fs/promises'

import Log from './Log'

// Start The HTTP Server
export default (host: string, port: number, apiHost: string, imageHost: string, version: string): http.Server => {
  const app = express()
  const server = http.createServer(app)

  app.get(['/', '/home'], async (req, res) => {
    await sendFile(res, path.join(__dirname, '../App/Pages/Home.html'), { version })
    logRequest(req, res)
  })

  app.get('/g/:id', async (req, res) => {
    const id = req.params.id

    try {
      const response = await (await fetch(`${apiHost}/api/gallery/${id}`)).json()

      if (response.error) {
        await sendFile(res, path.join(__dirname, '../App/Pages/Error.html'), { error: 'We cannot find your doujinshi, maybe try going back to <a href="/">home</a> and try another one?' })
      } else {
        const extension = response.images.pages[0].t === 'j' ? 'jpg' : response.images.pages[0].t === 'g' ? 'gif' : response.images.pages[0].t === 'w' ? 'webp' : 'png'
        await sendFile(res, path.join(__dirname, '../App/Pages/Download.html'), {
          id,
          title: response.title.english,
          cover: `${imageHost}/galleries/${response.media_id}/1.${extension}`,
        })
      }
    } catch (error) {
      await sendFile(res, path.join(__dirname, '../App/Pages/Error.html'), { error: 'An error occurred while fetching the gallery.' })
    }

    logRequest(req, res)
  })

  app.get('/g/:id/*', (req, res) => {
    res.redirect(`/g/${req.params.id}`)
  })

  app.get('/download/:hash/:file', async (req, res) => {
    const filePath = path.join(__dirname, 'Cache', 'Downloads', req.params.hash, req.params.file)

    try {
      if (!req.params.file.endsWith('.zip')) throw new Error('Invalid File')
      await fs.access(filePath)
      res.sendFile(filePath)
    } catch {
      await sendFile(res, path.join(__dirname, '../App/Pages/Error.html'), { error: 'Bro what are you trying to download? <a href="/g/228922">this</a>?' })
    }

    logRequest(req, res)
  })

  app.get('/Scripts/:script', async (req, res) => {
    const scriptPath = path.join(__dirname, 'Cache', 'Scripts', req.params.script.split('.')[0] + '.mjs')

    try {
      await fs.access(scriptPath)
      res.setHeader('Content-Type', 'text/javascript')
      res.end(await fs.readFile(scriptPath))
    } catch {
      await sendFile(res, path.join(__dirname, '../App/Pages/Error.html'), { error: 'console.error(\'Script Not Found\')' })
    }

    logRequest(req, res)
  })

  app.get('/Styles/:style', async (req, res) => {
    const stylePath = path.join(__dirname, '../App/Styles', req.params.style)

    try {
      await fs.access(stylePath)
      await sendFile(res, stylePath)
    } catch {
      await sendFile(res, path.join(__dirname, '../App/Pages/Error.html'), { error: 'What style do you even want? Something like <a href="/g/228922">this</a>?' })
    }

    logRequest(req, res)
  })

  app.get('/Images/:image', async (req, res) => {
    const imagePath = path.join(__dirname, '../App/Images', req.params.image)

    try {
      await fs.access(imagePath)
      res.sendFile(imagePath)
    } catch {
      await sendFile(res, path.join(__dirname, '../App/Pages/Error.html'), { error: 'We cannot find that image :(' })
    }

    logRequest(req, res)
  })

  app.get('/error', async (req, res) => {
    await sendFile(res, path.join(__dirname, '../App/Pages/Error.html'), { error: 'Don\'t be shy! I know you like <a href="/g/228922">this</a> kind of stuff.' })
    logRequest(req, res)
  })

  app.get('/robots.txt', async (req, res) => {
    await sendFile(res, path.join(__dirname, '../App/robots.txt'))
    logRequest(req, res)
  })

  app.all('*', (req, res) => {
    res.redirect('/error')
    logRequest(req, res)
  })

  server.listen(port, () => {
    Log.success(`nZip running on ${host}/`)
  })

  return server
}

// Send File
async function sendFile(res: http.ServerResponse, filePath: string, args?: null | { [key: string]: any }): Promise<void> {
  try {
    await fs.access(filePath)
    const extension = path.extname(filePath)

    if (extension === '.html') res.setHeader('Content-Type', 'text/html')
    if (extension === '.css') res.setHeader('Content-Type', 'text/css')
    if (extension === '.txt') res.setHeader('Content-Type', 'text/plain')

    let content = await fs.readFile(filePath, 'utf8')

    if (args) {
      for (const key of Object.keys(args)) {
        content = content.replaceAll(`{${key}}`, args[key])
      }
    }

    res.end(content)
  } catch {
    res.end('Resource Not Found')
  }
}

// Log Request
function logRequest(req: express.Request, res: express.Response): void {
  Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
}