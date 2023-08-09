import { useEffect, useState } from 'react';

const pairMap = {};

const useBitfinexWebSocket = () => {
  const [cryptoData, setCryptoData] = useState({});

  useEffect(() => {
    const pairs = ['BTCUSD', 'ETHUSD', 'LTCUSD', 'LTCBTC', 'ETHBTC'];

    const bitfinexSocket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

    bitfinexSocket.addEventListener('open', () => {
      console.log('WebSocket connected');

      pairs.forEach((pair) => {
        bitfinexSocket.send(
          JSON.stringify({
            event: 'subscribe',
            channel: 'ticker',
            symbol: `t${pair}`,
          })
        );
      });
    });

    bitfinexSocket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.event === 'subscribed') {
        pairMap[data.chanId] = data;
      }

      // Check if data is a valid array and not a heartbeat message
      if (Array.isArray(data) && data[1] !== 'hb') {
        const [channelId, tickerData] = data;
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
        ] = tickerData;

        const newRow = {
          channelId: channelId,
          name: pairMap[channelId].pair, // Use the pair's name based on the channel ID
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
        };

        setCryptoData((prevData) => ({
          ...prevData,
          [pairMap[channelId].pair]: newRow,
        }));
      }
    });

    return () => {
      bitfinexSocket.close();
    };
  }, []);

  return { cryptoData, pairMap };
};

export default useBitfinexWebSocket;
