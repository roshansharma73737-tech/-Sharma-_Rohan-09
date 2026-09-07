/* =========================================================
   FANFARE — TICKET BOOKING HOMEPAGE SCRIPT
   Organised in the same order as the HTML sections it
   controls. Every block starts with a short comment naming
   the HTML element(s) it connects to — see README.md →
   "JavaScript connection guide" for the full walkthrough.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     0. TOAST NOTIFICATIONS
     Connects to: #toastContainer
     Used by almost every feature below to give feedback.
  --------------------------------------------------------- */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast${type === 'error' ? ' toast--error' : ''}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-leaving');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, 3200);
  }

  /* ---------------------------------------------------------
     1. PRELOADER
     Connects to: #preloader
     Hides the loading screen once the page has fully loaded.
  --------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('is-hidden'), 400);
  });
  // Safety net: never trap the user behind the preloader.
  setTimeout(() => preloader.classList.add('is-hidden'), 2500);

  /* ---------------------------------------------------------
     2. NAVBAR — scroll shadow + mobile menu
     Connects to: #navbar, #hamburger, #navLinks
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const backToTop = document.getElementById('backToTop'); // used again in section 16

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
    backToTop.classList.toggle('is-visible', window.scrollY > 480);
  });

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu whenever a nav link is tapped.
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      hamburger.classList.remove('is-active');
    });
  });

  /* ---------------------------------------------------------
     3. THEME TOGGLE (light / dark)
     Connects to: #themeToggle
     NOTE: state is kept in memory only (no localStorage) so
     the demo works inside the Claude.ai artifact sandbox.
     See README.md for how to persist it on a real server.
  --------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  root.setAttribute('data-theme', 'dark');

  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
  });

  /* ---------------------------------------------------------
     4. SEARCH WIDGET — category tabs + form fields
     Connects to: #searchTabs .search-tab, #searchForm
  --------------------------------------------------------- */
  const searchTabs = document.querySelectorAll('.search-tab');
  const searchFields = document.querySelectorAll('.search-form__field');
  const searchForm = document.getElementById('searchForm');
  let activeCategory = 'movies';

  function applySearchCategory(category) {
    activeCategory = category;
    searchTabs.forEach(tab => {
      const isActive = tab.dataset.category === category;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
    searchFields.forEach(field => {
      const shownFor = field.dataset.shownFor.split(',');
      field.style.display = shownFor.includes(category) ? 'flex' : 'none';
    });
  }

  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => applySearchCategory(tab.dataset.category));
  });
  applySearchCategory('movies'); // set the correct fields on first load

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('fDate').value || 'any date';

    let summary;
    if (['bus', 'train', 'flight'].includes(activeCategory)) {
      const from = document.getElementById('fFrom').value || 'anywhere';
      const to = document.getElementById('fTo').value || 'anywhere';
      summary = `Searching ${activeCategory} from ${from} to ${to} on ${date}…`;
    } else {
      const city = document.getElementById('fCity').value || 'your city';
      summary = `Searching ${activeCategory} in ${city} on ${date}…`;
    }
    showToast(summary);
    // Also reflect the search category in the Trending filter below.
    filterTrending(activeCategory === 'movies' || activeCategory === 'events' ? 'all' : activeCategory);
  });

  /* ---------------------------------------------------------
     5. ANIMATED STAT COUNTERS
     Connects to: .stat[data-count] inside the hero ticket stub
  --------------------------------------------------------- */
  const stats = document.querySelectorAll('.stat[data-count]');

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const numEl = el.querySelector('.stat__num');
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      numEl.textContent = value.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  stats.forEach(stat => statObserver.observe(stat));

  /* ---------------------------------------------------------
     6. CATEGORY CARDS — filter the Trending grid below
     Connects to: #categoryGrid .category-card
  --------------------------------------------------------- */
  const categoryCards = document.querySelectorAll('.category-card');
  const trendingLede = document.getElementById('trendingLede');
  const ticketCards = document.querySelectorAll('.ticket-card');

  function filterTrending(category) {
    categoryCards.forEach(card => card.classList.toggle('is-active', card.dataset.category === category));
    ticketCards.forEach(card => {
      const match = category === 'all' || card.dataset.category === category;
      card.classList.toggle('is-hidden', !match);
    });
    trendingLede.textContent = `Filtered by: ${category === 'all' ? 'everything' : category}`;
  }

  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const alreadyActive = card.classList.contains('is-active');
      const next = alreadyActive ? 'all' : card.dataset.category;
      filterTrending(next);
      document.getElementById('trending').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------------------------------------------------------
     7. TRENDING CAROUSEL — prev / next scroll buttons
     Connects to: #prevCard, #nextCard, #trendingTrack
  --------------------------------------------------------- */
  const trendingTrack = document.getElementById('trendingTrack');
  document.getElementById('prevCard').addEventListener('click', () => {
    trendingTrack.scrollBy({ left: -280, behavior: 'smooth' });
  });
  document.getElementById('nextCard').addEventListener('click', () => {
    trendingTrack.scrollBy({ left: 280, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     8. GENERIC MODAL OPEN / CLOSE
     Connects to: any .modal-overlay, [data-close-modal],
     #openLogin, #openSignup, #switchToLogin, #switchToSignup
  --------------------------------------------------------- */
  function openModal(id) {
    document.getElementById(id).classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function closeAllModals() {
    document.querySelectorAll('.modal-overlay.is-open').forEach(m => closeModal(m.id));
  }

  document.getElementById('openLogin').addEventListener('click', () => openModal('loginModal'));
  document.getElementById('openSignup').addEventListener('click', () => openModal('signupModal'));
  document.getElementById('switchToSignup').addEventListener('click', () => { closeModal('loginModal'); openModal('signupModal'); });
  document.getElementById('switchToLogin').addEventListener('click', () => { closeModal('signupModal'); openModal('loginModal'); });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay').id));
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay.id); });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllModals(); });

  /* ---------------------------------------------------------
     9. LOGIN FORM
     Connects to: #loginForm, #loginError
  --------------------------------------------------------- */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    if (!emailPattern.test(email)) { errorEl.textContent = 'Enter a valid email address.'; return; }
    if (password.length < 6) { errorEl.textContent = 'Password must be at least 6 characters.'; return; }

    errorEl.textContent = '';
    closeModal('loginModal');
    showToast(`Welcome back, ${email.split('@')[0]}!`);
    e.target.reset();
  });

  /* ---------------------------------------------------------
     10. SIGNUP FORM
     Connects to: #signupForm, #signupError
  --------------------------------------------------------- */
  document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const errorEl = document.getElementById('signupError');

    if (name.length < 2) { errorEl.textContent = 'Tell us your name.'; return; }
    if (!emailPattern.test(email)) { errorEl.textContent = 'Enter a valid email address.'; return; }
    if (password.length < 6) { errorEl.textContent = 'Password must be at least 6 characters.'; return; }

    errorEl.textContent = '';
    closeModal('signupModal');
    showToast(`Account created — welcome, ${name.split(' ')[0]}!`);
    e.target.reset();
  });

  /* ---------------------------------------------------------
     11. BOOKING MODAL + SEAT MAP
     Connects to: [data-book] buttons on every .ticket-card,
     #bookingModal, #seatMap, #confirmBooking
  --------------------------------------------------------- */
  const bookingModal = document.getElementById('bookingModal');
  const bookingTitle = document.getElementById('bookingTitle');
  const bookingMeta = document.getElementById('bookingMeta');
  const seatMap = document.getElementById('seatMap');
  const seatCountEl = document.getElementById('seatCount');
  const bookingTotalEl = document.getElementById('bookingTotal');
  const confirmBookingBtn = document.getElementById('confirmBooking');

  let currentPrice = 0;
  const TOTAL_SEATS = 32;
  const MAX_SEATS = 8;

  function buildSeatMap() {
    seatMap.innerHTML = '';
    // Roughly 20% of seats start pre-booked by other travellers.
    for (let i = 1; i <= TOTAL_SEATS; i++) {
      const seat = document.createElement('button');
      seat.type = 'button';
      seat.className = 'seat';
      seat.textContent = i;
      if (Math.random() < 0.2) {
        seat.classList.add('seat--taken');
        seat.disabled = true;
      }
      seat.addEventListener('click', () => toggleSeat(seat));
      seatMap.appendChild(seat);
    }
    updateBookingSummary();
  }

  function toggleSeat(seat) {
    const selectedCount = seatMap.querySelectorAll('.seat--selected').length;
    if (!seat.classList.contains('seat--selected') && selectedCount >= MAX_SEATS) {
      showToast(`You can select up to ${MAX_SEATS} seats at a time.`, 'error');
      return;
    }
    seat.classList.toggle('seat--selected');
    updateBookingSummary();
  }

  function updateBookingSummary() {
    const count = seatMap.querySelectorAll('.seat--selected').length;
    seatCountEl.textContent = count;
    bookingTotalEl.textContent = (count * currentPrice).toLocaleString('en-IN');
  }

  document.querySelectorAll('[data-book]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.ticket-card');
      bookingTitle.textContent = card.dataset.title;
      bookingMeta.textContent = card.dataset.meta;
      currentPrice = parseInt(card.dataset.price, 10);
      buildSeatMap();
      openModal('bookingModal');
    });
  });

  confirmBookingBtn.addEventListener('click', () => {
    const count = seatMap.querySelectorAll('.seat--selected').length;
    if (count === 0) {
      showToast('Select at least one seat to continue.', 'error');
      return;
    }
    closeModal('bookingModal');
    showToast(`🎟 Booking confirmed — ${count} seat(s) for "${bookingTitle.textContent}".`);
  });

  /* ---------------------------------------------------------
     12. OFFER CODE — copy to clipboard
     Connects to: [data-copy] buttons in the Offers section
  --------------------------------------------------------- */
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(code);
      } catch (err) {
        // Clipboard API can be blocked in some sandboxed previews;
        // the toast still confirms the code to copy manually.
      }
      showToast(`Code "${code}" copied to clipboard.`);
    });
  });

  /* ---------------------------------------------------------
     13. TESTIMONIAL SLIDER
     Connects to: #testimonialTrack, #testimonialDots
  --------------------------------------------------------- */
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialSlides = testimonialTrack.children;
  const dotsWrap = document.getElementById('testimonialDots');
  let slideIndex = 0;
  let autoplayId;

  for (let i = 0; i < testimonialSlides.length; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }
  const dots = dotsWrap.children;

  function goToSlide(index) {
    slideIndex = (index + testimonialSlides.length) % testimonialSlides.length;
    testimonialTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
    Array.from(dots).forEach((d, i) => d.classList.toggle('is-active', i === slideIndex));
  }

  function startAutoplay() {
    autoplayId = setInterval(() => goToSlide(slideIndex + 1), 6000);
  }
  function stopAutoplay() { clearInterval(autoplayId); }

  const testimonialSlider = document.getElementById('testimonialSlider');
  testimonialSlider.addEventListener('mouseenter', stopAutoplay);
  testimonialSlider.addEventListener('mouseleave', startAutoplay);
  startAutoplay();

  /* ---------------------------------------------------------
     14. FAQ ACCORDION
     Connects to: #accordion .accordion-item
  --------------------------------------------------------- */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const question = item.querySelector('.accordion-item__q');
    const answer = item.querySelector('.accordion-item__a');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close every other item first (classic single-open accordion).
      document.querySelectorAll('.accordion-item.is-open').forEach(openItem => {
        openItem.classList.remove('is-open');
        openItem.querySelector('.accordion-item__a').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------------------------------------------------------
     15. NEWSLETTER FORM
     Connects to: #newsletterForm
  --------------------------------------------------------- */
  document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    if (!emailPattern.test(emailInput.value.trim())) {
      showToast('Enter a valid email address.', 'error');
      return;
    }
    showToast('Subscribed — watch your inbox for fare drops.');
    e.target.reset();
  });

  /* ---------------------------------------------------------
     16. BACK TO TOP
     Connects to: #backToTop (visibility is toggled in the
     navbar scroll listener above)
  --------------------------------------------------------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
