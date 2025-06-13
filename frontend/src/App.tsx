import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserManagementPage from './pages/UserManagementPage';
import { useAuth } from './hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <CircularProgress />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ p: 3, mt: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/users" element={<UserManagementPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;