import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import { loginAdmin } from "../services/adminApi";
import { canAttemptLogin, recordLoginAttempt } from "../utils/rateLimiter";
import { validateLoginForm } from "../utils/validation";

const INITIAL_STATE = {
  email: "",
  password: "",
};

function toFriendlyWait(waitMs) {
  return Math.max(Math.ceil(waitMs / 1000), 1);
}

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [value, setValue] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");

  const redirectPath = useMemo(() => {
    return location.state?.from || "/admin";
  }, [location.state]);

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    const nextErrors = validateLoginForm(value);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const limit = canAttemptLogin();
    if (!limit.allowed) {
      setServerError(`Too many login attempts. Try again in ${toFriendlyWait(limit.waitMs)} seconds.`);
      return;
    }

    try {
      setBusy(true);
      recordLoginAttempt();
      const session = await loginAdmin(value);
      login(session);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setServerError(error.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="wrap main admin-layout">
      <section className="admin-card auth-card">
        <h1 className="admin-title">Admin Login</h1>
        <p className="admin-subtitle">Access is restricted to authorized administrators only.</p>
        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          <label className="admin-field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={value.email}
              onChange={(event) => setValue((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="admin@ledgerpost.com"
            />
            {errors.email ? <small className="admin-error">{errors.email}</small> : null}
          </label>

          <label className="admin-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={value.password}
              onChange={(event) => setValue((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="••••••••••"
            />
            {errors.password ? <small className="admin-error">{errors.password}</small> : null}
          </label>

          {serverError ? <p className="admin-error-block">{serverError}</p> : null}

          <button type="submit" className="admin-btn primary" disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="admin-footnote">
          In demo mode, use <strong>admin@ledgerpost.com</strong> and <strong>AdminPass!2026</strong>.
          <br />
          <Link to="/">Return to public site</Link>
        </p>
      </section>
    </main>
  );
}
