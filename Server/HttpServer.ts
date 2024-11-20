import express from 'express'
import http from 'http'
import path from 'path'
import fs from 'fs'

import Log from './Log'

// Start The HTTP Server
export default (host: string, port: number, apiHost: string, imageHost: string, version: string): http.Server => {
  const app = express()
  const server = http.createServer(app)

  app.get(['/', '/home'], (req, res) => {
    sendFile(res, path.resolve(__dirname, '../App/Pages/Home.html'), { version })
    Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
  })

  app.get('/g/:id', async (req, res) => {
    const id = req.params.id
    
    const response = await (await fetch(`${apiHost}/api/gallery/${id}`)).json()

    if (response.error) return sendFile(res, path.resolve(__dirname, '../App/Pages/Error.html'), { error: 'We cannot find your doujinshi, maybe try going back to <a href="/">home</a> and try another one?' })
    
    const extension = response.images.pages[0].t === 'j' ? 'jpg' : response.images.pages[0].t === 'g' ? 'gif' : response.images.pages[0].t === 'w' ? 'webp' : 'png'

    sendFile(res, path.resolve(__dirname, '../App/Pages/Download.html'), {
      id,
      title: response.title.english,
      cover: `${imageHost}/galleries/${response.media_id}/1.${extension}`,
    })

    Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
  })

  app.get('/g/:id/*', async (req, res) => {
    res.redirect(`/g/${req.params.id}`)
  })

  app.get('/download/:hash/:file', async (req, res) => {
    const hash = req.params.hash
    const file = req.params.file

    const filePath = path.join(__dirname, 'Cache', 'Downloads', hash, file)

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath)
      Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
    } else {
      sendFile(res, path.resolve(__dirname, '../App/Pages/Error.html'), { error: 'Bro what are you trying to download? <a href="/g/228922">this</a>?' })
      Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
    }
  })

  app.get('/Scripts/:script', async (req, res) => {
    const reqPath = req.params.script
    if (fs.existsSync(path.join(__dirname, 'Cache', 'Scripts', reqPath.split('.')[0] + '.mjs'))) {
      res.setHeader('Content-Type', 'text/javascript')
      res.end(fs.readFileSync(path.join(__dirname, 'Cache', 'Scripts', reqPath.split('.')[0] + '.mjs')))
      Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
    } else {
      sendFile(res, path.resolve(__dirname, '../App/Pages/Error.html'), { error: 'console.error(\'Script Not Found\')' })
      Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
    }
  })

  app.get('/Styles/:style', async (req, res) => {
    if (fs.existsSync(path.resolve(__dirname, `../App/Styles/${req.params.style}`))) {
      res.setHeader('Content-Type', 'text/css')
      res.end(fs.readFileSync(path.resolve(__dirname, `../App/Styles/${req.params.style}`)))
      Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
    } else {
      sendFile(res, path.resolve(__dirname, '../App/Pages/Error.html'), { error: 'What style do you even want? Something like <a href="/g/228922">this</a>?' })
      Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
    }
  })

  app.get('/Images/:image', async (req, res) => {
    if (fs.existsSync(path.resolve(__dirname, `../App/Images/${req.params.image}`))) {
      res.sendFile(path.resolve(__dirname, `../App/Images/${req.params.image}`))
      Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
    } else {
      sendFile(res, path.resolve(__dirname, '../App/Pages/Error.html'), { error: 'We cannot find that image :(' })
      Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
    }
  })

  app.get('/error', (req, res) => {
    sendFile(res, path.resolve(__dirname, '../App/Pages/Error.html'), { error: 'Don\'t be shy! I know you like <a href="/g/228922">this</a> kind of stuff.' })
    Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
  })

  app.get('/robots.txt', (req, res) => {
    sendFile(res, path.resolve(__dirname, '../App/Robots.txt'))
    Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
  })

  app.all('*', (req, res) => {
    res.redirect('/error')
    Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)
  })

  server.listen(port, () => {
    Log.success(`nZip running on ${host}/`)
  })

  return server
}

// Send File
function sendFile (res: http.ServerResponse, filePath: string, args?: null | { [key: string]: any }): void {
  if (fs.existsSync(filePath)) {
    const extension = path.extname(filePath)

    if (extension === '.html') res.setHeader('Content-Type', 'text/html')

    if (args === undefined || args === null) res.end(fs.readFileSync(filePath))
    else {
      let content = fs.readFileSync(filePath, 'utf8')

      for (const key of Object.keys(args)) content = content.replaceAll(`{${key}}`, args[key])

      res.end(content)
    }
  } else {
    res.end('Resource Not Found')
  }
}