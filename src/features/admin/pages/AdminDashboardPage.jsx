import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import { ARTICLE_STATUS } from "../constants";
import { listAdminArticles, publishAdminArticle } from "../services/adminApi";

function formatDate(isoDate) {
  if (!isoDate) return "-";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(isoDate));
}

export default function AdminDashboardPage() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setError("");
        const data = await listAdminArticles(session);
        if (mounted) setArticles(data);
      } catch (loadError) {
        if (mounted) setError(loadError.message || "Unable to load admin articles.");
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [session]);

  const counts = useMemo(() => {
    return articles.reduce(
      (acc, item) => {
        if (item.status === ARTICLE_STATUS.PUBLISHED) {
          acc.published += 1;
        } else {
          acc.draft += 1;
        }
        return acc;
      },
      { draft: 0, published: 0 }
    );
  }, [articles]);

  const handlePublish = async (articleId) => {
    try {
      setBusyId(articleId);
      const updated = await publishAdminArticle(session, articleId);
      setArticles((prev) => prev.map((item) => (item.id === articleId ? updated : item)));
    } catch (publishError) {
      setError(publishError.message || "Failed to publish article.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <main className="wrap main admin-layout">
      <section className="admin-card">
        <header className="admin-header-row">
          <div>
            <h1 className="admin-title">Editorial Admin</h1>
            <p className="admin-subtitle">Manage drafts, preview content, and publish when ready.</p>
          </div>
          <div className="admin-header-actions">
            <Link className="admin-btn primary" to="/admin/articles/new">New article</Link>
            <button className="admin-btn" onClick={() => { logout(); navigate("/admin/login"); }}>
              Sign out
            </button>
          </div>
        </header>

        <div className="admin-stats-grid">
          <article className="admin-stat">
            <h2>Total</h2>
            <p>{articles.length}</p>
          </article>
          <article className="admin-stat">
            <h2>Draft</h2>
            <p>{counts.draft}</p>
          </article>
          <article className="admin-stat">
            <h2>Published</h2>
            <p>{counts.published}</p>
          </article>
        </div>

        {error ? <p className="admin-error-block">{error}</p> : null}

        <div className="admin-table-wrap" role="region" aria-label="Articles list">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={4}>No admin articles yet. Start by creating your first draft.</td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <strong>{article.title}</strong>
                      <p>{article.excerpt}</p>
                    </td>
                    <td>
                      <span className={`admin-badge ${article.status}`}>{article.status}</span>
                    </td>
                    <td>{formatDate(article.updatedAt)}</td>
                    <td>
                      <div className="admin-row-actions">
                        <Link className="admin-btn" to={`/admin/articles/${article.id}/edit`}>Edit</Link>
                        {article.status !== ARTICLE_STATUS.PUBLISHED ? (
                          <button
                            className="admin-btn success"
                            onClick={() => handlePublish(article.id)}
                            disabled={busyId === article.id}
                          >
                            {busyId === article.id ? "Publishing..." : "Publish"}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
