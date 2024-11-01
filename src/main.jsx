// import { StrictMode, useContext, useState } from 'react';
// import ReactDOM from 'react-dom/client';
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
// import './index.css';
// import Main from './Main/Main';
// import Home from './Home/Home';
// import LoginForm from './Users/Login'; // Import employee interface
// import EmployeeHome from './Home/EmployeeHome';
// import { AuthContext } from './AuthProvider/AuthProvider';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState(null); // Track user role (admin or employee)

//   const { user } = useContext(AuthContext);
 
//   const handleLogin = (role) => {
//     setIsLoggedIn(true);
//     setUserRole(role); // Set the role based on login
//   };

//   // Define router for the admin view
//   const adminRouter = createBrowserRouter([
//     {
//       path: "/",
//       element: <Main isAdmin={true} />,
//       errorElement: <div>404 Not Found</div>,
//       children: [
//         {
//           path: "/",
//           element: <Home />,
//         },
//       ],
//     },
//   ]);

//   // Define router for the employee view
//   const employeeRouter = createBrowserRouter([
//     {
//       path: "/",
//       element: <Main isAdmin={false} />,
//       errorElement: <div>404 Not Found</div>,
//       children: [
//         {
//           path: "/",
//           element: <EmployeeHome />,
//         },
//       ],
//     },
//   ]);

//   return (
//     <AuthProvider>
//       {isLoggedIn ? (
//         userRole === 'admin' ? (
//           <RouterProvider router={adminRouter} /> // Admin interface
//         ) : (
//           <RouterProvider router={employeeRouter} /> // Employee interface
//         )
//       ) : (
//         <LoginForm onLogin={handleLogin} /> // Pass handleLogin to LoginForm
//       )}
//     </AuthProvider>
//   );
// };

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//       <App />
//     </GoogleOAuthProvider>
//   </StrictMode>
// );

import { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Main from './Main/Main';
import Home from './Home/Home';
import LoginForm from './Users/Login';
import EmployeeHome from './Home/EmployeeHome';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthProvider from './AuthProvider/AuthProvider';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => JSON.parse(localStorage.getItem('isLoggedIn')) || false
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem('userRole') || null
  );
  const [userEmail, setUserEmail] = useState(null);

  const handleLogin = (role, email) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('isLoggedIn', JSON.stringify(true));
    localStorage.setItem('userRole', role);
    setUserEmail(email);
  };

  const adminRouter = createBrowserRouter([
    {
      path: "/",
      element: <Main isAdmin={true} />,
      errorElement: <div>404 Not Found</div>,
      children: [
        {
          path: "/",
          element: <Home userEmail={userEmail} />,
        },
      ],
    },
  ]);

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
    <AuthProvider>
      {isLoggedIn ? (
        userRole === 'admin' ? (
          <RouterProvider router={adminRouter} /> // Admin interface
        ) : (
          <RouterProvider router={employeeRouter} /> // Employee interface
        )
      ) : (
        <LoginForm onLogin={handleLogin} /> // Pass handleLogin to LoginForm
      )}
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
