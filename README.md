# FanFare — Ticket Booking Homepage (Front End Only)

A single home page for a ticket booking product (movies, events, bus, train, flight), built with **plain HTML5, CSS3 and vanilla JavaScript** — no frameworks, no build step. Open the file and it runs.

This is a **front end only** demo: every "booking," "login," and "search" you see is simulated in the browser with toast notifications. There is no server, database, or payment processor behind it. The README below tells you exactly where to plug those in later.

```
ticket-booking/
├── index.html   → structure & content (every section, every button)
├── style.css    → all visual design, theming and animation
├── script.js    → all interactivity (what happens when you click)
└── README.md    → you are here
```

## 1. How to run it

1. Download all three files (`index.html`, `style.css`, `script.js`) into the **same folder**. They must sit side by side — `index.html` loads the other two with relative paths (`href="style.css"`, `src="script.js"`).
2. Double‑click `index.html`, or drag it into a browser tab.
3. That's it — no `npm install`, no server. Everything runs client-side.

For a nicer local workflow (auto-refresh on save), you can optionally serve the folder with any static server, e.g. `npx serve .` or the VS Code "Live Server" extension — but it isn't required.

---

## 2. What's on the page (output overview)

Scrolling top to bottom, the home page contains:

| # | Section | What it shows |
|---|---------|----------------|
| 1 | **Preloader** | A short "printing your tickets…" animation while the page loads, then fades out. |
| 2 | **Navbar** | Logo, page-jump links, a light/dark theme toggle, Log in / Sign up buttons, and a hamburger menu on mobile. |
| 3 | **Hero** | A large graphic styled as a literal admission ticket (dashed perforation with chasing marquee lights) containing the headline, a multi-category **search widget**, and live stat counters. |
| 4 | **Categories** | 5 clickable ticket-stub cards: Movies, Events, Bus, Train, Flight. |
| 5 | **Trending** | A horizontally scrolling row of 8 bookable listings, each with a **Book now** button. |
| 6 | **How it works** | A 3-step explanation: Search & compare → Choose your seat → Confirm & go. |
| 7 | **Offers** | 3 promo codes, each with a **Copy** button. |
| 8 | **Testimonials** | An auto-playing quote slider with dot navigation. |
| 9 | **FAQ** | A 4-question accordion. |
| 10 | **Newsletter** | An email signup form. |
| 11 | **Footer** | Link columns and copyright. |
| 12 | **Floating extras** | A "back to top" button (appears after scrolling) and a toast notification stack (top-right) used across the whole page. |
| 13 | **Modals** (hidden until triggered) | Log in, Sign up, and a full **seat-selection booking** modal with a live seat map and price total. |

---

## 3. Every functional button on the home page

