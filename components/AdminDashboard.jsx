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

function buildAddress(transaction) {
  return [transaction.address, transaction.city, transaction.state, transaction.pincode]
    .filter(Boolean)
    .join(", ");
}

const emptyBannerForm = {
  title: "",
  desktopImageUrl: "",
  mobileImageUrl: "",
  altText: "",
  targetUrl: "#annadaan",
  sortOrder: 0,
  isActive: true
};

const emptyCampaignForm = {
  name: "",
  source: "meta",
  medium: "paid_social",
  campaign: "",
  content: "",
  term: "",
  baseUrl: "https://iskconcharity.org",
  landingPath: ""
};

const frontendBannerAssets = [
  { label: "Narasimha Jayanthi Annadaan - Desktop", path: "/banners/nsj-annadan-web.jpeg", format: "desktop" },
  { label: "Narasimha Jayanthi Annadaan - Mobile", path: "/banners/nsj-annadan-mobile.jpeg", format: "mobile" },
  { label: "Narasimha Jayanthi - Desktop", path: "/banners/narasimha-jayanthi-desktop.jpeg", format: "desktop" },
  { label: "Narasimha Jayanthi - Mobile", path: "/banners/narasimha-jayanthi-mobile.jpeg", format: "mobile" },
  { label: "Gau Seva - Desktop", path: "/banners/gau-seva-desktop.png", format: "desktop" },
  { label: "Gau Seva - Mobile", path: "/banners/gau-seva-mobile.png", format: "mobile" },
  { label: "5 Billion Meals - Desktop", path: "/banners/5-billion-meals-desktop.webp", format: "desktop" },
  { label: "5 Billion Meals - Mobile", path: "/banners/5-billion-meals-mobile-final.jpeg", format: "mobile" },
  { label: "Ekadashi - Desktop", path: "/banners/ekadashi-desktop.webp", format: "desktop" },
  { label: "Ekadashi - Mobile", path: "/banners/ekadashi-mobile.webp", format: "mobile" },
  { label: "Annadaan Banner", path: "/banners/annadaan-banner.webp", format: "desktop" },
  { label: "Go Seva Banner", path: "/banners/goseva-banner.webp", format: "desktop" }
];

