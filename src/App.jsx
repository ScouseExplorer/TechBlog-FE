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
import { API_BASE_URL } from "./config/api";

const CATEGORIES = [
  { id: "all", label: "All", color: "#1A2A3D" },
  { id: "tech", label: "Tech", color: "#2A6F97" },
  { id: "business", label: "Business", color: "#3B6B4A" },
  { id: "fintech", label: "Fintech", color: "#0E7C7B" },
  { id: "economics", label: "Economics", color: "#A8650B" },
  { id: "policy", label: "Policy", color: "#7A3E8E" },
];

const AUTHORS = {
  daniel: {
    name: "Daniel Allen",
    role: "Editor, bydanielallen",
    bio: "Daniel writes about capital flows, market structure, and regulation at the edge of software and finance.",
    avatar: "DO",
  },
};

const ARTICLES = [
  {
    id: 1,
    slug: "nvidia-post-jensen-huang-era",
    title: "Can a tech giant outgrow its founder? Inside Nvidia’s post-Jensen era",
    excerpt:
      "Jensen Huang’s sudden exit leaves a visionary void at the center of the AI boom, testing whether Nvidia’s software moat can outlast its founder.",
    category: "tech",
    tags: ["nvidia", "ai", "leadership"],
    authorId: "daniel",
    publishedAt: "2026-11-16T09:00:00.000Z",
    updatedAt: "2026-11-16T09:00:00.000Z",
    readMinutes: 5,
    featured: true,
    sources: [
      { label: "NVIDIA Announces CEO Transition", url: "https://nvidianews.nvidia.com/news/nvidia-announces-ceo-transition" },
      { label: "Motley Fool analysis on Nvidia's post-Huang risks", url: "https://www.fool.com/investing/2026/11/16/the-resignation-of-jensen-huang-isn-t-nvidia-s-only-problem-where-the-stock-could-fall-to-by-the-end-of-2027/" },
    ],
    content: `## An abrupt end to a three-decade run

For more than thirty years, Nvidia and Jensen Huang were practically synonymous. That era ended on November 12, 2026, when Huang abruptly resigned as president, CEO, and board member, with longtime CFO Colette Kress stepping in as interim CEO.

The departure triggered immediate volatility on Wall Street and renewed scrutiny in Washington over national security and export controls. Now the market faces a foundational question: **how resilient is Nvidia without its co-founder?**

### Why Nvidia’s moat still holds

Switching away from Nvidia is not as simple as buying cheaper silicon from AMD or Intel. Millions of developers rely on its proprietary software stack. Hyperscalers like Microsoft, Meta, and Amazon have already committed billions toward Blackwell and next-generation Rubin infrastructure. Interim CEO Colette Kress has steered Nvidia’s finances since 2013, bringing the steady execution institutional investors want.

### What to watch next

1. **The vision gap:** Engineering teams execute roadmaps, but founders make contrarian bets years ahead of the market.
2. **Washington scrutiny:** Heightened political focus on China exposure could tighten export rules and slow global growth.
3. **Consumer gaming priorities:** Under finance-led interim leadership, enterprise data centers will likely overshadow GeForce graphics even further.

> Nvidia is no longer a scrappy startup—it is the infrastructure layer of the AI economy. Its technology will endure, even if its boldest chapter has closed.`
  },
  {
    id: 2,
    slug: "bank-of-england-rate-hike-home-buyers",
    title: "The Bank of England just raised rates to 4%: What it means for home buyers",
    excerpt:
      "Middle East energy shocks forced the MPC to hike rates for the first time in over three years. Here is how borrowing power and house prices shift next.",
    category: "economics",
    tags: ["interest rates", "mortgages", "housing"],
    authorId: "daniel",
    publishedAt: "2026-11-16T10:30:00.000Z",
    updatedAt: "2026-11-16T10:30:00.000Z",
    readMinutes: 6,
    featured: false,
    sources: [
      { label: "Bank of England November 2026 Monetary Policy Summary", url: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/november-2026" },
      { label: "The Guardian on BoE Chief Economist Huw Pill's rate outlook", url: "https://www.theguardian.com/business/2026/nov/14/interest-rate-rises-inflation-bank-of-england-chief-economist" },
    ],
    content: `## Why the Bank reversed course

On November 5, 2026, the Bank of England’s Monetary Policy Committee voted 8–1 to raise the UK base rate by 0.25 percentage points to **4%**.

Ongoing conflict in the Middle East has kept energy prices volatile, pushing inflation back up and prompting warnings that price growth could reach 5% by mid-2027. Chief Economist Huw Pill has already signaled that further hikes could follow in December and early 2027.

### How this hits buyers and homeowners

Fixed mortgage rates had largely priced in the move already, because lenders base their deals on market swap rates. Higher stress-test rates reduce maximum loan sizes and buyers’ purchasing power compared with early 2026. With many first-time buyers pausing their search, sellers face softer demand and more room for negotiation. Tracker and SVR borrowers see monthly repayments rise straight away, while fixed-rate holders remain insulated until renewal.

### Smart moves before the next MPC meeting

1. **Lock in a rate early** if your current fix expires within six months, preserving the option to switch if pricing improves.
2. **Push toward the next deposit tier** (such as 10% or 40% equity) where lenders concentrate their sharpest rate discounts.
3. **Compare total cost over headline rates**, factoring in arrangement fees through a whole-of-market broker.

> Higher borrowing costs shrink budgets, but a quieter market hands negotiating leverage back to prepared buyers.`
  },
  {
    id: 3,
    slug: "musk-spacex-xai-tesla-merger-endgame",
    title: "Elon Musk’s $3.5 trillion endgame: Why SpaceX, xAI, and Tesla are merging",
    excerpt:
      "After folding xAI into SpaceX, talks to absorb Tesla would create the largest corporate tie-up in history—combining orbital compute with voting control.",
    category: "business",
    tags: ["tesla", "spacex", "mergers"],
    authorId: "daniel",
    publishedAt: "2026-11-16T12:00:00.000Z",
    updatedAt: "2026-11-16T12:00:00.000Z",
    readMinutes: 6,
    featured: false,
    sources: [
      { label: "Motley Fool breakdown of the SpaceX-Tesla deal structure", url: "https://www.fool.com/investing/2026/11/13/spacex-could-announce-a-deal-for-tesla-as-soon-as-december-here-s-what-it-would-do-to-spacex-stock/" },
      { label: "Crypto Briefing on Musk's Tesla-SpaceX merger proposal", url: "https://cryptobriefing.com/musk-proposes-tesla-spacex-merger-to-boost-tech-dominance/" },
    ],
    content: `## Pulling the empire under one roof

Earlier in 2026, SpaceX absorbed xAI before going public in a record-setting IPO. Now, active merger discussions between SpaceX and Tesla point toward a roughly **$3.5 trillion combination** that would dwarf every corporate takeover in history.

### Why Musk wants the deal

Uniting SpaceX’s orbital infrastructure and Starlink network with Tesla’s Full Self-Driving and Optimus robotics could remove friction around chips and compute. Musk holds dominant voting power at SpaceX, and structuring the transaction as SpaceX absorbing Tesla would give him decisive governance control without relying on performance milestones alone.

### What it means for shareholders

Tesla investors would trade standalone EV exposure for satellite and AI growth if their shares converted into SpaceX stock, while giving up outside shareholder voting influence. For SpaceX investors, absorbing Tesla would add massive scale but could dilute rapid revenue growth with a slower-growing, capital-intensive automotive business.

### What to look out for next

1. **The exchange ratio:** Independent board committees must agree on a share-swap price that avoids legal challenges over valuation and executive vesting.
2. **National security reviews:** Merging Tesla’s deep manufacturing footprint in China with SpaceX’s classified U.S. defense contracts will draw intense scrutiny in Washington.
3. **Upcoming shareholder milestones:** Watch for formal proxy filings and signals around Tesla’s December annual meeting.

> A unified balance sheet solves Musk’s governance and compute bottlenecks, but forces investors to buy the entire empire at once.`
  },
  {
    id: 4,
    slug: "beyond-chatbots-ai-agents-world-models",
    title: "Beyond chatbots: 3 tech shifts reshaping how we work and live",
    excerpt:
      "Software is moving from passive chat boxes to autonomous agents and physics-aware world models—just as global regulators tighten the rules.",
    category: "tech",
    tags: ["ai agents", "world models", "regulation"],
    authorId: "daniel",
    publishedAt: "2026-11-16T14:00:00.000Z",
    updatedAt: "2026-11-16T14:00:00.000Z",
    readMinutes: 5,
    featured: false,
    sources: [
      { label: "Gartner Top Strategic Technology Trends for 2027", url: "https://www.gartner.com/en/newsroom/press-releases/2026-10-20-gartner-identifies-the-top-strategic-technology-trends-for-2027" },
      { label: "Firecrawl Agentic AI Trends Report 2026", url: "https://www.firecrawl.dev/blog/agentic-ai-trends" },
    ],
    content: `## From tools you click to systems that act

For the past few years, interacting with AI meant typing prompts into a chat window. That interface is rapidly giving way to autonomous systems that operate software, simulate physical environments, and face far stricter oversight.

### Three shifts defining the landscape

Multi-agent systems and command-line developer tools can plan workflows, authenticate across apps, and execute multi-step tasks with minimal prompting. Unlike text-based models that predict words, world models learn space, time, and causality, allowing robotics and autonomous vehicles to simulate outcomes before acting. As enterprises deploy agents with real system credentials, dynamic identity controls, audit trails, and stricter safety regulations are becoming essential.

### What this means in practice

1. **Prompt engineering is fading** in favor of context engineering feeding agents structured, real-time data so they act reliably.
2. **Specialized models win on cost:** Smaller, domain-tuned models are outperforming giant general-purpose models in healthcare, finance, and legal workflows.
3. **Trust is the bottleneck:** The companies that win next will not just have better demos, but verifiable safety and permission controls.

> The novelty phase of AI is over. The next wave is quieter, deeply embedded in workflows, and held to much higher standards.`
  },
];

const css = `
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,700&display=swap");
:root{--ink:#14171F;--mute:#5D6473;--paper:#FFFFFF;--card:#FFFFFF;--line:#E3E7EE;--accent:#0F5B92;--deep:#1A2A3D;--serif:"Fraunces",Georgia,"Times New Roman",serif;--sans:"Manrope",system-ui,-apple-system,"Segoe UI",sans-serif}
@media (prefers-color-scheme: dark){:root{--ink:#F7F7F4;--mute:#ADB3C0;--paper:#121821;--card:#1C2432;--line:#313B4C;--accent:#49A7A4;--accent-2:#E4A268;--deep:#0D1522}}
*{box-sizing:border-box}
.np{min-height:100svh;font-family:var(--sans);line-height:1.58;color:var(--ink);background:var(--paper)}
.np a{color:inherit;text-decoration:none}
.np button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.np :focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:6px}
.wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.top{position:sticky;top:0;z-index:40;border-bottom:1px solid var(--line);background:var(--paper)}
.top-row{height:72px;display:flex;align-items:center;gap:14px}
.brand{font-family:var(--sans);font-size:1.55rem;font-weight:800;letter-spacing:0;margin-right:auto}
.top-links{display:flex;gap:8px;flex-wrap:wrap}
.top-link{padding:8px 2px;font-size:.9rem;font-weight:600;color:var(--mute);border-bottom:2px solid transparent}
.top-link.active,.top-link:hover{color:var(--ink);border-bottom-color:var(--ink)}
.main{padding:26px 0 54px}
.hero{display:grid;gap:18px;align-items:start}
.hero-card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:22px}
.kicker{display:inline-flex;align-items:center;gap:8px;font-size:.72rem;text-transform:uppercase;letter-spacing:.09em;color:var(--mute);font-weight:700}
.kicker-dot{display:inline-block;width:8px;height:8px;border-radius:999px;background:var(--cat)}
.hero h1{font-family:var(--sans);font-size:clamp(1.8rem,4.6vw,3.1rem);font-weight:800;line-height:1.08;letter-spacing:0;margin:10px 0 12px;text-wrap:balance;max-width:20ch}
.hero-card p{font-family:var(--serif);font-size:clamp(1.02rem,2.3vw,1.35rem);color:var(--mute);margin:0 0 14px;max-width:62ch}
.meta{display:flex;flex-wrap:wrap;gap:8px 14px;color:var(--mute);font-size:.88rem}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 12px}
.filter-chip{height:34px;padding:0 13px;border-radius:5px;border:1px solid var(--line);background:var(--card);font-size:.84rem;font-weight:700;color:var(--mute)}
.filter-chip.active{background:#EFF3F8;border-color:#CDD6E2;color:var(--ink)}
.search{display:flex;align-items:center;gap:10px;height:48px;border:1px solid var(--line);border-radius:12px;padding:0 12px;background:var(--card);margin-bottom:20px}
.search input{width:100%;border:0;outline:0;background:transparent;color:var(--ink);font-size:1rem}
.grid{display:grid;gap:16px}
.card{display:flex;flex-direction:column;gap:8px;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:16px;transition:border-color .2s,box-shadow .2s}
.card:hover{border-color:#C9D3E2;box-shadow:0 5px 14px rgba(18,31,47,.06)}
.card h3{font-family:var(--sans);font-size:1.3rem;font-weight:800;line-height:1.25;margin:0;letter-spacing:0}
.card p{margin:0;color:var(--mute)}
.tags{display:flex;flex-wrap:wrap;gap:6px}
.tag{padding:2px 7px;border-radius:4px;background:#F3F6FA;font-size:.72rem;font-weight:700;color:#41506A}
.article{display:grid;gap:26px;min-width:0}
.article-body{min-width:0;background:var(--card);border:1px solid color-mix(in srgb,var(--line) 72%,transparent);border-radius:16px;padding:24px}
.article-header{padding-bottom:18px;border-bottom:1px solid color-mix(in srgb,var(--line) 76%,transparent)}
.article-title{font-family:var(--sans);font-size:clamp(2.1rem,5vw,3.8rem);font-weight:800;line-height:1.08;letter-spacing:0;margin:10px 0 14px;max-width:22ch}
.article-dek{font-family:var(--serif);font-size:clamp(1.05rem,2.2vw,1.32rem);line-height:1.55;color:var(--mute);margin:0 0 16px;max-width:60ch}
.byline{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:14px}
.avatar{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--deep);color:#fff;font-weight:800;font-size:.82rem}
.byline-text strong{display:block;font-size:.96rem}
.byline-text span{display:block;color:var(--mute);font-size:.85rem}
.dateline{display:flex;flex-wrap:wrap;gap:6px 12px;color:var(--mute);font-size:.84rem}
.dateline .sep{opacity:.55}
.markdown{min-width:0;margin-top:26px;font-size:1.05rem;line-height:1.76;max-width:72ch;overflow-wrap:anywhere}
.markdown h2,.markdown h3{font-family:var(--serif);letter-spacing:-.01em;line-height:1.2;margin:1.8rem 0 .8rem}
.markdown p{margin:0 0 1.1rem}
.markdown ul,.markdown ol{padding-left:1.2rem}
.markdown blockquote{margin:1rem 0;padding:.9rem 1rem;border-left:3px solid var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent);border-radius:0 8px 8px 0}
.markdown pre{margin:1rem 0;padding:14px 16px;border:1px solid var(--line);border-radius:8px;background:#F7F9FC;overflow:auto}
.markdown table{display:block;width:100%;max-width:100%;border-collapse:collapse;margin:1rem 0;font-size:.94rem;overflow-x:auto;white-space:nowrap}
.markdown img{max-width:100%;height:auto}
.markdown th,.markdown td{border:1px solid var(--line);padding:.5rem .65rem;text-align:left}
.markdown code{padding:.1rem .4rem;background:color-mix(in srgb,var(--line) 45%,transparent);border-radius:6px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}
.markdown a{color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px}
.side-panel{display:grid;gap:14px}
.panel{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:16px}
.panel h3{margin:0 0 10px;font-family:var(--serif);font-size:1.3rem}
.panel ul{margin:0;padding:0;list-style:none;display:grid;gap:10px}
.source-link{display:block;padding:10px;border:1px solid var(--line);border-radius:10px;font-size:.92rem;color:var(--mute)}
.source-link:hover{border-color:var(--accent);color:var(--ink)}
.share{display:flex;gap:8px;flex-wrap:wrap}
.share a{display:inline-flex;align-items:center;justify-content:center;height:34px;padding:0 12px;border-radius:4px;background:#EFF3F8;font-size:.84rem;font-weight:700}
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
@media (max-width: 520px){
  .top-row{height:auto;min-height:68px;flex-wrap:wrap;gap:0 12px;padding-top:8px;padding-bottom:8px}
  .brand{font-size:1.35rem}
  .top-links{width:100%;gap:16px}
  .top-link{padding:5px 0}
  .main{padding-top:18px;padding-bottom:36px}
  .hero-card{padding:18px}
  .article{gap:18px}
  .article-body{padding:18px;border-radius:10px}
  .markdown{font-size:1rem}
  .filter-chip{height:40px}
  .share a{height:40px}
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

function normalizeApiPost(post) {
  const content = post.body || "";
  return normalizeAdminArticle({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: content.replace(/\s+/g, " ").slice(0, 160),
    tags: [],
    publishedAt: post.published_at || post.created_at,
    updatedAt: post.updated_at,
    content,
  });
}

async function fetchPublishedApiArticles() {
  if (!API_BASE_URL) return [];

  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) return [];

  const body = await response.json();
  return (body.data || [])
    .filter((post) => post.published && post.slug && post.title && post.body)
    .map(normalizeApiPost);
}

function usePublicArticles() {
  const [adminPublished, setAdminPublished] = useState(() => readPublishedAdminArticles());
  const [apiPublished, setApiPublished] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchPublishedApiArticles()
      .then((items) => {
        if (mounted) setApiPublished(items);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

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

    [...ARTICLES, ...adminPublished, ...apiPublished].forEach((article) => {
      mergedBySlug.set(article.slug, article);
    });

    return Array.from(mergedBySlug.values())
      .filter((article) =>
        !article.title.toLowerCase().includes("how to get rich") &&
        !article.slug.toLowerCase().includes("how-to-get-rich")
      )
      .sort((a, b) => {
        const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        if (featuredDiff !== 0) return featuredDiff;

        const aDate = new Date(a.publishedAt || a.updatedAt).getTime();
        const bDate = new Date(b.publishedAt || b.updatedAt).getTime();
        return bDate - aDate;
      });
  }, [adminPublished, apiPublished]);
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
        <Link className="brand" to="/">ByDanielAllen</Link>
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

  const featured =
    filtered.find((item) => item.featured) ??
    filtered.find((item) => item.slug === "stablecoin-rails-vs-correspondent-banking") ??
    filtered[0];
  const remaining = filtered.filter((item) => item.id !== featured?.id);

  useSeo({
    title: "bydanielallen | Markets, policy, and fintech analysis",
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
          title: `${article.title} | bydanielallen`,
          description: article.excerpt,
          type: "article",
          url: `${window.location.origin}/articles/${article.slug}`,
        }
      : {
          title: "Story not found | bydanielallen",
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
                  <a href={href} target="_blank" rel="noreferrer">
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
    title: "Story not found | bydanielallen",
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
        <div className="wrap">bydanielallen. Independent reporting on markets, policy, and fintech.</div>
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
