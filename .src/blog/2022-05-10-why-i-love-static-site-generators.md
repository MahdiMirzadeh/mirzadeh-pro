<!---
title: Why I Love Static Site Generators
description: A deep dive (as of 2022) into static sites: pros/cons, web bloat, and why I use both GitHub and stagit for my projects.
--->

The web is broken. Not in the "it doesn't work" sense, but in the "we've piled so much abstraction and complexity on top of HTTP that serving a blog post requires a runtime, a database, three CDNs, and a prayer." Static sites are the antidote.

I'm writing after years of watching the web get heavier, slower, and more fragile. Static generation isn't a compromise. It's a philosophy aligned with [suckless](http://suckless.org/philosophy/): clarity, simplicity, and code you can understand.

## The state of the modern web

Let's be honest about what most websites have become:

- **Megabytes of JavaScript** for a page that could be 10KB of HTML. React/Vue/Angular bundles, polyfills, framework runtime, state management, router, ... all before the user sees a single word.
- **Build toolchains** with hundreds of npm dependencies. Webpack, Babel, PostCSS, a plugin for a plugin for a plugin. One breaking change in a transitive dependency and your site won't build.
- **Dynamic backends** running 24/7 to serve content that changes once a month. Database queries, ORM overhead, cache layers, session management, complexity breeding more complexity.
- **Privacy-hostile tracking**. Google Analytics, Facebook pixels, ad networks injecting scripts. Your blog post comes with surveillance.
- **Vendor lock-in**. Hosted CMSs, proprietary APIs, platform-specific features. Move your site? Good luck exporting.

The web wasn't supposed to be this way. HTTP is simple: request a resource, get bytes back. Somewhere we forgot that.

## Why static sites are the right answer

### 1. Simplicity in design and deployment

A static site is just files. HTML, CSS, maybe some images. No application server, no database, no runtime state. Deployment is `rsync -avz out/ server:/var/www/` or `scp -r out/* user@host:/srv/http/`. You can serve it with any HTTP daemon, nginx, lighttpd, even Python's `http.server` for local testing.

Want to move hosts? `tar czf site.tar.gz out/ && scp site.tar.gz newhost:` and you're done. No database dumps, no environment variables, no "we only support Ubuntu 18.04 with these exact package versions."

### 2. Performance that scales

Static files are fast. The server reads bytes from disk (or cache) and writes them to the socket. No interpreting code, no querying databases, no serializing JSON. TTFB is near-instant. Add a CDN and you get global distribution for pennies.

With a dynamic site, every request burns CPU. With static, the work is done once at build time. A Raspberry Pi can serve thousands of requests per second. Try that with WordPress.

### 3. Security through minimalism

No dynamic code means no SQL injection, no RCE through eval(), no auth bypass, no session fixation. The attack surface is the HTTP server (mature, audited, minimal config) and the static files themselves (which you control).

Compare this to a CMS: PHP runtime, database, plugin ecosystem, admin panel, password reset flows, file uploads. Each is a vector. Each gets CVEs. I'd rather not play that game.

### 4. Reproducibility and version control

Your entire site lives in a Git repo: Markdown source, templates, images, build script. The build is deterministic, same inputs produce the same outputs. You can diff changes, bisect bugs, review edits.

Dynamic CMSs store content in databases. Good luck diffing that. Good luck rolling back a change. Good luck knowing who edited what and when without trusting the CMS's audit log (which might not exist).

### 5. No runtime dependencies

Once built, the site has zero runtime dependencies. The generator can break, npm can implode, your language runtime can EOL, doesn't matter. The HTML you shipped keeps working. In 2022 I can still open a static site from 2005 and it renders perfectly. Try running a Rails 2 app from 2008.

### 6. Cost and reliability

Static hosting is cheap. S3 + CloudFront, Netlify, GitHub Pages, a $5 VPS, all works fine. No need for load balancers, no database backups, no autoscaling, no midnight pager because the app crashed.

Reliability is trivial: any file server can serve your site. Origin down? Serve from a mirror. CDN hiccup? Users hit the origin. There's no single point of failure that's a running process.

## The trade-offs (and why they don't bother me)

**"But what about comments?"**
Most comments are spam anyway. If someone has something thoughtful to say, they can email me at [mahdi@mirzadeh.pro](mailto:mahdi@mirzadeh.pro).

**"But what about search?"**
For a small site, client-side search with a JSON index is fine. For a large site, offload to a search engine or use the browser's Ctrl+F. I'm not Google; I don't need real-time indexing.

**"But what about forms?"**
Forms POST to a serverless function or a minimal CGI script. You don't need a full backend for a contact form.

**"But what about admin UI?"**
I edit Markdown in a text editor and run a build script. That's my CMS. It's faster than any web UI and I can use version control.

**"But builds can be slow!"**
Only if you're doing it wrong. My site rebuilds in under a second. Bigger sites can use incremental builds or caching. Worst case, you wait 10 seconds. Compare that to debugging a prod outage at 2am.

## How static generation works (by example)

Here's the pipeline:

```
┌─────────────────────┐
│  Source (Markdown)  │  <-- You write this
│  + Templates (HTML) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Static Generator    │  <-- Runs once, locally or in CI
│ (shell/Go/Rust/etc) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ HTML + CSS + Assets │  <-- Output: plain files
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  HTTP Server        │  <-- nginx, lighttpd, whatever
│  (or CDN)           │
└──────────┬──────────┘
           │
           ▼
       Browser
```

