# Developer website — updated bilingual version

Static website built with HTML, CSS, Tailwind CDN and vanilla JavaScript.

## Files
- `index.html` — homepage
- `services.html` — service cards, tech stack and USD price calculator
- `contacts.html` — contact form
- `assets/style.css` — shared styles and responsive service-card styles
- `assets/main.js` — language switching, calculator and form behavior

## What changed
- English is the default language on a fresh visit; the selected language is saved in `localStorage`.
- The language switcher is on the far right of the navbar; desktop navigation is centered.
- Portfolio has been removed from the navigation and the `portfolio.html` page has been removed.
- Services & Pricing includes three service categories and a technology stack.
- Calculator prices are in USD and use budget-friendly example rates. Quantity is a number input from 1 to 15.

## Before publishing
1. Test both languages on every page, including the calculator and the order-to-contact flow.
2. Confirm your Web3Forms access key is configured in `contacts.html` before relying on contact-form submissions.
3. Tailwind is loaded from a CDN, so the page needs an internet connection to load Tailwind styles.

Open `index.html` locally or use VS Code Live Server to test.

## Calculator behavior update
- Service name and quantity field are center-aligned.
- Quantity is shown only for multi-page websites (1–15 pages).
- Landing pages, scripts/automation, and code fixes use a fixed base rate; irrelevant page-count controls are hidden.
- Responsive layout, SEO, rush delivery, and micro-animations are offered for website projects; scripts and code fixes show only rush delivery.
- All calculator amounts are formatted with a leading `$` and remain in USD.
