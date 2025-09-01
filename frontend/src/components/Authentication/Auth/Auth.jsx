import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../service/api';
import { Navigate } from 'react-router-dom';
import './Auth.css';

const registerInitialValues = {
  username: '',
  email: '',
  password: '',
  phone: '',
  address:'',
  role: ''
};

const loginInitialValues = {
  email: '',
  password: '',
  role: ''
};

const Auth = ({ setIsAuthenticated, setUserName }) => {
  const [register, setRegister] = useState(registerInitialValues);
  const [login, setLogin] = useState(loginInitialValues);
  const [account, toggleAccount] = useState('login');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [warnings, setWarnings] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const toggleSignup = () => {
    toggleAccount(account === 'register' ? 'login' : 'register');
    setError('');
    setWarnings({});
  };

  const handleClick = () => {
    navigate('./confirmemail');
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => password.length >= 6;

  const onInputChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
    validateFields('register', e.target.name, e.target.value);
  };

  const onValueChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
    validateFields('login', e.target.name, e.target.value);
  };

  const onRoleChange = (e) => {
    const role = e.target.value;
    if (account === 'login') {
      setLogin({ ...login, role });
    } else {
      setRegister({ ...register, role });
    }
  };

  const validateFields = (form, field, value) => {
    const newWarnings = { ...warnings };

    if (field === 'email' && !validateEmail(value)) {
      newWarnings.email = 'Please enter a valid email address.';
    } else if (field === 'password' && !validatePassword(value)) {
      newWarnings.password = 'Password must be at least 6 characters long.';
    } else {
      delete newWarnings[field];
    }

    if (form === 'register' && field === 'name' && value.trim() === '') {
      newWarnings.username = 'Name is required.';
    } else if (form === 'register' && field === 'username') {
      delete newWarnings.username;
    }

     if (form === 'register' && field === 'phone' && value.trim() === '') {
    newWarnings.phone = 'Phone number is required.';
  } else if (form === 'register' && field === 'phone') {
    delete newWarnings.phone;
  }

  // Address validation
  if (form === 'register' && field === 'address' && value.trim() === '') {
    newWarnings.address = 'Address is required.';
  } else if (form === 'register' && field === 'address') {
    delete newWarnings.address;
  }

    setWarnings(newWarnings);
  };

  const registerUser = async () => {
    if (!register.username || !register.email || !register.password || !register.role || !register.phone || !register.address) {
      setError('Please fill in all fields.');
      return;
    }
    if (Object.keys(warnings).length > 0) {
      setError('Please resolve all validation warnings.');
      return;
    }

    try {
      const response =
        register.role === 'Admin'
          ? await API.adminregister(register) // Admin registration
          : register.role === 'User'
          ? await API.userregister(register) // Member registration
          : { isSuccess: false, msg: 'Invalid role' };
    
      if (response.isSuccess) {
        setRegister(registerInitialValues);
        toggleAccount('login');
        setError('');
      } else {
        setError('Something went wrong, try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Error in registerUser:', err);
    }
  };

  const loginUser = async () => {
    if (!login.email || !login.password || !login.role) {
      setError('Please fill in all fields.');
      return;
    }
    if (Object.keys(warnings).length > 0) {
      setError('Please resolve all validation warnings.');
      return;
    }

    try {
      const response =
        login.role === 'Admin'
          ? await API.adminlogin(login) // Admin login
          : login.role === 'User'
          ? await API.userlogin(login) // Member login
          : { isSuccess: false, msg: 'Invalid role' };

      if (response.isSuccess) {
        setIsAuthenticated(true);
        if (login.role === 'Admin') {
          setUserName(response.data.userName);
          localStorage.setItem('userName', response.data.userName);
          localStorage.setItem('role', login.role);
        } else if (login.role === 'User') {
          setUserName(response.data.userName);
          localStorage.setItem('userName', response.data.userName);
          localStorage.setItem('role', login.role);
        } 

        localStorage.setItem('token', response.data.token);
        setRedirectToHome(true);
      } else {
        setError('Invalid credentials, please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Error in loginUser:', err);
    }
  }

  if (redirectToHome) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-container">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      {account === 'login' ? (
        <div className="form-container login">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Enter Email"
            name="email"
            onChange={onValueChange}
            className="input-field"
          />
          {warnings.email && <p className="warning-message">{warnings.email}</p>}
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              onChange={onValueChange}
              className="input-field"
            />
            <span className="material-icons show-hide" onClick={togglePasswordVisibility}>
              {showPassword ? 'visibility' : 'visibility_off'}
            </span>
          </div>


          <p onClick={handleClick} style={{textAlign: "start"}}>Forgot Password ?</p>
          <select name="role" value={login.role} onChange={onRoleChange} className="input-field">
            <option value="">Login as</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          {warnings.password && <p className="warning-message">{warnings.password}</p>}
          {error && <p className="error-message">{error}</p>}
          <button className="dark-button" onClick={loginUser}>
            Login
          </button>
          <p className="text">OR</p><br />
          <button className="light-button" onClick={toggleSignup}>
            Create an account
          </button>
        </div>
      ) : (
        <div className="form-container register">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Enter Name"
            name="username"
            onChange={onInputChange}
            className="input-field"
          />
          {warnings.username && <p className="warning-message">{warnings.username}</p>}
          <input
            type="text"
            placeholder="Enter Email"
            name="email"
            onChange={onInputChange}
            className="input-field"
          />
          {warnings.email && <p className="warning-message">{warnings.email}</p>}
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              onChange={onInputChange}
              className="input-field"
            />
            <span className="material-icons show-hide" onClick={togglePasswordVisibility}>
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          </div>

                    <input
  type="text"
  placeholder="Enter Phone Number"
  name="phone"
  onChange={onInputChange}
  className="input-field"
/>
{warnings.phone && <p className="warning-message">{warnings.phone}</p>}

{/* Address */}
<input
  type="text"
  placeholder="Enter Address"
  name="address"
  onChange={onInputChange}
  className="input-field"
/>
{warnings.address && <p className="warning-message">{warnings.address}</p>}


          <select name="role" value={register.role} onChange={onRoleChange} className="input-field">
            <option value="">Signup as</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          {warnings.password && <p className="warning-message">{warnings.password}</p>}
          {error && <p className="error-message">{error}</p>}
          <button className="dark-button" onClick={registerUser}>Signup</button>
          <p className="text">OR</p>
          <br />
          <button className="light-button" onClick={toggleSignup}>Already have an account</button>
        </div>
      )}
    </div>
  );
};

export default Auth;
