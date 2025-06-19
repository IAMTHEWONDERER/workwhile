import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    const location = useLocation();
  
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
  
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
  
    return children;
  };

  export default ProtectedRoute;