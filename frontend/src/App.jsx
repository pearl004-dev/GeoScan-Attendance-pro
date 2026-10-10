
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      if (data.role !== loginRole) {
        throw new Error("Please select the correct role for this account.");
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

    const form = new FormData(event.currentTarget);

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      setMessage("Account created successfully. Please log in.");
      setShowRegister(false);
    } catch (err) {
      setError(err.message || "Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setCreatedSession(null);
    setError("");
    setMessage("");
  }

  if (user) {
    return (
      <div className="dashboard">
        <aside className="sidebar">
          <div className="sidebar-logo">GeoScan</div>
          
          <nav className="sidebar-nav">
            <button
              type="button"
              onClick={() => {
                setError("");
                setMessage("");
                document.getElementById("dashboard-top")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <span>⌂</span> Dashboard
            </button>

            {user.role === "LECTURER" && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("create-session")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                >
                  <span>＋</span> Create Session
                </button>

                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("manage-sessions")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                >
                  <span>▤</span> Manage Sessions
                </button>
              </>
            )}

            {user.role === "STUDENT" && (
              <button
                type="button"
                onClick={() =>
                  document.getElementById("attendance-history")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                <span>▤</span> Attendance History
              </button>
            )}
          </nav>

          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </aside>

        <main className="dashboard-content" id="dashboard-top">
          <h1>
            {user.role === "STUDENT"
              ? "Student Dashboard"
              : "Lecturer Dashboard"}
          </h1>
          <p className="dashboard-welcome">
            Welcome, {user.username}!
          </p>

          {error && <p className="app-error">{error}</p>}
          {message && <p className="app-message">{message}</p>}

          
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
        <p>Records will appear when history is connected.</p>
      </div>

      <div className="dashboard-section student-stat">
        <h3>Attendance Rate</h3>
        <p className="student-stat-value">—</p>
        <p>Calculated when attendance data is available.</p>
      </div>

      <div className="dashboard-section student-stat">
        <h3>Upcoming Classes</h3>
        <p className="student-stat-value">—</p>
        <p>Class schedules are not connected yet.</p>
      </div>
    </section>

   
<section className="dashboard-section" id="attendance-history">
  <h2>My Attendance History</h2>
  <p>View the classes where your attendance has been recorded.</p>

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
    
    <section className="dashboard-section student-quick-actions">
      <h2>Quick Actions</h2>
      <p>Choose an action to get started.</p>

      <div className="quick-actions-grid">
        <button
          type="button"
          onClick={() =>
            setMessage(
              "QR scanning will be available when the scanner is implemented."
            )
          }
        >
          <span className="quick-action-icon">▦</span>
          <span className="quick-action-title">Scan Attendance</span>
          <span className="quick-action-description">
            Record attendance using your lecturer's QR code.
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setMessage(
              "Your attendance history is displayed above. Live records are not connected yet."
            )
          }
        >
          <span className="quick-action-icon">▤</span>
          <span className="quick-action-title">Attendance History</span>
          <span className="quick-action-description">
            Review your recorded class attendance.
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setMessage(
              `You are logged in as ${user.username} with the ${user.role} role.`
            )
          }
        >
          <span className="quick-action-icon">♙</span>
          <span className="quick-action-title">My Profile</span>
          <span className="quick-action-description">
            View your account information.
          </span>
        </button>
      </div>
    </section>

  </div>
</section>


    <section className="dashboard-section student-scan">
      <h2>Scan Attendance QR Code</h2>
      <p>
        Scan your lecturer's session QR code to record your
        attendance. QR scanning and GPS verification are
        still being developed.
      </p>
      <button type="button" disabled>
        QR Scanner Coming Soon
      </button>
    </section>
  </div>
  
  
)}


          {user.role === "LECTURER" && (
        <>
        
              <section className="lecturer-hero">
                <p className="lecturer-eyebrow">LECTURER PORTAL</p>
                <h2>Welcome back, {user.username}!</h2>
                <p>
                  Manage your class sessions and monitor student
                  attendance from one place.
                </p>
              </section>

              <section className="lecturer-overview">
                <div className="dashboard-section lecturer-stat">
                  <span className="lecturer-stat-icon">▣</span>
                  <h3>Sessions Created</h3>
                  <p className="lecturer-stat-value">—</p>
                  <p>Session statistics not connected yet.</p>
                </div>

                <div className="dashboard-section lecturer-stat">
                  <span className="lecturer-stat-icon">▦</span>
                  <h3>Attendance Records</h3>
                  <p className="lecturer-stat-value">—</p>
                  <p>Attendance totals not connected yet.</p>
                </div>

                <div className="dashboard-section lecturer-stat">
                  <span className="lecturer-stat-icon">◷</span>
                  <h3>Upcoming Classes</h3>
                  <p className="lecturer-stat-value">—</p>
                  <p>Class schedules not connected yet.</p>
                </div>
              </section>

              <section className="dashboard-section" id="create-session">
                <h2>Create Attendance Session</h2>
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    setError("");
                    setMessage("");
                    setCreatedSession(null);
                    setLoading(true);

                    const form = new FormData(event.currentTarget);

                    try {
                      const response = await fetch(
                        `${API}/attendance/sessions/`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            class_name: form.get("class_name"),
                            date: form.get("date"),
                            start_time: form.get("start_time"),
                            end_time: form.get("end_time"),
                          }),
                        }
                      );

                      const data = await response.json();

                      if (!response.ok) {
                        throw new Error(
                          data.error || "Could not create session."
                        );
                      }

                      setCreatedSession({
                        id: data.session_id,
                        className: form.get("class_name"),
                        date: form.get("date"),
                        startTime: form.get("start_time"),
                        endTime: form.get("end_time"),
                      });

                      setMessage(data.message);
                      event.currentTarget.reset();
                    } catch (err) {
                      setError(
                        err.message || "Cannot connect to the server."
                      );
                    } finally {
                      setLoading(false);
                    }
                    
                  }}
                >
                  <div className="form-group">
                    <label>Class Name</label>
                    <input
                      name="class_name"
                      type="text"
                      placeholder="e.g. Software Engineering"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input name="date" type="date" required />
                  </div>

                  <div className="form-group">
                    <label>Start Time</label>
                    <input name="start_time" type="time" required />
                  </div>

                  <div className="form-group">
                    <label>End Time</label>
                    <input name="end_time" type="time" required />
                  </div>

                  <button
                    className="action-button"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Session"}
                  </button>
                </form>
              </section>

              
              {createdSession && (
                <section className="dashboard-section session-success-card">
                  <div className="session-success-heading">
                    <span className="session-success-icon">✓</span>
                    <div>
                      <h2>Session Created Successfully</h2>
                      <p>Your attendance session has been created.</p>
                    </div>
                  </div>

                  <div className="session-details-grid">
                    <div className="session-detail">
                      <span>Session ID</span>
                      <strong>#{createdSession.id}</strong>
                    </div>

                    <div className="session-detail">
                      <span>Class Name</span>
                      <strong>{createdSession.className}</strong>
                    </div>

                    <div className="session-detail">
                      <span>Date</span>
                      <strong>{createdSession.date}</strong>
                    </div>

                    <div className="session-detail">
                      <span>Start Time</span>
                      <strong>{createdSession.startTime}</strong>
                    </div>

                    <div className="session-detail">
                      <span>End Time</span>
                      <strong>{createdSession.endTime}</strong>
                    </div>
                  </div>

                  <div className="session-next-step">
                    <strong>Next step</strong>
                    <p>
                      QR-code generation and live attendance monitoring
                      still need to be implemented.
                    </p>
                  </div>
                </section>
              )}
              
              <section className="dashboard-section manage-sessions" id="manage-sessions">
                <div className="manage-sessions-heading">
                  <div>
                    <h2>Manage Sessions</h2>
                    <p>
                      Review your attendance sessions and their details.
                    </p>
                  </div>
                  <span className="session-count">Session list unavailable</span>
                </div>

                {createdSession ? (
                  <div className="managed-session-card">
                    <div className="managed-session-info">
                      <h3>{createdSession.className}</h3>
                      <p>Session ID: #{createdSession.id}</p>
                      <p>Date: {createdSession.date}</p>
                      <p>
                        Time: {createdSession.startTime} –{" "}
                        {createdSession.endTime}
                      </p>
                    </div>
                    <span className="session-status">Created</span>
                  </div>
                ) : (
                  <div className="student-empty-state">
                    <p>No session has been created during this login yet.</p>
                    <p>
                      Create a session above to see its details here.
                    </p>
                  </div>
                )}
              </section>

            </>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="login-card">
        <div className="logo">GeoScan Attendance Pro</div>
        <p className="subtitle">Smart Attendance System</p>
        <h2>{showRegister ? "Register" : "Login"}</h2>

        {error && <p className="app-error">{error}</p>}
        {message && <p className="app-message">{message}</p>}

        {showRegister ? (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="full_name" type="text" required />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input name="username" type="text" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" defaultValue="STUDENT">
                <option value="STUDENT">Student</option>
                <option value="LECTURER">Lecturer</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" required />
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
              <label>Login as</label>
              <select
                value={loginRole}
                onChange={(event) => setLoginRole(event.target.value)}
              >
                <option value="STUDENT">Student</option>
                <option value="LECTURER">Lecturer</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input name="username" type="text" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" required />
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
            setShowRegister(!showRegister);
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
