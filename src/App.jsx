import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ADMIN_STORAGE_KEYS } from "./features/admin/constants";
import { AuthProvider } from "./features/admin/auth/AuthContext";
import ProtectedRoute from "./features/admin/auth/ProtectedRoute";
import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage";
import AdminLoginPage from "./features/admin/pages/AdminLoginPage";
import ArticleEditorPage from "./features/admin/pages/ArticleEditorPage";

const CATEGORIES = [
  { id: "all", label: "All", color: "#1A2A3D" },
  { id: "fintech", label: "Fintech", color: "#0E7C7B" },
  { id: "economics", label: "Economics", color: "#A8650B" },
  { id: "policy", label: "Policy", color: "#7A3E8E" },
];

const AUTHORS = {
  daniel: {
    name: "Daniel Allen",
    role: "Editor, The Ledger Post",
    bio: "Daniel writes about capital flows, market structure, and regulation at the edge of software and finance.",
    avatar: "DO",
  },
};

const ARTICLES = [
  {
    id: 1,
    slug: "stablecoin-rails-vs-correspondent-banking",
    title: "Why stablecoin rails are quietly replacing correspondent banking",
    excerpt:
      "Cross-border settlement that once took three days now clears in minutes. The banks that built the old system are the ones buying in.",
    category: "fintech",
    tags: ["payments", "stablecoins", "banking"],
    authorId: "daniel",
    publishedAt: "2026-10-16T08:20:00.000Z",
    updatedAt: "2026-10-16T10:05:00.000Z",
    readMinutes: 9,
    featured: true,
    sources: [
      { label: "BIS report on cross-border payments", url: "https://www.bis.org/cpmi/publ/d193.htm" },
      { label: "IMF note on digital money", url: "https://www.imf.org/en/Publications/fintech-notes" },
    ],
    content: `## The shift is not loud, but it is real

Most enterprises do not wake up asking for stablecoins. They ask for faster settlement, lower reconciliation overhead, and fewer failed transfers.

Traditional correspondent networks still solve scale and trust. But they carry **layered fees**, delay windows, and country-specific friction.

### What is changing

- Treasury teams now compare settlement quality, not just fees.
- New payment processors expose blockchain rails in the same dashboard as card and bank transfers.
- Banks are piloting tokenized deposit products to keep enterprise clients from routing around them.

### What to watch next

1. Whether large payroll providers add stablecoin payout options.
2. Whether regulators harmonize reserve and disclosure rules.
3. Whether liquidity providers can offer tighter FX spreads during volatile windows.

> The winning rail is rarely ideological. It is whichever option clears money faster and fails less often.`
  },
  {
    id: 2,
    slug: "sticky-services-inflation-central-banks",
    title: "Sticky services inflation is the number central banks cannot ignore",
    excerpt: "Goods prices have cooled. Wages and rents have not.",
    category: "economics",
    tags: ["inflation", "interest rates", "macro"],
    authorId: "daniel",
    publishedAt: "2026-10-15T07:10:00.000Z",
    updatedAt: "2026-10-15T08:45:00.000Z",
    readMinutes: 6,
    sources: [
      { label: "OECD inflation dashboard", url: "https://www.oecd.org/en/data/indicators/inflation-cpi.html" },
    ],
    content: `When services inflation stays elevated, policy makers cannot call the cycle over.

### Why services are harder to cool

Services are labor-heavy. If wage growth remains above productivity growth, businesses eventually pass costs through.

- Housing and rents reset slowly.
- Care and education are less exposed to imports.
- Labor shortages can persist despite weaker headline growth.

### The practical implication

Central banks may hold rates higher for longer even if goods disinflation keeps headline CPI moving lower.`
  },
  {
    id: 3,
    slug: "open-banking-rules-small-lenders",
    title: "What the new open banking rules change for small lenders",
    excerpt: "Data-sharing mandates reach further than the headlines suggest.",
    category: "policy",
    tags: ["open banking", "compliance", "lending"],
    authorId: "daniel",
    publishedAt: "2026-10-14T08:50:00.000Z",
    updatedAt: "2026-10-14T09:30:00.000Z",
    readMinutes: 7,
    sources: [
      { label: "UK FCA policy updates", url: "https://www.fca.org.uk/publications/policy-statements" },
    ],
    content: `The latest rule package expands both **data scope** and **timing obligations**.

### What small lenders need to implement

| Area | Requirement | Risk if delayed |
| --- | --- | --- |
| Consent flows | Clear, revocable consent records | Enforcement and complaints |
| Data retention | Defined expiry and deletion routines | Privacy breaches |
| Incident response | Structured reporting windows | Fines and trust loss |

### Quick operating checklist

1. Map every third-party data dependency.
2. Version API contracts and monitor deprecations.
3. Add customer-facing transparency logs.`
  },
  {
    id: 4,
    slug: "payment-gateway-card-and-bitcoin",
    title: "Building a payment gateway on two rails: card and Bitcoin",
    excerpt: "Lessons from routing one checkout across Stripe and BTCPay.",
    category: "fintech",
    tags: ["architecture", "payments", "crypto"],
    authorId: "daniel",
    publishedAt: "2026-10-13T09:25:00.000Z",
    updatedAt: "2026-10-13T11:15:00.000Z",
    readMinutes: 8,
    sources: [
      { label: "Stripe docs", url: "https://docs.stripe.com" },
      { label: "BTCPay docs", url: "https://docs.btcpayserver.org" },
    ],
    content: `A dual-rail checkout succeeds when failure handling is first-class.

### Non-negotiables

- Shared order state machine across rails.
- Idempotent webhook processing.
- Explicit timeout and retry semantics.


tsx
const nextState = transitions[currentState][event] ?? currentState;


If one rail is down, users should still complete checkout with the fallback path.`
  },
  {
    id: 5,
    slug: "uk-productivity-puzzle-again",
    title: "The UK productivity puzzle, one more time",
    excerpt: "Investment, not effort, explains most of the gap.",
    category: "economics",
    tags: ["productivity", "investment", "growth"],
    authorId: "daniel",
    publishedAt: "2026-10-12T11:40:00.000Z",
    updatedAt: "2026-10-12T12:30:00.000Z",
    readMinutes: 5,
    sources: [{ label: "ONS productivity estimates", url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/labourproductivity" }],
    content: `Productivity debates often over-index on motivation.

The bigger variable is **capital deepening**: software, tools, logistics, and management systems.

### Two things can be true

- Workers are putting in effort.
- Output per hour still lags peers.

Without sustained investment, this gap does not close by itself.`
  },
  {
    id: 6,
    slug: "export-controls-and-compute-cost",
    title: "Export controls and the cost of cutting off compute",
    excerpt: "How restrictions ripple through suppliers, startups, and allies.",
    category: "policy",
    tags: ["trade", "compute", "geopolitics"],
    authorId: "daniel",
    publishedAt: "2026-10-10T14:00:00.000Z",
    updatedAt: "2026-10-10T16:05:00.000Z",
    readMinutes: 6,
    sources: [{ label: "WTO trade policy resources", url: "https://www.wto.org/english/res_e/booksp_e/trade_policymaking_e.pdf" }],
    content: `Controls can slow adversarial capability growth, but they also reshape supply chains.

### Secondary effects to model

- Alternate sourcing and gray-market leakage.
- Cost inflation for allied buyers.
- Longer lead times for legitimate enterprise demand.

The policy challenge is not whether controls matter. It is whether implementation keeps strategic intent aligned with market reality.`
  },
];

const css = `
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,700&display=swap");
:root{--ink:#11131A;--mute:#5B6273;--paper:#FFFFFF;--card:#FFFFFF;--line:#D8DEE8;--accent:#0E7C7B;--accent-2:#C06A1A;--deep:#1A2A3D;--serif:"Fraunces",Georgia,"Times New Roman",serif;--sans:"Manrope",system-ui,-apple-system,"Segoe UI",sans-serif}
@media (prefers-color-scheme: dark){:root{--ink:#F7F7F4;--mute:#ADB3C0;--paper:#121821;--card:#1C2432;--line:#313B4C;--accent:#49A7A4;--accent-2:#E4A268;--deep:#0D1522}}
*{box-sizing:border-box}
.np{min-height:100svh;font-family:var(--sans);line-height:1.58;color:var(--ink);background:radial-gradient(circle at 12% 0%,color-mix(in srgb,var(--accent) 18%,transparent),transparent 30%),radial-gradient(circle at 88% 6%,color-mix(in srgb,var(--accent-2) 18%,transparent),transparent 35%),var(--paper)}
.np a{color:inherit;text-decoration:none}
.np button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.np :focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:6px}
.wrap{max-width:1160px;margin:0 auto;padding:0 20px}
.top{position:sticky;top:0;z-index:40;border-bottom:1px solid color-mix(in srgb,var(--line) 70%,transparent);backdrop-filter:blur(10px);background:color-mix(in srgb,var(--paper) 83%,transparent)}
.top-row{height:72px;display:flex;align-items:center;gap:14px}
.brand{font-family:var(--serif);font-size:1.7rem;font-weight:700;letter-spacing:-.02em;margin-right:auto}
.top-links{display:flex;gap:8px;flex-wrap:wrap}
.top-link{padding:8px 12px;border-radius:999px;font-size:.9rem;font-weight:600;color:var(--mute)}
.top-link.active,.top-link:hover{background:color-mix(in srgb,var(--line) 55%,transparent);color:var(--ink)}
.main{padding:26px 0 54px}
.hero{display:grid;gap:18px;align-items:start}
.hero-card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:20px;box-shadow:0 22px 44px rgba(19,26,39,.08)}
.kicker{display:inline-flex;align-items:center;gap:8px;font-size:.72rem;text-transform:uppercase;letter-spacing:.09em;color:var(--mute);font-weight:700}
.kicker-dot{display:inline-block;width:8px;height:8px;border-radius:999px;background:var(--cat)}
.hero h1{font-family:var(--serif);font-size:clamp(2rem,5.6vw,3.8rem);line-height:1.04;letter-spacing:-.03em;margin:10px 0 12px;text-wrap:balance;max-width:20ch}
.hero p{font-family:var(--serif);font-size:clamp(1.02rem,2.3vw,1.35rem);color:var(--mute);margin:0 0 14px;max-width:62ch}
.meta{display:flex;flex-wrap:wrap;gap:8px 14px;color:var(--mute);font-size:.88rem}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 12px}
.filter-chip{height:34px;padding:0 13px;border-radius:999px;border:1px solid var(--line);background:var(--card);font-size:.85rem;font-weight:700;color:var(--mute)}
.filter-chip.active{background:var(--deep);border-color:var(--deep);color:#fff}
.search{display:flex;align-items:center;gap:10px;height:48px;border:1px solid var(--line);border-radius:12px;padding:0 12px;background:var(--card);margin-bottom:20px}
.search input{width:100%;border:0;outline:0;background:transparent;color:var(--ink);font-size:1rem}
.grid{display:grid;gap:16px}
.card{display:flex;flex-direction:column;gap:8px;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s,border-color .2s}
.card::before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:var(--cat)}
.card:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(20,26,38,.11);border-color:color-mix(in srgb,var(--cat) 40%,var(--line))}
.card h3{font-family:var(--serif);font-size:1.45rem;line-height:1.2;margin:0;letter-spacing:-.015em}
.card p{margin:0;color:var(--mute)}
.tags{display:flex;flex-wrap:wrap;gap:6px}
.tag{padding:3px 8px;border-radius:999px;background:color-mix(in srgb,var(--cat) 14%,transparent);font-size:.74rem;font-weight:700;color:var(--cat)}
.article{display:grid;gap:26px}
.article-body{background:var(--card);border:1px solid color-mix(in srgb,var(--line) 72%,transparent);border-radius:16px;padding:24px}
.article-header{padding-bottom:18px;border-bottom:1px solid color-mix(in srgb,var(--line) 76%,transparent)}
.article-title{font-family:var(--serif);font-size:clamp(2.1rem,5vw,3.8rem);line-height:1.04;letter-spacing:-.03em;margin:10px 0 14px;max-width:22ch}
.article-dek{font-family:var(--serif);font-size:clamp(1.05rem,2.2vw,1.32rem);line-height:1.55;color:var(--mute);margin:0 0 16px;max-width:60ch}
.byline{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:14px}
.avatar{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--deep);color:#fff;font-weight:800;font-size:.82rem}
.byline-text strong{display:block;font-size:.96rem}
.byline-text span{display:block;color:var(--mute);font-size:.85rem}
.dateline{display:flex;flex-wrap:wrap;gap:6px 12px;color:var(--mute);font-size:.84rem}
.dateline .sep{opacity:.55}
.markdown{margin-top:26px;font-size:1.05rem;line-height:1.76;max-width:72ch}
.markdown h2,.markdown h3{font-family:var(--serif);letter-spacing:-.01em;line-height:1.2;margin:1.8rem 0 .8rem}
.markdown p{margin:0 0 1.1rem}
.markdown ul,.markdown ol{padding-left:1.2rem}
.markdown blockquote{margin:1rem 0;padding:.9rem 1rem;border-left:3px solid var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent);border-radius:0 8px 8px 0}
.markdown table{width:100%;border-collapse:collapse;margin:1rem 0;font-size:.94rem}
.markdown th,.markdown td{border:1px solid var(--line);padding:.5rem .65rem;text-align:left}
.markdown code{padding:.1rem .4rem;background:color-mix(in srgb,var(--line) 45%,transparent);border-radius:6px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}
.markdown a{color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px}
.side-panel{display:grid;gap:14px}
.panel{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px}
.panel h3{margin:0 0 10px;font-family:var(--serif);font-size:1.3rem}
.panel ul{margin:0;padding:0;list-style:none;display:grid;gap:10px}
.source-link{display:block;padding:10px;border:1px solid var(--line);border-radius:10px;font-size:.92rem;color:var(--mute)}
.source-link:hover{border-color:var(--accent);color:var(--ink)}
.share{display:flex;gap:8px;flex-wrap:wrap}
.share a{display:inline-flex;align-items:center;justify-content:center;height:34px;padding:0 12px;border-radius:999px;background:color-mix(in srgb,var(--line) 45%,transparent);font-size:.84rem;font-weight:700}
.not-found{padding:58px 0}
.not-found h1{font-family:var(--serif);font-size:2.4rem;margin:0 0 10px}
.footer{margin-top:26px;border-top:1px solid var(--line);padding:26px 0 40px;color:var(--mute);font-size:.9rem}
@media (min-width: 760px){
  .wrap{padding:0 30px}
  .hero{grid-template-columns:1.45fr .95fr}
  .grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (min-width: 1040px){
  .top-row{height:76px}
  .grid{grid-template-columns:repeat(3,minmax(0,1fr))}
  .article{grid-template-columns:minmax(0,2fr) minmax(280px,1fr);align-items:start}
  .article-body{padding:30px}
  .side-panel{position:sticky;top:96px}
}
@media (prefers-reduced-motion: reduce){
  .card{transition:none}
}
`;

function getCategory(catId) {
  return CATEGORIES.find((item) => item.id === catId) ?? CATEGORIES[0];
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(isoDate));
}

function estimateReadMinutes(content = "") {
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  return Math.max(Math.ceil(words / 220), 1);
}

function normalizeAdminArticle(article) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: "policy",
    tags: Array.isArray(article.tags) ? article.tags : [],
    authorId: "daniel",
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    readMinutes: estimateReadMinutes(article.content),
    featured: false,
    sources: [],
    content: article.content,
  };
}

