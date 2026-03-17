This repo is the source code of Seth Notary Services.

I am changing to version2.

---

## Google Reviews & SEO

The site has a **Reviews** section that shows positive Google-style reviews with SEO-friendly copy (keywords: notary public, mobile notary, loan signing agent, Tracy, Stockton, San Joaquin, etc.).

### Updating reviews (current setup)

- Edit **`reviews.json`** with real client names, ratings, and review text. Redeploy on Netlify to update the live site.
- In **`index.html`** (and `seth-notary-page.html`), update the JSON-LD script: set `ratingCount` and the `review` array to match your real Google rating so search engines can show stars in results.

### Live Google reviews on Netlify (www.sethnotaryservices.com)

The site can show **live** Google reviews when you configure the following:

1. **Get your Google Place ID** — Use the [Place ID finder](https://developers.google.com/maps/documentation/places/web-service/place-id) and search for "Seth Notary Services LLC Tracy". The Place ID is a long string (e.g. `ChIJ...`).
2. **Enable Places API (New) and create an API key** — In [Google Cloud Console](https://console.cloud.google.com/): enable **Places API (New)**, then create an API key. Reviews use [Place Details pricing](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ent-plus-sku).
3. **Set env vars in Netlify** — Site configuration → Environment variables: add `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID`. Then trigger a new deploy.
4. **Deploy** — The function at `netlify/functions/get-reviews.js` is called by the frontend; if it returns reviews they show, else the site uses **`reviews.json`**.

**Alternative (no API):** Use a widget ([Elfsight](https://elfsight.com/google-reviews-widget/), [EmbedSocial](https://embedsocial.com/products/embed-reviews/), [Trustindex](https://www.trustindex.io/)) and add their embed in the reviews section.

**Review link:** `https://g.page/r/CSJb0MtvqIeOEBM/review`
