import { kv } from '@vercel/kv'

const SEED_ARTICLES = [
  {
    id: "1",
    title: "World leaders gather in Geneva as climate talks reach critical juncture",
    slug: "world-leaders-geneva-climate-talks",
    desc: "Representatives from over 140 nations have assembled for what analysts are calling the most consequential environmental summit in a decade.",
    content: "GENEVA — World leaders arrived in Geneva for emergency climate talks that diplomats say could determine the trajectory of global emissions policy for the next three decades.\n\nRepresentatives from over 140 nations have assembled for what analysts are calling the most consequential environmental summit in a decade. At the heart of the negotiations are binding emissions targets, green energy transition timelines, and a proposed $500 billion climate fund for developing nations.\n\nThe summit comes amid a string of record-breaking temperature anomalies reported across four continents this year, lending urgency to the proceedings.",
    cat: "World",
    author: "Sarah Okonkwo",
    icon: "🌍",
    image: "",
    breaking: true,
    date: "2026-04-19T08:00:00Z"
  },
  {
    id: "2",
    title: "Central bank holds interest rates steady amid easing inflation pressures",
    slug: "central-bank-holds-interest-rates",
    desc: "Policymakers cite easing price pressures but warn that premature cuts could reignite inflationary trends.",
    content: "The central bank held its benchmark interest rate steady at 4.75% on Thursday, citing progress on inflation but signalling caution about moving too quickly toward rate cuts.\n\nThe decision, which was unanimous among the rate-setting committee, came despite growing calls from business groups and some economists for an immediate reduction to stimulate sluggish economic growth.",
    cat: "Business",
    author: "James Whitfield",
    icon: "📈",
    image: "",
    breaking: true,
    date: "2026-04-19T06:30:00Z"
  },
  {
    id: "3",
    title: "Parliament debates sweeping electoral reform bill",
    slug: "parliament-electoral-reform-bill",
    desc: "The proposed legislation would overhaul constituency boundaries and introduce ranked-choice voting.",
    content: "Parliament erupted into heated debate on Wednesday as lawmakers began scrutinising a sweeping electoral reform bill that its sponsors say would modernise the country's democratic system.\n\nThe proposed legislation would redraw constituency boundaries for the first time in 22 years and introduce ranked-choice voting for general elections.",
    cat: "Politics",
    author: "Fatima Al-Rashid",
    icon: "⚖️",
    image: "",
    breaking: false,
    date: "2026-04-19T05:00:00Z"
  },
  {
    id: "4",
    title: "Researchers unveil solid-state battery that charges in under four minutes",
    slug: "solid-state-battery-four-minutes",
    desc: "The breakthrough could revolutionise electric vehicles and consumer electronics, with commercial production expected by 2028.",
    content: "Scientists at a leading research university announced a major breakthrough in battery technology on Tuesday, unveiling a solid-state cell capable of charging to full capacity in under four minutes.\n\nThe development represents a significant advance over current lithium-ion batteries, which typically require 30 to 60 minutes for a full charge.",
    cat: "Technology",
    author: "Dr. Priya Nair",
    icon: "🔬",
    image: "",
    breaking: true,
    date: "2026-04-18T14:00:00Z"
  },
  {
    id: "5",
    title: "National team secures World Cup qualification after dramatic comeback",
    slug: "national-team-world-cup-qualification",
    desc: "Two late goals turned the match on its head as the squad booked their place in next year's tournament.",
    content: "The national football team secured their place at next year's World Cup with one of the most dramatic performances in recent memory, overturning a two-goal deficit in the final fifteen minutes to win 3–2.\n\nA packed stadium witnessed scenes of jubilation as the final whistle confirmed qualification.",
    cat: "Sports",
    author: "Marcus Obi",
    icon: "🏆",
    image: "",
    breaking: false,
    date: "2026-04-18T20:00:00Z"
  }
]

export async function getArticles() {
  try {
    const articles = await kv.get('articles')
    if (!articles) {
      await kv.set('articles', SEED_ARTICLES)
      return SEED_ARTICLES
    }
    return articles
  } catch (e) {
    return SEED_ARTICLES
  }
}

export async function saveArticles(articles) {
  await kv.set('articles', articles)
}

export function timeAgo(dateStr) {
  const now = new Date()
  const then = new Date(dateStr)
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
