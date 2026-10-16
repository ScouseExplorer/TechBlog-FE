import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function ArticleForm({
  value,
  errors,
  onChange,
  onSubmit,
  onPublish,
  isEdit,
  isSaving,
  isPublishing,
  articleMeta,
}) {
  const [viewMode, setViewMode] = useState("edit");

  const wordCount = useMemo(() => {
    return value.content.trim() ? value.content.trim().split(/\s+/).length : 0;
  }, [value.content]);

  return (
    <form className="admin-form" onSubmit={onSubmit} noValidate>
      <div className="admin-form-toolbar">
        <div className="admin-tabs" role="tablist" aria-label="Editor mode">
          <button
            type="button"
            className={`admin-tab ${viewMode === "edit" ? "active" : ""}`}
            onClick={() => setViewMode("edit")}
          >
            Edit
          </button>
          <button
            type="button"
            className={`admin-tab ${viewMode === "preview" ? "active" : ""}`}
            onClick={() => setViewMode("preview")}
          >
            Preview
          </button>
        </div>
        <div className="admin-meta-inline">
          <span>{wordCount} words</span>
          <span>Status: {value.status}</span>
          {isEdit ? <span>Updated: {formatDateTime(articleMeta?.updatedAt)}</span> : null}
        </div>
      </div>

      <label className="admin-field">
        <span>Title</span>
        <input
          value={value.title}
          onChange={(event) => onChange("title", event.target.value)}
          placeholder="Article headline"
          maxLength={140}
        />
        {errors.title ? <small className="admin-error">{errors.title}</small> : null}
      </label>

      <label className="admin-field">
        <span>Excerpt</span>
        <textarea
          value={value.excerpt}
          onChange={(event) => onChange("excerpt", event.target.value)}
          rows={3}
          maxLength={280}
          placeholder="Summary shown on cards and social previews"
        />
        {errors.excerpt ? <small className="admin-error">{errors.excerpt}</small> : null}
      </label>

      <label className="admin-field">
        <span>Tags (comma-separated)</span>
        <input
          value={value.tagsText}
          onChange={(event) => onChange("tagsText", event.target.value)}
          placeholder="fintech, regulation, markets"
        />
        {errors.tagsText ? <small className="admin-error">{errors.tagsText}</small> : null}
      </label>

      <label className="admin-field">
        <span>Content (Markdown)</span>
        {viewMode === "edit" ? (
          <textarea
            className="admin-content-input"
            value={value.content}
            onChange={(event) => onChange("content", event.target.value)}
            rows={18}
            placeholder="Write your article in markdown"
          />
        ) : (
          <article className="admin-preview markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value.content || "Nothing to preview yet."}</ReactMarkdown>
          </article>
        )}
        {errors.content ? <small className="admin-error">{errors.content}</small> : null}
      </label>

      <div className="admin-actions">
        <button type="submit" className="admin-btn primary" disabled={isSaving}>
          {isSaving ? "Saving..." : isEdit ? "Update Draft" : "Create Draft"}
        </button>
        <button
          type="button"
          className="admin-btn success"
          onClick={onPublish}
          disabled={isPublishing}
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </form>
  );
}
