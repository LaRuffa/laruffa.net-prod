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
    var FILE = "easter-egg.sh";
    // Treat Windows-style ".\" like "./", drop quotes, collapse spaces.
    var norm = function (t) {
      return t.replace(/^\.\\/, "./").replace(/["']/g, "").replace(/\s+/g, " ").trim();
    };
    var run = function (cmd) {
      var t = norm(cmd), word = t.split(" ")[0], arg = t.split(" ")[1];
      hist += PROMPT + esc(cmd) + "\n";
      if (!t) return render();
      if (/^ls( -[a-zA-Z]+| \.\/?| ~\/?)*$/.test(t)) {
        hist += '<span class="egg-file">' + FILE + "</span>\n";
      } else if (t === "./" + FILE || /^(ba)?sh (\.\/)?easter-egg\.sh$/.test(t)) {
        hist += '<span class="ok">You found me! Did I do this right?</span>\n';
        locked = true;
        setTimeout(function () { hist = base; locked = false; render(); }, 4000);
      } else if (/^(ba)?sh$/.test(word) && arg) {
        hist += word + ": " + esc(arg) + ": No such file or directory\n";
      } else if (/[\/\\]/.test(word)) {
        hist += "bash: " + esc(word) + ": No such file or directory\n";
      } else {
        hist += "bash: " + esc(word) + ": command not found\n";
      }
      render();
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
        input.value = complete(input.value);
        render();
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