That's it. No databases, no application servers, no session state, no caching layers, no "it works on my machine." Just files on disk and an HTTP daemon.

My site uses a [custom POSIX shell script](https://github.com/mahdimirzadeh/kaveh) (more on that in a future post). The entire build is a script that reads Markdown, applies a template, and writes HTML. Zero dependencies beyond coreutils and a shell. It runs anywhere.

```sh
#!/bin/sh
for md in src/*.md; do
  out="out/$(basename "$md" .md).html"
  # ... markdown to HTML conversion ...
  cat template/header.html > "$out"
  markdown_to_html < "$md" >> "$out"
  cat template/footer.html >> "$out"
done
```

## Why I use both GitHub and stagit for code hosting

I maintain my code in two places:

1. **GitHub** ([github.com/mahdimirzadeh](https://github.com/mahdimirzadeh)): discoverability, PRs, issues, CI.
2. **stagit** ([git.mirzadeh.pro](https://git.mirzadeh.pro)): for a self-hosted, static, JavaScript-free mirror I fully control.

### Why GitHub?

Because it's where people are. If I want contributions, bug reports, or visibility, GitHub is the platform. The network effects are real. The tooling (Actions, code search, blame UI) is good.

But I don't think they are reliable and you shouldn't have a single point of failure, having a static mirror is easy and maintainable.

### Why stagit?

Because I want a copy I control. No JavaScript. No tracking. No "we're sunsetting this feature" or "we're rewriting the UI in React and it's slower now." Just plain HTML generated from my Git repos and served from my domain.

stagit is a static Git page generator by the suckless community. You point it at a bare repo and it spits out HTML: commits, files, refs, blame, diffs. No runtime. No CGI. Pure static pages.

Here's how it works:

```
/srv/git/
  ├── dwm.git/
  ├── st.git/
  ├── dmenu.git/
  └── ...
       │
       │  (on push or cron)
       ▼
   stagit (per repo)  ──────►  /var/www/git/dwm/index.html
                                              log.html
                                              files.html
                                              commit/*.html
       │
       ▼
   stagit-index (all repos)  ─►  /var/www/git/index.html
```

Post-receive hook example (simplified):

```sh
# path=null start=null
#!/bin/sh
GIT_DIR_ROOT="/srv/git"
WWW_ROOT="/var/www/git"

# Rebuild the repo that was just pushed
repo_name=$(basename "$GIT_DIR" .git)
mkdir -p "$WWW_ROOT/$repo_name"
stagit -o "$WWW_ROOT/$repo_name" "$GIT_DIR"

# Rebuild the index (list of all repos)
stagit-index "$GIT_DIR_ROOT"/*.git > "$WWW_ROOT/index.html"
```

That's it. No database. No application server. No session cookies. No JavaScript bundle that breaks when you update a dependency. Just HTML files on disk, served by nginx.

If GitHub goes down, my stagit mirror still works. If GitHub changes their ToS, I still have full control. If I want to grep my commit history, I don't need an API token, I just grep the HTML.

### The git.mirzadeh.pro setup

- Repos: bare Git repos in `/srv/git/*.git`
- Generator: stagit + stagit-index
- Server: nginx serving `/var/www/git/`
- Updates: post-receive hooks + daily cron for safety
- Theme: minimal CSS, no JavaScript, works in Lynx

Every repo is readable in a text browser. Every commit is a permalink. Every file has a raw link. It's fast, it's simple, it's mine.

## The suckless philosophy applied to the web

From [suckless.org/philosophy](http://suckless.org/philosophy/):

> "Focus on simplicity, clarity and frugality. [...] The quality of software is inversely proportional to its complexity."

This applies to websites just as much as to window managers or text editors.

- **Simplicity**: Static files. No runtime. No layers.
- **Clarity**: View source and you see HTML, not a mess of React components and bundler output.
- **Frugality**: Kilobytes, not megabytes. Minimal dependencies, minimal infrastructure.

You don't need a build system with 500 npm packages to serve a blog. You don't need a database to host your Git repos. You don't need JavaScript to render Markdown.

The web has been overengineered into oblivion. Static sites are a return to sanity.

## Dynamic features without bloat

If you absolutely need dynamic behavior:

- **Forms**: POST to a small CGI script or serverless function. Don't run a backend just for a contact form.
- **Comments**: Use a lightweight service or skip them. Email exists.
- **Search**: Client-side with a small JSON index, or link to an external search engine.
- **Analytics**: Self-host something minimal or use nothing. You don't need to know every user's shoe size.
- **Authentication**: If you must, put it in front of the static site (HTTP auth, a reverse proxy) or use a separate minimal backend.

The goal: keep the core static, add dynamics at the edges.

## Closing thoughts

The web is bloated because we've normalized complexity. "Just add another layer of abstraction." "Just install these 200 dependencies." "Just run this daemon."

No.

Static sites are fast, secure, portable, and simple. They respect users' bandwidth and privacy. They don't break when a transitive dependency updates. They don't need a "devops team" to keep them running.

If you're into owning your tools and software that doesn't fight you, try static generation. Write Markdown, run a script, deploy files. That's it.

The web was built on hypertext. Let's get back to that.
