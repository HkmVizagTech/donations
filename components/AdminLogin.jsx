"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_API_URL, storeAdminSession } from "@/lib/adminApi";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!ADMIN_API_URL) {
      setError("Backend API URL is missing.");
      return;
    }

    if (!username.trim() || !password) {
      setError("Enter username and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${ADMIN_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username.trim(),
          password
        }),
        credentials: "omit"
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Login failed.");
      }

      storeAdminSession(payload.token, payload.admin);
      router.replace("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-panel">
        <div className="admin-brand-mark">
          <img src="/branding/iskcon-gambheeram-logo.png" alt="ISKCON Gambheeram logo" />
        </div>
        <p className="admin-eyebrow">ISKCON Charity Vizag</p>
        <h1>Admin Login</h1>
        <p className="admin-auth-copy">
          View donations, donors, UTM campaign performance, receipts, and export reports.
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            <span>Username or Email</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              placeholder="admin@iskconcharity.org"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter password"
            />
          </label>

          {error ? <p className="admin-error">{error}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
