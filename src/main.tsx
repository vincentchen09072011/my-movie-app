import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App.tsx'
import './index.css'
import LandingPage from './pages/landing/index.tsx'
import {AboutPage} from './pages/about/index.tsx'
import {ContactPage} from './pages/contact/index.tsx'
import {DetailPage} from './pages/detail/index.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/about",
    element: <AboutPage />
  },
  {
    path: "/contact",
    element: <ContactPage />
  },
  {
    path: "/movie/:id",
    element: <DetailPage />
  }
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/*<App />*/}
    <RouterProvider router={router} />
  </React.StrictMode>,
)