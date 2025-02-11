import { Scope, Style } from '../Scope.js'

Scope.use({
  id: 'default',

  initialize: scope => {
    scope.AttributeManager.createAttribute('style:dynamic:minheight', (element, value) => {
      // Update The Height
      function update(): void {
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

socket.addEventListener('message', async event => {
  const buffer = new Uint8Array(await event.data.arrayBuffer())

  /**
   * 0x00: Start loading the images
   * 0x01: All images loaded
   * 0x02: All images zipped, download link
   * 0x10: Progress
   * 0x20: Error
   */
  switch (buffer[0]) {
    case 0x00:
      return addLog('Start loading the images...')
    case 0x01:
      return addLog('All images loaded!<br><br>Zipping the images...')
    case 0x02:
      addLog('All images zipped!<br><br>Click the button below to download the zip file.')
      downloadButton.href = new TextDecoder('utf8').decode(buffer.slice(1))
      downloadButton.download = `${window.location.pathname.split('/')[2]}.zip`
      downloadButton.innerText = 'Download ZIP'
      return
    case 0x10:
      const [completed, total] = JSON.parse(new TextDecoder('utf8').decode(buffer.slice(1)))
      return addLog(`Progress: ${completed} / ${total}`)
    case 0x20:
      return addLog('Error occurred while downloading the images. Please report this issue to the developer.')
  }
})

function addLog(message: string): void {
  text_logs.innerHTML += '<br>' + message
  logs.scrollTo(0, logs.scrollHeight)
}
