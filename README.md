# Pineview website

Static site with no build step. Open `index.html` in a browser, or upload the whole folder to any host (Netlify, Cloudflare Pages, GitHub Pages, cPanel, etc.).

```
index.html      Home
services.html   All services, anchored: #roofing #gutters #siding #painting #packages #lighting
about.html      About
gallery.html    Photo gallery (filterable)
contact.html    Free-estimate form
assets/css/styles.css   All styles. Brand colors are at the top (:root)
assets/js/main.js       Menu, gallery filter, form handling
assets/img/             Logos used on the site and favicons
assets/brand/           The full original logo kit
```

## Brand colors (from the logo)
Brown `#8B5E3C`, black `#000000`, gray `#777777`, and white. Other colors in `styles.css` are tints or shades of these.

## Common edits

**Add a photo.** Each gray striped box is a `photo-slot` with a comment inside it. Put your image in `assets/img/photos/` and replace the comment with:
```html
<img src="assets/img/photos/roof-post-falls.jpg" alt="New architectural shingle roof on a two-story home in Post Falls" loading="lazy">
```
The placeholder label disappears on its own. Write alt text that describes what's in the photo.

**Add reviews.** Search for `customer review` in `index.html` and `about.html`. Only use real reviews.

**Remove editor notes.** Search for `editor-note` and delete those lines (Services and About pages) once you've filled them in.

**Service-area towns.** Search for `town-list` in `index.html`.

**Legal line.** The "operated by Brycen Does Roofs LLC" line is commented out in each page's footer. Search for `LEGAL LINE` to turn it on.

**Header and footer.** These are repeated on all 5 pages. To change the phone number or email, use find-and-replace across all `.html` files.

**Domain.** The site is set to `https://pineviewnw.com` (canonical and og tags).

## The estimate form
Until you connect a form service, submitting the form opens the visitor's email app with the request filled in and addressed to you.

To receive submissions directly, create a form with a service like Formspree, Basin, or Getform. Then paste its URL into `FORM_ENDPOINT` at the top of `assets/js/main.js`. On Netlify, you can instead add `data-netlify="true"` to the `<form>`.

Service links can pre-check boxes on the form, for example `contact.html?service=roofing` or `contact.html?service=permanent-lighting`.
