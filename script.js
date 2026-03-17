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
