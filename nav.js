/* Header navigation.

   Desktop keeps the CSS-only hover dropdown untouched. Below the header
   breakpoint the same markup becomes a hamburger drawer: the toggle opens the
   nav panel, and the Services group gets its own disclosure button so the
   fourteen service links stay reachable without leaving the drawer.

   The breakpoint lives in one place here and must stay in step with the
   900px step in styles.css. */
(function (document, window) {

  var BREAKPOINT = 900;
  var mq = window.matchMedia('(max-width: ' + BREAKPOINT + 'px)');

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!header || !toggle || !nav) return;

  var drop = header.querySelector('.nav-drop');
  var dropToggle = header.querySelector('.nav-drop__toggle');

  function setDrawer(open) {
    header.classList.toggle('is-nav-open', open);
    document.body.classList.toggle('has-nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  }

  function setDrop(open) {
    if (!drop || !dropToggle) return;
    drop.classList.toggle('is-open', open);
    dropToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function closeAll() {
    setDrawer(false);
    setDrop(false);
  }

  toggle.addEventListener('click', function () {
    setDrawer(toggle.getAttribute('aria-expanded') !== 'true');
  });

  if (dropToggle) {
    dropToggle.addEventListener('click', function () {
      setDrop(dropToggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  /* Following a link inside the drawer navigates, but same-page anchors and
     the booking overlay do not, so the drawer is closed either way. */
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !header.classList.contains('is-nav-open')) return;
    closeAll();
    toggle.focus();
  });

  document.addEventListener('click', function (e) {
    if (!header.classList.contains('is-nav-open')) return;
    if (!e.target.closest('.site-header')) closeAll();
  });

  /* Crossing back into the desktop layout leaves the drawer classes stranded
     on markup that no longer uses them. */
  function onChange() {
    if (!mq.matches) closeAll();
  }
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else mq.addListener(onChange);

}(document, window));
