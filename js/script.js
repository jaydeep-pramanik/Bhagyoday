/* ========================================
   BHAGYODAY RESTAURANT & HOTEL CLASSIC
   Multi-Page Website — script.js
   ======================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initActiveNav();
    initHeader();
    initHamburger();
    initScrollReveal();
    initCounters();
    initMenuFilter();
    initGalleryFilter();
    initLightbox();
    initReviewSlider();
    initFAQ();
    initReservationForm();
    initContactForm();
    initBackToTop();
    initBookingType();
    initAnchorScroll();
  });

  /* ========== ACTIVE NAV (by current page filename) ========== */
  function initActiveNav() {
    var page = document.body.getAttribute('data-page');
    if (!page) return;
    document.querySelectorAll('.nav-link[data-page]').forEach(function (link) {
      if (link.getAttribute('data-page') === page) {
        link.classList.add('active');
      }
    });
  }

  /* ========== STICKY HEADER ========== */
  function initHeader() {
    var header = document.getElementById('header');
    if (!header) return;
    if (header.classList.contains('scrolled-static')) return;
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ========== HAMBURGER MENU ========== */
  function initHamburger() {
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav');
    if (!hamburger || !nav) return;
    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ========== SCROLL REVEAL ========== */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    var heroEls = document.querySelectorAll('.reveal-hero');

    heroEls.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('visible'); }, 200 + i * 150);
    });

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });

    var grids = document.querySelectorAll('.why-grid, .dishes-grid, .rooms-grid, .facilities-grid, .qf-grid, .values-grid, .reviews-grid, .quick-ct-grid');
    grids.forEach(function (grid) {
      grid.querySelectorAll('.reveal').forEach(function (child, i) {
        child.style.transitionDelay = (i * 0.06) + 's';
      });
    });
  }

  /* ========== ANIMATED COUNTERS ========== */
  var countersStarted = false;
  function initCounters() {
    var statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    if (!('IntersectionObserver' in window)) { startCounters(); return; }
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        startCounters();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }
  function startCounters() {
    document.querySelectorAll('.stat-num').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var isDecimal = el.getAttribute('data-decimal') === 'true';
      var duration = 2000;
      var startTime = null;
      function animate(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(target * eased);
        el.textContent = isDecimal ? (current / 10).toFixed(1) : current.toLocaleString();
        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = isDecimal ? (target / 10).toFixed(1) : target.toLocaleString();
      }
      requestAnimationFrame(animate);
    });
  }

  /* ========== MENU FILTER ========== */
  function initMenuFilter() {
    var catBtns = document.querySelectorAll('.cat-btn');
    var dishes = document.querySelectorAll('#dishesGrid .dish-card');
    if (!catBtns.length || !dishes.length) return;
    catBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        catBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-cat');
        dishes.forEach(function (dish) {
          dish.classList.toggle('hidden', cat !== 'all' && dish.getAttribute('data-cat') !== cat);
        });
      });
    });
  }

  /* ========== GALLERY FILTER ========== */
  function initGalleryFilter() {
    var galBtns = document.querySelectorAll('.gal-btn');
    var galItems = document.querySelectorAll('#galleryGrid .gal-item');
    if (!galBtns.length || !galItems.length) return;
    galBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        galBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var gal = btn.getAttribute('data-gal');
        galItems.forEach(function (item) {
          item.classList.toggle('hidden', gal !== 'all' && item.getAttribute('data-gal') !== gal);
        });
      });
    });
  }

  /* ========== LIGHTBOX ========== */
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lbClose = document.getElementById('lbClose');
    var lbOverlay = document.getElementById('lightboxOverlay');
    var lbCaption = document.getElementById('lbCaption');
    if (!lightbox) return;
    document.querySelectorAll('#galleryGrid .gal-item').forEach(function (item) {
      item.addEventListener('click', function () {
        if (lbCaption) {
          var p = item.querySelector('.gal-info p');
          lbCaption.textContent = p ? p.textContent : '';
        }
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeLb() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
    if (lbClose) lbClose.addEventListener('click', closeLb);
    if (lbOverlay) lbOverlay.addEventListener('click', closeLb);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  }

  /* ========== REVIEW SLIDER ========== */
  function initReviewSlider() {
    var slider = document.getElementById('reviewSlider');
    var dotsContainer = document.getElementById('sliderDots');
    var prevBtn = document.getElementById('sliderPrev');
    var nextBtn = document.getElementById('sliderNext');
    if (!slider) return;
    var slides = slider.querySelectorAll('.review-slide');
    var current = 0;
    var autoInterval = null;
    if (dotsContainer) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', function () { goTo(i); resetAuto(); });
        dotsContainer.appendChild(dot);
      });
    }
    function goTo(index) {
      slides[current].classList.remove('active');
      if (dotsContainer) {
        var dots = dotsContainer.querySelectorAll('.slider-dot');
        if (dots[current]) dots[current].classList.remove('active');
      }
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dotsContainer) {
        var dots = dotsContainer.querySelectorAll('.slider-dot');
        if (dots[current]) dots[current].classList.add('active');
      }
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });
    function startAuto() { autoInterval = setInterval(function () { goTo(current + 1); }, 5000); }
    function resetAuto() { clearInterval(autoInterval); startAuto(); }
    startAuto();
  }

  /* ========== FAQ ========== */
  function initFAQ() {
    document.querySelectorAll('.faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var answer = btn.nextElementSibling;
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        var list = btn.closest('.faq-list');
        if (list) {
          list.querySelectorAll('.faq-q').forEach(function (other) {
            if (other !== btn) {
              other.setAttribute('aria-expanded', 'false');
              var ans = other.nextElementSibling;
              if (ans) ans.classList.remove('open');
            }
          });
        }
        btn.setAttribute('aria-expanded', String(!isOpen));
        if (answer) answer.classList.toggle('open', !isOpen);
      });
    });
  }

  /* ========== RESERVATION FORM ========== */
  function initReservationForm() {
    var form = document.getElementById('reservationForm');
    var success = document.getElementById('resSuccess');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('resName');
      var phone = document.getElementById('resPhone');
      var guests = document.getElementById('resGuests');
      var email = document.getElementById('resEmail');
      var date = document.getElementById('resDate');
      var valid = true;
      clearErr('nameErr'); clearErr('phoneErr'); clearErr('guestsErr'); clearErr('emailErr'); clearErr('dateErr');
      if (!name || name.value.trim().length < 2) { showErr('nameErr', 'Please enter your full name.'); valid = false; }
      if (!phone || !/^[0-9\+\s\-]{8,15}$/.test(phone.value.trim())) { showErr('phoneErr', 'Please enter a valid phone number.'); valid = false; }
      if (!guests || !guests.value) { showErr('guestsErr', 'Please select number of guests.'); valid = false; }
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showErr('emailErr', 'Please enter a valid email.'); valid = false; }
      if (!date || !date.value) { showErr('dateErr', 'Please select a date.'); valid = false; }
      if (valid && success) { success.classList.add('visible'); form.reset(); setTimeout(function () { success.classList.remove('visible'); }, 5000); }
    });
  }

  /* ========== CONTACT FORM ========== */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    var success = document.getElementById('contactSuccess');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ctName = document.getElementById('ctName');
      var ctPhone = document.getElementById('ctPhone');
      var ctMsg = document.getElementById('ctMsg');
      var valid = true;
      if (!ctName || ctName.value.trim().length < 2) valid = false;
      if (!ctPhone || !/^[0-9\+\s\-]{8,15}$/.test(ctPhone.value.trim())) valid = false;
      if (!ctMsg || ctMsg.value.trim().length < 5) valid = false;
      if (valid && success) { success.classList.add('visible'); form.reset(); setTimeout(function () { success.classList.remove('visible'); }, 5000); }
    });
  }

  /* ========== BACK TO TOP ========== */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () { btn.classList.toggle('visible', window.scrollY > 400); }, { passive: true });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ========== BOOKING TYPE ========== */
  function initBookingType() {
    document.querySelectorAll('.type-btns').forEach(function (group) {
      group.querySelectorAll('.type-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          group.querySelectorAll('.type-btn').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
        });
      });
    });
  }

  /* ========== ANCHOR SCROLL (for #reservation hash on contact page) ========== */
  function initAnchorScroll() {
    if (window.location.hash) {
      var target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(function () {
          var headerH = document.getElementById('header') ? document.getElementById('header').offsetHeight : 72;
          var top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }, 300);
      }
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#' || href.length <= 1) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var headerH = document.getElementById('header') ? document.getElementById('header').offsetHeight : 72;
        var top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ========== HELPERS ========== */
  function showErr(id, msg) { var el = document.getElementById(id); if (el) el.textContent = msg; }
  function clearErr(id) { var el = document.getElementById(id); if (el) el.textContent = ''; }

})();
