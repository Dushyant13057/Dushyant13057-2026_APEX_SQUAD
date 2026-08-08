import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DesignStudio from './pages/DesignStudio';
import OrderPage from './pages/OrderPage';
import PrintMode from './pages/PrintMode';
import BusinessRegister from './pages/BusinessRegister';
import RatingsPage from './pages/RatingsPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />
        } />
        <Route path="/dashboard" element={
          isLoggedIn ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />
        <Route path="/design" element={
          isLoggedIn ? <DesignStudio user={user} /> : <Navigate to="/login" />
        } />
        <Route path="/order" element={
          isLoggedIn ? <OrderPage user={user} /> : <Navigate to="/login" />
        } />
        <Route path="/print" element={
          isLoggedIn ? <PrintMode user={user} /> : <Navigate to="/login" />
        } />
        <Route path="/register" element={
          isLoggedIn ? <BusinessRegister user={user} /> : <Navigate to="/login" />
        } />
        <Route path="/ratings" element={
          isLoggedIn ? <RatingsPage user={user} /> : <Navigate to="/login" />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
