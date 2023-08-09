import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom';
import useFavorites from '../hooks/favorites';

const Details = () => {
  const { getFavorites, setFavorites } = useFavorites();
  const favorites = getFavorites();
  const { pair } = useParams();
  const [isFavorite, setIsFavorite] = useState(favorites.includes(pair));

  const addFavorites = useCallback(() => {
    setFavorites(favorites.concat([pair]));
    setIsFavorite(true);
  }, []);

  const removeFavorites = useCallback(() => {
    setFavorites(favorites.filter(f => f !== pair));
    setIsFavorite(false);
  }, []);

  const favoritesList = isFavorite ? <button onClick={removeFavorites}>Remove favorite</button> : <button onClick={addFavorites}>Add favorite</button>;

  return (
    <>
      <div>Details for {pair}</div>
      {favoritesList}
    </>
  )
}

export default Details