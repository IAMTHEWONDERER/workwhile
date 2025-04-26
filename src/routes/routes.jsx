import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../utils/store";
import { checkAuthState } from "../utils/slices/authSlice";

import Homepage from "../pages/Homepage";
import LoginPage from "../pages/Loginpage";
import JobListingsPage from "../pages/JobListingsPage";
import JobDetailsPage from "../pages/JobDetailsPage";
import JobApplicationPage from "../pages/JobApplicationPage";
import Layout from "../components/common/Layout";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div className="mt-24 text-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Homepage />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "jobs",
          element: <JobListingsPage />,
        },
        {
          path: "job/:id",
          element: <JobDetailsPage />,
        },
        {
          path: "job/:id/apply",
          element: (
            <ProtectedRoute>
              <JobApplicationPage />
            </ProtectedRoute>
          ),
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