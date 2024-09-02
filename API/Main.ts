import http from 'http'
import https from 'https'

const PORT = 8081

interface GalleryData {
  media_id: string
  images: {
    pages: Array<{ t: string }>
    cover: { t: string }
    thumbnail: { t: string }
  }
}

async function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      handleResponse(res, resolve, reject)
    }).on('error', (error) => {
      reject(error)
    })
  })
}

function handleResponse(res: http.IncomingMessage, resolve: (data: string) => void, reject: (error: Error) => void): void {
  const { statusCode } = res
  let rawData = ''

  res.on('data', (chunk) => {
    rawData += chunk
  })

  res.on('end', () => {
    if (statusCode === 200) {
      resolve(rawData)
    } else {
      reject(new Error(`Request Failed. Status Code: ${statusCode}`))
    }
  })
}

const server = http.createServer(async (req, res) => {
  const urlParts = req.url?.split('/')
  const id = urlParts?.[2]

  if (!id) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: false, reason: 'Missing id parameter' }))
    return
  }

  try {
    const rawData = await fetchUrl(`https://nhentai.net/api/gallery/${id}`)
    const jsonData: GalleryData = JSON.parse(rawData)

    handleRequest(urlParts, jsonData, res)
  } catch {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: false, reason: 'Internal Server Error' }))
  }
})

function handleRequest(urlParts: string[], jsonData: GalleryData, res: http.ServerResponse): void {
  const mediaId = jsonData.media_id
  const baseUrl = `https://i.nhentai.net/galleries/${mediaId}`
  const baseUrlThumbnail = `https://t.nhentai.net/galleries/${mediaId}`

  switch (urlParts[1]) {
    case 'g':
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(jsonData))
      break
    case 'pages':
      const pages = jsonData.images.pages.map((page, index) => {
        const extension = page.t === 'j' ? 'jpg' : page.t === 'g' ? 'gif' : 'png';
        return `${baseUrl}/${index + 1}.${extension}`;
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(pages));
      break;
    case 'pages-t':
      const pagesThumbnails = jsonData.images.pages.map((page, index) => {
        const extension = page.t === 'j' ? 'jpg' : page.t === 'g' ? 'gif' : 'png';
        return `${baseUrlThumbnail}/${index + 1}t.${extension}`;
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(pagesThumbnails));
      break;
    case 'cover':
      const cover = `${baseUrlThumbnail}/cover.${jsonData.images.cover.t === 'j' ? 'jpg' : jsonData.images.cover.t === 'g' ? 'gif' : 'png'}`;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([cover]));
      break;
    case 'cover-t':
      const coverThumbnail = `${baseUrlThumbnail}/thumb.${jsonData.images.thumbnail.t === 'j' ? 'jpg' : jsonData.images.thumbnail.t === 'g' ? 'gif' : 'png'}`;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([coverThumbnail]));
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: false, reason: 'Not Found' }))
  }
}

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`)
})
