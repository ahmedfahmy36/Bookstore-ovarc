import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './auth-context';
import { useAuth } from './hooks/useAuth';
import Loading from './pages/Loading';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Stores = lazy(() => import('./pages/Stores'));
const Books = lazy(() => import('./pages/Books'));
const Authors = lazy(() => import('./pages/Authors'));
const NotFound = lazy(() => import('./pages/NotFound'));
const StoreInventory = lazy(() => import('./pages/StoreInventory'));
const Login = lazy(() => import('./pages/Login'));
const Layout = lazy(() => import('./components/Layout'));

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/stores" element={<Stores />} />
              <Route path="/books" element={<Books />} />
              <Route path="/authors" element={<Authors />} />
              <Route
                path="/store/:storeId"
                element={
                  <ProtectedRoute>
                    <StoreInventory />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;