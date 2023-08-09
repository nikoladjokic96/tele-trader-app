const useFavorites = () => {
  const getFavorites = () =>
    localStorage.getItem('favorites')
      ? JSON.parse(localStorage.getItem('favorites'))
      : []
  const setFavorites = (fav) => {
    debugger
    localStorage.setItem('favorites', JSON.stringify(fav))
  }

  return { getFavorites, setFavorites }
}

export default useFavorites
