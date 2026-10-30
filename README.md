# NL (Normal Level) – deploy to GitHub Pages

Pages
- login.html  – split sign-in / create-account page with the image panel
- index.html  – dashboard (sidebar, "left to live on", category cards, debts, savings goals)
- scan.html   – receipt scanner (live camera, review, saved summary)
- common.js, style.css – shared code and styling
- login-art.jpg, icon-*.png, favicon-64.png, apple-touch-icon.png, manifest.webmanifest – image and app-tile files
- vendor/ – the Supabase library (optional; the pages fall back to the internet copy if it is missing)

Steps
1. In your GitHub repository, upload ALL files from this folder (replace the old ones).
2. Settings > Pages > Source: "Deploy from a branch" > `main` > `/ (root)` > Save.
3. Open `https://<your-username>.github.io/<repo>/login.html`.
4. In Supabase: Authentication > URL Configuration, set Site URL to the address above (without login.html) and add it under Redirect URLs.

The camera needs the https address GitHub Pages gives you; the browser will ask for permission.
The Supabase URL and publishable key in common.js are safe to publish; row-level security keeps each user's data private.
