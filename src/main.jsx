import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Main from './Main/Main';
import Home from './Home/Home';
import LoginForm from './Users/Login'; // Import employee interface
import EmployeeHome from './Home/EmployeeHome';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // Track user role (admin or employee)

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role); // Set the role based on login
  };

  // Define router for the admin view
  const adminRouter = createBrowserRouter([
    {
      path: "/",
      element: <Main isAdmin={true} />,
      errorElement: <div>404 Not Found</div>,
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ]);

  // Define router for the employee view
  const employeeRouter = createBrowserRouter([
    {
      path: "/",
      element: <Main isAdmin={false} />,
      errorElement: <div>404 Not Found</div>,
      children: [
        {
          path: "/",
          element: <EmployeeHome />,
        },
      ],
    },
  ]);

  return (
    <StrictMode>
      {isLoggedIn ? (
        userRole === 'admin' ? (
          <RouterProvider router={adminRouter} /> // Admin interface
        ) : (
          <RouterProvider router={employeeRouter} /> // Employee interface
        )
      ) : (
        <LoginForm onLogin={handleLogin} /> // Pass handleLogin to LoginForm
      )}
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<App />);
