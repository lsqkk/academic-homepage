// IP-based location lookup for the footer globe.
// Providers are tried in order; the result is cached for the browser session.
// Nothing is sent anywhere except the lookup request itself.

function normalize(info) {
  var lat = Number(info.lat);
  var lon = Number(info.lon);

  if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    throw new Error("invalid coordinates");
  }

  if (Math.abs(lat) < 0.001 && Math.abs(lon) < 0.001) {
    throw new Error("empty coordinates");
  }

  return {
    city: String(info.city || "").trim().slice(0, 48),
    region: String(info.region || "").trim().slice(0, 48),
    country: String(info.country || "").trim().slice(0, 48),
    lat: lat,
    lon: lon,
    timezone: info.timezone ? String(info.timezone) : ""
  };
}

function fromIpwho(data) {
  if (!data || data.success !== true) {
    throw new Error("ipwho unavailable");
  }
  return normalize({
    city: data.city,
    region: data.region,
    country: data.country,
    lat: data.latitude,
    lon: data.longitude,
    timezone: data.timezone && data.timezone.id
  });
}

function fromB52m(data) {
  if (!data || data.code !== 200 || !data.data) {
    throw new Error("b52m unavailable");
  }
  var d = data.data;
  return normalize({
    city: d.city_name_3 || d.city_name_2 || d.city_name,
    region: d.province_name_3 || d.region_name,
    country: d.country_name,
    lat: parseFloat(d.latitude_2 || d.latitude_3),
    lon: parseFloat(d.longitude_2 || d.longitude_3),
    timezone: ""
  });
}

function fromIpapiIs(data) {
  if (!data || data.lat === undefined || data.lon === undefined) {
    throw new Error("ipapi.is unavailable");
  }
  return normalize({
    city: data.city,
    region: data.region,
    country: data.country,
    lat: data.lat,
    lon: data.lon,
    timezone: data.timezone
  });
}

function fetchJSON(url, timeout) {
  var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  var timer = window.setTimeout(function () {
    if (controller) {
      controller.abort();
    }
  }, timeout || 6500);

  return window
    .fetch(url, {
      cache: "no-store",
      signal: controller ? controller.signal : undefined,
      headers: { Accept: "application/json" }
    })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      window.clearTimeout(timer);
      return data;
    })
    .catch(function (error) {
      window.clearTimeout(timer);
      throw error;
    });
}

export function locateLocation() {
  return fetchJSON("https://ipwho.is/", 6500)
    .then(fromIpwho)
    .catch(function () {
      return fetchJSON("https://api.ipapi.is/", 6500)
        .then(fromIpapiIs)
        .catch(function () {
          return fetchJSON("https://api.b52m.cn/api/IP/", 6500).then(fromB52m);
        });
    });
}

export function readCachedLocation() {
  try {
    var raw = window.sessionStorage.getItem("hp.globe.location.v1");
    if (!raw) {
      return null;
    }
    var cached = JSON.parse(raw);
    if (!cached || Date.now() - cached.time > 6 * 60 * 60 * 1000) {
      return null;
    }
    return normalize(cached.info);
  } catch (error) {
    return null;
  }
}

export function cacheLocation(info) {
  try {
    window.sessionStorage.setItem(
      "hp.globe.location.v1",
      JSON.stringify({ time: Date.now(), info: info })
    );
  } catch (error) {
    /* storage unavailable; the lookup simply runs again next time */
  }
}

export function readOverride() {
  try {
    var params = new URLSearchParams(window.location.search);
    if (!params.has("lat") || !params.has("lon")) {
      return null;
    }
    return normalize({
      city: params.get("city") || "",
      country: "",
      lat: params.get("lat"),
      lon: params.get("lon"),
      timezone: params.get("tz") || ""
    });
  } catch (error) {
    return null;
  }
}
