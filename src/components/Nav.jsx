import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import React from 'react'

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasCheckedToken, setHasCheckedToken] = useState(false)

  const handleLogin = () => {
    if (!isLoggedIn) {
      window.localStorage.setItem('login_token', true)
      setIsLoggedIn(true)
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
    </nav>
  )
}

export default Nav
