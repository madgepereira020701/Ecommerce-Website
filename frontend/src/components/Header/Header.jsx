import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

const Header = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName") || "";
    const storedUserRole = localStorage.getItem("role") || "";

    // Generate initials safely
    if (storedUserName) {
      const nameParts = storedUserName.trim().split(" ");
      let initials = "";

      if (nameParts.length === 1) {
        initials = nameParts[0][0]; // Single name
      } else {
        initials = nameParts.map((word) => word[0]).join(""); // First letters of all words
      }

      setUserInitials(initials.toUpperCase());
    }

    setRole(storedUserRole);
  }, []);

  const toggleDropDown = () => setIsDropDownOpen(!isDropDownOpen);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    window.location.href = "/login"; // redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <Link to="/" className="navbar-brand">
            🛒 Ecommerce App
          </Link>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {role === "Admin" ? (
              <>
                <li className="nav-item">
                  <NavLink to="/home" className="nav-link">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/profile" className="nav-link">
                    Profile
                  </NavLink>
                </li>
                                <li className="nav-item">
                  <NavLink to="/categories" className="nav-link">
                    Categories
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/products" className="nav-link">
                    Products
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/orders" className="nav-link">
                    Orders
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/users" className="nav-link">
                    Users
                  </NavLink>
                </li>
              </>
            ) : role === "User" ? (
              <>
                <li className="nav-item">
                  <NavLink to="/home" className="nav-link">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/category" className="nav-link">
                    Category
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/cart" className="nav-link">
                    Cart
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/orders" className="nav-link">
                    Orders
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/profile" className="nav-link">
                    Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/products" className="nav-link">
                    Products
                  </NavLink>
                </li>
              </>
            ) : null}

            {/* User initials dropdown */}
            {userInitials ? (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle"
                  role="button"
                  onClick={toggleDropDown}
                >
                  {userInitials}
                </span>
                {isDropDownOpen && (
                  <ul className="dropdown-menu dropdown-menu-end show">
                    <li>
                      <span className="dropdown-item-text">
                        Role: {role || "User"}
                      </span>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={logout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
