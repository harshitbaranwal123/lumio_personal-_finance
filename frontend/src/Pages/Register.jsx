import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = register(name, email, password);
    if (!success) {
      setError("Email already exists");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="login-bg">
      <div className="login-card animate-card">
        <h2 className="auth-title">Create Account</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field" data-has-value={name.length > 0}>
            <input
              type="text"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-label="Name"
              placeholder="Name"
              autoComplete="name"
            />
            <label className="auth-label">Name</label>
          </div>

          <div className="auth-field" data-has-value={email.length > 0}>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
              placeholder="Email"
              autoComplete="email"
            />
            <label className="auth-label">Email</label>
          </div>

          <div className="auth-field" data-has-value={password.length > 0}>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
              placeholder="Password"
              autoComplete="new-password"
            />
            <label className="auth-label">Password</label>
          </div>

          <button type="submit" className="auth-btn">Register</button>
        </form>


        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
