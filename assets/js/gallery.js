(function () {
  var cfg = (window.SITE_CONFIG && window.SITE_CONFIG.business) || {};
  var data = window.SITE_DATA || { heroes: {}, portfolio: [], weddings: [], automobile: [] };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var toArr = function (v) {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  var CAT_LABELS = {
    "p-auto": "Automotive",
    "p-outdoor": "Travel & Outdoor",
    "p-nature": "Nature",
    "p-event": "Events",
    "p-other": "Portfolio",
    "a-shoot": "Automobile Shoot",
    "w-bride": "The Bride",
    "w-groom": "The Groom",
    "w-couple": "Together",
    "w-ceremony": "Ceremony",
    "w-decor": "Details & Decor",
    "w-candid": "Candid",
    "w-family": "Family",
    "w-other": "Wedding"
  };

  /* ---------- Config injection ---------- */
  $$("[data-cfg]").forEach(function (el) {
    var val = cfg[el.getAttribute("data-cfg")];
    if (val) el.setAttribute("href", val);
  });
  $$("[data-cfg-text]").forEach(function (el) {
    var val = cfg[el.getAttribute("data-cfg-text")];
    if (val) el.textContent = val;
  });

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hero backgrounds (smart focal point + rotation) ---------- */
  function heroPosition(item) {
    if (!item || !item.w || !item.h) return "center";
    return item.h > item.w * 1.05 ? "center 26%" : "center 48%";
  }
  var heroes = data.heroes || {};
  $$("[data-hero]").forEach(function (el) {
    var items = toArr(heroes[el.getAttribute("data-hero")]);
    if (!items.length) return;
    el.style.backgroundImage = "url('" + items[0].src + "')";
    el.style.backgroundPosition = heroPosition(items[0]);
    if (items.length > 1 && !reducedMotion) {
      var idx = 0;
      var clone = el.cloneNode(false);
      clone.style.opacity = "0";
      clone.style.transition = "opacity 1.4s ease";
      clone.style.backgroundPosition = heroPosition(items[1]);
      el.parentNode.insertBefore(clone, el.nextSibling);
      items.forEach(function (it, i) { if (i > 0) { var im = new Image(); im.src = it.src; } });
      setInterval(function () {
        idx = (idx + 1) % items.length;
        clone.style.backgroundImage = "url('" + items[idx].src + "')";
        clone.style.backgroundPosition = heroPosition(items[idx]);
        clone.style.opacity = "1";
        setTimeout(function () {
          el.style.backgroundImage = "url('" + items[idx].src + "')";
          el.style.backgroundPosition = heroPosition(items[idx]);
          clone.style.opacity = "0";
        }, 1500);
      }, 8000);
    }
  });

  /* ---------- Home media (wedding strip, about) ---------- */
  (function () {
    var strip = $("[data-wed-strip]");
    if (strip) {
      var weds = toArr(data.weddings);
      var pick = weds.filter(function (i) { return i.cat === "w-bride"; })[0] || weds[0];
      if (pick) {
        strip.src = pick.full;
        strip.style.objectPosition = (pick.h > pick.w * 1.05) ? "center 25%" : "center";
      } else {
        var sec = strip.closest(".wed-strip");
        if (sec) sec.style.display = "none";
      }
    }
    var about = $("[data-about-img]");
    if (about) {
      var aboutItem = (heroes.about ? toArr(heroes.about)[0] : null) || toArr(data.portfolio)[0];
      if (aboutItem) {
        about.src = aboutItem.src || aboutItem.full;
      } else {
        about.style.display = "none";
        var grid = about.closest(".about-grid");
        if (grid) grid.classList.add("no-media");
      }
    }
  })();

  /* ---------- Social frame (Instagram mini feed) ---------- */
  (function () {
    var igGrid = $("[data-ig-grid]");
    if (!igGrid) return;
    var pool = toArr(data.weddings).concat(toArr(data.automobile), toArr(data.portfolio));
    var picks = [];
    if (pool.length) {
      var step = Math.max(1, Math.floor(pool.length / 6));
      for (var i = 0; i < pool.length && picks.length < 6; i += step) {
        picks.push(pool[i]);
      }
    }
    if (!picks.length) {
      var card = igGrid.closest(".social-card");
      if (card) card.style.display = "none";
      return;
    }
    var igUrl = cfg.instagram || "https://www.instagram.com/bilalaamer/";
    picks.forEach(function (p) {
      var a = document.createElement("a");
      a.className = "ig-cell";
      a.href = igUrl;
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", "Open Instagram profile");
      var im = document.createElement("img");
      im.src = p.thumb;
      im.alt = "";
      im.loading = "lazy";
      im.decoding = "async";
      a.appendChild(im);
      igGrid.appendChild(a);
    });
  })();

  /* ---------- Reveal on scroll ---------- */
  var io = null;
  if ("IntersectionObserver" in window && !reducedMotion) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  }
  function watch(el) {
    if (reducedMotion || !io) { el.classList.add("in"); return; }
    io.observe(el);
  }
  $$(".reveal").forEach(watch);

  /* ---------- Skiper-style ExpandOnHover featured strip ---------- */
  function buildExpStrip(stripEl) {
    var key = stripEl.getAttribute("data-exp-strip");
    var items = toArr(data[key]).slice(0, 6);
    if (items.length < 3) {
      var sec = stripEl.closest("section");
      if (sec) sec.style.display = "none";
      return;
    }
    var lbList = [];
    items.forEach(function (it, i) {
      var label = CAT_LABELS[it.cat] || "Photograph";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "exp-item reveal";
      btn.setAttribute("aria-label", "View photo: " + label);
      var img = document.createElement("img");
      img.src = it.thumb;
      img.alt = label + " \u2014 Bilal Aamer Photography";
      img.loading = "lazy";
      img.decoding = "async";
      var code = document.createElement("span");
      code.className = "exp-code";
      code.textContent = "# " + (i + 1 < 10 ? "0" : "") + (i + 1);
      var lab = document.createElement("span");
      lab.className = "exp-label";
      lab.textContent = label;
      btn.appendChild(img);
      btn.appendChild(code);
      btn.appendChild(lab);
      (function (idx, el) {
        el.addEventListener("click", function () { openLightbox(lbList, idx, el); });
      })(i, btn);
      lbList.push({ full: it.full, thumb: it.thumb || it.full, label: label });
      stripEl.appendChild(btn);
    });
    $$(".exp-item", stripEl).forEach(watch);
  }
  $$("[data-exp-strip]").forEach(buildExpStrip);

  /* ---------- Gallery: balanced columns + Skiper-style parallax ---------- */
  var BREAK_M = 700;
  var BREAK_T = 1024;
  var BASE = { 1: [0], 2: [0, 28], 3: [0, 30, 12] };
  var AMP = { 1: [0], 2: [12, -10], 3: [18, -14, 26] };
  var parallaxGrids = [];

  function colTarget() {
    var w = window.innerWidth;
    return w < BREAK_M ? 1 : w < BREAK_T ? 2 : 3;
  }

  function layoutColumns(grid) {
    var tiles = grid._tiles || [];
    var visible = tiles.filter(function (t) { return !t.classList.contains("filtered"); });
    var n = colTarget();
    var cols = [];
    var heights = [];
    for (var i = 0; i < n; i++) {
      var c = document.createElement("div");
      c.className = "pcol";
      cols.push(c);
      heights.push(0);
    }
    visible.forEach(function (t) {
      var j = 0;
      for (var k = 1; k < n; k++) { if (heights[k] < heights[j] - 0.01) j = k; }
      cols[j].appendChild(t);
      heights[j] += (parseFloat(t.getAttribute("data-ar")) || 1.35) + 0.06;
    });
    grid.replaceChildren.apply(grid, cols);
    grid._cols = cols;
    grid._cols_n = n;
    applyGridParallax(grid);
  }

  function applyGridParallax(grid) {
    if (!grid._cols || !grid._cols.length) return;
    var n = grid._cols_n;
    if (reducedMotion || n === 1) {
      grid._cols.forEach(function (c) { c.style.transform = ""; });
      return;
    }
    var r = grid.getBoundingClientRect();
    var ih = window.innerHeight;
    if (r.bottom < -180 || r.top > ih + 180) return;
    var p = (ih - r.top) / (ih + r.height);
    p = Math.max(0, Math.min(1, p)) - 0.5;
    var base = BASE[n] || BASE[3];
    var amp = AMP[n] || AMP[3];
    grid._cols.forEach(function (c, i) {
      var y = (base[i] || 0) + p * 2 * (amp[i] || 0);
      c.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
    });
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      parallaxGrids.forEach(applyGridParallax);
    });
  }, { passive: true });

  var resizeT = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      parallaxGrids.forEach(function (g) {
        if (g._cols_n !== colTarget()) { layoutColumns(g); } else { applyGridParallax(g); }
      });
    }, 180);
  });

  /* ---------- Galleries ---------- */
  function buildGallery(grid) {
    var key = grid.getAttribute("data-gallery");
    var items = toArr(data[key]);
    var chipsBox = $('[data-chips="' + key + '"]');
    if (!items.length) {
      if (chipsBox) chipsBox.remove();
      grid.outerHTML = '<p class="lede">Photos coming soon.</p>';
      return;
    }
    var tiles = [];
    items.forEach(function (it, i) {
      var label = CAT_LABELS[it.cat] || "Photograph";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tile reveal";
      btn.setAttribute("data-cat", it.cat || "");
      btn.setAttribute("data-full", it.full);
      btn.setAttribute("data-thumb", it.thumb || it.full);
      btn.setAttribute("data-label", label);
      btn.setAttribute("data-ar", ((it.th && it.tw) ? (it.th / it.tw) : ((it.h && it.w) ? it.h / it.w : 1.35)).toFixed(3));
      btn.setAttribute("aria-label", "View photo: " + label);
      var img = document.createElement("img");
      img.src = it.thumb;
      img.alt = label + " \u2014 Bilal Aamer Photography";
      img.loading = "lazy";
      img.decoding = "async";
      if (it.tw) { img.width = it.tw; }
      if (it.th) { img.height = it.th; }
      var cap = document.createElement("span");
      cap.className = "tile-cap";
      cap.textContent = label;
      btn.appendChild(img);
      btn.appendChild(cap);
      if (!reducedMotion) { btn.style.transitionDelay = ((i % 6) * 70) + "ms"; }
      tiles.push(btn);
    });
    grid._tiles = tiles;
    layoutColumns(grid);
    $$(".tile", grid).forEach(watch);
    parallaxGrids.push(grid);
    applyGridParallax(grid);

    /* Filter chips */
    if (chipsBox) {
      var counts = {};
      items.forEach(function (it) { counts[it.cat] = (counts[it.cat] || 0) + 1; });
      var visible = 0;
      $$(".chip", chipsBox).forEach(function (chip) {
        var f = chip.getAttribute("data-filter");
        if (f !== "all") {
          var any = f.split(/\s+/).some(function (c) { return counts[c]; });
          if (!any) { chip.classList.add("hidden"); } else { visible++; }
        } else { visible++; }
        chip.addEventListener("click", function () {
          $$(".chip", chipsBox).forEach(function (c) { c.classList.remove("active"); });
          chip.classList.add("active");
          var codes = f === "all" ? null : f.split(/\s+/);
          grid._tiles.forEach(function (t) {
            var show = !codes || codes.indexOf(t.getAttribute("data-cat")) !== -1;
            t.classList.toggle("filtered", !show);
          });
          layoutColumns(grid);
        });
      });
      if (visible < 2) chipsBox.remove();
    }

    grid.addEventListener("click", function (e) {
      var tile = e.target.closest(".tile");
      if (!tile) return;
      var vis = grid._tiles.filter(function (t) { return !t.classList.contains("filtered"); });
      var list = vis.map(function (t) {
        return {
          full: t.getAttribute("data-full"),
          thumb: t.getAttribute("data-thumb"),
          label: t.getAttribute("data-label")
        };
      });
      openLightbox(list, vis.indexOf(tile), tile);
    });
  }
  $$("[data-gallery]").forEach(buildGallery);

  /* ---------- Lightbox / photo viewer ---------- */
  var lb = $("#lightbox");
  var lbImg, lbText, lbCount, lbStrip;
  var lbState = { list: [], index: 0 };

  function stripThumbActive(prevIndex) {
    if (!lbStrip) return;
    var thumbs = $$(".lb-thumb", lbStrip);
    if (prevIndex >= 0 && thumbs[prevIndex]) thumbs[prevIndex].classList.remove("active");
    var cur = thumbs[lbState.index];
    if (cur) {
      cur.classList.add("active");
      if (typeof cur.scrollIntoView === "function") {
        cur.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
      }
    }
  }

  function buildStrip(list) {
    if (!lbStrip) return;
    var frag = document.createDocumentFragment();
    list.forEach(function (it, i) {
      var t = document.createElement("img");
      t.className = "lb-thumb";
      t.src = it.thumb || it.full;
      t.alt = "";
      t.loading = "lazy";
      t.setAttribute("data-i", i);
      frag.appendChild(t);
    });
    lbStrip.replaceChildren(frag);
  }

  function lbUpdate() {
    var it = lbState.list[lbState.index];
    if (!it) return;
    lbImg.classList.remove("zoomed");
    lbImg.style.transformOrigin = "";
    lbImg.style.transform = "";
    lbImg.style.transition = "";
    lbImg.src = it.full;
    lbImg.alt = (it.label || "Photograph") + " \u2014 Bilal Aamer Photography";
    lbText.textContent = it.label || "";
    lbCount.textContent = (lbState.index + 1) + " \u00B7 " + lbState.list.length;
    [lbState.index - 1, lbState.index + 1].forEach(function (n) {
      var it2 = lbState.list[(n + lbState.list.length) % lbState.list.length];
      if (it2) { var pre = new Image(); pre.src = it2.full; }
    });
  }
  function openLightbox(list, index, srcEl) {
    if (!lb || !list.length || index < 0) return;
    lbState.list = list;
    lbState.index = index;
    buildStrip(list);
    lb.classList.add("open");
    lb.classList.toggle("only-one", list.length < 2);
    document.body.style.overflow = "hidden";
    lbUpdate();
    stripThumbActive(-1);
    if (srcEl) animateFromTile(srcEl);
    var closeBtn = $(".lb-close", lb);
    if (closeBtn) closeBtn.focus();
  }
  function animateFromTile(srcEl) {
    if (reducedMotion) return;
    var from = srcEl.getBoundingClientRect();
    if (!from || from.width < 40 || from.width > window.innerWidth) return;
    var run = function () {
      var to = lbImg.getBoundingClientRect();
      if (!to.width || !to.height) return;
      var dx = (from.left + from.width / 2) - (to.left + to.width / 2);
      var dy = (from.top + from.height / 2) - (to.top + to.height / 2);
      var sc = Math.max(0.15, Math.min(1, from.width / to.width));
      lbImg.style.transformOrigin = "50% 50%";
      lbImg.style.transition = "none";
      lbImg.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(" + sc.toFixed(3) + ")";
      lbImg.style.opacity = ".45";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          lbImg.style.transition = "transform .55s cubic-bezier(.2,.7,.2,1), opacity .35s ease";
          lbImg.style.transform = "translate(0,0) scale(1)";
          lbImg.style.opacity = "1";
        });
      });
    };
    if (lbImg.complete && lbImg.naturalWidth) {
      requestAnimationFrame(run);
    } else {
      lbImg.addEventListener("load", function h() {
        lbImg.removeEventListener("load", h);
        run();
      });
    }
  }
  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }
  function lbStep(dir) {
    if (lbState.list.length < 2) return;
    var prev = lbState.index;
    lbState.index = (lbState.index + dir + lbState.list.length) % lbState.list.length;
    lbUpdate();
    stripThumbActive(prev);
  }
  function lbJump(i) {
    if (!lbState.list[i] || i === lbState.index) return;
    var prev = lbState.index;
    lbState.index = i;
    lbUpdate();
    stripThumbActive(prev);
  }

  if (lb) {
    lbImg = $(".lb-img", lb);
    lbText = $(".lb-text", lb);
    lbCount = $(".lb-count", lb);
    lbStrip = $(".lb-strip", lb);

    $$("[data-lb]", lb).forEach(function (b) {
      b.addEventListener("click", function () {
        var a = b.getAttribute("data-lb");
        if (a === "close") closeLightbox();
        if (a === "prev") lbStep(-1);
        if (a === "next") lbStep(1);
      });
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lb-top") || e.target.classList.contains("lb-stage")) closeLightbox();
    });

    /* Tap / click to zoom */
    lbImg.addEventListener("click", function (e) {
      lbImg.style.transition = "";
      lbImg.style.transform = "";
      var zoomed = lbImg.classList.contains("zoomed");
      if (!zoomed) {
        var rect = lbImg.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        lbImg.style.transformOrigin = x + "% " + y + "%";
        lbImg.classList.add("zoomed");
      } else {
        lbImg.classList.remove("zoomed");
        lbImg.style.transformOrigin = "";
      }
    });

    /* Filmstrip navigation */
    if (lbStrip) {
      lbStrip.addEventListener("click", function (e) {
        var t = e.target.closest(".lb-thumb");
        if (!t) return;
        lbJump(parseInt(t.getAttribute("data-i"), 10));
      });
    }

    /* Swipe (touch) */
    var tX = null, tY = null;
    lb.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1 || lbImg.classList.contains("zoomed")) { tX = null; return; }
      tX = e.touches[0].clientX;
      tY = e.touches[0].clientY;
    }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (tX === null) return;
      var dx = e.changedTouches[0].clientX - tX;
      var dy = e.changedTouches[0].clientY - tY;
      tX = null;
      if (Math.abs(dx) > 45 && Math.abs(dy) < 70) lbStep(dx < 0 ? 1 : -1);
    }, { passive: true });

    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbStep(-1);
      if (e.key === "ArrowRight") lbStep(1);
    });
  }

  /* ---------- Header ---------- */
  var header = $(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    var toggle = $(".nav-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        header.classList.toggle("nav-open");
      });
      $$(".nav a").forEach(function (a) {
        a.addEventListener("click", function () { header.classList.remove("nav-open"); });
      });
    }
  }

  /* ---------- Year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
