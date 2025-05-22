import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaUserShield } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Register = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/auth/register", values);
      if (res.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h2 className="mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              name="username"
              required
              value={values.username}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaEnvelope />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              name="email"
              required
              value={values.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              required
              value={values.password}
              onChange={handleChange}
            />
          </div>

          {/* Role Dropdown */}
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaUserShield />
            </span>
            <select
              className="form-select"
              name="role"
              value={values.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
             
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">Register</button>

          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
