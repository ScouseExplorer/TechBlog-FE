const TITLE_MIN = 8;
const CONTENT_MIN = 80;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateLoginForm(values) {
  const errors = {};

  if (!isNonEmptyString(values.email)) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!isNonEmptyString(values.password)) {
    errors.password = "Password is required.";
  } else if (values.password.length < 10) {
    errors.password = "Password must be at least 10 characters.";
  }

  return errors;
}

export function validateArticle(values) {
  const errors = {};

  if (!isNonEmptyString(values.title) || values.title.trim().length < TITLE_MIN) {
    errors.title = `Title must be at least ${TITLE_MIN} characters.`;
  }

  if (!isNonEmptyString(values.excerpt)) {
    errors.excerpt = "Excerpt is required.";
  }

  if (!isNonEmptyString(values.content) || values.content.trim().length < CONTENT_MIN) {
    errors.content = `Content must be at least ${CONTENT_MIN} characters.`;
  }

  const tags = (values.tagsText || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (tags.length > 8) {
    errors.tagsText = "Use at most 8 tags.";
  }

  return errors;
}
