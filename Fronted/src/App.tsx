import React from 'react'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import Home from './pages/home';
import Search from './pages/search';
import Cart from './pages/cart'
import ProductDetails from './pages/product-details';


const App = () => {
  return (
    <Router>
      {/* Header */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          {/* Not logged In Route */}
          </Routes>
          </Router>
  )
}

export default App
