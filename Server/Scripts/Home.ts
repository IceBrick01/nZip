const input_sauce = document.getElementById('input_sauce')! as HTMLInputElement
const text_sauce = document.getElementById('text_sauce')! as HTMLHeadingElement

input_sauce.onchange = () => {
  if (input_sauce.value.substring(0, 22) === 'https://nhentai.net/g/') window.location.replace('/g/' + input_sauce.value.substring(22))
  else if (!isNaN(parseInt(input_sauce.value))) window.location.href = '/g/' + input_sauce.value
}

let target = 0
let current = 0

setInterval(() => {
  current += (target - current) / 40
  text_sauce.innerHTML = Math.round(current).toString().padStart(6, '0')
}, 10)

const socket = new WebSocket(window.location.href)

socket.addEventListener('message', async (event) => {
  const raw = new Uint8Array(await event.data.arrayBuffer())
  const buffer = new Uint8Array(raw)

  target = parseInt(new TextDecoder().decode(buffer))
})
