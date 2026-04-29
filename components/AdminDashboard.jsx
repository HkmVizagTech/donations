"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ADMIN_API_URL,
  adminRequest,
  clearAdminSession,
  getAdminToken,
  getStoredAdmin
} from "@/lib/adminApi";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short"
});

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return dateFormatter.format(date);
}

function StatCard({ label, value, hint }) {
  return (
    <article className="admin-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {hint ? <small>{hint}</small> : null}
    </article>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [topDonors, setTopDonors] = useState([]);
  const [utmStats, setUtmStats] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const token = useMemo(() => getAdminToken(), []);

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    const storedAdmin = getStoredAdmin();

    if (storedAdmin) {
      setAdmin(storedAdmin);
    }
  }, [router, token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isActive = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: "12",
          status,
          search
        });
        const [statsPayload, transactionsPayload, donorsPayload, utmPayload] = await Promise.all([
          adminRequest("/api/admin/dashboard/stats"),
          adminRequest(`/api/admin/transactions?${query.toString()}`),
          adminRequest("/api/admin/dashboard/top-donors?limit=5"),
          adminRequest("/api/admin/utm-stats")
        ]);

        if (!isActive) {
          return;
        }

        setStats(statsPayload.stats);
        setTransactions(transactionsPayload.transactions || []);
        setPagination(transactionsPayload.pagination || null);
        setTopDonors(donorsPayload.donors || []);
        setUtmStats(utmPayload.stats || []);
      } catch (err) {
        if (err.message?.toLowerCase().includes("authentication") || err.message?.toLowerCase().includes("token")) {
          clearAdminSession();
          router.replace("/admin/login");
          return;
        }

        setError(err.message || "Unable to load dashboard.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, [page, router, search, status, token]);

  const handleLogout = () => {
    clearAdminSession();
    router.replace("/admin/login");
  };

  const exportUrl = `${ADMIN_API_URL}/api/admin/transactions/export`;

  return (
    <main className="admin-dashboard-page">
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">ISKCON Charity Vizag</p>
          <h1>Donation Admin Dashboard</h1>
          <span>{admin?.name || admin?.email || "Admin"}</span>
        </div>
        <div className="admin-topbar-actions">
          <a
            href={exportUrl}
            onClick={(event) => {
              event.preventDefault();
              const tokenValue = getAdminToken();
              fetch(exportUrl, {
                headers: { Authorization: `Bearer ${tokenValue}` },
                credentials: "omit"
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Export failed.");
                  }

                  return response.blob();
                })
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "iskcon-donations.csv";
                  link.click();
                  URL.revokeObjectURL(url);
                })
                .catch((err) => setError(err.message || "Export failed."));
            }}
          >
            Export CSV
          </a>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {error ? <p className="admin-dashboard-error">{error}</p> : null}

      <section className="admin-stats-grid" aria-busy={isLoading}>
        <StatCard
          label="Total Donations"
          value={currency.format(stats?.totalDonations?.value || 0)}
          hint={stats?.totalDonations?.change}
        />
        <StatCard
          label="Total Donors"
          value={stats?.totalDonors?.value || 0}
          hint={stats?.totalDonors?.change}
        />
        <StatCard
          label="This Month"
          value={currency.format(stats?.thisMonth?.value || 0)}
          hint={stats?.thisMonth?.change}
        />
        <StatCard
          label="Today"
          value={currency.format(stats?.today?.value || 0)}
          hint={stats?.today?.change}
        />
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-panel admin-transactions-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Transactions</h2>
              <p>Search donors, mobile numbers, payment IDs, and statuses.</p>
            </div>
            <div className="admin-filters">
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search"
              />
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="created">Created</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Mobile</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>UTM</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id || transaction.id}>
                    <td>
                      <strong>{transaction.name || "-"}</strong>
                      <span>{transaction.email || transaction.id || "-"}</span>
                    </td>
                    <td>{transaction.mobile || "-"}</td>
                    <td>{currency.format(transaction.amount || 0)}</td>
                    <td>
                      <span className={`admin-status admin-status-${transaction.status || "created"}`}>
                        {transaction.status || "created"}
                      </span>
                    </td>
                    <td>{transaction.utm?.campaign || transaction.utm?.source || "-"}</td>
                    <td>{formatDate(transaction.date)}</td>
                  </tr>
                ))}
                {!transactions.length && !isLoading ? (
                  <tr>
                    <td colSpan="6">No transactions found.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="admin-pagination">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </button>
            <span>
              Page {pagination?.currentPage || page} of {pagination?.totalPages || 1}
            </span>
            <button
              type="button"
              disabled={pagination ? page >= pagination.totalPages : true}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </div>

        <aside className="admin-side-stack">
          <section className="admin-panel">
            <h2>Top Donors</h2>
            <div className="admin-list">
              {topDonors.map((donor) => (
                <div key={donor.email || donor.name} className="admin-list-row">
                  <div>
                    <strong>{donor.name || "-"}</strong>
                    <span>{donor.email || "-"}</span>
                  </div>
                  <b>{currency.format(donor.amount || 0)}</b>
                </div>
              ))}
              {!topDonors.length && !isLoading ? <p>No paid donors yet.</p> : null}
            </div>
          </section>

          <section className="admin-panel">
            <h2>UTM Performance</h2>
            <div className="admin-list">
              {utmStats.slice(0, 6).map((item) => (
                <div
                  key={`${item._id?.source || "direct"}-${item._id?.campaign || "direct"}`}
                  className="admin-list-row"
                >
                  <div>
                    <strong>{item._id?.campaign || "direct"}</strong>
                    <span>{item._id?.source || "direct"}</span>
                  </div>
                  <b>{currency.format(item.totalAmount || 0)}</b>
                </div>
              ))}
              {!utmStats.length && !isLoading ? <p>No paid UTM conversions yet.</p> : null}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
