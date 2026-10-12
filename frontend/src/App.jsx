
import { useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000/api";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [loginRole, setLoginRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdSession, setCreatedSession] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  async function readResponse(response) {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch {
      throw new Error("Unexpected server response. Check the backend.");
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${API}/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.error || data.detail || "Login failed.");
      }

      if (data.role !== loginRole) {
        throw new Error("Please select the correct role.");
      }

      setUser({
        username: data.username,
        role: data.role,
      });
    } catch (err) {
      setError(err.message || "Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      const response = await fetch(`${API}/users/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.get("full_name"),
          username: form.get("username"),
          email: form.get("email"),
          password: form.get("password"),
          role: form.get("role"),
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error || data.detail || "Registration failed."
        );
      }

      setShowRegister(false);
      setMessage("Account created successfully. Please log in.");
      formElement.reset();
    } catch (err) {
      setError(err.message || "Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setCreatedSession(null);
    setMenuOpen(false);
    setError("");
    setMessage("");
  }

  async function handleCreateSession(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const session = {
      className: form.get("class_name"),
      date: form.get("date"),
      startTime: form.get("start_time"),
      endTime: form.get("end_time"),
    };

    if (session.endTime <= session.startTime) {
      setError("End time must be later than start time.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API}/attendance/sessions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_name: session.className,
          date: session.date,
          start_time: session.startTime,
          end_time: session.endTime,
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error || data.detail || "Could not create session."
        );
      }

      setCreatedSession({
        id: data.session_id ?? data.id ?? "N/A",
        ...session,
      });

      setMessage(data.message || "Session created successfully.");
      formElement.reset();
    } catch (err) {
      setError(err.message || "Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  function scrollToSection(id) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function NavButton({ section, icon, children }) {
    return (
      <button
        type="button"
        className="sidebar-link"
        onClick={() => scrollToSection(section)}
      >
        <span className="sidebar-link-icon">{icon}</span>
        <span>{children}</span>
      </button>
    );
  }

  // DASHBOARDS
  if (user) {
    return (
      <div className="dashboard">
        <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon">G</span>
            <div>
              <strong>GeoScan</strong>
              <small>Attendance Pro</small>
            </div>
          </div>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕ Close Menu" : "☰ Menu"}
          </button>

          <p className="sidebar-section-title">MAIN MENU</p>

          <nav className="sidebar-nav">
            <NavButton section="dashboard-top" icon="⌂">
              Dashboard
            </NavButton>

            {user.role === "STUDENT" && (
              <NavButton section="attendance-history" icon="▤">
                Attendance History
              </NavButton>
            )}

            {user.role === "LECTURER" && (
              <>
                <NavButton section="create-session" icon="＋">
                  Create Session
                </NavButton>
                <NavButton section="manage-sessions" icon="▤">
                  Manage Sessions
                </NavButton>
              </>
            )}

            {user.role === "ADMIN" && (
              <>
                <NavButton section="admin-overview" icon="▦">
                  Overview
                </NavButton>
                <NavButton section="admin-users" icon="♙">
                  User Management
                </NavButton>
                <NavButton section="admin-reports" icon="▤">
                  Attendance Reports
                </NavButton>
                <NavButton section="admin-activity" icon="◷">
                  Recent Activity
                </NavButton>
              </>
            )}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-user">
              <span className="sidebar-user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </span>
              <div>
                <strong>{user.username}</strong>
                <small>{user.role}</small>
              </div>
            </div>

            <button
              className="logout-button"
              type="button"
              onClick={logout}
            >
              ↪ Logout
            </button>
          </div>
        </aside>

        <main className="dashboard-content" id="dashboard-top">
          <header className="dashboard-header">
            <div className="dashboard-heading">
              <p className="dashboard-welcome">GEOSCAN ATTENDANCE PRO</p>
              <h1>
                {user.role === "STUDENT"
                  ? "Student Dashboard"
                  : user.role === "LECTURER"
                  ? "Lecturer Dashboard"
                  : "Administrator Dashboard"}
              </h1>
              <p className="dashboard-heading-description">
                Welcome to your attendance management workspace.
              </p>
            </div>

            <div className="dashboard-user">
              <span className="dashboard-avatar">
                {user.username.charAt(0).toUpperCase()}
              </span>
              <div>
                <strong>{user.username}</strong>
                <p>{user.role}</p>
              </div>
            </div>
          </header>

          {error && <p className="app-error" role="alert">{error}</p>}
          {message && <p className="app-message" role="status">{message}</p>}

          {/* STUDENT DASHBOARD */}
          {user.role === "STUDENT" && (
            <div className="student-dashboard">
              <section className="dashboard-section student-hero">
                <p className="student-eyebrow">STUDENT PORTAL</p>
                <h2>Welcome back, {user.username}!</h2>
                <p>
                  Manage your attendance and keep track of your classes
                  with GeoScan Attendance Pro.
                </p>
              </section>

              <section className="student-stats">
                <div className="dashboard-section student-stat">
                  <h3>Attendance Records</h3>
                  <p className="student-stat-value">—</p>
                  <p>Statistics are not connected yet.</p>
                </div>
                <div className="dashboard-section student-stat">
                  <h3>Attendance Rate</h3>
                  <p className="student-stat-value">—</p>
                  <p>Statistics are not connected yet.</p>
                </div>
                <div className="dashboard-section student-stat">
                  <h3>Upcoming Classes</h3>
                  <p className="student-stat-value">—</p>
                  <p>Class schedules are not connected yet.</p>
                </div>
              </section>

              <section
                className="dashboard-section"
                id="attendance-history"
              >
                <h2>My Attendance History</h2>
                <p>Review your recorded class attendance.</p>
                <div className="attendance-table-wrapper">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>Class</th>
                        <th>Date</th>
                        <th>Attendance Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="4" className="attendance-empty-cell">
                          No attendance records available yet.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="dashboard-section student-scan">
                <h2>Scan Attendance QR Code</h2>
                <p>QR scanning and GPS verification are still being developed.</p>
                <button type="button" disabled>
                  QR Scanner Coming Soon
                </button>
              </section>
            </div>
          )}

          {/* LECTURER DASHBOARD */}
          {user.role === "LECTURER" && (
            <div className="lecturer-dashboard">
              <section className="lecturer-hero">
                <div className="lecturer-hero-content">
                  <span className="lecturer-eyebrow">
                    GEOSCAN • LECTURER PORTAL
                  </span>
                  <h2>Welcome back, {user.username}!</h2>
                  <p>
                    Create class sessions and manage attendance from
                    one place.
                  </p>
                  <button
                    type="button"
                    className="lecturer-primary-button"
                    onClick={() => scrollToSection("create-session")}
                  >
                    + Create New Session
                  </button>
                </div>
                <div className="lecturer-hero-icon">▦</div>
              </section>

              <section className="lecturer-overview">
                <div className="dashboard-section lecturer-stat">
                  <h3>Sessions Created</h3>
                  <p className="lecturer-stat-value">
                    {createdSession ? "1" : "0"}
                  </p>
                </div>
                <div className="dashboard-section lecturer-stat">
                  <h3>Attendance Records</h3>
                  <p className="lecturer-stat-value">—</p>
                </div>
                <div className="dashboard-section lecturer-stat">
                  <h3>Upcoming Classes</h3>
                  <p className="lecturer-stat-value">—</p>
                </div>
              </section>

              <section
                className="dashboard-section lecturer-form-section"
                id="create-session"
              >
                <h2>Create Attendance Session</h2>
                <p>Enter your class details below.</p>

                <form
                  className="lecturer-session-form"
                  onSubmit={handleCreateSession}
                >
                  <div className="form-group">
                    <label htmlFor="class-name">Class Name</label>
                    <input
                      id="class-name"
                      name="class_name"
                      type="text"
                      placeholder="e.g. Software Engineering"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="session-date">Session Date</label>
                    <input id="session-date" name="date" type="date" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="start-time">Start Time</label>
                    <input
                      id="start-time"
                      name="start_time"
                      type="time"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="end-time">End Time</label>
                    <input
                      id="end-time"
                      name="end_time"
                      type="time"
                      required
                    />
                  </div>
                  <button
                    className="action-button"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating Session..." : "Create Session"}
                  </button>
                </form>
              </section>

              {createdSession && (
                <section className="dashboard-section session-success-card">
                  <h2>Session Created Successfully</h2>
                  <p>Session ID: #{createdSession.id}</p>
                  <p>Class: {createdSession.className}</p>
                  <p>Date: {createdSession.date}</p>
                  <p>
                    Time: {createdSession.startTime} – {createdSession.endTime}
                  </p>
                  <p>
                    QR-code generation and live attendance monitoring
                    still need to be implemented.
                  </p>
                </section>
              )}

              <section
                className="dashboard-section manage-sessions"
                id="manage-sessions"
              >
                <h2>Manage Sessions</h2>
                {createdSession ? (
                  <div className="managed-session-card">
                    <h3>{createdSession.className}</h3>
                    <p>Session ID: #{createdSession.id}</p>
                    <p>
                      {createdSession.date} · {createdSession.startTime}
                      {" – "}
                      {createdSession.endTime}
                    </p>
                  </div>
                ) : (
                  <p>No sessions created during this login yet.</p>
                )}
              </section>
            </div>
          )}

          {/* UNIVERSITY ADMINISTRATOR DASHBOARD */}
          {user.role === "ADMIN" && (
            <div className="admin-dashboard">
              <section className="admin-welcome-card">
                <div className="admin-welcome-content">
                  <span className="admin-welcome-badge">
                    ✦ UNIVERSITY ADMINISTRATION
                  </span>
                  <h2>Your university, at a glance.</h2>
                  <p>
                    Welcome back, {user.username}! Manage users and
                    review attendance activity.
                  </p>
                  <button
                    type="button"
                    className="admin-welcome-button"
                    onClick={() => scrollToSection("admin-users")}
                  >
                    Explore Management →
                  </button>
                </div>
                <div className="admin-welcome-art" aria-hidden="true">
                  <div className="admin-art-circle admin-art-circle-one" />
                  <div className="admin-art-circle admin-art-circle-two" />
                  <div className="admin-art-icon">🎓</div>
                  <span className="admin-art-sparkle">✦</span>
                  <span className="admin-art-star">✧</span>
                </div>
              </section>

              <div className="admin-section-heading" id="admin-overview">
                <div>
                  <span className="admin-section-eyebrow">OVERVIEW</span>
                  <h2>Dashboard Summary</h2>
                  <p>Here's a snapshot of your attendance system.</p>
                </div>
                <span className="admin-live-label">System Overview</span>
              </div>

              <section className="admin-stats">
                {[
                  ["♙", "Total Students", "admin-card-purple"],
                  ["♟", "Total Lecturers", "admin-card-blue"],
                  ["▦", "Attendance Sessions", "admin-card-pink"],
                  ["✓", "Attendance Records", "admin-card-green"],
                ].map(([icon, label, color]) => (
                  <article className={`admin-stat-card ${color}`} key={label}>
                    <div className="admin-stat-card-top">
                      <span className="admin-stat-icon">{icon}</span>
                    </div>
                    <p className="admin-stat-label">{label}</p>
                    <h3 className="admin-stat-number">—</h3>
                    <p className="admin-stat-footnote">
                      Awaiting backend statistics
                    </p>
                  </article>
                ))}
              </section>

              <div className="admin-content-grid">
                <section
                  className="admin-modern-panel admin-management-panel"
                  id="admin-users"
                >
                  <div className="admin-panel-heading">
                    <div className="admin-panel-icon admin-panel-icon-purple">
                      ♙
                    </div>
                    <div>
                      <h2>User Management</h2>
                      <p>Manage the people using GeoScan.</p>
                    </div>
                  </div>

                  <div className="admin-feature-row">
                    <span className="admin-feature-icon">🎓</span>
                    <div>
                      <strong>Students</strong>
                      <p>Student account management</p>
                    </div>
                    <span className="admin-feature-arrow">→</span>
                  </div>
                  <div className="admin-feature-row">
                    <span className="admin-feature-icon">👩‍🏫</span>
                    <div>
                      <strong>Lecturers</strong>
                      <p>Lecturer account management</p>
                    </div>
                    <span className="admin-feature-arrow">→</span>
                  </div>
                  <div className="admin-feature-row">
                    <span className="admin-feature-icon">🛡️</span>
                    <div>
                      <strong>Administrators</strong>
                      <p>Administrative account overview</p>
                    </div>
                    <span className="admin-feature-arrow">→</span>
                  </div>
                  <p className="admin-panel-note">
                    User lists require connected backend endpoints.
                  </p>
                </section>

                <section
                  className="admin-modern-panel admin-reports-panel"
                  id="admin-reports"
                >
                  <div className="admin-panel-heading">
                    <div className="admin-panel-icon admin-panel-icon-blue">
                      ▤
                    </div>
                    <div>
                      <h2>Attendance Reports</h2>
                      <p>Keep track of attendance performance.</p>
                    </div>
                  </div>
                  <div className="admin-report-illustration">
                    <div className="admin-report-bars">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="admin-report-center">
                      <span>📊</span>
                    </div>
                  </div>
                  <div className="admin-report-caption">
                    <strong>Insights that matter</strong>
                    <p>
                      Report summaries and exports require connected data.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="admin-outline-button"
                    onClick={() =>
                      setMessage(
                        "Attendance reports are awaiting backend integration."
                      )
                    }
                  >
                    View Report Status →
                  </button>
                </section>
              </div>

              <section
                className="admin-modern-panel admin-activity-panel"
                id="admin-activity"
              >
                <div className="admin-activity-header">
                  <div>
                    <span className="admin-section-eyebrow">
                      SYSTEM MONITOR
                    </span>
                    <h2>Recent Activity</h2>
                    <p>Monitor activity across the attendance system.</p>
                  </div>
                  <span className="admin-activity-badge">Preview</span>
                </div>

                <div className="admin-activity-list">
                  {[
                    ["▦", "Attendance Sessions"],
                    ["♙", "User Registrations"],
                    ["▤", "Attendance Reports"],
                  ].map(([icon, title]) => (
                    <div className="admin-activity-item" key={title}>
                      <span className="admin-activity-icon">{icon}</span>
                      <div className="admin-activity-description">
                        <strong>{title}</strong>
                        <p>Activity data is not connected yet.</p>
                      </div>
                      <span className="admin-activity-status">
                        Not connected
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <footer className="admin-dashboard-footer">
                <span className="admin-footer-mark">G</span>
                <p>GeoScan Attendance Pro</p>
                <span>University Administration</span>
              </footer>
            </div>
          )}
        </main>
      </div>
    );
  }

  // LOGIN AND REGISTRATION
  return (
    <div className="app">
      <div className="login-card">
        <div className="logo">GeoScan Attendance Pro</div>
        <p className="subtitle">Smart Attendance System</p>

        <h2>{showRegister ? "Register" : "Login"}</h2>

        {error && <p className="app-error" role="alert">{error}</p>}
        {message && <p className="app-message" role="status">{message}</p>}

        {showRegister ? (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="register-full-name">Full Name</label>
              <input
                id="register-full-name"
                name="full_name"
                type="text"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-username">Username</label>
              <input
                id="register-username"
                name="username"
                type="text"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                name="email"
                type="email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-role">Role</label>
              <select
                id="register-role"
                name="role"
                defaultValue="STUDENT"
              >
                <option value="STUDENT">Student</option>
                <option value="LECTURER">Lecturer</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                name="password"
                type="password"
                required
              />
            </div>
            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-role">Login as</label>
              <select
                id="login-role"
                value={loginRole}
                onChange={(event) => setLoginRole(event.target.value)}
              >
                <option value="STUDENT">Student</option>
                <option value="LECTURER">Lecturer</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                name="username"
                type="text"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
              />
            </div>
            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        <p className="register-text">
          {showRegister
            ? "Already have an account?"
            : "Don't have an account?"}
        </p>

        <button
          className="register-button"
          type="button"
          onClick={() => {
            setShowRegister((current) => !current);
            setError("");
            setMessage("");
          }}
        >
          {showRegister ? "Back to Login" : "Register"}
        </button>
      </div>
    </div>
  );
}

export default App;
