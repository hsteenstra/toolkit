/* =========================================================
   CODE FOR ME — Bring Coding to Your School toolkit
   Builds a plan from the form answers. Everything stays in
   the visitor's browser.
   ========================================================= */

(function () {
  "use strict";

  var form = document.getElementById("tk-form");
  if (!form) return;

  var STORE_KEY = "cfm-toolkit-answers";
  var CHECKS_KEY = "cfm-toolkit-checks";

  /* ---------- Real Code For ME resources ---------- */

  var TOOLS = {
    kids: {
      name: "Code For ME Kids",
      desc: "Snap blocks together, watch them turn into real Python, and steer your own robot. 19 lessons.",
      url: "https://hsteenstra.github.io/codeformekids/",
      price: "Free",
      color: "sun",
      letter: "block-based lessons that turn into real Python"
    },
    playground: {
      name: "The Free Playground",
      desc: "After the lessons, students design their own mazes and remix games.",
      url: "https://hsteenstra.github.io/codeformekids/playground.html",
      price: "Free",
      color: "sun",
      letter: "a playground where students design their own mazes and games"
    },
    posters: {
      name: "Classroom posters",
      desc: "Free printable posters that explain big ideas like variables. Hang them in your room.",
      url: "index.html#start",
      price: "Free",
      color: "coral",
      letter: "free printable posters for the classroom"
    },
    workbook: {
      name: "Intro to Python Workbook",
      desc: "73 pages and 13 topics: print, variables, loops, turtle art, and games. Read it, try every example.",
      url: "https://hsteenstra.github.io/workbook/",
      price: "Free",
      color: "mint",
      letter: "a 73-page Python workbook that students work through at their own pace"
    },
    sandbox: {
      name: "Python Sandbox",
      desc: "Write code, press Run, see it work. Runs in any browser, even school Chromebooks.",
      url: "https://hsteenstra.github.io/sandbox/",
      price: "Free",
      color: "grape",
      letter: "an online Python editor that runs in the browser"
    },
    tracer: {
      name: "Python Tracer",
      desc: "Step through code one line at a time and watch every variable change. Great for \"why did it do that?\"",
      url: "tracer.html",
      price: "Free",
      color: "grape",
      letter: "a visual tool that shows students what their code does, step by step"
    },
    codecourse: {
      name: "CodeCourse",
      desc: "Six levels of real Python with an editor built in. Students finish with a capstone project.",
      url: "learn.html",
      price: "Free",
      color: "accent",
      letter: "a six-level online Python course that ends in a capstone project"
    },
    teacherwb: {
      name: "Teacher Workbook",
      desc: "The answer-key edition of the Workbook, for checking students' work.",
      url: "https://hsteenstra.github.io/teacherworksheet/",
      price: "Free",
      color: "coral",
      letter: "a teacher edition with all the answers"
    },
    textbook: {
      name: "5-Day Python Textbook",
      desc: "Day-by-day lessons and activities for a week-long camp, written for teachers who have never coded.",
      url: "https://payhip.com/CodeForME",
      price: "$10 PDF",
      color: "accent",
      letter: "day-by-day camp lessons and activities ($10 as a PDF)"
    },
    web: {
      name: "Teach It. Code It. Build It!",
      desc: "A handbook for learning HTML and CSS by building a real website.",
      url: "https://payhip.com/CodeForME",
      price: "Paid book",
      color: "mint",
      letter: "a handbook for building a first website with HTML and CSS"
    }
  };

  var LABELS = {
    grades: { k5: "K–5", "68": "6–8", "912": "9–12" },
    format: {
      club: "after-school coding club",
      class: "coding unit",
      camp: "week-long coding camp",
      taster: "one-hour coding taster"
    },
    devices: {
      chromebooks: "Chromebooks",
      laptops: "laptops or desktops",
      tablets: "iPads or tablets",
      none: "whatever devices we can borrow"
    }
  };

  /* ---------- Helpers ---------- */

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function readStore(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (e) { return null; }
  }

  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }

  function answers() {
    var a = {};
    ["role", "grades", "format", "devices", "experience"].forEach(function (n) {
      var el = form.querySelector('input[name="' + n + '"]:checked');
      a[n] = el ? el.value : "";
    });
    a.school = form.elements.school.value.trim();
    a.name = form.elements.name.value.trim();
    return a;
  }

  function restore() {
    var saved = readStore(STORE_KEY);
    if (!saved) return;
    Object.keys(saved).forEach(function (n) {
      if (n === "school" || n === "name") {
        if (form.elements[n]) form.elements[n].value = saved[n] || "";
        return;
      }
      var el = form.querySelector('input[name="' + n + '"][value="' + saved[n] + '"]');
      if (el) el.checked = true;
    });
  }

  /* ---------- Which tools? ---------- */

  function pickTools(a) {
    var list;
    if (a.grades === "k5") {
      list = ["kids", "playground", "posters"];
    } else if (a.grades === "68") {
      list = ["kids", "workbook", "sandbox", "tracer"];
      if (a.experience !== "none" && a.format !== "taster") list.splice(0, 1);
    } else {
      list = ["workbook", "sandbox", "codecourse", "tracer"];
      if (a.format === "club" || a.format === "class") list.push("web");
    }
    if (a.grades !== "k5") {
      if (a.format === "camp") list.unshift("textbook");
      if (a.experience !== "lots" || a.role === "leader") list.push("teacherwb");
    }
    if (a.format === "taster") list = list.slice(0, 2);
    return list;
  }

  function notes(a) {
    var out = [];
    if (a.devices === "none") {
      out.push({ tone: "sun", title: "Short on devices?", text: "Start with a computer lab or a borrowed cart once a week. Students can read the Workbook on paper between sessions, and pairs can share one device: one types, one helps." });
    }
    if (a.devices === "tablets") {
      out.push({ tone: "mint", title: "Using tablets", text: a.grades === "k5"
        ? "Block coding works well with touch screens, so tablets are a great fit for Code For ME Kids."
        : "Everything runs in the web browser. Typing Python is much easier with a keyboard, so pair tablets with keyboards if you can." });
    }
    if (a.grades === "k5" && a.format === "camp") {
      out.push({ tone: "grape", title: "Planning a K–5 camp", text: "The 5-Day Textbook is written for ages 12 and up, so use a few Code For ME Kids lessons each day instead." });
    }
    if (a.experience === "none") {
      out.push({ tone: "coral", title: "New to coding yourself?", text: "That's normal. Spend 30 minutes trying the free tools below before you start. You only need to stay one lesson ahead of your students." });
    }
    return out;
  }

  /* ---------- Timeline ---------- */

  function timeline(a, tools) {
    var first = TOOLS[tools[0]].name;
    var practice = a.grades === "k5" ? "Code For ME Kids lessons" : "the Workbook in the Python Sandbox";
    var debug = a.grades === "k5" ? "Let students show each other their robots and explain how they work." : "When code does something surprising, paste it into the Python Tracer and step through it together.";
    var checkIT = "Ask IT to check that codeforme.org, hsteenstra.github.io and cdn.jsdelivr.net load on student devices.";

    if (a.format === "club") {
      return {
        title: "Your 8-week club timeline",
        sub: "One meeting a week, about an hour each.",
        phases: [
          { when: "2 weeks before", title: "Get ready", items: ["Spend 30 minutes trying " + first + " yourself.", "Pick a day, time and room.", checkIT, "Send a sign-up note home to families."] },
          { when: "Weeks 1–2", title: "First meetings", items: ["Start everyone on " + first + ".", "Work in pairs: one types, one helps. Switch every 10 minutes.", "End each meeting with two minutes of show-and-tell."] },
          { when: "Weeks 3–6", title: "Build skills", items: ["Keep going with " + practice + ".", debug, "Let fast finishers move on to the next tool in your plan."] },
          { when: "Weeks 7–8", title: "Project showcase", items: ["Each student or pair builds one project of their own.", "Invite families or another class to see what they made."] }
        ]
      };
    }
    if (a.format === "class") {
      return {
        title: "Your 3-week unit timeline",
        sub: "About three lessons a week, using regular class time.",
        phases: [
          { when: "Before the unit", title: "Get ready", items: ["Spend 30 minutes trying " + first + " yourself.", checkIT, "Bookmark the links on student devices or post them in your class page."] },
          { when: "Week 1", title: "What is code?", items: ["Start with " + first + ".", "Talk about where code shows up in everyday life: games, phones, traffic lights.", "Pair students so no one gets stuck alone."] },
          { when: "Week 2", title: "Practice", items: ["Continue with " + practice + ".", debug] },
          { when: "Week 3", title: "Mini project", items: ["Students make something small of their own.", "Finish with a gallery walk where students try each other's projects."] }
        ]
      };
    }
    if (a.format === "camp") {
      var daily = a.grades === "k5"
        ? ["Day 1: First Code For ME Kids lessons.", "Days 2–3: A few new lessons each day.", "Day 4: Students design games in the Playground.", "Day 5: Showcase for families."]
        : ["Days 1–4: Follow the textbook's day-by-day lessons.", "Use the Python Sandbox for every activity.", "Day 5: Students present their projects to families."];
      return {
        title: "Your 5-day camp timeline",
        sub: "A week of mornings or afternoons, about 2–3 hours a day.",
        phases: [
          { when: "1 month before", title: "Plan it", items: [a.grades === "k5" ? "Choose which Code For ME Kids lessons to do each day." : "Get the 5-Day Python Textbook and read Day 1.", "Book a room and pick your dates.", "Open sign-ups for students."] },
          { when: "1 week before", title: "Get ready", items: [checkIT, "Try Day 1's activities yourself.", "Print name tags and any handouts."] },
          { when: "Camp week", title: "Run it", items: daily },
          { when: "After camp", title: "Keep it going", items: ["Send families the links so students can keep coding at home.", "Ask students what they'd like to learn next."] }
        ]
      };
    }
    return {
      title: "Your one-hour taster plan",
      sub: "A single session to see if students love it.",
      phases: [
        { when: "Before", title: "Get ready", items: ["Spend 20 minutes trying " + first + " yourself.", checkIT] },
        { when: "0:00–0:10", title: "Welcome", items: ["Ask: \"Where have you seen code today?\"", "Show one short example and what it does."] },
        { when: "0:10–0:45", title: "Hands on", items: ["Everyone starts " + first + ".", "Pairs help each other before asking an adult."] },
        { when: "0:45–1:00", title: "Share and next steps", items: ["A few students show what they made.", "Send home the links so they can keep going."] }
      ]
    };
  }

  /* ---------- Letter ---------- */

  function letter(a, tools) {
    var school = a.school || "[School name]";
    var me = a.name || "[Your name]";
    var grades = LABELS.grades[a.grades];
    var format = LABELS.format[a.format];
    var toolLines = tools.map(function (t) { return "  - " + TOOLS[t].name + ": " + TOOLS[t].letter; }).join("\n");
    var cost = tools.indexOf("textbook") > -1
      ? "- It's nearly free. The online tools cost nothing. The optional textbook is $10 as a PDF."
      : "- It's free. Every tool above costs nothing.";
    var devices = a.devices === "chromebooks" ? ", including our Chromebooks" : "";
    var ask = {
      club: "A room and an after-school time slot once a week for about 8 weeks.",
      class: "Time for a 2–3 week coding unit in class.",
      camp: "A room and five days to run a week-long camp.",
      taster: "One hour to run a coding session for students."
    }[a.format];

    var body = [];
    if (a.role === "leader") {
      body.push("Hi everyone,", "");
      body.push("I'd love for " + school + " to offer a " + format + " for students in grades " + grades + ", and I'm looking for someone to help lead it. No coding experience is needed.");
      body.push("");
      body.push("We'd use Code For ME (www.codeforme.org), a free program made in Maine with coding lessons for students and teachers:");
      body.push(toolLines, "");
      body.push("Why it's easy to say yes:");
      body.push(cost);
      body.push("- Nothing to install. Everything runs in a web browser" + devices + ", and students don't need accounts.");
      body.push("- The lessons are step by step, and there's a teacher edition with all the answers.");
      body.push("");
      body.push("If you're curious, reply to this message or stop by. I'll make sure you have time and support to try it.");
      body.push("", "Thank you,", me);
      return body.join("\n");
    }

    var who = { teacher: "a teacher", parent: "a parent of a student", student: "a student" }[a.role] || "a member of our school community";
    body.push("Dear [Principal's name],", "");
    body.push("My name is " + me + ", and I'm " + who + " at " + school + ". I'd like to start a " + format + " for students in grades " + grades + ".");
    body.push("");
    body.push("We can do this using Code For ME (www.codeforme.org), a free program made in Maine with coding lessons for students and teachers. Here's what we'd use:");
    body.push(toolLines, "");
    body.push("Why it's a good fit for our school:");
    body.push(cost);
    body.push("- Nothing to install. Everything runs in a web browser" + devices + ", and students don't need accounts.");
    if (a.experience === "none") body.push("- No coding background is needed to lead it. The lessons are step by step, with a teacher edition that has every answer.");
    else body.push("- The lessons are step by step, so students can work at their own pace.");
    body.push("- Coding builds problem-solving, persistence and teamwork, skills that help in every subject.");
    body.push("");
    body.push("What I'm asking for:");
    body.push("- " + ask);
    body.push("- Help from IT to make sure codeforme.org, hsteenstra.github.io and cdn.jsdelivr.net load on student devices.");
    if (a.devices === "none") body.push("- Access to a computer lab or device cart for those sessions.");
    if (a.role === "student") body.push("- A teacher or staff member who could help supervise.");
    body.push("");
    body.push("I'd be glad to talk more about it. Thank you for considering it!");
    body.push("", "Sincerely,", me);
    return body.join("\n");
  }

  /* ---------- Checklist ---------- */

  function checklist(a) {
    var when = { club: "Pick a day, time and room", class: "Pick the weeks for your unit", camp: "Book a room and pick camp dates", taster: "Pick a date for your session" }[a.format];
    var items = [
      { id: "try", text: "Try the first tool yourself" },
      { id: "letter", text: a.role === "leader" ? "Send the message to your staff" : "Send the letter to your principal" },
      { id: "it", text: "Check that the sites load on student devices" },
      { id: "when", text: when },
      { id: "tell", text: "Tell students and families" },
      { id: "links", text: "Bookmark or post the links for students" },
      { id: "first", text: "Run your first session" },
      { id: "share", text: "Tell Code For ME how it went", link: "mailto:codeformaine@gmail.com?subject=" + encodeURIComponent("How our coding " + (a.format === "class" ? "unit" : a.format) + " went") }
    ];
    if (a.format === "camp" && a.grades !== "k5") items.splice(1, 0, { id: "book", text: "Get the 5-Day Python Textbook", link: "https://payhip.com/CodeForME" });
    return items;
  }

  /* ---------- Render ---------- */

  var els = {
    title: document.getElementById("tk-plan-title"),
    summary: document.getElementById("tk-plan-summary"),
    notes: document.getElementById("tk-notes"),
    tools: document.getElementById("tk-tools"),
    tlTitle: document.getElementById("tk-timeline-title"),
    tlSub: document.getElementById("tk-timeline-sub"),
    timeline: document.getElementById("tk-timeline"),
    letterTitle: document.getElementById("tk-letter-title"),
    letter: document.getElementById("tk-letter"),
    letterReset: document.getElementById("tk-letter-reset"),
    copy: document.getElementById("tk-copy"),
    email: document.getElementById("tk-email"),
    checks: document.getElementById("tk-checks"),
    progressFill: document.getElementById("tk-progress-fill"),
    progressLabel: document.getElementById("tk-progress-label"),
    contact: document.getElementById("tk-contact"),
    print: document.getElementById("tk-print")
  };

  var generatedLetter = "";
  var letterEdited = false;

  function render() {
    var a = answers();
    writeStore(STORE_KEY, a);
    var tools = pickTools(a);

    var formatName = { club: "coding club", class: "coding unit", camp: "coding camp", taster: "coding taster" }[a.format];
    els.title.textContent = (a.school ? a.school + "'s " : "Your ") + formatName + " plan";
    els.summary.textContent = "A " + LABELS.format[a.format] + " for grades " + LABELS.grades[a.grades] + ", on " + LABELS.devices[a.devices] + ".";

    els.notes.innerHTML = notes(a).map(function (n) {
      return '<div class="tk-note" style="--c: var(--' + n.tone + '); --c-soft: var(--' + n.tone + '-soft)"><strong>' + esc(n.title) + "</strong><p>" + esc(n.text) + "</p></div>";
    }).join("");

    els.tools.innerHTML = tools.map(function (id, i) {
      var t = TOOLS[id];
      var ext = /^https?:/.test(t.url);
      var c = t.color === "accent" ? "accent" : t.color;
      return '<a class="tk-tool" href="' + esc(t.url) + '"' + (ext ? ' target="_blank" rel="noreferrer"' : "") +
        ' style="--c: var(--' + c + '); --c-soft: var(--' + (c === "accent" ? "accent-light" : c + "-soft") + ')">' +
        '<span class="tk-tool-top"><span class="tk-tool-step">' + (i + 1) + "</span>" +
        (i === 0 ? '<span class="tk-tool-start">Start here</span>' : "") +
        '<span class="tk-tool-price">' + esc(t.price) + "</span></span>" +
        "<strong>" + esc(t.name) + "</strong>" +
        "<span class=\"tk-tool-desc\">" + esc(t.desc) + "</span>" +
        '<span class="tk-tool-go">Open <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
        "</a>";
    }).join("");

    var tl = timeline(a, tools);
    els.tlTitle.textContent = tl.title;
    els.tlSub.textContent = tl.sub;
    els.timeline.innerHTML = tl.phases.map(function (p) {
      return '<li class="tk-phase"><span class="tk-phase-when">' + esc(p.when) + "</span>" +
        "<div class=\"tk-phase-card\"><h4>" + esc(p.title) + "</h4><ul>" +
        p.items.map(function (it) { return "<li>" + esc(it) + "</li>"; }).join("") + "</ul></div></li>";
    }).join("");

    els.letterTitle.textContent = a.role === "leader" ? "A message for your staff" : "A letter for your principal";
    generatedLetter = letter(a, tools);
    if (!letterEdited) {
      els.letter.value = generatedLetter;
      sizeLetter();
    }
    updateEmail(a);

    renderChecks(a);

    els.contact.href = "mailto:codeformaine@gmail.com?subject=" + encodeURIComponent("Bringing coding to " + (a.school || "our school"));
  }

  function updateEmail(a) {
    var subject = a.role === "leader" ? "Starting a coding program" : "Starting a " + LABELS.format[a.format] + (a.school ? " at " + a.school : "");
    els.email.href = "mailto:?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(els.letter.value);
  }

  function sizeLetter() {
    els.letter.style.height = "auto";
    els.letter.style.height = els.letter.scrollHeight + 4 + "px";
  }

  function renderChecks(a) {
    var done = readStore(CHECKS_KEY) || {};
    var items = checklist(a);
    els.checks.innerHTML = items.map(function (it) {
      var on = !!done[it.id];
      return '<li class="tk-check' + (on ? " is-done" : "") + '"><label>' +
        '<input type="checkbox" data-id="' + it.id + '"' + (on ? " checked" : "") + " />" +
        '<span class="tk-box" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>' +
        "<span>" + esc(it.text) + "</span></label>" +
        (it.link ? '<a class="tk-check-link" href="' + esc(it.link) + '"' + (/^https?:/.test(it.link) ? ' target="_blank" rel="noreferrer"' : "") + ">Open</a>" : "") +
        "</li>";
    }).join("");
    updateProgress();
  }

  function updateProgress() {
    var boxes = els.checks.querySelectorAll("input");
    var n = 0;
    boxes.forEach(function (b) { if (b.checked) n++; });
    els.progressFill.style.width = (boxes.length ? (n / boxes.length) * 100 : 0) + "%";
    els.progressLabel.textContent = n === boxes.length && n > 0 ? "All done. Go code!" : n + " of " + boxes.length + " done";
  }

  /* ---------- Events ---------- */

  form.addEventListener("change", render);
  form.addEventListener("input", function (e) {
    if (e.target.type === "text") render();
  });

  els.letter.addEventListener("input", function () {
    letterEdited = els.letter.value !== generatedLetter;
    els.letterReset.hidden = !letterEdited;
    sizeLetter();
    updateEmail(answers());
  });

  els.letterReset.addEventListener("click", function () {
    letterEdited = false;
    els.letterReset.hidden = true;
    els.letter.value = generatedLetter;
    sizeLetter();
    updateEmail(answers());
  });

  els.copy.addEventListener("click", function () {
    var label = els.copy.querySelector("span");
    function done(ok) {
      label.textContent = ok ? "Copied!" : "Select and copy";
      els.copy.classList.toggle("is-copied", ok);
      setTimeout(function () { label.textContent = "Copy letter"; els.copy.classList.remove("is-copied"); }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(els.letter.value).then(function () { done(true); }, function () {
        els.letter.select();
        done(false);
      });
    } else {
      els.letter.select();
      done(false);
    }
  });

  els.checks.addEventListener("change", function (e) {
    if (!e.target.matches('input[type="checkbox"]')) return;
    var done = readStore(CHECKS_KEY) || {};
    done[e.target.dataset.id] = e.target.checked;
    writeStore(CHECKS_KEY, done);
    e.target.closest(".tk-check").classList.toggle("is-done", e.target.checked);
    updateProgress();
  });

  els.print.addEventListener("click", function () { window.print(); });
  window.addEventListener("resize", sizeLetter);

  restore();
  render();
})();
