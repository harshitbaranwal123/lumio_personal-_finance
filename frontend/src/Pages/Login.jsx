import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import AnimatedLogo from "../components/AnimatedLogo";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = login(email, password);

    if (!success) {
      setError("Invalid email or password");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="login-bg">
      <div className="login-card animate-card">
        <h2 className="auth-title">Login</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
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
              autoComplete="current-password"
            />
            <label className="auth-label">Password</label>
          </div>

          <button type="submit" className="auth-btn">Login</button>
        </form>


        <p className="auth-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
