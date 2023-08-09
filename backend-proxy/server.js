const express = require('express')
const http = require('http')
const WebSocket = require('ws') // Import WebSocket from 'ws'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ noServer: true }) // Create WebSocket server

// Handle CORS
const cors = require('cors')
app.use(cors())

// WebSocket connection handling
wss.on('connection', (socket) => {
  const pairs = ['BTCUSD', 'ETHUSD', 'LTCUSD', 'LTCBTC', 'ETHBTC']
  const bitfinexSocket = new WebSocket('wss://api-pub.bitfinex.com/ws/2')

  bitfinexSocket.on('open', () => {
    // WebSocket is open, now you can send data
    pairs.forEach((pair) => {
      bitfinexSocket.send(
        JSON.stringify({
          event: 'subscribe',
          channel: 'ticker',
          symbol: `t${pair}`,
        })
      )
    })
  })

  // Handle messages from Bitfinex WebSocket
  bitfinexSocket.on('message', (message) => {
    socket.send(message)
  })

  // Handle messages from client WebSocket
  socket.on('message', (message) => {
    bitfinexSocket.send(message)
  })
})

// Handle WebSocket upgrades
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit('connection', socket, request)
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`)
})
