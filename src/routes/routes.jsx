import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../redux/store";
import { checkAuthState } from "../slices/authSlice";
import ProfileSettingsPage from "../pages/ProfileSettingsPage"
import Homepage from "../pages/Homepage";
import LoginPage from "../pages/Loginpage";
import RegisterPage from "../pages/RegisterPage";
import ProfileSetupPage from "../pages/ProfileSetupPage";
import JobListingsPage from "../pages/JobListingsPage";
import JobDetailsPage from "../pages/JobDetailsPage";
import JobApplicationPage from "../pages/JobApplicationPage";
import Layout from "../components/common/Layout";
import CompanyReviewPage from "../pages/CompanyReviewPage";
import SalaryGuidePage from "../pages/SalaryGuidePage";

// ScrollToTop component to reset scroll position on page navigation
const ScrollToTop = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return children;
};

// ProtectedRoute component - requires authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the current location the user was trying to access
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

// NewUserRoute component - only for newly registered users who need to complete profile
const NewUserRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has just registered (needs to complete profile)
  const needsProfileSetup = user?.needsProfileSetup === true;
  
  if (!needsProfileSetup) {
    return <Navigate to="/jobs" replace />;
  }

  return children;
};

// ProfileCompletedRoute component - requires authentication AND completed profile
const ProfileCompletedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the current location the user was trying to access
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect to profile setup if needed
  if (user?.needsProfileSetup) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

// AppContent component
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ScrollToTop>
          <Layout />
        </ScrollToTop>
      ),
      children: [
        {
          index: true,
          element: <Homepage />, // Homepage is now publicly accessible
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
        {
          path: "profile-setup",
          element: (
            <NewUserRoute>
              <ProfileSetupPage />
            </NewUserRoute>
          ),
        },
        {
          path: "jobs",
          element: <JobListingsPage />, // Job listings are publicly accessible
        },
        {
          path: "job/:id",
          element: <JobDetailsPage />, // Job details are publicly accessible
        },
        {
          path: "companies",
          element: <CompanyReviewPage />, // Company reviews are publicly accessible
        },
        {
          path: "salaries",
          element: <SalaryGuidePage />, // Salary guides are publicly accessible
        },
        {
          path: "job/:id/apply",
          element: (
            <ProfileCompletedRoute>
              <JobApplicationPage />
            </ProfileCompletedRoute>
          ), // Job application requires authentication
        },
        {
          path: "job/:id/edit",
          element: (
            <ProtectedRoute>
              <JobDetailsPage isEditing={true} />
            </ProtectedRoute>
          ),
        },
        {
          path: "job/:id/applications",
          element: (
            <ProtectedRoute>
              <JobDetailsPage showApplications={true} />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile/applications",
          element: (
            <ProtectedRoute>
              <JobListingsPage showApplications={true} />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <ProfileSettingsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: (
            <div className="min-h-screen flex justify-center items-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">404</h1>
                <p className="text-xl text-gray-600">Page not found</p>
                <button 
                  onClick={() => window.history.back()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Go Back
                </button>
              </div>
            </div>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

// Final AppRouter with Redux Provider
const AppRouter = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default AppRouter;