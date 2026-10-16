export const ARTICLE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export const ADMIN_STORAGE_KEYS = {
  SESSION: "ledger_admin_session",
  ARTICLES: "ledger_admin_articles",
  LOGIN_ATTEMPTS: "ledger_admin_login_attempts",
};

export const EMPTY_ARTICLE = {
  title: "",
  excerpt: "",
  content: "",
  tagsText: "",
  status: ARTICLE_STATUS.DRAFT,
};