This is the full list of interactive elements and exactly what each one does. (IDs/classes in brackets are how you'll find them in the code.)

| Button / control | Location | What happens when you use it |
|---|---|---|
| **Theme toggle** `#themeToggle` | Navbar | Switches the whole page between dark and light color themes instantly. |
| **Hamburger** `#hamburger` | Navbar (mobile) | Slides the navigation menu in/out from the right. |
| **Log in** `#openLogin` | Navbar | Opens the Log in modal. |
| **Sign up** `#openSignup` | Navbar | Opens the Sign up modal. |
| **Search tabs** `.search-tab` | Hero | Switches the search form between Movies / Events / Bus / Train / Flight, showing only the relevant input fields for that category. |
| **Search** button `.search-form__submit` | Hero | Validates nothing is required, builds a plain-English summary of your search, shows it as a toast, and filters the Trending section to match. |
| **Category cards** `.category-card` (×5) | Categories | Filters the Trending grid below to that category only; click the same card again to show everything. Scrolls you down to see the results. |
| **Carousel ‹ ›** `#prevCard` / `#nextCard` | Trending | Scrolls the trending row left/right by one card width, smoothly. |
| **Book now** `[data-book]` (×8) | Each trending card | Opens the Booking modal pre-filled with that listing's name and price, and generates a fresh random seat map. |
| **Copy** `[data-copy]` (×3) | Offers | Copies the promo code to your clipboard and confirms with a toast. |
| **Testimonial dots** `.testimonial-dots button` | Testimonials | Jumps straight to that quote. The slider also auto-advances every 6 seconds and pauses while your mouse is over it. |
| **FAQ questions** `.accordion-item__q` (×4) | FAQ | Expands that answer and collapses any other open answer (only one open at a time). |
| **Get alerts** (newsletter form) `#newsletterForm` | Newsletter | Validates the email format, then confirms subscription with a toast. |
| **Log in form** `#loginForm` | Log in modal | Validates email format + password length, then closes the modal and welcomes the user by name. |
| **Sign up form** `#signupForm` | Sign up modal | Validates name/email/password, then closes the modal and confirms account creation. |
| **"Create an account" / "Log in" links** | Inside the modals | Swaps between the Log in and Sign up modals without a page reload. |
| **Seats** `.seat` (32 per booking) | Booking modal | Click to select/deselect a seat (max 8 at once). Already-booked seats are dashed and disabled. The seat count and total price update live. |
| **Confirm booking** `#confirmBooking` | Booking modal | Requires at least one seat selected, then closes the modal and shows a booking-confirmed toast with the seat count. |
| **Modal close (×) / overlay click / Esc key** | Any modal | All three close the currently open modal. |
| **Back to top** `#backToTop` | Bottom-right, floating | Appears once you scroll past the hero; smooth-scrolls you back to the top. |

---

## 4. JavaScript connection guide — how a button "does something"

Every interactive element follows the **same three-step pattern**. Once you understand it for one button, you can wire up any new one.

### The pattern

```html
<!-- 1. HTML: give the element something unique to grab onto -->
<button id="openLogin" type="button">Log in</button>
```

```js
// 2. JavaScript: grab it by that same id
const openLoginBtn = document.getElementById('openLogin');

// 3. Tell it what to do when the user interacts with it
openLoginBtn.addEventListener('click', () => {
  openModal('loginModal');
});
```

That's the whole connection: **HTML gives an element an `id` (or a `data-*` attribute) → JavaScript finds it with `document.getElementById()` / `document.querySelectorAll()` → `addEventListener()` runs a function when the user clicks, submits, types, etc.**

All the code in `script.js` is wrapped in one listener so it only runs once the page has finished loading:

```js
document.addEventListener('DOMContentLoaded', () => {
  // ...every connection below lives inside here...
});
```

### Worked example 1 — a single button (theme toggle)

```html
<button class="theme-toggle" id="themeToggle">…sun/moon icons…</button>
```
```js
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next); // CSS reacts to this attribute — see section 5
});
```
One id, one listener, one line of logic. This is the simplest possible connection.

### Worked example 2 — a group of repeated buttons (Book now)

When you have *many* similar buttons (8 "Book now" buttons, one per card), you don't give each one its own id. Instead you give them all the same `data-*` marker and loop over them:

```html
<article class="ticket-card" data-title="Nightfall Protocol" data-price="299" data-meta="Sci-Fi · IMAX 2D · 2h 18m">
  ...
  <button data-book>Book now</button>
</article>
```
```js
document.querySelectorAll('[data-book]').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.ticket-card');       // find the parent card
    bookingTitle.textContent = card.dataset.title;   // read its data-* attributes
    currentPrice = parseInt(card.dataset.price, 10);
    buildSeatMap();
    openModal('bookingModal');
  });
});
```
`card.dataset.title` reads the HTML attribute `data-title="Nightfall Protocol"`. This is how the same booking modal can show different content depending on which card you clicked — the data lives in the HTML, and JavaScript just reads it.

### Worked example 3 — a form (newsletter)

```html
<form id="newsletterForm">
  <input type="email" id="newsletterEmail" required>
  <button type="submit">Get alerts</button>
</form>
```
```js
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();               // stop the page from reloading (default form behaviour)
  const email = document.getElementById('newsletterEmail').value.trim();
  if (!emailPattern.test(email)) { showToast('Enter a valid email address.', 'error'); return; }
  showToast('Subscribed — watch your inbox for fare drops.');
  e.target.reset();                 // clear the input
});
```
`e.preventDefault()` is the key line for every form in this project — without it, submitting a form reloads the whole page.

### How to add your own connected button

1. In `index.html`, add your element with a unique `id="myButton"`.
2. In `script.js`, inside the existing `document.addEventListener('DOMContentLoaded', ...)` block, add:
   ```js
   document.getElementById('myButton').addEventListener('click', () => {
     // your logic here
     showToast('It worked!');
   });
   ```
3. Reload the page in your browser — no build step needed.

### Connecting these buttons to a real back end

Right now every "success" (`showToast(...)`) is just a simulation. To make it real:

- **Search** → inside the `searchForm` submit handler, replace the `showToast(...)` call with a `fetch('/api/search?...')` request and render real results.
- **Log in / Sign up** → inside `loginForm` / `signupForm` submit handlers, `POST` the values to your auth endpoint (`fetch('/api/login', { method:'POST', body: JSON.stringify({email, password}) })`) instead of showing a toast directly.
- **Confirm booking** → in `confirmBookingBtn`'s click handler, send the selected seat numbers, `bookingTitle`, and total price to your booking/payment endpoint before showing the confirmation toast.
- **Theme + login state** → this demo intentionally avoids `localStorage` (Claude.ai's built-in preview sandbox blocks it). If you're running the files on your own site/server, you can freely add `localStorage.setItem('theme', next)` in the theme toggle and read it back on load — same idea for "remember me" logins.

---

## 5. CSS3 connection guide — how the styling actually works with the page

### 5.1 Every element is styled by matching its class or id

`style.css` never styles raw tags like `div` or `button` on their own (except a few resets at the top) — it targets the **class names written in the HTML**, in the same left-to-right order as the sections in `index.html`:

```html
<button class="btn btn--primary search-form__submit" type="submit">Search</button>
```
```css
.btn          { /* base look shared by every button on the page */ }
.btn--primary { /* the amber "primary action" color, layered on top */ }
```
A single element can carry several classes at once — this is intentional. `.btn` gives every button the same shape, padding and transition; `.btn--primary`, `.btn--ghost`, `.btn--small`, `.btn--tiny` and `.btn--block` are small **modifier** classes that each change one thing (color, size, or width) without repeating the shared rules. Mix and match them in the HTML to get new button styles without writing new CSS.

### 5.2 CSS custom properties (variables) drive the whole theme

Right at the top of `style.css`:
```css
:root{
  --bg: #0F1226;
  --surface: #171B39;
  --amber: #FFB100;
  --text: #F5F3EE;
  ...
}
```
Every color used anywhere on the page is written as `var(--amber)`, `var(--bg)`, etc. — never a hard-coded hex value inside a component's own rules. This is what makes theming possible: a second block

```css
[data-theme="light"]{
  --bg: #F3F2FB;
  --surface: #FFFFFF;
  --amber: #D98A00;
  ...
}
```
**redefines the same variable names** for a lighter palette. When `script.js` runs `root.setAttribute('data-theme','light')`, nothing about individual components changes — the variables they already reference simply resolve to different values, and every color on the page updates at once. This is the CSS half of the theme-toggle connection described in section 4.

> **To restyle the whole site**, change the hex values inside `:root{ }` and `[data-theme="light"]{ }`. You never need to touch the 400+ lines below them.

### 5.3 JavaScript toggles classes; CSS defines what those classes look like

JavaScript almost never sets styles directly (`element.style.color = ...`). Instead it adds or removes a small "state" class, and CSS already has a rule ready for that class:

| Class JS toggles | Added when… | What the matching CSS rule does |
|---|---|---|
| `.is-open` | a modal or the mobile menu is opened | fades/slides it into view (`.modal-overlay.is-open`, `.nav-links.is-open`) |
| `.is-active` | a search tab / category card is selected | highlights it in amber (`.search-tab.is-active`, `.category-card.is-active`) |
| `.is-scrolled` | the page scrolls past 12px | gives the navbar a blurred background (`.navbar.is-scrolled`) |
| `.is-hidden` | a trending card doesn't match the active filter | `display:none`s it (`.ticket-card.is-hidden`) |
| `.is-visible` | you scroll past the hero | fades in the "back to top" button |
| `.seat--selected` / `.seat--taken` | you click a seat / it's randomly pre-booked | recolors that seat (amber vs. dashed/faded) |

This separation is deliberate: **HTML holds structure, CSS holds appearance, JavaScript only flips switches.** If you want to change what "selected" looks like, you only ever edit `.seat--selected` in `style.css` — you never have to touch `script.js`.

### 5.4 The signature "ticket" look, explained

The hero and every card are shaped like a real admission ticket using two small CSS techniques you can reuse anywhere:

- **Perforation / notch cut-outs**: a small circle the same color as the page background is placed with `::before` / `::after` on top of a dashed border, so it looks like a semicircle has been "punched" out of the edge (`.ticket__perforation::before/::after`, `.category-card__notch`).
- **Marquee chase lights**: six tiny dots (`.bulb`) sit along that dashed line, each with the *same* `animation` but a different `animation-delay` (`.2s` apart), so the amber glow appears to travel down the line rather than blinking in unison.

### 5.5 Animations at a glance

| Animation | Defined in | Triggered by |
|---|---|---|
| `ticketPulse` | preloader | runs automatically while the preloader is visible |
| `ticketDrop` | `.ticket--hero` | plays once, on page load |
| `bulbChase` | `.bulb` (×6, staggered) | runs continuously — the one deliberate "always-on" animation on the page |
| `toastIn` / `toastOut` | `.toast` | fires every time `showToast()` is called from JS |
| transitions on `transform`/`box-shadow` | buttons, cards, modals | fire on `:hover`, or when JS adds/removes `.is-open` / `.is-active` |
| `max-height` transition | `.accordion-item__a` | fires when JS opens/closes an FAQ item |

Everything outside of the marquee bulbs is **response to a user action** (hover, click, scroll) rather than looping in the background — this keeps the page calm instead of busy. `@media (prefers-reduced-motion: reduce)` near the bottom of the file shortens every animation/transition to near-zero for anyone whose OS asks for reduced motion.

### 5.6 Layout & responsiveness

- Layout is done with **Flexbox** (rows of buttons, card content) and **CSS Grid** (`.category-grid`, `.how-strip`, `.footer__inner`, `.seat-map`) — search each file for `display:grid` / `display:flex` to see exactly which.
- Two breakpoints handle smaller screens:
  - `@media (max-width:920px)` — turns the horizontal nav into a slide-in panel, stacks the hero ticket vertically, and reduces grid columns.
  - `@media (max-width:600px)` — further stacks the footer and newsletter into single columns and shrinks the seat map to 6 columns.
- The whole page uses relative units (`clamp()`, `%`, `fr`, `vw`) for headline sizes and grids, so it scales smoothly between the two breakpoints rather than jumping.

### 5.7 Fonts

Two Google Fonts are loaded in the `<head>` of `index.html`:
- **Bebas Neue** — the condensed display face used only for headlines, the ticket price, and stat numbers (`--font-display`).
- **Space Grotesk** — the body/UI face used for everything else (`--font-body`).

To swap either, change the `<link>` in `index.html` and the matching `--font-display` / `--font-body` value in `style.css`.

---

## 6. Customizing the content

All booking listings, offers, testimonials and FAQ text live directly in `index.html` — there is no separate data file. To add a 9th trending listing, copy one `<article class="ticket-card">…</article>` block, change its `data-title`, `data-price`, `data-meta`, `data-category` and visible text, and it will automatically pick up the carousel, filtering, and booking-modal behaviour with zero JavaScript changes.

## 7. Browser support

Built with standard, widely-supported CSS3 and ES6+ JavaScript (`const`/`let`, arrow functions, template literals, `IntersectionObserver`, the Clipboard API). Works in current versions of Chrome, Edge, Firefox and Safari. The Clipboard API "Copy code" button has a silent fallback if a browser blocks it — the toast still tells the user the code to copy manually.
