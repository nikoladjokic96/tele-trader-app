import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/nav'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import Details from './pages/Details'

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Favorites" element={<Favorites />} />
          <Route path="Details/:pair" element={<Details />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
