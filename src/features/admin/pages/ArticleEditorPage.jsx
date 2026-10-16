import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../auth/useAuth";
import ArticleForm from "../components/ArticleForm";
import { EMPTY_ARTICLE, ARTICLE_STATUS } from "../constants";
import {
  createAdminArticle,
  getAdminArticleById,
  publishAdminArticle,
  updateAdminArticle,
} from "../services/adminApi";
import { validateArticle } from "../utils/validation";

function toFormState(article) {
  if (!article) return EMPTY_ARTICLE;

  return {
    title: article.title || "",
    excerpt: article.excerpt || "",
    content: article.content || "",
    tagsText: article.tags?.join(", ") || "",
    status: article.status || ARTICLE_STATUS.DRAFT,
  };
}

export default function ArticleEditorPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { session } = useAuth();
  const navigate = useNavigate();

  const [value, setValue] = useState(EMPTY_ARTICLE);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    if (!isEdit) return;

    let mounted = true;

    async function load() {
      try {
        const article = await getAdminArticleById(session, id);
        if (!mounted) return;
        setMeta(article);
        setValue(toFormState(article));
      } catch (error) {
        if (mounted) setLoadError(error.message || "Unable to load article.");
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [id, isEdit, session]);

  const pageTitle = useMemo(() => (isEdit ? "Edit Article" : "Create Article"), [isEdit]);

  const handleChange = (field, nextValue) => {
    setValue((prev) => ({ ...prev, [field]: nextValue }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const nextErrors = validateArticle(value);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setBusy(true);
      const payload = { ...value, status: ARTICLE_STATUS.DRAFT };

      if (isEdit) {
        const updated = await updateAdminArticle(session, id, payload);
        setMeta(updated);
        setValue(toFormState(updated));
      } else {
        const created = await createAdminArticle(session, payload);
        navigate(`/admin/articles/${created.id}/edit`, { replace: true });
      }
    } catch (error) {
      setLoadError(error.message || "Unable to save article.");
    } finally {
      setBusy(false);
    }
  };

  const handlePublish = async () => {
    const nextErrors = validateArticle(value);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setPublishing(true);
      let targetId = id;

      if (!isEdit) {
        const created = await createAdminArticle(session, { ...value, status: ARTICLE_STATUS.DRAFT });
        targetId = created.id;
      }

      const updated = await publishAdminArticle(session, targetId);
      navigate(`/admin/articles/${updated.id}/edit`, { replace: true });
      setMeta(updated);
      setValue(toFormState(updated));
    } catch (error) {
      setLoadError(error.message || "Unable to publish article.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <main className="wrap main admin-layout">
      <section className="admin-card">
        <header className="admin-header-row">
          <div>
            <h1 className="admin-title">{pageTitle}</h1>
            <p className="admin-subtitle">Use markdown editor with live preview before publishing.</p>
          </div>
          <Link className="admin-btn" to="/admin">Back to dashboard</Link>
        </header>

        {loadError ? <p className="admin-error-block">{loadError}</p> : null}

        <ArticleForm
          value={value}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSave}
          onPublish={handlePublish}
          isEdit={isEdit}
          isSaving={busy}
          isPublishing={publishing}
          articleMeta={meta}
        />
      </section>
    </main>
  );
}
