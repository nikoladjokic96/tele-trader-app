import { useEffect, useState } from 'react'
import socket from '../services/socketService'

const useBitfinexWebSocket = () => {
  const [cryptoData, setCryptoData] = useState([])

  useEffect(() => {
    const pairs = ['BTCUSD', 'ETHUSD', 'LTCUSD', 'LTCBTC', 'ETHBTC']

    const bitfinexSocket = new WebSocket('wss://api-pub.bitfinex.com/ws/2')

    bitfinexSocket.addEventListener('open', () => {
      console.log('WebSocket connected')

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

    bitfinexSocket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)

      // Check if data is a valid array and not a heartbeat message
      if (Array.isArray(data) && data[1] !== 'hb') {
        const [, tickerData] = data
        const [DAILY_CHANGE, LAST_PRICE, DAILY_CHANGE_RELATIVE, HIGH, LOW] =
          tickerData

        const newRow = {
          name: pairs[data[0]], // Use the pair's name based on the channel ID
          last: LAST_PRICE,
          change: DAILY_CHANGE,
          changePercent: DAILY_CHANGE_RELATIVE,
          high: HIGH,
          low: LOW,
        }

        setCryptoData((prevData) => [...prevData, newRow])
      }
    })

    return () => {
      bitfinexSocket.close()
    }
  }, [])

  return cryptoData
}

export default useBitfinexWebSocket
