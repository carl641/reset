/* Services ticker.

   The bar hides its overflow, which still leaves it a scroll container: tab to
   a name that has travelled off the right edge and the browser scrolls the bar
   to reveal it. While that link holds focus the behaviour is exactly right —
   the CSS pauses the travel so the name can be read — but the offset would
   otherwise stay behind after focus moves on, sliding the row out of its frame
   for everyone else. So the bar returns to its own geometry on the way out.

   Under prefers-reduced-motion the bar is not a marquee at all but a row the
   reader scrolls themselves, and their scroll position is theirs to keep. */
(function (document, window) {

  var ticker = document.querySelector('.ticker');
  var viewport = document.querySelector('.ticker__viewport');
  if (!ticker || !viewport) return;

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  ticker.addEventListener('focusout', function (e) {
    if (calm.matches) return;
    if (e.relatedTarget && ticker.contains(e.relatedTarget)) return;
    viewport.scrollLeft = 0;
  });

}(document, window));
