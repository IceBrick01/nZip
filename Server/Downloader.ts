import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'
import { promises as fsPromises } from 'fs'
import * as path from 'path'
import { EventEmitter } from 'events'

interface DownloadOptions {
  concurrentDownloads?: number
  maxRetries?: number
  downloadDir?: string
  timeout?: number
  debug?: boolean
}

interface DownloadRequest {
  urls: string[]
  headers?: { [key: string]: string }
  cookies?: { [key: string]: string }
}

interface DownloadTask {
  url: string
  headers?: { [key: string]: string }
  cookies?: { [key: string]: string }
}

export default class FileDownloader extends EventEmitter {
  private concurrentDownloads: number
  private maxRetries: number
  private downloadDir: string
  private redirectLimit: number
  private timeout: number
  private debug: boolean
  private totalTasks: number
  private completedTasks: number

  constructor(options: DownloadOptions = {}) {
    super()
    this.concurrentDownloads = options.concurrentDownloads || 2
    this.maxRetries = options.maxRetries || 3
    this.downloadDir = options.downloadDir || './downloads'
    this.redirectLimit = 5
    this.timeout = options.timeout || 30000
    this.debug = options.debug || false
    this.totalTasks = 0
    this.completedTasks = 0

    fsPromises.mkdir(this.downloadDir, { recursive: true }).catch(err => {
      this.log(`Failed to create download directory: ${err.message}`)
    })
  }

  async download(requests: DownloadRequest[]): Promise<void> {
    const tasks: DownloadTask[] = []

    for (const request of requests) {
      for (const url of request.urls) {
        tasks.push({
          url,
          headers: request.headers,
          cookies: request.cookies
        })
      }
    }

    this.totalTasks = tasks.length
    this.completedTasks = 0

    const workers: Promise<void>[] = []

    for (let i = 0; i < this.concurrentDownloads; i++) {
      workers.push(this.worker(tasks))
    }

    await Promise.all(workers)
  }

  private async worker(queue: DownloadTask[]): Promise<void> {
    while (queue.length > 0) {
      const task = queue.shift()
      if (task) {
        await this.downloadWithRetries(task)
        this.completedTasks++
        this.emit('progress', this.completedTasks, this.totalTasks)
      }
    }
  }

  private async downloadWithRetries(task: DownloadTask): Promise<void> {
    let attempts = 0
    while (attempts < this.maxRetries) {
      try {
        await this.downloadFile(task)
        return
      } catch (error) {
        this.log(`Failed to download ${task.url}: ${error}`)
        attempts++
        if (attempts >= this.maxRetries) {
          this.log(`Failed to download ${task.url} after ${this.maxRetries} attempts.`)
        } else {
          this.log(`Retrying download for ${task.url}. Attempt ${attempts + 1}.`)
          await this.delay(2 ** attempts * 1000)
        }
      }
    }
  }

  private async downloadFile(task: DownloadTask, redirectCount = 0): Promise<void> {
    if (redirectCount >= this.redirectLimit) {
      throw new Error(`Too many redirects for ${task.url}`)
    }

    const { url, headers, cookies } = task
    const protocol = url.startsWith('https') ? https : http
    const fileName = path.basename(new URL(url).pathname)
    const filePath = path.join(this.downloadDir, fileName)

    try {
      await fsPromises.access(filePath)
      this.log(`File ${fileName} already exists. Skipping download.`)
      return
    } catch {
      // File doesn't exist, proceed with download
    }

    return new Promise((resolve, reject) => {
      const options: http.RequestOptions = {
        headers: {
          ...headers,
          Cookie: cookies
            ? Object.entries(cookies)
                .map(([k, v]) => `${k}=${v}`)
                .join('; ')
            : ''
        },
        timeout: this.timeout
      }

      const req = protocol.get(url, options, response => {
        const { statusCode, headers: resHeaders } = response

        if (statusCode && statusCode >= 200 && statusCode < 300) {
          const fileStream = fs.createWriteStream(filePath)
          response.pipe(fileStream)

          response.on('error', async err => {
            await fsPromises.unlink(filePath).catch(() => {})
            reject(err)
          })

          fileStream.on('finish', () => {
            this.log(`Downloaded ${url} to ${filePath}`)
            resolve()
          })

          fileStream.on('error', async err => {
            await fsPromises.unlink(filePath).catch(() => {})
            reject(err)
          })
        } else if (statusCode && statusCode >= 300 && statusCode < 400 && resHeaders.location) {
          const redirectUrl = new URL(resHeaders.location, url).toString()
          this.downloadFile({ ...task, url: redirectUrl }, redirectCount + 1)
            .then(resolve)
            .catch(reject)
        } else {
          reject(new Error(`Failed to get '${url}' (${statusCode})`))
        }
      })

      req.on('error', async err => {
        await fsPromises.unlink(filePath).catch(() => {})
        reject(err)
      })

      req.on('timeout', () => {
        req.destroy()
        reject(new Error(`Request timed out for ${url}`))
      })
    })
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private log(message: string): void {
    if (this.debug) {
      console.log(message)
    }
  }
}
