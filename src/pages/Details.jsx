import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useFavorites from '../utils/favorites'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import useCryptoDetails from '../hooks/useCryptoDetails'

const Details = () => {
  const { getFavorites, setFavorites } = useFavorites()
  const favorites = getFavorites()
  const { pair } = useParams()
  const [isFavorite, setIsFavorite] = useState(favorites.includes(pair))

  const loginToken = localStorage.getItem('login_token')
  const isLoggedIn = loginToken === 'true'

  useEffect(() => {
    setIsFavorite(favorites.includes(pair))
  }, [favorites, pair])

  const toggleFavorites = () => {
    if (isFavorite) {
      setFavorites(favorites.filter((f) => f !== pair))
    } else {
      setFavorites(favorites.concat([pair]))
    }
    setIsFavorite((prevIsFavorite) => !prevIsFavorite)
  }

  const cryptoData = useCryptoDetails(pair)

  const favoritesList = isLoggedIn && (
    <div className="favorite-btn-container">
      <button
        className={`btn ${isFavorite ? 'btn--remove' : ''}`}
        onClick={toggleFavorites}
      >
        {isFavorite ? 'Remove favorite' : 'Add favorite'}
      </button>
    </div>
  )

  return (
    <>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 600, maxWidth: '97%' }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Last</TableCell>
              <TableCell align="right">High</TableCell>
              <TableCell align="right">Low</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pair && (
              <TableRow key={cryptoData.name}>
                <TableCell component="th" scope="row">
                  <Link className="link">{pair}</Link>
                </TableCell>
                <TableCell align="right">{cryptoData.last_price}</TableCell>
                <TableCell align="right">{cryptoData.high}</TableCell>
                <TableCell align="right">{cryptoData.low}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {favoritesList}
    </>
  )
}

export default Details
