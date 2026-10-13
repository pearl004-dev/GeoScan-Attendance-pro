import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>GeoScan</h2>
        <p>Administrator</p>

        <nav>
          <a href="#overview">Overview</a>
          <a href="#users">User Management</a>
          <a href="#attendance">Attendance Reports</a>
          <a href="#settings">Settings</a>
        </nav>

        <button onClick={() => window.location.reload()}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>University Admin Dashboard</h1>
            <p>Manage users and monitor university attendance.</p>
          </div>
          <span className="admin-badge">Administrator</span>
        </header>

        <section id="overview" className="admin-stats">
          <div className="admin-card">
            <h3>Total Students</h3>
            <p>--</p>
          </div>

          <div className="admin-card">
            <h3>Total Lecturers</h3>
            <p>--</p>
          </div>

          <div className="admin-card">
            <h3>Attendance Sessions</h3>
            <p>--</p>
          </div>

          <div className="admin-card">
            <h3>Attendance Records</h3>
            <p>--</p>
          </div>
        </section>

        <section id="users" className="admin-section">
          <h2>User Management</h2>
          <p>
            Registered students, lecturers and administrators
            will appear here when connected to the backend.
          </p>
        </section>

        <section id="attendance" className="admin-section">
          <h2>Attendance Reports</h2>
          <p>
            Attendance summaries and session records will
            appear here when connected to the backend.
          </p>
        </section>

        <section id="settings" className="admin-section">
          <h2>System Settings</h2>
          <p>University attendance system administration.</p>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
