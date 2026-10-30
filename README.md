# NL (Normal Level) – deploy to GitHub Pages

Pages
- login.html  – sign in / create account
- index.html  – dashboard
- scan.html   – receipt scanner (camera / gallery, review, save)
- common.js, style.css – shared code and styling
- vendor/ – the Supabase library (upload this folder too, keep the folder name)
- manifest.webmanifest + icon files – favicon and home-screen app tile

Steps
1. On github.com create a new public repository, e.g. `nl-app`.
2. Upload ALL files AND the `vendor` folder to the repository root (drag the unzipped folder contents in, including the vendor folder).
3. Settings > Pages > Source: "Deploy from a branch" > Branch `main`, folder `/ (root)` > Save.
4. Your app appears at `https://<your-username>.github.io/nl-app/` in about a minute.
5. In Supabase: Authentication > URL Configuration, set Site URL to that address and add it under Redirect URLs.

On a phone, use "Add to Home Screen" and the NL logo becomes the app tile.
The Supabase URL and publishable key in common.js are safe to publish; row-level security keeps each user's data private.
