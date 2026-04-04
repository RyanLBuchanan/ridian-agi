/* =========================================================
   Piper GenUI — Core Logic
   ========================================================= */

(function () {
  "use strict";

  // -------------------------------------------------------
  // Boot
  // -------------------------------------------------------
  const form    = document.getElementById("genui-form");
  const input   = document.getElementById("genui-prompt");
  const surface = document.getElementById("genui-surface");
  const chips   = document.querySelectorAll(".chip");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const prompt = input.value.trim();
    if (!prompt) return;
    const type = classifyPrompt(prompt);
    renderSurface(type, prompt);
  });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      const prompt = chip.getAttribute("data-prompt");
      input.value = prompt;
      const type = classifyPrompt(prompt);
      renderSurface(type, prompt);
    });
  });

  // -------------------------------------------------------
  // Intent classifier
  // -------------------------------------------------------
  function classifyPrompt(prompt) {
    var p = prompt.toLowerCase();

    var teacherKeywords  = ["my students", "teach", "misconception", "explain to a student", "my learners", "my class keeps"];
    var missedKeywords   = ["missed class", "start from beginning", "start from the beginning", "start over", "review", "catch up", "missed yesterday"];
    var geometryKeywords = ["triangle", "angle", "congruent", "congruence", "geometry", "polygon", "shape"];
    var fractionKeywords = ["fraction", "numerator", "denominator", "1/2", "1/3", "1/4", "equivalent", "half", "third", "quarter"];

    if (matchesAny(p, teacherKeywords))  return "teacher";
    if (matchesAny(p, missedKeywords))   return "missed-class";
    if (matchesAny(p, geometryKeywords)) return "geometry";
    if (matchesAny(p, fractionKeywords)) return "fractions";

    // Default
    return "fractions";
  }

  function matchesAny(text, keywords) {
    for (var i = 0; i < keywords.length; i++) {
      if (text.indexOf(keywords[i]) !== -1) return true;
    }
    return false;
  }

  // -------------------------------------------------------
  // Surface router
  // -------------------------------------------------------
  function renderSurface(type, prompt) {
    // Clear and re-trigger animation
    surface.style.animation = "none";
    void surface.offsetHeight; // reflow
    surface.style.animation = "";

    switch (type) {
      case "fractions":
        renderFractionsSurface(prompt);
        break;
      case "geometry":
        renderGeometrySurface(prompt);
        break;
      case "missed-class":
        renderMissedClassSurface(prompt);
        break;
      case "teacher":
        renderTeacherSurface(prompt);
        break;
    }
  }

  // =======================================================
  //  1. FRACTIONS SURFACE
  // =======================================================
  function renderFractionsSurface(prompt) {
    surface.innerHTML =
      '<div class="surface-piper-response">' +
        "That's a great place to start. Before I explain anything, let's explore " +
        "what fractions look like. Try clicking on pieces of the bar below and " +
        "see if you notice what changes." +
      "</div>" +

      '<div class="surface-card">' +
        '<h2 class="surface-heading">Explore Fractions</h2>' +

        '<div class="toggle-group" id="frac-view-toggle">' +
          '<button class="toggle-btn active" data-view="bar">Fraction Bars</button>' +
          '<button class="toggle-btn" data-view="area">Area Model</button>' +
          '<button class="toggle-btn" data-view="line">Number Line</button>' +
        "</div>" +

        '<div class="fraction-controls" id="frac-divide-controls">' +
          '<button class="fraction-divide-btn" data-parts="2">÷ 2</button>' +
          '<button class="fraction-divide-btn" data-parts="3">÷ 3</button>' +
          '<button class="fraction-divide-btn active" data-parts="4">÷ 4</button>' +
          '<button class="fraction-divide-btn" data-parts="5">÷ 5</button>' +
          '<button class="fraction-divide-btn" data-parts="6">÷ 6</button>' +
          '<button class="fraction-divide-btn" data-parts="8">÷ 8</button>' +
        "</div>" +

        '<div class="fraction-bar-container" id="frac-vis"></div>' +
      "</div>" +

      '<div class="surface-card">' +
        '<p class="surface-prompt-text">"What do you notice?"</p>' +
        '<input class="surface-input" id="frac-notice-input" placeholder="I notice that…">' +
      "</div>";

    initFractionsInteractivity();
  }

  function initFractionsInteractivity() {
    var parts = 4;
    var view  = "bar";
    var selected = {};

    draw();

    // Divide controls
    document.getElementById("frac-divide-controls").addEventListener("click", function (e) {
      var btn = e.target.closest(".fraction-divide-btn");
      if (!btn) return;
      parts = parseInt(btn.getAttribute("data-parts"), 10);
      selected = {};
      document.querySelectorAll(".fraction-divide-btn").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      draw();
    });

    // View toggle
    document.getElementById("frac-view-toggle").addEventListener("click", function (e) {
      var btn = e.target.closest(".toggle-btn");
      if (!btn) return;
      view = btn.getAttribute("data-view");
      document.querySelectorAll("#frac-view-toggle .toggle-btn").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      selected = {};
      draw();
    });

    function draw() {
      var container = document.getElementById("frac-vis");
      if (view === "bar")  drawBar(container, parts);
      if (view === "area") drawArea(container, parts);
      if (view === "line") drawLine(container, parts);
    }

    function drawBar(container, n) {
      var html = '<div class="fraction-bar">';
      for (var i = 0; i < n; i++) {
        var sel = selected[i] ? " selected" : "";
        html += '<div class="fraction-segment' + sel +'" data-idx="' + i + '">1/' + n + "</div>";
      }
      html += "</div>";
      container.innerHTML = html;

      container.addEventListener("click", function (e) {
        var seg = e.target.closest(".fraction-segment");
        if (!seg) return;
        var idx = parseInt(seg.getAttribute("data-idx"), 10);
        selected[idx] = !selected[idx];
        drawBar(container, n);
      });
    }

    function drawArea(container, n) {
      var cols = n <= 4 ? n : Math.ceil(Math.sqrt(n));
      var rows = Math.ceil(n / cols);
      var html = '<div class="area-model" style="grid-template-columns:repeat(' + cols + ',1fr);grid-template-rows:repeat(' + rows + ',1fr);">';
      for (var i = 0; i < n; i++) {
        var sel = selected[i] ? " selected" : "";
        html += '<div class="area-cell' + sel + '" data-idx="' + i + '"></div>';
      }
      html += "</div>";
      container.innerHTML = html;

      container.addEventListener("click", function (e) {
        var cell = e.target.closest(".area-cell");
        if (!cell) return;
        var idx = parseInt(cell.getAttribute("data-idx"), 10);
        selected[idx] = !selected[idx];
        drawArea(container, n);
      });
    }

    function drawLine(container, n) {
      var w = 560, h = 80, pad = 30;
      var lineY = 45;
      var svg = '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">';
      svg += '<line x1="' + pad + '" y1="' + lineY + '" x2="' + (w - pad) + '" y2="' + lineY + '" stroke="#4c566a" stroke-width="2"/>';

      var segW = (w - 2 * pad) / n;
      for (var i = 0; i <= n; i++) {
        var x = pad + i * segW;
        var big = (i === 0 || i === n);
        svg += '<line x1="' + x + '" y1="' + (lineY - (big ? 14 : 10)) + '" x2="' + x + '" y2="' + (lineY + (big ? 14 : 10)) + '" stroke="#4c566a" stroke-width="' + (big ? 2 : 1.5) + '"/>';
        svg += '<text x="' + x + '" y="' + (lineY + 28) + '" text-anchor="middle" font-size="11" fill="#4c566a" font-family="Segoe UI, system-ui, sans-serif">' + i + '/' + n + '</text>';
      }

      // Highlight selected segments
      for (var j = 0; j < n; j++) {
        if (selected[j]) {
          var x1 = pad + j * segW;
          var x2 = pad + (j + 1) * segW;
          svg += '<rect x="' + x1 + '" y="' + (lineY - 6) + '" width="' + segW + '" height="12" fill="#c07878" opacity="0.45" rx="2"/>';
        }
      }

      // Clickable regions
      for (var k = 0; k < n; k++) {
        var rx = pad + k * segW;
        svg += '<rect x="' + rx + '" y="0" width="' + segW + '" height="' + h + '" fill="transparent" data-idx="' + k + '" class="nl-click" style="cursor:pointer"/>';
      }

      svg += "</svg>";
      container.innerHTML = '<div class="number-line-container">' + svg + "</div>";

      container.querySelectorAll(".nl-click").forEach(function (rect) {
        rect.addEventListener("click", function () {
          var idx = parseInt(rect.getAttribute("data-idx"), 10);
          selected[idx] = !selected[idx];
          drawLine(container, n);
        });
      });
    }
  }

  // =======================================================
  //  2. GEOMETRY SURFACE
  // =======================================================
  function renderGeometrySurface(prompt) {
    surface.innerHTML =
      '<div class="surface-piper-response">' +
        "Let's think about this visually. Below is a triangle you can manipulate. " +
        "Try moving one of the vertices and observe what changes — and what stays the same." +
      "</div>" +

      '<div class="surface-card">' +
        '<h2 class="surface-heading">Interactive Triangle</h2>' +
        '<div class="toggle-group" id="geo-toggle">' +
          '<button class="toggle-btn active" data-action="labels-toggle">Show Labels</button>' +
          '<button class="toggle-btn" data-action="highlight-sides">Highlight Sides</button>' +
          '<button class="toggle-btn" data-action="highlight-angles">Highlight Angles</button>' +
        "</div>" +
        '<div class="geometry-canvas-wrap" id="geo-canvas"></div>' +
      "</div>" +

      '<div class="surface-card">' +
        '<p class="surface-prompt-text">"What stays the same when you move this?"</p>' +
        '<input class="surface-input" id="geo-notice-input" placeholder="I think that…">' +
      "</div>";

    initGeometryInteractivity();
  }

  function initGeometryInteractivity() {
    var svgNS = "http://www.w3.org/2000/svg";
    var W = 500, H = 340;
    var points = [
      { x: 120, y: 280, label: "A" },
      { x: 380, y: 280, label: "B" },
      { x: 250, y:  60, label: "C" }
    ];
    var showLabels = true;
    var highlightSides = false;
    var highlightAngles = false;
    var dragging = null;

    var canvas = document.getElementById("geo-canvas");

    function render() {
      var svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      svg.setAttribute("width", W);
      svg.setAttribute("height", H);

      // Triangle polygon fill
      var polygon = document.createElementNS(svgNS, "polygon");
      polygon.setAttribute("points", points.map(function (p) { return p.x + "," + p.y; }).join(" "));
      polygon.setAttribute("fill", highlightAngles ? "rgba(208,160,160,0.15)" : "rgba(208,160,160,0.08)");
      polygon.setAttribute("stroke", "none");
      svg.appendChild(polygon);

      // Sides
      for (var i = 0; i < 3; i++) {
        var j = (i + 1) % 3;
        var line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", points[i].x);
        line.setAttribute("y1", points[i].y);
        line.setAttribute("x2", points[j].x);
        line.setAttribute("y2", points[j].y);
        line.setAttribute("class", "geo-side" + (highlightSides ? " highlight" : ""));
        svg.appendChild(line);

        // Side length label
        if (showLabels) {
          var mx = (points[i].x + points[j].x) / 2;
          var my = (points[i].y + points[j].y) / 2;
          var dx = points[j].x - points[i].x;
          var dy = points[j].y - points[i].y;
          var len = Math.sqrt(dx * dx + dy * dy).toFixed(0);
          var offsetX = dy > 0 ? -12 : 12;
          var offsetY = dx > 0 ? 12 : -12;
          var text = document.createElementNS(svgNS, "text");
          text.setAttribute("x", mx + offsetX);
          text.setAttribute("y", my + offsetY);
          text.setAttribute("class", "geo-label");
          text.setAttribute("text-anchor", "middle");
          text.textContent = len;
          svg.appendChild(text);
        }
      }

      // Angle arcs
      if (highlightAngles) {
        for (var a = 0; a < 3; a++) {
          var prev = points[(a + 2) % 3];
          var curr = points[a];
          var next = points[(a + 1) % 3];
          var ang1 = Math.atan2(prev.y - curr.y, prev.x - curr.x);
          var ang2 = Math.atan2(next.y - curr.y, next.x - curr.x);
          // Ensure proper arc direction
          if (ang1 < 0) ang1 += 2 * Math.PI;
          if (ang2 < 0) ang2 += 2 * Math.PI;
          if (ang2 < ang1) ang2 += 2 * Math.PI;
          var r = 28;
          var largeArc = (ang2 - ang1) > Math.PI ? 1 : 0;
          var sx = curr.x + r * Math.cos(ang1);
          var sy = curr.y + r * Math.sin(ang1);
          var ex = curr.x + r * Math.cos(ang2);
          var ey = curr.y + r * Math.sin(ang2);
          var path = document.createElementNS(svgNS, "path");
          path.setAttribute("d", "M " + sx + " " + sy + " A " + r + " " + r + " 0 " + largeArc + " 1 " + ex + " " + ey);
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", "#c07878");
          path.setAttribute("stroke-width", "2");
          path.setAttribute("opacity", "0.7");
          svg.appendChild(path);

          // Angle value label
          if (showLabels) {
            var angleDeg = angleBetween(prev, curr, next);
            var midAng = (ang1 + ang2) / 2;
            var lx = curr.x + (r + 16) * Math.cos(midAng);
            var ly = curr.y + (r + 16) * Math.sin(midAng);
            var aLabel = document.createElementNS(svgNS, "text");
            aLabel.setAttribute("x", lx);
            aLabel.setAttribute("y", ly);
            aLabel.setAttribute("class", "geo-label");
            aLabel.setAttribute("text-anchor", "middle");
            aLabel.setAttribute("font-size", "11");
            aLabel.textContent = angleDeg + "°";
            svg.appendChild(aLabel);
          }
        }
      }

      // Points (draggable)
      for (var p = 0; p < 3; p++) {
        (function (idx) {
          var circle = document.createElementNS(svgNS, "circle");
          circle.setAttribute("cx", points[idx].x);
          circle.setAttribute("cy", points[idx].y);
          circle.setAttribute("r", 7);
          circle.setAttribute("fill", "#c07878");
          circle.setAttribute("class", "geo-point");

          circle.addEventListener("pointerdown", function (e) {
            e.preventDefault();
            dragging = idx;
            circle.classList.add("dragging");
            circle.setPointerCapture(e.pointerId);
          });
          circle.addEventListener("pointermove", function (e) {
            if (dragging !== idx) return;
            var rect = svg.getBoundingClientRect();
            var scaleX = W / rect.width;
            var scaleY = H / rect.height;
            points[idx].x = Math.max(10, Math.min(W - 10, (e.clientX - rect.left) * scaleX));
            points[idx].y = Math.max(10, Math.min(H - 10, (e.clientY - rect.top) * scaleY));
            render();
          });
          circle.addEventListener("pointerup", function () {
            dragging = null;
            circle.classList.remove("dragging");
          });

          svg.appendChild(circle);

          // Vertex label
          if (showLabels) {
            var label = document.createElementNS(svgNS, "text");
            label.setAttribute("x", points[idx].x);
            label.setAttribute("y", points[idx].y - 14);
            label.setAttribute("class", "geo-label");
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("font-weight", "600");
            label.textContent = points[idx].label;
            svg.appendChild(label);
          }
        })(p);
      }

      canvas.innerHTML = "";
      canvas.appendChild(svg);
    }

    function angleBetween(a, vertex, b) {
      var v1x = a.x - vertex.x, v1y = a.y - vertex.y;
      var v2x = b.x - vertex.x, v2y = b.y - vertex.y;
      var dot = v1x * v2x + v1y * v2y;
      var cross = v1x * v2y - v1y * v2x;
      var angle = Math.atan2(Math.abs(cross), dot);
      return Math.round(angle * 180 / Math.PI);
    }

    render();

    // Toggle controls
    document.getElementById("geo-toggle").addEventListener("click", function (e) {
      var btn = e.target.closest(".toggle-btn");
      if (!btn) return;
      var action = btn.getAttribute("data-action");

      if (action === "labels-toggle") {
        showLabels = !showLabels;
        btn.classList.toggle("active", showLabels);
      } else if (action === "highlight-sides") {
        highlightSides = !highlightSides;
        btn.classList.toggle("active", highlightSides);
      } else if (action === "highlight-angles") {
        highlightAngles = !highlightAngles;
        btn.classList.toggle("active", highlightAngles);
      }
      render();
    });
  }

  // =======================================================
  //  3. MISSED CLASS SURFACE
  // =======================================================
  function renderMissedClassSurface(prompt) {
    surface.innerHTML =
      '<div class="surface-piper-response">' +
        "No worries — let's get you caught up. Here's a quick entry point into " +
        "what we've been working on. Start with the task below, and when you're ready, " +
        "reveal the summary to check your thinking." +
      "</div>" +

      '<div class="surface-card">' +
        '<h2 class="surface-heading">Lesson: Comparing Fractions with Unlike Denominators</h2>' +
      "</div>" +

      '<div class="launch-task-card">' +
        "<h3>Launch Task</h3>" +
        '<p>Without calculating, decide: which is greater — <strong>3/8</strong> or <strong>1/3</strong>? ' +
        "Use a drawing, a number line, or reasoning to justify your answer.</p>" +
      "</div>" +

      '<div class="notice-wonder">' +
        '<div class="nw-box">' +
          "<h4>I Notice…</h4>" +
          '<input class="surface-input" placeholder="Something I see...">' +
        "</div>" +
        '<div class="nw-box">' +
          "<h4>I Wonder…</h4>" +
          '<input class="surface-input" placeholder="Something I'm curious about...">' +
        "</div>" +
      "</div>" +

      '<button class="reveal-btn" id="mc-reveal-btn">I\'m ready — show me the summary</button>' +

      '<div class="hidden-summary" id="mc-summary">' +
        '<div class="surface-card">' +
          '<h2 class="surface-heading">Key Ideas from This Lesson</h2>' +
          "<ul style=\"padding-left:1.2rem;color:#4c566a;font-size:0.9rem;line-height:1.7;\">" +
            "<li>To compare fractions with unlike denominators, we can find a common denominator or use visual models.</li>" +
            "<li>The size of each piece depends on the denominator — more pieces means smaller pieces.</li>" +
            "<li>Drawing a picture often reveals relationships that numbers alone don't.</li>" +
          "</ul>" +
        "</div>" +
        '<div class="surface-card">' +
          '<p class="surface-prompt-text">"Can you explain in your own words why 3/8 and 1/3 are hard to compare just by looking at the numbers?"</p>' +
          '<input class="surface-input" id="mc-check-input" placeholder="I think it's because…">' +
        "</div>" +
      "</div>";

    document.getElementById("mc-reveal-btn").addEventListener("click", function () {
      document.getElementById("mc-summary").classList.add("visible");
      this.style.display = "none";
    });
  }

  // =======================================================
  //  4. TEACHER SURFACE
  // =======================================================
  function renderTeacherSurface(prompt) {
    var topicContext = inferTeacherTopic(prompt);

    surface.innerHTML =
      '<div class="surface-piper-response">' +
        topicContext.response +
      "</div>" +

      '<div class="teacher-cards">' +
        '<div class="teacher-card">' +
          "<h4>Likely Misconception</h4>" +
          "<p>" + topicContext.misconception + "</p>" +
        "</div>" +
        '<div class="teacher-card">' +
          "<h4>Suggested Next Move</h4>" +
          "<p>" + topicContext.nextMove + "</p>" +
        "</div>" +
        '<div class="teacher-card">' +
          "<h4>Representation to Use</h4>" +
          "<p>" + topicContext.representation + "</p>" +
        "</div>" +
        '<div class="teacher-card">' +
          "<h4>Discussion Prompt</h4>" +
          "<p>" + topicContext.discussion + "</p>" +
        "</div>" +
      "</div>" +

      '<div class="surface-card">' +
        '<p class="surface-prompt-text">Want to refine this further? Describe what your students said or did.</p>' +
        '<input class="surface-input" placeholder="My students said…">' +
      "</div>";
  }

  function inferTeacherTopic(prompt) {
    var p = prompt.toLowerCase();

    if (p.indexOf("numerator") !== -1 || p.indexOf("denominator") !== -1) {
      return {
        response:
          "This is one of the most common sticking points with fractions. Students often " +
          "memorize the positions without connecting them to meaning. Here are some ideas " +
          "to help surface the confusion and work through it.",
        misconception:
          "Students may think the numerator is \"the bigger number\" or " +
          "the denominator is \"how many you have.\" They may be swapping the roles — counting " +
          "the total as the numerator and the selected parts as the denominator.",
        nextMove:
          "Ask students to draw a picture of 3/4 and label each part. Then ask: " +
          "\"Which number tells you how many pieces? Which tells you how many are shaded?\" " +
          "Let them discover the inconsistency themselves.",
        representation:
          "Use a fraction bar or set model (e.g., 3 out of 4 circles). Physical " +
          "manipulatives are ideal here — pattern blocks or fraction strips.",
        discussion:
          "\"If I eat 2 slices of a pizza cut into 8 pieces, what fraction did I eat? " +
          "What does the 2 mean? What does the 8 mean?\""
      };
    }

    if (p.indexOf("multiply") !== -1 || p.indexOf("smaller") !== -1) {
      return {
        response:
          "When students first encounter multiplication by fractions less than 1, it " +
          "challenges their existing model of multiplication as \"making bigger.\" This " +
          "is a conceptual shift worth spending time on.",
        misconception:
          "Students believe multiplication always makes numbers bigger because their " +
          "experience with whole numbers reinforces this. They may say: \"I multiplied, " +
          "so the answer has to be more.\"",
        nextMove:
          "Use a number line to show what \"1/2 of 6\" looks like. Compare it to " +
          "\"2 × 6\" side by side. Ask: \"What happened differently?\"",
        representation:
          "Number line or area model. Show \"1/2 × 6\" as finding half " +
          "of a length or half of a rectangular area.",
        discussion:
          "\"Does multiplying always make things bigger? Can you think of a time " +
          "when multiplying gave you a smaller answer? Why might that happen?\""
      };
    }

    // Default teacher surface
    return {
      response:
        "It sounds like your students may be working through an important conceptual " +
        "hurdle. Here are some strategies that might help you meet them where they are " +
        "and guide them forward without over-correcting.",
      misconception:
        "Students may be applying a procedure without understanding why it works. " +
        "Look for signs that they're following steps but can't explain the reasoning.",
      nextMove:
        "Pause the procedure and ask students to represent the problem with a " +
        "drawing or manipulative. Have them explain their drawing to a partner " +
        "before returning to the symbolic form.",
      representation:
        "A visual model — fraction bars, area models, or set models — can " +
        "help bridge the gap between abstract notation and concrete understanding.",
      discussion:
        "\"Can someone explain this idea using a picture or a real-life example? " +
        "What would change if the numbers were different?\""
    };
  }

})();
