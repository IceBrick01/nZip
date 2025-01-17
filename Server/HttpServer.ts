import express from 'express'
import http from 'http'
import path from 'path'
import fs from 'fs/promises'

import { Element, ElementAttributes } from './Scope'
import Log from './Log'

import HomePage from '../App/Pages/Home'
import DownloadPage from '../App/Pages/Download'
import ErrorPage from '../App/Pages/Error'

let analytics: ElementAttributes | null = null

// Start The HTTP Server
export default (host: string, port: number, apiHost: string, imageHost: string, analytic: string, version: string): http.Server => {
  analytics = analytic ? (JSON.parse(analytic) as ElementAttributes) : null

  const app = express()
  const server = http.createServer(app)

  app.use((_, res, next) => {
    res.setHeader('X-Powered-By', 'nZip')
    next()
  })

  app.get(['/', '/home'], async (req, res) => {
    sendPage(res, HomePage, { version })
    logRequest(req, res)
  })

  app.get('/g/:id', async (req, res) => {
    const id = req.params.id

    try {
      const response = await (await fetch(`${apiHost}/api/gallery/${id}`)).json()

      if (response.error) {
        await sendPage(res, ErrorPage, { error: 'We cannot find your doujinshi, maybe try going back to <a href="/">home</a> and try another one?' })
      } else {
        const extension = response.images.pages[0].t === 'j' ? 'jpg' : response.images.pages[0].t === 'g' ? 'gif' : response.images.pages[0].t === 'w' ? 'webp' : 'png'
        sendPage(res, DownloadPage, { id, title: response.title.english, cover: `${imageHost}/galleries/${response.media_id}/1.${extension}` })
      }
    } catch (error) {
      await sendPage(res, ErrorPage, { error: 'An error occurred while fetching the gallery.' })
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
      await sendPage(res, ErrorPage, { error: 'Bro what are you trying to download? <a href="/g/228922">this</a>?' })
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
      await sendPage(res, ErrorPage, { error: "console.error('Script Not Found')" })
    }

    logRequest(req, res)
  })

  app.get('/Styles/:style', async (req, res) => {
    const stylePath = path.join(__dirname, '../App/Styles', req.params.style)

    try {
      await fs.access(stylePath)
      await sendFile(res, stylePath)
    } catch {
      await sendPage(res, ErrorPage, { error: 'What style do you even want? Something like <a href="/g/228922">this</a>?' })
    }

    logRequest(req, res)
  })

  app.get('/Images/:image', async (req, res) => {
    const imagePath = path.join(__dirname, '../App/Images', req.params.image)

    try {
      await fs.access(imagePath)
      res.sendFile(imagePath)
    } catch {
      await sendPage(res, ErrorPage, { error: 'We cannot find that image :(' })
    }

    logRequest(req, res)
  })

  app.get('/error', async (req, res) => {
    sendPage(res, ErrorPage, { error: 'Don\'t be shy! I know you like <a href="/g/228922">this</a> kind of stuff.' })
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

// Send Page
async function sendPage(res: http.ServerResponse, page: Function, args?: null | { [key: string]: any }): Promise<void> {
  try {
    const Page = page(args)
    const doctype = '<!DOCTYPE html>'
    const head = [
      new Element('title', { innerHTML: Page.title }),
      new Element('meta', { name: 'title', content: Page.title }),
      new Element('meta', { name: 'description', content: Page.description }),
      new Element('meta', { name: 'og:title', content: Page.title }),
      new Element('meta', { name: 'og:description', content: Page.description }),
      new Element('meta', { charset: 'utf-8' }),
      new Element('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
      new Element('link', { rel: 'icon', href: '/Images/icon.ico' }),
      new Element('link', { rel: 'stylesheet', href: '/Styles/Main.css' }),
    ]

    if (analytics) head.push(new Element('script', analytics))

    const html = new Element('html', { lang: 'en' }, [
      new Element('head', {}, head),
      Page.content
    ]).render()

    res.setHeader('Content-Type', 'text/html')
    res.end(doctype + html)
  } catch (error) {
    Log.error(error)
    res.end('Page Not Found')
  }
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
  Log.info(`${req.method} ${req.url} ${res.statusCode} - ${req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress}`)
}