const desktopBannerAssets = frontendBannerAssets.filter((asset) => asset.format === "desktop");
const mobileBannerAssets = frontendBannerAssets.filter((asset) => asset.format === "mobile");

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [topDonors, setTopDonors] = useState([]);
  const [utmStats, setUtmStats] = useState([]);
  const [banners, setBanners] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [bannerForm, setBannerForm] = useState(emptyBannerForm);
  const [editingBannerId, setEditingBannerId] = useState("");
  const [campaignForm, setCampaignForm] = useState(emptyCampaignForm);
  const [generatedUrl, setGeneratedUrl] = useState("");
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
        const [statsPayload, transactionsPayload, donorsPayload, utmPayload, bannersPayload, campaignsPayload] = await Promise.all([
          adminRequest("/api/admin/dashboard/stats"),
          adminRequest(`/api/admin/transactions?${query.toString()}`),
          adminRequest("/api/admin/dashboard/top-donors?limit=5"),
          adminRequest("/api/admin/utm-stats"),
          adminRequest("/api/admin/banners"),
          adminRequest("/api/admin/campaigns")
        ]);

        if (!isActive) {
          return;
        }

        setStats(statsPayload.stats);
        setTransactions(transactionsPayload.transactions || []);
        setPagination(transactionsPayload.pagination || null);
        setTopDonors(donorsPayload.donors || []);
        setUtmStats(utmPayload.stats || []);
        setBanners(bannersPayload.banners || []);
        setCampaigns(campaignsPayload.campaigns || []);
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

  const refreshManagementData = async () => {
    const [bannersPayload, campaignsPayload, utmPayload] = await Promise.all([
      adminRequest("/api/admin/banners"),
      adminRequest("/api/admin/campaigns"),
      adminRequest("/api/admin/utm-stats")
    ]);

    setBanners(bannersPayload.banners || []);
    setCampaigns(campaignsPayload.campaigns || []);
    setUtmStats(utmPayload.stats || []);
  };

  const updateBannerField = (field, value) => {
    setBannerForm((current) => ({ ...current, [field]: value }));
  };

  const saveBanner = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const path = editingBannerId ? `/api/admin/banners/${editingBannerId}` : "/api/admin/banners";
      await adminRequest(path, {
        method: editingBannerId ? "PUT" : "POST",
        body: JSON.stringify({
          ...bannerForm,
          sortOrder: Number(bannerForm.sortOrder || 0),
          isActive: Boolean(bannerForm.isActive)
        })
      });
      setBannerForm(emptyBannerForm);
      setEditingBannerId("");
      await refreshManagementData();
    } catch (err) {
      setError(err.message || "Unable to save banner.");
    }
  };

  const editBanner = (banner) => {
    setEditingBannerId(banner._id);
    setBannerForm({
      title: banner.title || "",
      desktopImageUrl: banner.desktopImageUrl || "",
      mobileImageUrl: banner.mobileImageUrl || "",
      altText: banner.altText || "",
      targetUrl: banner.targetUrl || "#annadaan",
      sortOrder: banner.sortOrder || 0,
      isActive: banner.isActive !== false
    });
    setActiveSection("banners");
  };

  const deleteBanner = async (bannerId) => {
    setError("");

    try {
      await adminRequest(`/api/admin/banners/${bannerId}`, { method: "DELETE" });
      await refreshManagementData();
    } catch (err) {
      setError(err.message || "Unable to delete banner.");
    }
  };

  const updateCampaignField = (field, value) => {
    setCampaignForm((current) => ({ ...current, [field]: value }));
  };

  const saveCampaign = async (event) => {
    event.preventDefault();
    setError("");
    setGeneratedUrl("");

    try {
      const payload = await adminRequest("/api/admin/create-campaign", {
        method: "POST",
        body: JSON.stringify(campaignForm)
      });
      setGeneratedUrl(payload.campaign?.generatedUrl || "");
      setCampaignForm(emptyCampaignForm);
      await refreshManagementData();
    } catch (err) {
      setError(err.message || "Unable to create UTM campaign.");
    }
  };

  const deleteCampaign = async (campaignId) => {
    setError("");

    try {
      await adminRequest(`/api/admin/campaigns/${campaignId}`, { method: "DELETE" });
      await refreshManagementData();
    } catch (err) {
      setError(err.message || "Unable to delete campaign.");
    }
  };

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

      <nav className="admin-tabs" aria-label="Admin sections">
        {[
          ["overview", "Overview"],
          ["banners", "Banners"],
          ["utm", "UTM Builder"]
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={activeSection === value ? "active" : ""}
            onClick={() => setActiveSection(value)}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeSection === "overview" ? (
        <>
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
                  <th>Contact</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Seva</th>
                  <th>Payment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id || transaction.id}>
                    <td>
                      <strong>{transaction.name || "-"}</strong>
                      <span>{transaction.email || transaction.id || "-"}</span>
                      {transaction.dob ? <span>DOB: {transaction.dob}</span> : null}
                    </td>
                    <td>
                      <strong>{transaction.mobile || "-"}</strong>
                      {transaction.certificate ? <span>80G: {transaction.panNumber || "PAN pending"}</span> : null}
                      {buildAddress(transaction) ? <span>{buildAddress(transaction)}</span> : null}
                    </td>
                    <td>{currency.format(transaction.amount || 0)}</td>
                    <td>
                      <span className={`admin-status admin-status-${transaction.status || "created"}`}>
                        {transaction.status || "created"}
                      </span>
                    </td>
                    <td>
                      <strong>{transaction.sevaName || transaction.type || transaction.occasion || "-"}</strong>
                      {transaction.sevaDate ? <span>Seva date: {transaction.sevaDate}</span> : null}
                      {transaction.mahaprasadam ? <span>Mahaprasadam requested</span> : null}
                    </td>
                    <td>
                      <strong>{transaction.razorpayPaymentId || "-"}</strong>
                      <span>{transaction.razorpayOrderId || transaction.id || "-"}</span>
                      <span>{transaction.utm?.campaign || transaction.utm?.source || "-"}</span>
                    </td>
                    <td>
                      <strong>{formatDate(transaction.lastPaymentDate || transaction.date)}</strong>
                      {transaction.receiptNumber ? <span>Receipt: {transaction.receiptNumber}</span> : null}
                    </td>
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
        </>
      ) : null}

      {activeSection === "banners" ? (
        <section className="admin-management-grid">
          <form className="admin-panel admin-management-form" onSubmit={saveBanner}>
            <div className="admin-panel-header">
              <div>
                <h2>{editingBannerId ? "Edit Banner" : "Add Banner"}</h2>
                <p>Use separate desktop and mobile image URLs. The first active banner appears first.</p>
              </div>
            </div>
            <label>
              <span>Banner Title</span>
              <input value={bannerForm.title} onChange={(event) => updateBannerField("title", event.target.value)} />
            </label>
            <label>
              <span>Desktop Image URL</span>
              <input value={bannerForm.desktopImageUrl} onChange={(event) => updateBannerField("desktopImageUrl", event.target.value)} placeholder="/banners/nsj-annadan-web.jpeg" />
            </label>
            <label>
              <span>Choose Existing Desktop Image</span>
              <select value={bannerForm.desktopImageUrl} onChange={(event) => updateBannerField("desktopImageUrl", event.target.value)}>
                <option value="">Select desktop banner</option>
                {desktopBannerAssets.map((asset) => (
                  <option key={asset.path} value={asset.path}>
                    {asset.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Mobile Image URL</span>
              <input value={bannerForm.mobileImageUrl} onChange={(event) => updateBannerField("mobileImageUrl", event.target.value)} placeholder="/banners/nsj-annadan-mobile.jpeg" />
            </label>
            <label>
              <span>Choose Existing Mobile Image</span>
              <select value={bannerForm.mobileImageUrl} onChange={(event) => updateBannerField("mobileImageUrl", event.target.value)}>
                <option value="">Select mobile banner</option>
                {mobileBannerAssets.map((asset) => (
                  <option key={asset.path} value={asset.path}>
                    {asset.label}
                  </option>
                ))}
              </select>
            </label>
            {(bannerForm.desktopImageUrl || bannerForm.mobileImageUrl) ? (
              <div className="admin-banner-preview-grid">
                {bannerForm.desktopImageUrl ? (
                  <div>
                    <span>Desktop Preview</span>
                    <img src={bannerForm.desktopImageUrl} alt="Desktop banner preview" />
                  </div>
                ) : null}
                {bannerForm.mobileImageUrl ? (
                  <div>
                    <span>Mobile Preview</span>
                    <img src={bannerForm.mobileImageUrl} alt="Mobile banner preview" />
                  </div>
                ) : null}
              </div>
            ) : null}
            <label>
              <span>Alt Text</span>
              <input value={bannerForm.altText} onChange={(event) => updateBannerField("altText", event.target.value)} />
            </label>
            <div className="admin-form-row">
              <label>
                <span>Click Target</span>
                <select value={bannerForm.targetUrl} onChange={(event) => updateBannerField("targetUrl", event.target.value)}>
                  <option value="#annadaan">Annadaan Section</option>
                  <option value="#goseva">Gau Seva Section</option>
                  <option value="/">Home</option>
                  <option value="/akshaya-tritiya">Campaign Page</option>
                </select>
              </label>
              <label>
                <span>Sort Order</span>
                <input type="number" value={bannerForm.sortOrder} onChange={(event) => updateBannerField("sortOrder", event.target.value)} />
              </label>
            </div>
            <label className="admin-inline-check">
              <input type="checkbox" checked={bannerForm.isActive} onChange={(event) => updateBannerField("isActive", event.target.checked)} />
              <span>Active</span>
            </label>
            <div className="admin-form-actions">
              <button type="submit">{editingBannerId ? "Update Banner" : "Add Banner"}</button>
              {editingBannerId ? (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setEditingBannerId("");
                    setBannerForm(emptyBannerForm);
                  }}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <section className="admin-panel">
            <h2>Hero Banners</h2>
            <div className="admin-banner-list">
              {banners.map((banner) => (
                <article key={banner._id} className="admin-banner-item">
                  <img src={banner.desktopImageUrl} alt={banner.altText} />
                  <div>
                    <strong>{banner.title}</strong>
                    <span>{banner.isActive ? "Active" : "Inactive"} · Order {banner.sortOrder || 0}</span>
                    <small>{banner.targetUrl}</small>
                  </div>
                  <div className="admin-row-actions">
                    <button type="button" onClick={() => editBanner(banner)}>Edit</button>
                    <button type="button" className="danger" onClick={() => deleteBanner(banner._id)}>Delete</button>
                  </div>
                </article>
              ))}
              {!banners.length ? <p>No dynamic banners yet. The site will use the fallback banners.</p> : null}
            </div>
          </section>
        </section>
      ) : null}

      {activeSection === "utm" ? (
        <section className="admin-management-grid">
          <form className="admin-panel admin-management-form" onSubmit={saveCampaign}>
            <div className="admin-panel-header">
              <div>
                <h2>Advanced UTM Creator</h2>
                <p>Create clean campaign links for Meta, Google, WhatsApp, email, and organic posts.</p>
              </div>
            </div>
            <label>
              <span>Campaign Display Name</span>
              <input value={campaignForm.name} onChange={(event) => updateCampaignField("name", event.target.value)} placeholder="Narasimha Jayanthi Meta Donations" />
            </label>
            <div className="admin-form-row">
              <label>
                <span>Source</span>
                <select value={campaignForm.source} onChange={(event) => updateCampaignField("source", event.target.value)}>
                  <option value="meta">Meta</option>
                  <option value="google">Google</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="email">Email</option>
                </select>
              </label>
              <label>
                <span>Medium</span>
                <select value={campaignForm.medium} onChange={(event) => updateCampaignField("medium", event.target.value)}>
                  <option value="paid_social">Paid Social</option>
                  <option value="cpc">CPC</option>
                  <option value="organic_social">Organic Social</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="referral">Referral</option>
                </select>
              </label>
            </div>
            <label>
              <span>Campaign Key</span>
              <input value={campaignForm.campaign} onChange={(event) => updateCampaignField("campaign", event.target.value)} placeholder="narasimha_jayanthi_annadaan" />
            </label>
            <div className="admin-form-row">
              <label>
                <span>Ad Content</span>
                <input value={campaignForm.content} onChange={(event) => updateCampaignField("content", event.target.value)} placeholder="image_501_card" />
              </label>
              <label>
                <span>Term / Audience</span>
                <input value={campaignForm.term} onChange={(event) => updateCampaignField("term", event.target.value)} placeholder="broad_ap_telugu" />
              </label>
            </div>
            <div className="admin-form-row">
              <label>
                <span>Base URL</span>
                <input value={campaignForm.baseUrl} onChange={(event) => updateCampaignField("baseUrl", event.target.value)} />
              </label>
              <label>
                <span>Landing Path</span>
                <select value={campaignForm.landingPath} onChange={(event) => updateCampaignField("landingPath", event.target.value)}>
                  <option value="">Home</option>
                  <option value="/akshaya-tritiya">Akshaya Tritiya</option>
                </select>
              </label>
            </div>
            <button type="submit">Create UTM Link</button>
            {generatedUrl ? (
              <div className="admin-generated-url">
                <span>Generated URL</span>
                <code>{generatedUrl}</code>
                <button type="button" onClick={() => navigator.clipboard?.writeText(generatedUrl)}>Copy</button>
              </div>
            ) : null}
          </form>

          <section className="admin-panel">
            <h2>Saved UTM Campaigns</h2>
            <div className="admin-list">
              {campaigns.map((campaign) => (
                <div key={campaign._id} className="admin-campaign-row">
                  <div>
                    <strong>{campaign.name}</strong>
                    <span>{campaign.utm?.source} / {campaign.utm?.medium} / {campaign.utm?.campaign}</span>
                    <code>{campaign.generatedUrl}</code>
                  </div>
                  <div className="admin-row-actions">
                    <button type="button" onClick={() => navigator.clipboard?.writeText(campaign.generatedUrl)}>Copy</button>
                    <button type="button" className="danger" onClick={() => deleteCampaign(campaign._id)}>Delete</button>
                  </div>
                </div>
              ))}
              {!campaigns.length ? <p>No UTM campaigns created yet.</p> : null}
            </div>
          </section>
        </section>
      ) : null}
    </main>
  );
}
