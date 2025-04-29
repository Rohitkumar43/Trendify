import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loader from './components/loader';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { userExist, userNotExist } from './redux/reducer/userReducer';
import { getUser } from './redux/api/userApi';
import { RootState } from './redux/store';
import ProtectedRoute from './components/protected-routes';
import Login from './pages/login';
import Header from './components/header';
import NotFound from './pages/not-found';

// Lazy-loaded User Routes
const Home = lazy(() => import('./pages/home'));
const Search = lazy(() => import('./pages/search'));
const ProductDetails = lazy(() => import('./pages/product-details'));
const Cart = lazy(() => import('./pages/cart'));
const ImageUploadDemo = lazy(() => import('./pages/ImageUploadDemo'));

// Lazy-loaded Admin Routes
const Dashboard = lazy(() => import('./pages/admin/dashboard'));
const Products = lazy(() => import('./pages/admin/products'));
const Customers = lazy(() => import('./pages/admin/customers'));
const Transaction = lazy(() => import('./pages/admin/transaction'));

// Lazy-loaded Charts
const Barcharts = lazy(() => import('./pages/admin/charts/barcharts'));
const Piecharts = lazy(() => import('./pages/admin/charts/piecharts'));
const Linecharts = lazy(() => import('./pages/admin/charts/linecharts'));

// Lazy-loaded Apps
const Coupon = lazy(() => import('./pages/admin/apps/coupon'));
const Stopwatch = lazy(() => import('./pages/admin/apps/stopwatch'));
const Toss = lazy(() => import('./pages/admin/apps/toss'));

// Lazy-loaded Management
const NewProduct = lazy(() => import('./pages/admin/management/newproduct'));
const ProductManagement = lazy(() => import('./pages/admin/management/productmanagement'));
const TransactionManagement = lazy(() => import('./pages/admin/management/transactionmanagement'));

const App = () => {
  const { user, loading } = useSelector((state: RootState) => state.user);
  
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User logged in');
        const data = await getUser(user.uid);
        dispatch(userExist(data.user));
      } else {
        console.log('Not logged in');
        dispatch(userNotExist());
      }
    });
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : (
    <Router>
      {/* Header Component */}
      <Header user={user} />
      
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Search />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/image-upload' element={<ImageUploadDemo />} />
          
          {/* Login Route (Only accessible if not logged in) */}
          <Route
            path='/login'
            element={
              <ProtectedRoute isAuthenticated={!user}>
                <Login />
              </ProtectedRoute>
            }
          />
          
          {/* Protected User Routes */}
          <Route element={<ProtectedRoute isAuthenticated={!!user} />}>
          
            {/* Admin Routes - Only accessible by admin users */}
            <Route
              element={<ProtectedRoute isAuthenticated={!!user} adminOnly admin={user?.role === 'admin'} />}
            >
              <Route path='/admin/dashboard' element={<Dashboard />} />
              <Route path='/admin/product' element={<Products />} />
              <Route path='/admin/product/new' element={<NewProduct />} />
              <Route path='/admin/product/:id' element={<ProductManagement />} />
              <Route path='/admin/customer' element={<Customers />} />
              <Route path='/admin/transaction' element={<Transaction />} />
              <Route path='/admin/transaction/:id' element={<TransactionManagement />} />
              
              {/* Charts */}
              <Route path='/admin/chart/bar' element={<Barcharts />} />
              <Route path='/admin/chart/pie' element={<Piecharts />} />
              <Route path='/admin/chart/line' element={<Linecharts />} />
              
              {/* Apps */}
              <Route path='/admin/app/coupon' element={<Coupon />} />
              <Route path='/admin/app/stopwatch' element={<Stopwatch />} />
              <Route path='/admin/app/toss' element={<Toss />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      {/* Toaster Notification */}
      <Toaster position='bottom-right' />
    </Router>
  );
};

export default App;
