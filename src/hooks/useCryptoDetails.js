import { useEffect, useState } from 'react'
import axios from 'axios'

const useCryptoDetails = (symbol) => {
  const [cryptoData, setCryptoData] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/v1/pubticker/${symbol}`)
        setCryptoData(response.data)
      } catch (error) {
        console.error('An error occurred while fetching data:', error)
      }
    }
    fetchData()
  }, [symbol])

  return cryptoData
}

export default useCryptoDetails
