import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider, useAuth } from 'react-auth-kit';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import "./styles.css"
import HomePage from './components/Pages/HomePage';
import Profile from './components/Pages/ProfilePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "signin",
    element: <SignIn/>,
  },
  {
    path: "signup",
    element: <div className='signUp'><SignUp/></div>,
  },
  {
    path: "home",
    element: <HomePage/>,
  },
  {
    path: "welcome",
    element: <App/>,
  },
  {
    path: "profile",
    element: <Profile/>,
  },

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
