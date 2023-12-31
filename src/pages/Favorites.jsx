import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import useFetchFavorites from '../hooks/useFetchFavorites'
import { Link } from 'react-router-dom'

const Favorites = () => {
  const { cryptoData } = useFetchFavorites()
  const favoritesCheck = localStorage.getItem('favorites')
  const favoritesArray = JSON.parse(favoritesCheck)

  return (
    <>
      {favoritesArray && favoritesArray.length > 0 ? (
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 600, maxWidth: '97%' }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Last</TableCell>
                <TableCell align="right">Change</TableCell>
                <TableCell align="right">Change Percent</TableCell>
                <TableCell align="right">High</TableCell>
                <TableCell align="right">Low</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(cryptoData).map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    <Link className="link" to={`/Details/${row.name}`}>
                      {row.name}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{row.LAST_PRICE}</TableCell>
                  <TableCell align="right">{row.DAILY_CHANGE}</TableCell>
                  <TableCell align="right">
                    {row.DAILY_CHANGE_RELATIVE.toFixed(2)}%
                  </TableCell>
                  <TableCell align="right">{row.HIGH}</TableCell>
                  <TableCell align="right">{row.LOW}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="empty-list">Your list of favorites is empty</div>
      )}
    </>
  )
}

export default Favorites
