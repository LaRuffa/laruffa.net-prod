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

  // Keep "N+ years" current between site rebuilds.
  document.querySelectorAll("[data-years-since]").forEach(function (n) {
    var start = new Date(n.dataset.yearsSince + "T00:00:00");
    var years = Math.floor((Date.now() - start) / (365.25 * 864e5));
    if (years > 0) n.textContent = years + "+";
  });

  // Easter egg: the hero terminal accepts input. Only `ls` and running the file it lists work.
  // Desktop only: on touch screens the pop-up keyboard makes it look like a bug.
  var shell = document.querySelector("[data-shell]");
  var touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  if (shell && touch) {
    shell.removeAttribute("title");
    shell.removeAttribute("data-shell");
    shell.querySelector(".term-input").remove();
    shell = null;
  }
  if (shell) {
    var body = shell.querySelector(".terminal-body");
    var input = shell.querySelector(".term-input");
    var PROMPT = '<span class="accent">$</span> ';
    var CURSOR = '<span class="cursor"></span>';
    var original = body.innerHTML;
    var base = original.slice(0, original.lastIndexOf(PROMPT));
    var locked = false, histEl, lineEl;
    var esc = function (t) {
      return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };
    // History is append-only so only new output animates; the prompt line redraws on each key.
    var setup = function () {
      body.innerHTML = '<span class="term-hist">' + base + '</span><span class="term-line"></span>';
      histEl = body.firstChild;
      lineEl = body.lastChild;
      drawLine();
    };
    var drawLine = function () {
      lineEl.innerHTML = locked ? "" : PROMPT + esc(input.value) + CURSOR;
      body.scrollTop = body.scrollHeight;
    };
    var print = function (html, animate) {
      histEl.insertAdjacentHTML("beforeend", animate ? '<span class="term-out">' + html + "</span>" : html);
    };
    var reset = function () {
      body.classList.add("fading");
      setTimeout(function () { locked = false; setup(); body.classList.remove("fading"); }, reduce ? 0 : 350);
    };
    var typeOut = function (text, done) {
      var span = document.createElement("span");
      span.className = "ok";
      histEl.appendChild(span);
      if (reduce) { span.textContent = text; return done(); }
      var n = 0;
      (function step() {
        span.textContent = text.slice(0, ++n);
        body.scrollTop = body.scrollHeight;
        if (n < text.length) setTimeout(step, 32); else done();
      })();
    };
    setup();
    var FILE = "easter-egg.sh";
    // Treat Windows-style ".\" like "./", drop quotes, collapse spaces.
    var norm = function (t) {
      return t.replace(/^\.\\/, "./").replace(/["']/g, "").replace(/\s+/g, " ").trim();
    };
    var run = function (cmd) {
      var t = norm(cmd), word = t.split(" ")[0], arg = t.split(" ")[1];
      print(PROMPT + esc(cmd) + "\n");
      if (!t) return drawLine();
      if (/^ls( -[a-zA-Z]+| \.\/?| ~\/?)*$/.test(t)) {
        print('<span class="egg-file">' + FILE + "</span>\n", true);
      } else if (t === "./" + FILE || /^(ba)?sh (\.\/)?easter-egg\.sh$/.test(t)) {
        locked = true;
        drawLine();
        return typeOut("You found me! Did I do this right?", function () { setTimeout(reset, 2800); });
      } else if (/^(ba)?sh$/.test(word) && arg) {
        print(word + ": " + esc(arg) + ": No such file or directory\n", true);
      } else if (/[\/\\]/.test(word)) {
        print("bash: " + esc(word) + ": No such file or directory\n", true);
      } else {
        print("bash: " + esc(word) + ": command not found\n", true);
      }
      drawLine();
    };
    // Tab-complete the file name in the last word, like bash.
    var complete = function (value) {
      var m = value.match(/^(.*?)(\S*)$/), before = m[1], last = norm(m[2]);
      if (last.length >= 2 && ("./" + FILE).indexOf(last) === 0) return before + "./" + FILE;
      if (before.trim() && last && FILE.indexOf(last) === 0) return before + FILE;
      return value;
    };
    shell.addEventListener("click", function () {
      if (!window.getSelection().toString()) input.focus({ preventScroll: true });
    });
    input.addEventListener("focus", function () { shell.classList.add("focused"); });
    input.addEventListener("blur", function () { shell.classList.remove("focused"); });
    input.addEventListener("input", function () { if (!locked) drawLine(); });
    input.addEventListener("keydown", function (e) {
      if (locked) { e.preventDefault(); return; }
      if (e.key === "Enter") {
        e.preventDefault();
        var cmd = input.value;
        input.value = "";
        run(cmd);
      } else if (e.key === "Tab") {
        // Keep Tab in the terminal like a real shell (Esc leaves). Complete the file name.
        e.preventDefault();
        input.value = complete(input.value);
        drawLine();
      } else if (e.key === "Escape") {
        input.blur();
      }
    });
  }

  window.addEventListener("beforeprint", function () {
    document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("in"); });
  });

  // Let visitors know a mailto link hands off to their email app.
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
    if (!a.title) a.title = "Opens your email app";
  });

  // Count a stat up from zero, keeping its suffix ("+") and thousands separators.
  var countUp = function (el) {
    var m = el.textContent.trim().match(/^([\d,]+)(.*)$/);
    if (!m) return;
    var target = parseInt(m[1].replace(/,/g, ""), 10), comma = m[1].indexOf(",") > -1, t0 = null;
    var fmt = function (v) { return (comma ? v.toLocaleString("en-US") : String(v)) + m[2]; };
    el.textContent = fmt(0);
    requestAnimationFrame(function tick(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / 1400, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    });
  };

  // Ease home-page sections in as they scroll into view, their cards and rows one after another.
  // Only top-level sections, never the résumé, so content can't get stuck hidden (or print blank).
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        e.target.querySelectorAll(".stat-value").forEach(countUp);
        io.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".main > section.section, .main > .stats").forEach(function (n) {
      n.classList.add("reveal");
      n.querySelectorAll(".stat, .timeline-item, .skill-grid > .card, .lab-grid > .card, .cert").forEach(function (c, i) {
        c.classList.add("rv-child");
        c.style.setProperty("--i", Math.min(i, 8));
      });
      io.observe(n);
    });
  }
})();
