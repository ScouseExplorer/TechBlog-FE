import { ADMIN_STORAGE_KEYS, ARTICLE_STATUS } from "../constants";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function generateSlug(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function normalizeTags(tagsText) {
  return tagsText
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 8);
}

function nowIso() {
  return new Date().toISOString();
}

function readLocalArticles() {
  const raw = localStorage.getItem(ADMIN_STORAGE_KEYS.ARTICLES);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalArticles(articles) {
  localStorage.setItem(ADMIN_STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  window.dispatchEvent(new CustomEvent("admin-articles-updated"));
}

function makeAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function ensureAuthorized(session) {
  if (!session?.token || session?.role !== "admin") {
    throw new Error("Unauthorized. Please login as an admin.");
  }
}

async function apiRequest(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Request failed.");
  }

  return response.json();
}

export async function loginAdmin({ email, password }) {
  if (API_BASE_URL) {
    return apiRequest("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }

  if (email !== "admin@ledgerpost.com" || password !== "AdminPass!2026") {
    throw new Error("Invalid credentials.");
  }

  return {
    token: `mock-${crypto.randomUUID()}`,
    role: "admin",
    email,
  };
}

export async function listAdminArticles(session) {
  ensureAuthorized(session);

  if (API_BASE_URL) {
    return apiRequest("/admin/articles", {
      method: "GET",
      headers: makeAuthHeaders(session.token),
    });
  }

  return readLocalArticles().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export async function getAdminArticleById(session, id) {
  ensureAuthorized(session);

  if (API_BASE_URL) {
    return apiRequest(`/admin/articles/${id}`, {
      method: "GET",
      headers: makeAuthHeaders(session.token),
    });
  }

  const article = readLocalArticles().find((item) => item.id === id);
  if (!article) {
    throw new Error("Article not found.");
  }

  return article;
}

export async function createAdminArticle(session, values) {
  ensureAuthorized(session);

  if (API_BASE_URL) {
    return apiRequest("/admin/articles", {
      method: "POST",
      headers: makeAuthHeaders(session.token),
      body: JSON.stringify(values),
    });
  }

  const timestamp = nowIso();
  const article = {
    id: crypto.randomUUID(),
    slug: generateSlug(values.title),
    title: values.title.trim(),
    excerpt: values.excerpt.trim(),
    content: values.content.trim(),
    tags: normalizeTags(values.tagsText || ""),
    status: values.status || ARTICLE_STATUS.DRAFT,
    createdAt: timestamp,
    updatedAt: timestamp,
    publishedAt: values.status === ARTICLE_STATUS.PUBLISHED ? timestamp : null,
  };

  const articles = readLocalArticles();
  articles.push(article);
  writeLocalArticles(articles);
  return article;
}

export async function updateAdminArticle(session, id, values) {
  ensureAuthorized(session);

  if (API_BASE_URL) {
    return apiRequest(`/admin/articles/${id}`, {
      method: "PUT",
      headers: makeAuthHeaders(session.token),
      body: JSON.stringify(values),
    });
  }

  const articles = readLocalArticles();
  const index = articles.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error("Article not found.");
  }

  const current = articles[index];
  const nextStatus = values.status || current.status;
  const publishDate =
    current.publishedAt || (nextStatus === ARTICLE_STATUS.PUBLISHED ? nowIso() : null);

  const updated = {
    ...current,
    title: values.title.trim(),
    slug: generateSlug(values.title),
    excerpt: values.excerpt.trim(),
    content: values.content.trim(),
    tags: normalizeTags(values.tagsText || values.tags?.join(",") || ""),
    status: nextStatus,
    updatedAt: nowIso(),
    publishedAt: publishDate,
  };

  articles[index] = updated;
  writeLocalArticles(articles);
  return updated;
}

export async function publishAdminArticle(session, id) {
  ensureAuthorized(session);

  if (API_BASE_URL) {
    return apiRequest(`/admin/articles/${id}/publish`, {
      method: "POST",
      headers: makeAuthHeaders(session.token),
    });
  }

  const article = await getAdminArticleById(session, id);
  return updateAdminArticle(session, id, {
    ...article,
    tagsText: article.tags.join(", "),
    status: ARTICLE_STATUS.PUBLISHED,
  });
}
