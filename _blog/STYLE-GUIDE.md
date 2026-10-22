# Darksoft Blog: style guide and publishing checklist

The blog lives at `/blog/`, with each post at `/blog/<slug>/`. Posts are Markdown
files with front matter, so they move to any static site generator unchanged.
This folder starts with `_`, so the site build ignores it.

- `_drafts/` holds unpublished posts. They show only in a local preview run with `--drafts`.
- `_posts/` holds published posts, named `YYYY-MM-DD-slug.md`.
- `_blog/inbox/` is for raw text (.txt or pasted) waiting to be converted. It is ignored by the build.
- `assets/blog/` holds post images.

## Front matter

```yaml
---
title: "The Story Behind “Day By Day”"        # required. Shown as the h1. Keep it under ~60 characters.
subtitle: "One line that sells the post."    # recommended. Shown under the title and on cards.
description: "One or two sentences for search results and link previews."
                                             # optional. Falls back to the subtitle, then the first paragraph.
date: 2026-10-22 10:00:00 -0400              # required for _drafts; _posts get it from the filename too
last_modified_at: 2026-11-01                 # optional. Add when a post gets a real update.
image: /assets/blog/slug.jpg                 # header photo, also used for link previews
image_alt: "What the photo shows"            # required whenever there is an image
image_caption: "Photo: ..."                  # optional; Markdown allowed
tags: [behind the songs, Rationalism]        # 1–3 tags, from the list below when possible
featured: true                               # optional. Featured posts lead the blog home (up to 3).
sidebar: [listen, newsletter, shows]         # optional. Order of the sidebar blocks.
---
```

Defaults (in `_config.yml`): the `post` layout, the URL `/blog/:title/`, `og:type article`,
and the sidebar `[listen, newsletter, shows]`.

### Sidebar blocks

Pick the three that fit the post best, in order of importance:

| Block | Shows | Good for |
|---|---|---|
| `listen` | Spotify, Apple Music, Bandcamp and YouTube Music buttons | song stories, releases |
| `newsletter` | signup form with the free booklet | every post; first or second on most |
| `shows` | link to /shows/ and Bandsintown | tour diaries, live posts, announcements |
| `merch` | link to /merch/ and Bandcamp | vinyl/CD news, studio and gear posts |
| `support` | link to /support/ | studio, process, personal posts |

### Tags

Lowercase for topics, title case for names. Reuse existing tags before making new ones.
Starting set: `news`, `behind the songs`, `recording`, `gear`, `music videos`, `live`,
and album names (`Everydayness`, `Rationalism`, ...).

## Voice and copy

- Byline is always "Darksoft". Never use a personal name.
- First person ("I") is fine, as on the Production page.
- Don't describe Darksoft as a local band, and don't add new location references.
- Short paragraphs (2–4 sentences). Use `##` subheads every few paragraphs; never `#` (the title is the only h1).
- Plain words, no hype.
- Don't invent facts. Check dates, track details and credits against `_data/`.

## Links

- Link the first mention of each album to `/discography/<album>/` and each song to `/lyrics/<album>/<song>/`.
- Use site-relative links for pages on this site (`/shows/`), full URLs for everything else.
- External links open in a new tab automatically. No extra markup needed.
- Streaming links: use the artist or track URLs from `_data/streaming.yml` and `_data/tracks.yml`.
- Link text says where it goes ("the Day By Day lyrics"), never "click here".

## Images

1. Put them in `assets/blog/`, named `<post-slug>.jpg` (header) or `<post-slug>-<n>.jpg`.
2. Resize to at most 1600 px wide and save as JPEG at quality 75–80. Aim for under 400 KB.
3. Strip all metadata (EXIF, XMP, GPS, camera serials) and keep the color profile:
   `exiftool -all= -tagsfromfile @ -icc_profile -overwrite_original assets/blog/<file>.jpg`
4. Check that nothing is left: `exiftool -a -G1 <file>` should list only file and image basics.
5. Header photos are cropped to 16:9, so keep the subject near the center.
6. In-post images:

   ```markdown
   ![What the photo shows](/assets/blog/slug-2.jpg)
   ```

   Add a caption as an italic line right after the image.

## Converting raw text into a post (checklist)

1. Read the whole source text. Keep the author's words and voice and fix only typos, grammar and flow.
2. Write the title, subtitle and description. If none was given, suggest options.
3. Pick a slug: short, lowercase, hyphenated (`the-story-behind-day-by-day`).
4. Break the text into short paragraphs with `##` subheads.
5. Add links as described under Links. Verify every URL.
6. Prepare the images as described under Images.
7. Choose 1–3 tags and the sidebar blocks.
8. Save to `_drafts/<slug>.md` and preview it with `--drafts`.
9. Check the result at phone and desktop widths, the link preview image and the title length.
10. Publish only after approval: move the file to `_posts/YYYY-MM-DD-<slug>.md` (the date is the publish date), then commit and push.
