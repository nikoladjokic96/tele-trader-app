import { useEffect, useState } from 'react'

const pairMap = {}

const useFetchFavorites = () => {
  const [cryptoData, setCryptoData] = useState({})

  const getFavoritesFromLocalStorage = () => {
    const favoritesStr = localStorage.getItem('favorites')
    if (favoritesStr) {
      try {
        return JSON.parse(favoritesStr)
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error)
      }
    }
    return []
  }

  const favorites = getFavoritesFromLocalStorage()

  useEffect(() => {
    if (favorites.length === 0) return

    const bitfinexSocket = new WebSocket(import.meta.env.VITE_BITFINEX_WS)

    bitfinexSocket.addEventListener('open', () => {
      favorites.forEach((pair) => {
        const symbol = `t${pair.toUpperCase()}`
        bitfinexSocket.send(
          JSON.stringify({
            event: 'subscribe',
            channel: 'ticker',
            symbol: symbol,
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
  }, [])

  return { cryptoData, pairMap }
}

export default useFetchFavorites
