/* Boulevard Self-Booking overlay.

   Loads the Boulevard injector once per page, then opens the overlay from any
   element carrying `data-blvd-book`. Two optional attributes narrow where the
   overlay lands, matching Boulevard's `urlParams`:

     data-blvd-path        deep link to a service or category, e.g.
                           "/cart/menu/Contrast Therapy/s_<service-id>"
     data-blvd-visit-type  "SELF_VISIT" or "GROUP_VISIT"

   Neither is set anywhere yet — the service ids come out of the Boulevard
   dashboard — so every button currently opens the overlay at its menu. */
(function (document) {

  var config = {
    businessId: '605d9300-a1cb-49d9-9c9c-6cc301f908da',
  };

  var loaded = false;
  var queued = null;

  function argsFor(el) {
    var urlParams = {};
    var path = el.getAttribute('data-blvd-path');
    var visitType = el.getAttribute('data-blvd-visit-type');

    if (path) urlParams.path = path;
    if (visitType) urlParams.visitType = visitType;

    return path || visitType ? { urlParams: urlParams } : undefined;
  }

  function open(args) {
    /* A click can land before the injector has finished loading. Hold it and
       replay it on load rather than dropping it. */
    if (!loaded) {
      queued = { args: args };
      return;
    }
    window.blvd.openBookingWidget(args);
  }

  document.addEventListener('click', function (event) {
    var el = event.target.closest && event.target.closest('[data-blvd-book]');
    if (!el) return;

    event.preventDefault();
    open(argsFor(el));
  });

  var script = document.createElement('script');
  var first = document.querySelector('script');

  script.src = 'https://static.joinboulevard.com/injector.min.js';
  script.async = true;
  script.onload = function () {
    blvd.init(config);
    loaded = true;

    if (queued) {
      open(queued.args);
      queued = null;
    }
  };

  if (first && first.parentNode) {
    first.parentNode.insertBefore(script, first);
  } else {
    document.head.appendChild(script);
  }

})(document);
