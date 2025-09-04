import React, { useState } from "react";
import "./App.css";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Profile from './pages/Profile/Profile'
import Home from "./pages/Home/Home";
import AboutUs from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Policy from "./pages/Policy/Policy";
import Pagenotfound from "./pages/Pagenotfound/Pagenotfound";

import Auth from "./components/Authentication/Auth/Auth";
import ChangePassword from "./components/Authentication/ChangePassword/ChangePassword";
import ConfirmEmail from "./components/Authentication/ConfirmEmail/ConfirmEmail";

import ProtectedRoute from "./ProtectedRoute.jsx"; // ✅
import Products from "./pages/Products/Products";
import Categories from "./pages/Categories/Categories.jsx";
import ProductDetails from "./pages/ProductDetails/ProductDetails.jsx";
import UserProducts from "./pages/UserSection/UserProducts";
import UserCategories from "./pages/UserSection/UserCategories.jsx";
import Cart from "./pages/UserSection/Cart.jsx";
import UserOrders from "./pages/UserSection/UserOrders.jsx";
import Orders from "./pages/Orders.jsx";
import UserHome from "./pages/UserSection/UserHome.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") !== null
  );
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  return (
    <div className="App">
        {/* Show Header only if logged in */}
        {isAuthenticated && (
          <Header
            isAuthenticated={isAuthenticated}
            userName={userName}
            setIsAuthenticated={setIsAuthenticated}
          />
        )}

        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" />
              ) : (
                <Auth
                  setIsAuthenticated={setIsAuthenticated}
                  setUserName={setUserName}
                />
              )
            }
          />

          {/* Public routes */}
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/confirmemail" element={<ConfirmEmail />} />

          {/* Protected routes */}
          <Route
            path="/home"
            element={<ProtectedRoute element={<Home />} />}
          />
          <Route
            path="/about"
            element={<ProtectedRoute element={<AboutUs />} />}
          />

                    <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />

          <Route
            path="/contact"
            element={<ProtectedRoute element={<Contact />} />}
          />
          <Route
            path="/policy"
            element={<ProtectedRoute element={<Policy />} />}
          />
                    <Route
            path="/categories"
            element={<ProtectedRoute element={<Categories />} />}
          />

                              <Route
            path="/product/:name"
            element={<ProtectedRoute element={<ProductDetails />} />}
          />


                    <Route
            path="/products"
            element={<ProtectedRoute element={<Products />} />}
          />

          <Route
            path="/userproducts"
            element={<ProtectedRoute element={<UserProducts />} requiredRole="User"/>}
          />

                                        <Route
            path="/usercategories"
            element={<ProtectedRoute element={<UserCategories />} requiredRole="User"/>}
          />


<Route
            path="/cart"
            element={<ProtectedRoute element={<Cart />} requiredRole="User"/>}
          />

  <Route
            path="/userorders"
            element={<ProtectedRoute element={<UserOrders/>} requiredRole="User"/>}
          />
        
  <Route
            path="/orders"
            element={<ProtectedRoute element={<Orders/>} requiredRole="Admin"/>}
          />

            <Route
            path="/userhome"
            element={<ProtectedRoute element={<UserHome/>} requiredRole="User"/>}
          />





          <Route
            path="*"
            element={<ProtectedRoute element={<Pagenotfound />} />}
          />
        </Routes>
    </div>
  );
}

export default App;
