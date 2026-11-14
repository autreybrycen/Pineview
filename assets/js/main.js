/* Pineview — small progressive enhancements. The site works without JavaScript. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     FORM SETTINGS — edit these two lines.
     FORM_ENDPOINT: paste a form-service URL (Formspree, Basin, Netlify,
     Getform, your own server, etc.). Leave it empty and the form opens
     the visitor's email app with everything filled in instead.
  ------------------------------------------------------------------- */
  var FORM_ENDPOINT = "";
  var FALLBACK_EMAIL = "brycen.autrey@brycendoesroofs.com";

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 881px)").addEventListener("change", function (m) { if (m.matches) setOpen(false); });
  }

  /* Services page: highlight the current section in the sub-nav */
  var subLinks = document.querySelectorAll(".subnav a[href^='#']");
  if (subLinks.length && "IntersectionObserver" in window) {
    var map = {};
    subLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          subLinks.forEach(function (a) { a.classList.remove("is-active"); });
          var link = map[en.target.id];
          if (link) { link.classList.add("is-active"); link.scrollIntoView({ block: "nearest", inline: "nearest" }); }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* Gallery filters */
  var filterBar = document.querySelector("[data-filters]");
  if (filterBar) {
    var items = document.querySelectorAll("[data-category]");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      var f = btn.getAttribute("data-filter");
      filterBar.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      items.forEach(function (it) {
        it.hidden = !(f === "all" || it.getAttribute("data-category").split(" ").indexOf(f) !== -1);
      });
    });
  }

  /* Estimate form */
  var form = document.getElementById("estimate-form");
  if (!form) return;

  // Pre-check a service from the URL, e.g. contact.html?service=lighting
  var params = new URLSearchParams(window.location.search);
  var pre = params.get("service");
  if (pre) {
    pre.split(",").forEach(function (v) {
      var box = form.querySelector('input[name="services"][value="' + v + '"]');
      if (box) box.checked = true;
    });
  }

  var status = form.querySelector(".form-status");
  var showStatus = function (msg, ok) {
    status.textContent = msg;
    status.className = "form-status " + (ok ? "ok" : "err");
    status.hidden = false;
    status.focus();
  };

  var clearErrors = function () {
    form.querySelectorAll(".has-error").forEach(function (f) { f.classList.remove("has-error"); });
    form.querySelectorAll(".error-msg").forEach(function (m) { m.remove(); });
    form.querySelectorAll("[aria-invalid]").forEach(function (i) { i.removeAttribute("aria-invalid"); });
  };

  var flag = function (input, msg) {
    var field = input.closest(".field");
    field.classList.add("has-error");
    input.setAttribute("aria-invalid", "true");
    var m = document.createElement("p");
    m.className = "error-msg";
    m.id = input.id + "-error";
    m.textContent = msg;
    field.appendChild(m);
    input.setAttribute("aria-describedby", m.id);
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    if (form.querySelector(".hp input").value) return; // spam bot

    var firstBad = null;
    form.querySelectorAll("[required]").forEach(function (input) {
      if (!input.value.trim()) { flag(input, "Please fill this in."); firstBad = firstBad || input; }
    });
    var email = form.querySelector("#email");
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { flag(email, "Please enter a valid email."); firstBad = firstBad || email; }
    var phone = form.querySelector("#phone");
    if (phone.value && phone.value.replace(/\D/g, "").length < 10) { flag(phone, "Please enter a 10-digit phone number."); firstBad = firstBad || phone; }
    if (firstBad) { firstBad.focus(); return; }

    var data = new FormData(form);
    var services = data.getAll("services");

    if (FORM_ENDPOINT) {
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Sending…";
      fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error();
          form.reset();
          showStatus("Thanks — we got your request. We'll reach out within one business day.", true);
        })
        .catch(function () {
          showStatus("Something went wrong sending the form. Please call 208-626-2145 or email " + FALLBACK_EMAIL + ".", false);
        })
        .finally(function () { btn.disabled = false; btn.textContent = "Get My Free Estimate"; });
      return;
    }

    // No endpoint configured: open the visitor's email app with the details filled in.
    var body = [
      "Name: " + data.get("name"),
      "Phone: " + data.get("phone"),
      "Email: " + data.get("email"),
      "Property address: " + data.get("address"),
      "Services: " + (services.length ? services.join(", ") : "Not sure yet"),
      "Best way to reach me: " + (data.get("contact_pref") || "Either"),
      "",
      data.get("message") || ""
    ].join("\n");
    window.location.href = "mailto:" + FALLBACK_EMAIL +
      "?subject=" + encodeURIComponent("Free estimate request — " + data.get("name")) +
      "&body=" + encodeURIComponent(body);
    showStatus("Your email app should open with your request filled in. Just hit send. Prefer to talk? Call 208-626-2145.", true);
  });
})();
