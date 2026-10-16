import { ADMIN_STORAGE_KEYS } from "../constants";

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;

function getAttempts() {
  const raw = localStorage.getItem(ADMIN_STORAGE_KEYS.LOGIN_ATTEMPTS);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveAttempts(attempts) {
  localStorage.setItem(ADMIN_STORAGE_KEYS.LOGIN_ATTEMPTS, JSON.stringify(attempts));
}

export function canAttemptLogin() {
  const now = Date.now();
  const recent = getAttempts().filter((ts) => now - ts < WINDOW_MS);
  saveAttempts(recent);

  return {
    allowed: recent.length < MAX_ATTEMPTS,
    remaining: Math.max(MAX_ATTEMPTS - recent.length, 0),
    waitMs: recent.length >= MAX_ATTEMPTS ? WINDOW_MS - (now - recent[0]) : 0,
  };
}

export function recordLoginAttempt() {
  const now = Date.now();
  const recent = getAttempts().filter((ts) => now - ts < WINDOW_MS);
  recent.push(now);
  saveAttempts(recent);
}
