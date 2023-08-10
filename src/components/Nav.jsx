import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import React from 'react'
import SnackBar from './SnackBar'

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasCheckedToken, setHasCheckedToken] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)

  const handleLogin = () => {
    if (!isLoggedIn) {
      window.localStorage.setItem('login_token', true)
      setIsLoggedIn(true)
      setShowSnackbar(true)
      setTimeout(() => {
        setShowSnackbar(false)
      }, 3000)
    }
  }

  useEffect(() => {
    const loginToken = window.localStorage.getItem('login_token')
    if (loginToken) {
      setIsLoggedIn(true)
    }
    setHasCheckedToken(true)
  }, [])

  return (
    <nav>
      <div className="pages-container">
        <Link className="link" to="/">
          Home
        </Link>
        {hasCheckedToken && isLoggedIn && (
          <Link className="link" to="Favorites">
            Favorites
          </Link>
        )}
      </div>
      {hasCheckedToken && !isLoggedIn && (
        <button className="login-btn" onClick={handleLogin}>
          Log in
        </button>
      )}
      {isLoggedIn && showSnackbar && <SnackBar />}{' '}
    </nav>
  )
}

export default Nav
