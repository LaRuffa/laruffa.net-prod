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
  var shell = document.querySelector("[data-shell]");
  if (shell) {
    var body = shell.querySelector(".terminal-body");
    var input = shell.querySelector(".term-input");
    var PROMPT = '<span class="accent">$</span> ';
    var CURSOR = '<span class="cursor"></span>';
    var original = body.innerHTML;
    var base = original.slice(0, original.lastIndexOf(PROMPT));
    var hist = base, locked = false;
    var esc = function (t) {
      return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };
    var render = function () {
      body.innerHTML = hist + (locked ? "" : PROMPT + esc(input.value) + CURSOR);
      body.scrollTop = body.scrollHeight;
    };
    var isEgg = function (cmd) {
      var c = cmd.replace(/^\.\\/, "./").replace(/\\ /g, " ").replace(/["']/g, "").replace(/\s+/g, " ");
      return /^((ba)?sh )?(\.\/)?easter egg$/.test(c) && (c.indexOf("./") === 0 || /^(ba)?sh /.test(c));
    };
    var run = function (cmd) {
      var t = cmd.trim();
      hist += PROMPT + esc(cmd) + "\n";
      if (!t) return render();
      if (t === "ls") {
        hist += "<span class=\"egg-file\">'easter egg'</span>\n";
      } else if (isEgg(t)) {
        hist += "<span class=\"ok\">You found me! Did I do this right?</span>\n";
        locked = true;
        setTimeout(function () { hist = base; locked = false; render(); }, 4000);
      } else {
        hist += "bash: " + esc(t.split(/\s+/)[0]) + ": command not found\n";
      }
      render();
    };
    shell.addEventListener("click", function () {
      if (!window.getSelection().toString()) input.focus({ preventScroll: true });
    });
    input.addEventListener("focus", function () { shell.classList.add("focused"); });
    input.addEventListener("blur", function () { shell.classList.remove("focused"); });
    input.addEventListener("input", function () { if (!locked) render(); });
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
        var v = input.value.replace(/^\.\\/, "./").replace(/\\ /g, " ").replace(/["']/g, "");
        if (v.length >= 2 && "./easter egg".indexOf(v) === 0) {
          input.value = "./easter\\ egg";
          render();
        }
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

  // Fade home-page sections in as they scroll into view. Only top-level sections, never the
  // résumé, so content can't get stuck hidden (or print blank).
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".main > section.section, .main > .stats").forEach(function (n) {
      n.classList.add("reveal");
      io.observe(n);
    });
  }
})();
