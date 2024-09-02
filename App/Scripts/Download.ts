const logs = document.getElementById('logs')!
const text_logs = document.getElementById('text_logs')!

const socket = new WebSocket(window.location.href)

socket.addEventListener('open', () => {
  text_logs.innerHTML += '<br>Connected!<br>'
})

let chunks: Uint8Array[] = []
let size: number = 0

socket.addEventListener('message', async (event) => {
  const buffer = new Uint8Array(await event.data.arrayBuffer())

  if (buffer[0] === 0 && buffer[1] === 0) {
    text_logs.innerHTML += '<br>' + new TextDecoder('utf8').decode(buffer.slice(2))

    logs.scrollTo(0, logs.scrollHeight)
  } else if (buffer[0] === 1 && buffer[1] === 0) {
    chunks.push(buffer.slice(2))
    size += buffer.length - 2
  } else if (buffer[0] === 1 && buffer[1] === 1) {
    const data = new Uint8Array(size)
    let index: number = 0
    
    for (const chunk of chunks) {
      data.set(chunk, index)
      index += chunk.length
    }

    console.log(data)

    const url = URL.createObjectURL(new Blob(chunks, { type: 'application/zip' }))

    const download = document.createElement('a')
    download.href = url
    download.download = `${window.location.pathname.split('/')[2]}.zip`

    download.click()

    URL.revokeObjectURL(url)
  }
})