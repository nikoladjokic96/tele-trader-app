const useFavorites = () => {
  const getFavorites = () =>
    localStorage.getItem('favorites')
      ? JSON.parse(localStorage.getItem('favorites'))
      : []
  const setFavorites = (fav) => {
    localStorage.setItem('favorites', JSON.stringify(fav))
  }

  return { getFavorites, setFavorites }
}

export default useFavorites
