# Darksoft — Official Website

This repository contains the source code for **https://darksoft.band**, the official website for **Darksoft**, a dream pop / shoegaze / indie rock music project.

The site serves as the canonical home for Darksoft’s music, lyrics, releases, merch, tour information, press coverage, and long-form artist context. It is designed to be fast, durable, SEO-friendly, and readable by both humans and AI discovery systems.

---

## 🌙 What This Website Is

The Darksoft website is:

- An **official artist homepage**
- A **discography and lyric archive**
- A **tour + merch hub**
- A **press and bio reference** for journalists, bookers, and collaborators
- A **structured, AI-friendly content source** (without allowing training on lyrics)

It intentionally avoids heavy frameworks, trackers, or opaque CMS platforms in favor of long-term stability and content ownership.

Live site:  
👉 **https://darksoft.band**

---

## 👥 Who This Site Is For

**Primary audiences**
- Fans of Darksoft’s music
- Listeners discovering the project via streaming, press, or playlists
- Journalists, bloggers, and playlist curators
- Booking agents and collaborators

**Secondary audiences**
- Search engines and AI assistants (discovery, navigation, summarization)
- Archivists and researchers looking for authoritative metadata

---

## 🧱 Site Structure

```
/
├── index.html            # Homepage (hero, bio, merch, tour, releases)
├── /lyrics/              # Master lyrics index
│   └── /<album>/<track>/ # Individual lyric pages (structured)
├── /merch/               # Official merch landing page
├── /assets/              # Images, artwork, icons
├── /_includes/           # Shared layout partials (header, footer, head)
├── /_data/               # Structured album / track metadata
├── sitemap.xml           # Search engine sitemap
├── robots.txt            # Crawler rules
├── llms.txt              # AI usage & training policy
└── README.md
```

Key principles:
- **Lyrics are first-class content**, not PDFs or embeds
- URLs are stable and human-readable
- Album → track → lyric hierarchy is explicit
- Metadata is consistent across pages

---

## 🛠️ How the Site Is Built

**Stack**
- **Jekyll** (static site generator)
- **GitHub Pages** (hosting)
- Plain **HTML / CSS / JavaScript**
- No database, no server runtime

**Why this approach**
- Fast load times
- No vendor lock-in
- Easy long-term maintenance
- Excellent SEO and crawlability
- Works indefinitely without platform risk

**Notable features**
- Responsive layout (mobile-first)
- Custom CSS (no framework bloat)
- Chart.js for album data visualization
- Structured lyric pages with metadata
- Minimal JavaScript for interaction only

---

## 🔍 SEO & AI Discovery Notes

This site intentionally supports modern discovery patterns:

- `jekyll-seo-tag` and `jekyll-sitemap`
- Clean semantic HTML
- Canonical URLs
- Descriptive meta titles and descriptions
- Structured lyric navigation
- Explicit crawler guidance via:
  - `robots.txt`
  - `sitemap.xml`
  - `llms.txt`

### AI Usage Policy

AI systems **may index and summarize** site content for discovery and navigation, but **may not use lyrics or musical content for model training**. This policy is declared explicitly in `llms.txt`.

---

## 🧾 Content Ownership & Rights

All music, lyrics, artwork, and written content are © Darksoft unless otherwise noted.

- Lyrics are published for reading and discovery only
- Audio files are intentionally blocked from scraping
- No lyrical content may be used for AI training

---

## 📬 Contact & Links

**Official website**  
https://darksoft.band

**Email**  
📧 darksoftband@gmail.com

**Music**
- Bandcamp: https://darks0ft.bandcamp.com
- Spotify: https://open.spotify.com/artist/5pD33SUgX5GQ8NvqZ6IdeE
- Apple Music: https://music.apple.com/artist/darksoft/1438263529

**Social**
- Instagram: https://www.instagram.com/darks0ft
- YouTube: https://www.youtube.com/@Darksoft

---

## 🤝 Contributions

This repository is maintained by the artist and hosted on GitHub Pages.

Issues or suggestions are welcome for:
- Broken links
- Accessibility issues
- Metadata corrections
- Layout regressions

This is **not** an open-contribution content project.

---

## 🖤 Final Note

This site is intentionally calm, durable, and human-scale — built to outlast platforms, trends, and feeds.

If you’re here: welcome. Also, what are you doing here?

