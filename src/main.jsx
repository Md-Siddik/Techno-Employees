import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Main from './Main/Main';
import Home from './Home/Home';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
