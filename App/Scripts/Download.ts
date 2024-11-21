import { Scope, Style } from '../../Server/Scope.js'

Scope.use({
  id: 'default',

  initialize: (scope) => {
    scope.AttributeManager.createAttribute('style:dynamic:minheight', (element, value) => {
      // Update The Height
      function update (): void {
        let totalHeight: number = 0

        for (const child of Array.from(element.children)) {
          const bound = child.getBoundingClientRect()

          totalHeight += bound.height
        }

        element.style.minHeight = Style.parseStyleValue(value.replace('<height>', `${totalHeight}px`))
      }

      update()

      scope.listen(window, 'resize', () => update())
    })
  }
})

new Scope(document.body)

const logs = document.getElementById('logs')!
const text_logs = document.getElementById('text_logs')!
const downloadButton = document.getElementById('download_button') as HTMLAnchorElement

const socket = new WebSocket(window.location.href)

socket.addEventListener('open', () => {
  text_logs.innerHTML += '<br>Connected!<br>'
})

let chunks: Uint8Array[] = []
let size: number = 0

socket.addEventListener('message', async (event) => {
  const buffer = new Uint8Array(await event.data.arrayBuffer())

  if (buffer[0] === 0 && buffer[1] === 0) {
    const message = new TextDecoder('utf8').decode(buffer.slice(2))
    text_logs.innerHTML += '<br>' + message
    logs.scrollTo(0, logs.scrollHeight)
  } else if (buffer[0] === 1 && buffer[1] === 0) {
    chunks.push(buffer.slice(2))
    size += buffer.length - 2
  } else if (buffer[0] === 1 && buffer[1] === 1) {
    downloadButton.href = new TextDecoder('utf8').decode(buffer.slice(2))
    downloadButton.download = `${window.location.pathname.split('/')[2]}.zip`
    downloadButton.innerText = 'Download ZIP'
  }
})