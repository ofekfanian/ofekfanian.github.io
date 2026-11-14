# Ofek Fanian · Portfolio

One-page personal site: plain HTML, CSS and a little JavaScript. No build step, no dependencies.

```
index.html       page content (all text lives here)
styles.css       layout, light/dark theme, responsive rules
script.js        theme toggle, mobile menu, scroll reveal, SpotOn screen tabs, count-up
favicon.svg      tab icon
og-image.png     1200×630 preview image shown when the link is shared on LinkedIn/WhatsApp
assets/img/      app screenshots (WebP), taken from each project's GitHub repo
assets/icons/    technology logos (Devicon, MIT licence)
```

## Run it locally

```bash
cd ~/Documents/Personal/portfolio
python3 -m http.server 4173
```

Open http://localhost:4173. (Opening `index.html` directly also works.)

## Deploy

Both options below are free and serve the folder as-is. Pick one.

### Live site

Live at **https://ofekfanian.com** (also https://www.ofekfanian.com). Hosted on GitHub Pages: repo `ofekfanian/ofekfanian.github.io`, branch `main`, root folder.
The domain is registered at Cloudflare (renews yearly). Its DNS has four `A` records for `@` (185.199.108.153, .109.153, .110.153, .111.153) and a `CNAME` for `www` pointing to `ofekfanian.github.io`, all set to **DNS only** (grey cloud). The `CNAME` file in this folder tells GitHub Pages which domain to serve; keep it.

To update the site, commit and push: Pages redeploys within a minute or two.

```bash
cd ~/Documents/Personal/portfolio
git add . && git commit -m "Update site" && git push
```

### Option A: GitHub Pages → `https://ofekfanian.github.io`

1. On GitHub, create a **public** repo named exactly `ofekfanian.github.io` (no README, so it is empty).
2. Push this folder:

   ```bash
   cd ~/Documents/Personal/portfolio
   git init -b main
   git add .
   git commit -m "Personal portfolio site"
   git remote add origin https://github.com/ofekfanian/ofekfanian.github.io.git
   git push -u origin main
   ```

   Or, with the GitHub CLI, steps 1 and 2 in one go:

   ```bash
   cd ~/Documents/Personal/portfolio && git init -b main && git add . && git commit -m "Personal portfolio site" && gh repo create ofekfanian.github.io --public --source=. --push
   ```

3. Repo → **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main` / `(root)` → Save.
4. Wait a minute, then open https://ofekfanian.github.io.

Every later `git push` redeploys automatically.

### Option B: Vercel → `https://<name>.vercel.app`

1. Push the folder to any GitHub repo (step 2 above, with a repo name such as `portfolio`).
2. Go to https://vercel.com → sign in with GitHub → **Add New → Project** → import the repo.
3. Framework preset: **Other**. Leave build command and output directory empty → **Deploy**.
4. Optional: Project → Settings → Domains to rename the `*.vercel.app` address.

Every later `git push` redeploys automatically.

### Custom domain (optional, either host)

Already set up for `ofekfanian.com` (see *Live site*). To change it, update the `CNAME` file, the two `og:` URLs at the top of `index.html`, GitHub **Settings → Pages → Custom domain**, and the DNS records.

## After it's live

- Add the link to the CV header and to LinkedIn: **Edit intro → Website**, and to the **Featured** section.
- Paste the link into https://www.linkedin.com/post-inspector/ to check the preview card.

## Editing content

All text is in `index.html`. Each project is one `<article class="tile">` block: copy one to add a new project (`tile--half` for half width, `tile--wide` for full width). Put new screenshots in `assets/img/` as `.webp`, about 420px wide for phone screens.
