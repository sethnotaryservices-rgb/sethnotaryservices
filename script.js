(function () {
  // Load reviews: try live Netlify function first, then fall back to reviews.json (SEO: noscript has fallback)
  var container = document.getElementById('reviews-container');
  if (!container) return;

  function renderReviews(data) {
    var reviews = data.reviews || [];
    if (reviews.length === 0) return;
    container.innerHTML = '';
    reviews.forEach(function (review) {
      var stars = '';
      for (var i = 0; i < (review.rating || 5); i++) stars += '<span class="review-star" aria-hidden="true">★</span>';
      var card = document.createElement('article');
      card.className = 'review-card';
      card.setAttribute('itemscope', '');
      card.setAttribute('itemtype', 'https://schema.org/Review');
      card.innerHTML =
        '<div class="review-stars" aria-label="' + (review.rating || 5) + ' out of 5 stars">' + stars + '</div>' +
        '<blockquote class="review-text" itemprop="reviewBody"><p>' + escapeHtml(review.text || '') + '</p></blockquote>' +
        '<footer class="review-author">' +
        '<cite itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">' + escapeHtml(review.author || 'Client') + '</span></cite>' +
        '<span class="review-source"> — ' + escapeHtml(review.source || 'Google') + ' Review</span></footer>';
      container.appendChild(card);
    });
  }
  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  // Try live API (Netlify function) first, then static JSON
  fetch('/.netlify/functions/get-reviews')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data.reviews && data.reviews.length > 0) renderReviews(data);
      else return fetch('reviews.json').then(function (r) { return r.ok ? r.json() : Promise.reject(); });
    })
    .then(function (data) {
      if (data && data.reviews && data.reviews.length > 0) renderReviews(data);
    })
    .catch(function () {
      fetch('reviews.json')
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(renderReviews)
        .catch(function () {});
    });
})();
(function () {
  // Header contrast: original cream over blue, navy over cream
  var header = document.querySelector('.header');
  var sections = document.querySelectorAll('[data-bg]');
  function setHeaderContrast() {
    if (!header || !sections.length) return;
    var y = window.scrollY + header.offsetHeight;
    var current = null;
    sections.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var elTop = rect.top + window.scrollY;
      var elBottom = elTop + rect.height;
      if (elTop <= y && y <= elBottom) current = el;
    });
    if (!current) {
      sections.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var elTop = rect.top + window.scrollY;
        if (elTop <= y) current = el;
      });
      if (!current) current = sections[0];
    }
    var bg = current.getAttribute('data-bg');
    header.classList.toggle('header--over-light', bg === 'dark');
  }
  setHeaderContrast();
  window.addEventListener('scroll', function () { setHeaderContrast(); }, { passive: true });
  window.addEventListener('resize', setHeaderContrast);
})();
(function () {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      var target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.remove('section-navigated');
        target.offsetHeight;
        target.classList.add('section-navigated');
        window.setTimeout(function () { target.classList.remove('section-navigated'); }, 2200);
      }
    });
  });

  // Quote form submit (no backend – show message or open mailto)
  var form = document.querySelector('.quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]').value;
      var phone = form.querySelector('[name="phone"]').value;
      var email = form.querySelector('[name="email"]').value;
      var message = form.querySelector('[name="message"]').value;
      var subject = 'Quote Request';
      var body = 'Name: ' + name + '\nPhone: ' + phone + '\nEmail: ' + email + '\n\nMessage:\n' + message;
      var mailto = 'mailto:Sethnotaryservices@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
    });
  }
})();
