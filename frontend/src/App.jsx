import { useState } from "react";
import "./App.css";

function App() {
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return (
      <div className="app">
        <div className="login-card">
          <div className="logo">GeoScan Attendance Pro</div>

          <p className="subtitle">Smart Attendance System</p>

          <h2>Register</h2>

          <form onSubmit={(event) => {
            event.preventDefault();
            alert("Registration form submitted!");
          }}>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Choose a username"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
  <label>Role</label>
  <select>
    <option>Student</option>
    <option>Lecturer</option>
    <option>Administrator</option>
  </select>
</div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
              />
            </div>

            <button className="login-button" type="submit">
              Create Account
            </button>
          </form>

          <p className="register-text">
            Already have an account?
          </p>

          <button
            className="register-button"
            onClick={() => setShowRegister(false)}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="login-card">
        <div className="logo">GeoScan Attendance Pro</div>

        <p className="subtitle">Smart Attendance System</p>

        <h2>Login</h2>

        <div className="form-group">
          <label>Login as</label>
          <select>
  <option value="student">Student</option>
  <option value="lecturer">Lecturer</option>
  <option value="admin">Administrator</option>
</select>
        </div>

        <form onSubmit={(event) => {
          event.preventDefault();
          alert("Login form submitted!");
        }}>
          
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button className="login-button" type="submit">
            Login
          </button>
        </form>

        <p className="register-text">
          Don't have an account?
        </p>

        <button
          className="register-button"
          onClick={() => setShowRegister(true)}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default App;