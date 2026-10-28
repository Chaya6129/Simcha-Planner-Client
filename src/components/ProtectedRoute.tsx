import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../api/token';
import { AuthProvider } from '../auth/AuthContext';

const ProtectedRoute = () => {
    const token = getToken();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
};

export default ProtectedRoute;