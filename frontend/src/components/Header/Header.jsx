import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const [role, setRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName") || "";
    const storedUserRole = localStorage.getItem("role") || "";

    if (storedUserName) {
      const nameParts = storedUserName.trim().split(" ");
      const initials =
        nameParts.length === 1
          ? nameParts[0][0]
          : nameParts.map((word) => word[0]).join("");
      setUserInitials(initials.toUpperCase());
    }
    setRole(storedUserRole);
  }, []);

  const toggleDropDown = () => setIsDropDownOpen(!isDropDownOpen);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirect to search results page or filter products
    console.log("Search query:", searchQuery);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          🛒 Shop Mania
        </Link>

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
          {/* Left side nav links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {role === "Admin" && (
              <>
                <li className="nav-item">
                  <NavLink to="/home" className="nav-link">Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/categories" className="nav-link">Categories</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/products" className="nav-link">Products</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/orders" className="nav-link">Orders</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/users" className="nav-link">Users</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/adminprofile" className="nav-link">Profile</NavLink>
                </li>
              </>
            )}

            {role === "User" && (
              <>
                <li className="nav-item">
                  <NavLink to="/userhome" className="nav-link">Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/usercategories" className="nav-link">Categories</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/userproducts" className="nav-link">Products</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/cart" className="nav-link">Cart</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/userorders" className="nav-link">Orders</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/userprofile" className="nav-link">Profile</NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Search bar for user */}
          {role === "User" && (
            <form
              className="d-flex me-3"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="btn btn-outline-success" type="submit">
                <FaSearch />
              </button>
            </form>
          )}

          {/* Right side user dropdown */}
          {userInitials ? (
            <div className="dropdown">
              <span
                className="btn btn-secondary dropdown-toggle"
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
            </div>
          ) : (
            <>
              <NavLink to="/register" className="btn btn-outline-primary me-2">
                Register
              </NavLink>
              <NavLink to="/login" className="btn btn-primary">
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
