import io from 'socket.io-client'

const socket = io(import.meta.env.VITE_BITFINEX_URL, {
  transports: ['websocket'], // Explicitly use WebSocket transport
})

export default socket
