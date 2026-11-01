// Footer connection globe.
// Renders a slowly turning dot-matrix Earth on a canvas, marks the visitor and
// the page's home point, and draws the connecting arc between them.
// Everything is computed locally; the only network call is an IP geolocation
// lookup, cached for the browser session.

import { LAND_POINTS, GRID_LINES, unitPoint, haversine } from "./globe-data.js";
import {
  locateLocation,
  readCachedLocation,
  cacheLocation,
  readOverride
} from "./globe-location.js";

(function () {
  "use strict";

  var section = document.getElementById("connection");
  if (!section) {
    return;
  }

  var canvas = document.getElementById("globe-canvas");
  var ctx = canvas.getContext("2d");

  var headingEl = document.getElementById("globe-heading");
  var ledeEl = document.getElementById("globe-lede");
  var metricEl = document.getElementById("globe-metric");
  var distanceEl = document.getElementById("globe-distance");
  var youCoordsEl = document.getElementById("globe-you-coords");
  var youTimeEl = document.getElementById("globe-you-time");
  var originCoordsEl = document.getElementById("globe-origin-coords");
  var originTimeEl = document.getElementById("globe-origin-time");

  var TAU = Math.PI * 2;
  var LAND_LEVELS = [0.1, 0.2, 0.32, 0.46, 0.6, 0.8];

  /* ------------------------------------------------------------ geometry */

  function turn(point, cosYaw, sinYaw, cosTilt, sinTilt) {
    var x1 = point.x * cosYaw + point.z * sinYaw;
    var z1 = -point.x * sinYaw + point.z * cosYaw;
    return {
      x: x1,
      y: point.y * cosTilt - z1 * sinTilt,
      z: point.y * sinTilt + z1 * cosTilt
    };
  }

  function angleDelta(target, current) {
    var delta = target - current;
    while (delta > Math.PI) {
      delta -= TAU;
    }
    while (delta < -Math.PI) {
      delta += TAU;
    }
    return delta;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /* ---------------------------------------------------------------- state */

  function numberOr(value, fallback) {
    var parsed = parseFloat(value);
    return isFinite(parsed) ? parsed : fallback;
  }

  var origin = {
    lat: numberOr(section.getAttribute("data-origin-lat"), 34.2465),
    lon: numberOr(section.getAttribute("data-origin-lon"), 108.984),
    label: section.getAttribute("data-origin-label") || "Xi'an, China",
    timezone: section.getAttribute("data-origin-tz") || "Asia/Shanghai"
  };
  var originShort = origin.label.split(",")[0];
  var originUnit = unitPoint(origin.lat, origin.lon);

  var visitor = null;
  var distanceKm = null;

  // Canvas colours come from the stylesheet so the globe follows the page's
  // light and dark palettes.
  var palette = {
    accent: "26, 90, 150",
    visitor: "0, 118, 173",
    origin: "176, 105, 20",
    bg: "255, 255, 255",
    landScale: 0.72
  };

  function readPalette() {
    var styles = window.getComputedStyle(section);
    var keys = ["accent", "visitor", "origin", "bg"];
    var names = {
      accent: "--globe-accent-rgb",
      visitor: "--globe-visitor-rgb",
      origin: "--globe-origin-rgb",
      bg: "--globe-bg-rgb"
    };

    for (var i = 0; i < keys.length; i += 1) {
      var value = (styles.getPropertyValue(names[keys[i]]) || "").trim();
      if (value) {
        palette[keys[i]] = value;
      }
    }

    var scale = parseFloat(styles.getPropertyValue("--globe-land-scale"));
    palette.landScale = isFinite(scale) ? scale : palette.landScale;
  }

  var cam = {
    yawBase: 0,
    tiltBase: 0.3,
    targetYaw: 0,
    targetTilt: 0.3,
    dragYaw: 0,
    dragTilt: 0
  };

  var width = 0;
  var height = 0;
  var dpr = 1;
  var visible = false;
  var rafId = 0;
  var lastFrame = 0;
  var lastRender = 0;
  var dragging = false;
  var dragX = 0;
  var dragY = 0;

  var reducedQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var reduced = reducedQuery ? reducedQuery.matches : false;

  /* -------------------------------------------------------------- drawing */

  function drawHalo(context, cx, cy, radius) {
    // Fade the halo out before the canvas edge, otherwise the clipped gradient
    // leaves a visible square around the globe.
    var extent = Math.min(radius * 1.5, Math.min(cx, cy) * 0.985);
    var halo = context.createRadialGradient(cx, cy, radius * 0.55, cx, cy, extent);
    halo.addColorStop(0, "rgba(" + palette.accent + ", 0.14)");
    halo.addColorStop(0.55, "rgba(" + palette.accent + ", 0.05)");
    halo.addColorStop(1, "rgba(" + palette.accent + ", 0)");
    context.fillStyle = halo;
    context.beginPath();
    context.arc(cx, cy, extent, 0, TAU);
    context.fill();

    var body = context.createRadialGradient(
      cx - radius * 0.35,
      cy - radius * 0.4,
      radius * 0.1,
      cx,
      cy,
      radius * 1.02
    );
    body.addColorStop(0, "rgba(" + palette.accent + ", 0.1)");
    body.addColorStop(0.65, "rgba(" + palette.accent + ", 0.035)");
    body.addColorStop(1, "rgba(" + palette.accent + ", 0)");
    context.fillStyle = body;
    context.beginPath();
    context.arc(cx, cy, radius, 0, TAU);
    context.fill();
  }

  function drawGraticule(context, cx, cy, radius, cosYaw, sinYaw, cosTilt, sinTilt) {
    var front = new Path2D();
    var back = new Path2D();
    var i;
    var j;
    var line;
    var prev;
    var x1;
    var z1;
    var y2;
    var z2;
    var point;

    for (i = 0; i < GRID_LINES.length; i += 1) {
      line = GRID_LINES[i];
      prev = null;

      for (j = 0; j < line.length; j += 3) {
        x1 = line[j] * cosYaw + line[j + 2] * sinYaw;
        z1 = -line[j] * sinYaw + line[j + 2] * cosYaw;
        y2 = line[j + 1] * cosTilt - z1 * sinTilt;
        z2 = line[j + 1] * sinTilt + z1 * cosTilt;
        point = { x: cx + x1 * radius, y: cy - y2 * radius, z: z2 };

        if (prev) {
          if (prev.z + point.z > 0) {
            front.moveTo(prev.x, prev.y);
            front.lineTo(point.x, point.y);
          } else {
            back.moveTo(prev.x, prev.y);
            back.lineTo(point.x, point.y);
          }
        }

        prev = point;
      }
    }

    context.lineWidth = 1;
    context.strokeStyle = "rgba(" + palette.accent + ", 0.04)";
    context.stroke(back);
    context.strokeStyle = "rgba(" + palette.accent + ", 0.16)";
    context.stroke(front);
  }

  function drawLand(context, cx, cy, radius, cosYaw, sinYaw, cosTilt, sinTilt) {
    var paths = [];
    var level;
    var i;
    var x1;
    var z1;
    var y2;
    var z2;
    var size;

    for (level = 0; level < LAND_LEVELS.length; level += 1) {
      paths.push(new Path2D());
    }

    for (i = 0; i < LAND_POINTS.length; i += 3) {
      x1 = LAND_POINTS[i] * cosYaw + LAND_POINTS[i + 2] * sinYaw;
      z1 = -LAND_POINTS[i] * sinYaw + LAND_POINTS[i + 2] * cosYaw;
      y2 = LAND_POINTS[i + 1] * cosTilt - z1 * sinTilt;
      z2 = LAND_POINTS[i + 1] * sinTilt + z1 * cosTilt;

      if (z2 <= 0.015) {
        continue;
      }

      level = Math.min(LAND_LEVELS.length - 1, Math.floor(z2 * LAND_LEVELS.length));
      size = 0.95 + z2 * 0.75;
      paths[level].rect(
        cx + x1 * radius - size / 2,
        cy - y2 * radius - size / 2,
        size,
        size
      );
    }

    for (i = 0; i < paths.length; i += 1) {
      context.fillStyle = "rgba(" + palette.accent + ", " + LAND_LEVELS[i] * palette.landScale + ")";
      context.fill(paths[i]);
    }
  }

  function drawRim(context, cx, cy, radius) {
    context.save();
    context.shadowColor = "rgba(" + palette.accent + ", 0.35)";
    context.shadowBlur = 22;
    context.strokeStyle = "rgba(" + palette.accent + ", 0.32)";
    context.lineWidth = 1;
    context.beginPath();
    context.arc(cx, cy, radius, 0, TAU);
    context.stroke();
    context.restore();
  }

  function markerPosition(unit, cx, cy, radius, cosYaw, sinYaw, cosTilt, sinTilt) {
    var rotated = turn(unit, cosYaw, sinYaw, cosTilt, sinTilt);
    if (rotated.z <= 0.02) {
      return null;
    }
    return {
      x: cx + rotated.x * radius,
      y: cy - rotated.y * radius,
      z: rotated.z
    };
  }

  function drawMarker(context, point, color, ringColor, isVisitor) {
    if (!point) {
      return;
    }

    context.beginPath();
    context.arc(point.x, point.y, isVisitor ? 6 : 5.5, 0, TAU);
    context.strokeStyle = ringColor;
    context.lineWidth = 1;
    context.stroke();

    context.save();
    context.shadowColor = color;
    context.shadowBlur = 14;
    context.beginPath();
    context.arc(point.x, point.y, isVisitor ? 2.6 : 2.3, 0, TAU);
    context.fillStyle = color;
    context.fill();
    context.restore();

    if (isVisitor) {
      context.beginPath();
      context.arc(point.x, point.y, 1.3, 0, TAU);
      context.fillStyle = "#f4fdff";
      context.fill();
    }
  }

  function drawPulses(context, point, now) {
    var period = 2600;
    var count = 3;

    for (var i = 0; i < count; i += 1) {
      var phase = ((now + (i * period) / count) % period) / period;
      var radius = 4 + phase * 20;
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, TAU);
      context.strokeStyle = "rgba(" + palette.visitor + ", " + 0.45 * (1 - phase) + ")";
      context.lineWidth = 1;
      context.stroke();
    }
  }

  function drawLabel(context, point, text, color, cx, cy) {
    if (!point || !text) {
      return;
    }

    var dx = point.x - cx;
    var dy = point.y - cy;
    var length = Math.sqrt(dx * dx + dy * dy);

    if (length < 12) {
      dx = 0;
      dy = -1;
      length = 1;
    }

    var labelX = point.x + (dx / length) * 16;
    var labelY = point.y + (dy / length) * 16;
    var maxX = context.canvas.clientWidth - 6;
    var maxY = context.canvas.clientHeight - 10;

    context.font = '10px "Ubuntu Mono", ui-monospace, Menlo, Consolas, monospace';
    context.textAlign = dx >= 0 ? "left" : "right";
    context.textBaseline = "middle";

    var textWidth = context.measureText(text).width;
    labelX = context.textAlign === "left"
      ? Math.min(labelX, maxX - textWidth)
      : Math.max(labelX, 6 + textWidth);
    labelY = clamp(labelY, 10, maxY);
    context.lineWidth = 3;
    context.strokeStyle = "rgba(" + palette.bg + ", 0.72)";
    context.strokeText(text, labelX, labelY);
    context.fillStyle = color;
    context.fillText(text, labelX, labelY);
  }

  function pointOnArc(from, control, to, t) {
    var inv = 1 - t;
    return {
      x: inv * inv * from.x + 2 * inv * t * control.x + t * t * to.x,
      y: inv * inv * from.y + 2 * inv * t * control.y + t * t * to.y
    };
  }

  function drawArc(context, cx, cy, visitorPoint, originPoint, now) {
    if (!visitorPoint || !originPoint) {
      return;
    }

    var dx = originPoint.x - visitorPoint.x;
    var dy = originPoint.y - visitorPoint.y;
    var chord = Math.sqrt(dx * dx + dy * dy);

    if (chord < 8) {
      return;
    }

    // Bow the route away from the chord, always upward on screen.
    var nx = -dy / chord;
    var ny = dx / chord;

    if (ny > 0) {
      nx = -nx;
      ny = -ny;
    }

    var midX = (visitorPoint.x + originPoint.x) / 2;
    var midY = (visitorPoint.y + originPoint.y) / 2;
    var control = {
      x: midX + nx * chord * 0.22,
      y: midY + ny * chord * 0.22
    };

    var path = new Path2D();
    path.moveTo(visitorPoint.x, visitorPoint.y);
    path.quadraticCurveTo(control.x, control.y, originPoint.x, originPoint.y);

    var gradient = context.createLinearGradient(
      visitorPoint.x,
      visitorPoint.y,
      originPoint.x,
      originPoint.y
    );
    gradient.addColorStop(0, "rgba(" + palette.visitor + ", 0.95)");
    gradient.addColorStop(1, "rgba(" + palette.origin + ", 0.95)");

    context.save();
    context.lineCap = "round";

    context.strokeStyle = "rgba(" + palette.visitor + ", 0.14)";
    context.lineWidth = 7;
    context.shadowColor = "rgba(" + palette.visitor + ", 0.45)";
    context.shadowBlur = 14;
    context.stroke(path);

    context.shadowBlur = 0;
    context.strokeStyle = "rgba(" + palette.bg + ", 0.72)";
    context.lineWidth = 4.5;
    context.stroke(path);

    context.strokeStyle = gradient;
    context.lineWidth = 2;
    context.setLineDash([3.5, 4.5]);
    context.lineDashOffset = reduced ? 0 : -(now * 0.02) % 8;
    context.stroke(path);

    context.restore();

    if (reduced) {
      return;
    }

    var progress = (now * 0.00009) % 1;
    var tailLength = 0.09;

    context.save();
    context.lineCap = "round";

    for (var i = 0; i < 12; i += 1) {
      var a = Math.max(0, progress - tailLength * (i + 1) / 12);
      var b = Math.max(0, progress - tailLength * i / 12);

      if (b <= 0) {
        continue;
      }

      var pa = pointOnArc(visitorPoint, control, originPoint, a);
      var pb = pointOnArc(visitorPoint, control, originPoint, b);
      var fade = 1 - i / 12;

      context.beginPath();
      context.moveTo(pa.x, pa.y);
      context.lineTo(pb.x, pb.y);
      context.strokeStyle = "rgba(" + palette.visitor + ", " + 0.6 * fade + ")";
      context.lineWidth = 1.8;
      context.stroke();
    }

    var head = pointOnArc(visitorPoint, control, originPoint, progress);
    var glow = context.createRadialGradient(head.x, head.y, 0, head.x, head.y, 9);
    glow.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    glow.addColorStop(0.35, "rgba(" + palette.visitor + ", 0.6)");
    glow.addColorStop(1, "rgba(" + palette.visitor + ", 0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(head.x, head.y, 9, 0, TAU);
    context.fill();
    context.restore();
  }

  function render(now, yaw, tilt) {
    if (!width || !height) {
      return;
    }

    var size = Math.min(width, height);
    var radius = size * 0.4;
    var cx = width / 2;
    var cy = height / 2;
    var cosYaw = Math.cos(yaw);
    var sinYaw = Math.sin(yaw);
    var cosTilt = Math.cos(tilt);
    var sinTilt = Math.sin(tilt);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    drawHalo(ctx, cx, cy, radius);
    drawGraticule(ctx, cx, cy, radius, cosYaw, sinYaw, cosTilt, sinTilt);
    drawLand(ctx, cx, cy, radius, cosYaw, sinYaw, cosTilt, sinTilt);
    drawRim(ctx, cx, cy, radius);

    var originPoint = markerPosition(originUnit, cx, cy, radius, cosYaw, sinYaw, cosTilt, sinTilt);
    var visitorPoint = visitor
      ? markerPosition(unitPoint(visitor.lat, visitor.lon), cx, cy, radius, cosYaw, sinYaw, cosTilt, sinTilt)
      : null;

    drawArc(ctx, cx, cy, visitorPoint, originPoint, now);

    if (visitorPoint && !reduced) {
      drawPulses(ctx, visitorPoint, now);
    }

    drawMarker(ctx, originPoint, "rgba(" + palette.origin + ", 0.92)", "rgba(" + palette.origin + ", 0.55)", false);
    drawMarker(ctx, visitorPoint, "rgba(" + palette.visitor + ", 0.95)", "rgba(" + palette.visitor + ", 0.55)", true);

    var visitorLabel = visitor && (visitor.city || visitor.country) ? (visitor.city || visitor.country).toUpperCase() : "YOU";

    if (distanceKm === null || distanceKm > 20) {
      drawLabel(ctx, visitorPoint, visitorLabel, "rgba(" + palette.visitor + ", 0.92)", cx, cy);
    }

    drawLabel(ctx, originPoint, originShort.toUpperCase(), "rgba(" + palette.origin + ", 0.92)", cx, cy);
  }

  /* --------------------------------------------------------------- motion */

  function setCameraBase(from, to) {
    var mx = from.x + to.x;
    var my = from.y + to.y;
    var mz = from.z + to.z;
    var length = Math.sqrt(mx * mx + my * my + mz * mz);

    if (length < 0.2) {
      mx = from.x;
      my = from.y;
      mz = from.z;
    } else {
      mx /= length;
      my /= length;
      mz /= length;
    }

    var horizontal = Math.sqrt(mx * mx + mz * mz) || 1;

    cam.targetYaw = Math.atan2(-mx, mz);
    cam.targetTilt = clamp(Math.atan2(my, horizontal), -0.95, 0.95);

    if (reduced) {
      cam.yawBase = cam.targetYaw;
      cam.tiltBase = cam.targetTilt;
    }
  }

  function applyReducedSetting() {
    reduced = reducedQuery ? reducedQuery.matches : false;
    lastFrame = 0;

    if (reduced) {
      stopFrame();
      cam.yawBase = cam.targetYaw;
      cam.tiltBase = cam.targetTilt;
    }

    ensureFrame();
  }

  function frame(now) {
    if (!visible || reduced) {
      rafId = 0;
      if (visible) {
        render(
          now,
          cam.yawBase + cam.dragYaw,
          clamp(cam.tiltBase + cam.dragTilt, -1.15, 1.15)
        );
      }
      return;
    }

    var delta = lastFrame ? Math.min(now - lastFrame, 64) : 16;
    lastFrame = now;
    var ease = 1 - Math.exp(-delta / 320);

    cam.yawBase += angleDelta(cam.targetYaw, cam.yawBase) * ease;
    cam.tiltBase += (cam.targetTilt - cam.tiltBase) * ease;

    var swing = reduced ? 0 : Math.sin(now * 0.0001) * 0.38;

    // The globe moves slowly; ~30fps keeps the motion smooth while halving
    // the per-frame cost on phones.
    if (now - lastRender >= 30) {
      render(
        now,
        cam.yawBase + swing + cam.dragYaw,
        clamp(cam.tiltBase + cam.dragTilt, -1.15, 1.15)
      );
      lastRender = now;
    }

    rafId = window.requestAnimationFrame(frame);
  }

  function ensureFrame() {
    if (!visible) {
      return;
    }

    if (reduced) {
      render(performance.now(), cam.yawBase + cam.dragYaw, clamp(cam.tiltBase + cam.dragTilt, -1.15, 1.15));
      return;
    }

    if (!rafId) {
      lastFrame = 0;
      rafId = window.requestAnimationFrame(frame);
    }
  }

  function stopFrame() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    width = Math.round(rect.width);
    height = Math.round(rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, width < 420 ? 1.6 : 2);

    if (!width || !height) {
      return;
    }

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ensureFrame();
  }

  /* ------------------------------------------------------------ copy & times */

  function formatCoords(lat, lon) {
    var ns = lat >= 0 ? "N" : "S";
    var ew = lon >= 0 ? "E" : "W";
    return Math.abs(lat).toFixed(2) + "° " + ns + " · " + Math.abs(lon).toFixed(2) + "° " + ew;
  }

  function formatDistance(km) {
    if (km < 1) {
      return "<1";
    }
    if (km < 10) {
      return km.toFixed(1);
    }
    return Math.round(km).toLocaleString("en-US");
  }

  function timeAt(timeZone) {
    if (!timeZone) {
      return "";
    }

    try {
      return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: timeZone
      }).format(new Date());
    } catch (error) {
      return "";
    }
  }

  function deviceTimeZone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch (error) {
      return "";
    }
  }


  function refreshTimes() {
    originTimeEl.textContent = timeAt(origin.timezone);
    if (visitor) {
      youTimeEl.textContent = timeAt(visitor.timezone || deviceTimeZone());
    }
  }

  /* ------------------------------------------------------------- interface */

  function updateCopy(info) {
    var place = info.city || info.region || info.country;
    var distance = formatDistance(distanceKm);
    var spokenDistance = distanceKm < 1 ? "under 1" : distance;

    headingEl.textContent = place
      ? "Welcome, a friend from " + place + "."
      : "Welcome, a friend from somewhere on Earth.";

    if (distanceKm <= 30) {
      ledeEl.textContent =
        "You are just " + spokenDistance + " km away — close enough to say hello in person. " +
        "Thanks for stopping by.";
    } else {
      ledeEl.textContent =
        "We are " + distance + " km apart, measured along the curve of the Earth. " +
        "This page still made it to your screen.";
    }

    metricEl.hidden = false;
    distanceEl.textContent = distance;
    youCoordsEl.textContent = formatCoords(info.lat, info.lon);
    originCoordsEl.textContent = formatCoords(origin.lat, origin.lon);
    refreshTimes();
  }

  function useFallback() {
    youCoordsEl.textContent = "Unavailable";
    youTimeEl.textContent = "";
    originCoordsEl.textContent = formatCoords(origin.lat, origin.lon);
    ledeEl.textContent =
      "The globe is still turning. This page lives in " + origin.label +
      " — wherever you opened it, thanks for reading.";
    refreshTimes();
    ensureFrame();
  }

  function applyVisitor(info) {
    visitor = info;
    distanceKm = haversine(origin.lat, origin.lon, info.lat, info.lon);
    setCameraBase(unitPoint(info.lat, info.lon), originUnit);
    updateCopy(info);
    ensureFrame();
  }

  function start() {
    if (visible) {
      return;
    }
    visible = true;
    ensureFrame();
  }

  function stop() {
    visible = false;
    stopFrame();
  }

  function init() {
    readPalette();
    originCoordsEl.textContent = formatCoords(origin.lat, origin.lon);
    refreshTimes();
    setCameraBase(originUnit, originUnit);
    cam.yawBase = cam.targetYaw;
    cam.tiltBase = cam.targetTilt;

    resize();

    if (window.IntersectionObserver) {
      var observer = new window.IntersectionObserver(
        function (entries) {
          if (entries[0] && entries[0].isIntersecting) {
            start();
          } else {
            stop();
          }
        },
        { rootMargin: "160px 0px" }
      );
      observer.observe(section);
    } else {
      start();
    }

    var themeQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    if (themeQuery) {
      var onThemeChange = function () {
        readPalette();
        ensureFrame();
      };
      if (themeQuery.addEventListener) {
        themeQuery.addEventListener("change", onThemeChange);
      } else if (themeQuery.addListener) {
        themeQuery.addListener(onThemeChange);
      }
    }

    if (reducedQuery) {
      if (reducedQuery.addEventListener) {
        reducedQuery.addEventListener("change", applyReducedSetting);
      } else if (reducedQuery.addListener) {
        reducedQuery.addListener(applyReducedSetting);
      }
    }

    if (window.ResizeObserver) {
      new window.ResizeObserver(resize).observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }

    canvas.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "touch") {
        return;
      }
      dragging = true;
      dragX = event.clientX;
      dragY = event.clientY;
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch (error) {
        /* pointer capture is a progressive enhancement */
      }
    });

    canvas.addEventListener("pointermove", function (event) {
      if (!dragging) {
        return;
      }
      cam.dragYaw += (event.clientX - dragX) * 0.006;
      cam.dragTilt = clamp(cam.dragTilt + (event.clientY - dragY) * 0.004, -0.6, 0.6);
      dragX = event.clientX;
      dragY = event.clientY;

      if (reduced) {
        ensureFrame();
      }
    });

    function endDrag() {
      dragging = false;
    }

    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);


    window.setInterval(refreshTimes, 30000);

    var override = readOverride();
    if (override) {
      applyVisitor(override);
      return;
    }

    var cached = readCachedLocation();
    if (cached) {
      applyVisitor(cached);
      return;
    }

    locateLocation()
      .then(function (info) {
        cacheLocation(info);
        applyVisitor(info);
      })
      .catch(useFallback);
  }

  init();
})();