function readPublishedAdminArticles() {
  const raw = localStorage.getItem(ADMIN_STORAGE_KEYS.ARTICLES);
  if (!raw) return [];

  try {
    const records = JSON.parse(raw);
    if (!Array.isArray(records)) return [];

    return records
      .filter((item) => item.status === "published" && item.slug && item.title && item.content)
      .map(normalizeAdminArticle);
  } catch {
    return [];
  }
}

function usePublicArticles() {
  const [adminPublished, setAdminPublished] = useState(() => readPublishedAdminArticles());

  useEffect(() => {
    const sync = () => setAdminPublished(readPublishedAdminArticles());
    window.addEventListener("admin-articles-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("admin-articles-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return useMemo(() => {
    const mergedBySlug = new Map();

    [...ARTICLES, ...adminPublished].forEach((article) => {
      mergedBySlug.set(article.slug, article);
    });

    return Array.from(mergedBySlug.values()).sort((a, b) => {
      const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      if (featuredDiff !== 0) return featuredDiff;

      const aDate = new Date(a.publishedAt || a.updatedAt).getTime();
      const bDate = new Date(b.publishedAt || b.updatedAt).getTime();
      return bDate - aDate;
    });
  }, [adminPublished]);
}

function ensureMetaTag(selector, attributes) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
}

function ensureLinkTag(selector, attributes) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("link");
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
}

function useSeo(meta) {
  useEffect(() => {
    const { title, description, type = "website", url } = meta;
    document.title = title;

    ensureMetaTag('meta[name="description"]', { name: "description", content: description });
    ensureMetaTag('meta[property="og:title"]', { property: "og:title", content: title });
    ensureMetaTag('meta[property="og:description"]', { property: "og:description", content: description });
    ensureMetaTag('meta[property="og:type"]', { property: "og:type", content: type });
    ensureMetaTag('meta[property="og:url"]', { property: "og:url", content: url });
    ensureMetaTag('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    ensureMetaTag('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    ensureMetaTag('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    ensureLinkTag('link[rel="canonical"]', { rel: "canonical", href: url });
  }, [meta]);
}

function ArticleMeta({ article }) {
  return (
    <div className="byline">
      <div className="dateline" aria-label="Publication details">
        <span>Published {formatDate(article.publishedAt)}</span>
        <span className="sep">|</span>
        <span>Updated {formatDate(article.updatedAt)}</span>
        <span className="sep">|</span>
        <span>{article.readMinutes} min read</span>
      </div>
    </div>
  );
}

function ArticleCard({ article }) {
  const category = getCategory(article.category);
  return (
    <article className="card" style={{ "--cat": category.color }}>
      <div className="kicker">
        <span className="kicker-dot" />
        {category.label}
      </div>
      <h3>
        <Link to={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
      <p>{article.excerpt}</p>
      <div className="tags">
        {article.tags.map((tag) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>
      <div className="meta">
        <span>{AUTHORS[article.authorId].name}</span>
        <span>{formatDate(article.publishedAt)}</span>
      </div>
    </article>
  );
}

function Header({ articles }) {
  const latestArticle = articles[0];

  return (
    <header className="top">
      <div className="wrap top-row">
        <Link className="brand" to="/">The Ledger Post</Link>
        <nav className="top-links" aria-label="Primary">
          <NavLink className={({ isActive }) => `top-link ${isActive ? "active" : ""}`} to="/">
            Home
          </NavLink>
          <NavLink className={({ isActive }) => `top-link ${isActive ? "active" : ""}`} to={latestArticle ? `/articles/${latestArticle.slug}` : "/"}>
            Latest
          </NavLink>
          <NavLink className={({ isActive }) => `top-link ${isActive ? "active" : ""}`} to="/admin">
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function HomePage({ articles }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return articles.filter((article) => {
      const categoryMatch = activeCategory === "all" || article.category === activeCategory;
      const queryMatch =
        !normalized ||
        [article.title, article.excerpt, ...article.tags].join(" ").toLowerCase().includes(normalized);
      return categoryMatch && queryMatch;
    });
  }, [activeCategory, articles, query]);

  const featured = filtered.find((item) => item.featured) ?? filtered[0];
  const remaining = filtered.filter((item) => item.id !== featured?.id);

  useSeo({
    title: "The Ledger Post | Markets, policy, and fintech analysis",
    description: "Modern reporting on fintech, economics, and policy with source-backed analysis.",
    url: window.location.href,
  });

  return (
    <main className="wrap main">
      <section className="hero">
        {featured ? (
          <article className="hero-card" style={{ "--cat": getCategory(featured.category).color }}>
            <div className="kicker">
              <span className="kicker-dot" />
              {getCategory(featured.category).label}
            </div>
            <h1>
              <Link to={`/articles/${featured.slug}`}>{featured.title}</Link>
            </h1>
            <p>{featured.excerpt}</p>
            <ArticleMeta article={featured} />
          </article>
        ) : (
          <article className="hero-card">
            <h1>No matching stories yet</h1>
            <p>Try changing the category or searching with a broader keyword.</p>
          </article>
        )}

        <aside className="panel" aria-label="Filter stories">
          <h3>Find by topic</h3>
          <div className="filters">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                className={`filter-chip ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
          <label className="search" htmlFor="story-search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              id="story-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, summaries, and tags"
            />
          </label>
          <p className="meta">
            <span>{filtered.length} stories found</span>
            <span>Updated daily</span>
          </p>
        </aside>
      </section>

      <section aria-label="Story grid" style={{ marginTop: 18 }}>
        <div className="grid">
          {remaining.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ArticlePage({ articles }) {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);

  useSeo(
    article
      ? {
          title: `${article.title} | The Ledger Post`,
          description: article.excerpt,
          type: "article",
          url: `${window.location.origin}/articles/${article.slug}`,
        }
      : {
          title: "Story not found | The Ledger Post",
          description: "The article you are looking for does not exist.",
          url: window.location.href,
        }
  );

  if (!article) {
    return <NotFoundPage />;
  }

  const category = getCategory(article.category);
  const author = AUTHORS[article.authorId];
  const articleUrl = `${window.location.origin}/articles/${article.slug}`;

  const related = articles.filter((candidate) => {
    if (candidate.id === article.id) return false;
    const sameCategory = candidate.category === article.category;
    const sharedTag = candidate.tags.some((tag) => article.tags.includes(tag));
    return sameCategory || sharedTag;
  }).slice(0, 3);

  const shareText = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(articleUrl);

  return (
    <main className="wrap main">
      <article className="article">
        <section className="article-body">
          <header className="article-header">
            <div className="kicker" style={{ "--cat": category.color }}>
              <span className="kicker-dot" />
              {category.label}
            </div>
            <h1 className="article-title">{article.title}</h1>
            <p className="article-dek">{article.excerpt}</p>
            <div className="tags" style={{ marginTop: 10 }}>
              {article.tags.map((tag) => (
                <span key={tag} className="tag" style={{ "--cat": category.color }}>#{tag}</span>
              ))}
            </div>
            <ArticleMeta article={article} />
          </header>

          <div className="markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noreferrer" className="source-link">
                    {children}
                  </a>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </section>

        <aside className="side-panel" aria-label="Related and sharing">
          <section className="panel">
            <h3>About the author</h3>
            <p style={{ margin: 0, color: "var(--mute)" }}>{author.bio}</p>
          </section>

          <section className="panel">
            <h3>Related articles</h3>
            <ul>
              {related.length === 0 ? (
                <li>No related articles yet.</li>
              ) : (
                related.map((item) => (
                  <li key={item.id}>
                    <Link to={`/articles/${item.slug}`}>{item.title}</Link>
                    <div className="meta">
                      <span>{getCategory(item.category).label}</span>
                      <span>{formatDate(item.publishedAt)}</span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="panel">
            <h3>Sources</h3>
            <ul>
              {article.sources.map((source) => (
                <li key={source.url}>
                  <a className="source-link" href={source.url} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <h3>Share</h3>
            <div className="share">
              <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noreferrer">Share on X</a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noreferrer">Share on LinkedIn</a>
              <a href={`mailto:?subject=${shareText}&body=${shareUrl}`}>Share by email</a>
            </div>
          </section>
        </aside>
      </article>
    </main>
  );
}

function NotFoundPage() {
  useSeo({
    title: "Story not found | The Ledger Post",
    description: "The article you are looking for does not exist.",
    url: window.location.href,
  });

  return (
    <main className="wrap main not-found">
      <h1>Story not found</h1>
      <p>This article may have moved or is no longer available.</p>
      <p style={{ marginTop: 12 }}>
        <Link className="source-link" to="/">Back to homepage</Link>
      </p>
    </main>
  );
}

function AppShell() {
  const articles = usePublicArticles();

  return (
    <div className="np">
      <style>{css}</style>
      <Header articles={articles} />
      <Routes>
        <Route path="/" element={<HomePage articles={articles} />} />
        <Route path="/articles/:slug" element={<ArticlePage articles={articles} />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={(
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/articles/new"
          element={(
            <ProtectedRoute>
              <ArticleEditorPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/articles/:id/edit"
          element={(
            <ProtectedRoute>
              <ArticleEditorPage />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer className="footer">
        <div className="wrap">The Ledger Post. Independent reporting on markets, policy, and fintech.</div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
