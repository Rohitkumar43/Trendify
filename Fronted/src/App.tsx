import React from 'react'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import { lazy , Suspense } from 'react';
import Loader from './components/loader';
const Home = lazy(() => import("./pages/home"));
const Search = lazy(() => import("./pages/search"));
const ProductDetails = lazy(() => import("./pages/product-details"));
const Cart = lazy(() => import("./pages/cart"));
// const Shipping = lazy(() => import("./pages/shipping"));
// const Login = lazy(() => import("./pages/login"));
// const Orders = lazy(() => import("./pages/orders"));
// const OrderDetails = lazy(() => import("./pages/order-details"));
// const NotFound = lazy(() => import("./pages/not-found"));
// const Checkout = lazy(() => import("./pages/checkout"));

const App = () => {
  return (
    <Router>
      {/* Header */}
        <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          {/* Not logged In Route */}
        </Routes>
        </Suspense>
    </Router>
  )
}

export default App
