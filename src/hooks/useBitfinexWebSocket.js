import { useEffect, useState } from 'react'
import axios from 'axios'

const pairMap = {}

const useFetchPairs = () => {
  const [pairs, setPairs] = useState([])
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const response = await axios.get('/api/v1/symbols')
        const parsedPairs = response.data
        const first5Pairs = parsedPairs.slice(0, 5)
        setPairs(first5Pairs)
      } catch (error) {
        setFetchError(error)
      }
    }

    fetchPairs()
  }, [])

  return { pairs, fetchError }
}

const useBitfinexWebSocket = () => {
  const [cryptoData, setCryptoData] = useState({})
  const { pairs, fetchError } = useFetchPairs()

  useEffect(() => {
    if (fetchError) {
      console.error('Error fetching pairs:', fetchError)
      return
    }

    if (pairs.length === 0) return

    const bitfinexSocket = new WebSocket(import.meta.env.VITE_BITFINEX_WS)

    bitfinexSocket.addEventListener('open', () => {
      const toUpper = (pair) => {
        return pair.toUpperCase()
      }
      const pairsUppercase = pairs.map(toUpper)

      pairsUppercase.forEach((pair) => {
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

      if (data.event === 'subscribed') {
        pairMap[data.chanId] = data
      }

      if (Array.isArray(data) && data[1] !== 'hb') {
        const [channelId, tickerData] = data
        const [
          BID,
          BID_SIZE,
          ASK,
          ASK_SIZE,
          DAILY_CHANGE,
          DAILY_CHANGE_RELATIVE,
          LAST_PRICE,
          VOLUME,
          HIGH,
          LOW,
        ] = tickerData

        const newRow = {
          channelId: channelId,
          name: pairMap[channelId]?.pair,
          BID,
          BID_SIZE,
          ASK,
          ASK_SIZE,
          DAILY_CHANGE,
          DAILY_CHANGE_RELATIVE,
          LAST_PRICE,
          VOLUME,
          HIGH,
          LOW,
        }

        setCryptoData((prevData) => ({
          ...prevData,
          [pairMap[channelId]?.pair]: newRow,
        }))
      }
    })

    return () => {
      bitfinexSocket.close()
    }
  }, [pairs, fetchError])

  return { cryptoData, pairMap }
}

export default useBitfinexWebSocket
