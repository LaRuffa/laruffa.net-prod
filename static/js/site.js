(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Rotate through the hero taglines like someone typing them.
  var el = document.querySelector(".typed");
  if (el && !reduce) {
    var words = (el.dataset.words || "").split("|").filter(Boolean);
    var w = 0, i = words[0] ? words[0].length : 0, deleting = true;
    el.textContent = words[0] || el.textContent;
    setTimeout(function tick() {
      var word = words[w];
      i += deleting ? -1 : 1;
      el.textContent = word.slice(0, i);
      var delay = deleting ? 35 : 70;
      if (!deleting && i === word.length) { deleting = true; delay = 2200; }
      else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    }, 2200);
  }

  // Let visitors know a mailto link hands off to their email app.
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
    if (!a.title) a.title = "Opens your email app";
  });

  // Fade sections in as they scroll into view.
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".section, .stats, .card, .timeline-item").forEach(function (n) {
      n.classList.add("reveal");
      io.observe(n);
    });
  }
})();
