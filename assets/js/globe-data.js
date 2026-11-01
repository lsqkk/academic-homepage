// Land mask and sphere geometry for the footer globe.
// The mask packs one bit per two-degree cell, generated from Natural Earth's
// 110m land polygons; rows run north to south.

var RAD = Math.PI / 180;
var GRID_W = 180;
var GRID_H = 90;
var EARTH_RADIUS_KM = 6371.0088;
var TAU = Math.PI * 2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// 90 x 180 land mask, one bit per two-degree cell. Generated from Natural
// Earth's 110m land polygons; rows run north to south.
var LAND_B64 =
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAH//5f/wAAAAAAAAAAAAAAAAAAAAAAA///////AAPwDwAADg" +
  "AAAAAAAAAAACd//////4AB/gAAAAB+AAAAAAAAAAB/H/8////4AAbAAAcABf4AGAAAAAAAD/" +
  "n/wAf//4AAAAAHwAf/4AP4AAAAAAH/3/8AP//wAAAAAMDX///+H4AAgH+AX//3/wP//gAAB8" +
  "AOH///////wBgf////79/4H/+AAAP/iH//////////8f//////l+H/wiAAf/////////////" +
  "////////3+H/A+AB+/////////////Df/////7/8D4AYAH//////////////A//////gHwB4" +
  "AAAP7////////////4APsP///gH+AAAAEP5///////////cAADwB///8H+AAAAGDz///////" +
  "//4A8AAOAB////v/gAAAPD//////////8B4AAAABf///v/4AAAfv///////////AwAAAAAP/" +
  "////wAAAX////////////AgAAAAAP////+8AAAH////////////AAAAAAAH/////8AAAD///" +
  "/v//////9AAAAAAAD/////AAAAB//7+P//////zAAAAAAAH////gAAAAf/vxPP//////zgAA" +
  "AAAAH////gAAAAfy///H/////+GAAAAAAAD///+AAAAAfC/f/H/////8CAAAAAAAB///+AAA" +
  "AAf/zf/n/////+OAAAAAAAB///8AAAAAP/Aj///////H8AAAAAAAAf//4AAAAAf/zB//////" +
  "/jwAAAAAAAAf//wAAAAAf//////////hAAAAAAAAAP/4wAAAAA///////////gAAAAAAAAAP" +
  "/A0AAAAB///////////AAAAAAAAAAH/AcAAAAD///////////gAAAAAAAAAD/A8AAAAH////" +
  "f/D///+gAAAAADAAAAfGOAAAAH//////B/7/wAAAAAAAgAAAf+H4AAAH////v+A/h+wgAAAA" +
  "AAAAAAH8EIAAAH////38A/B/AwAAAAAAAAAABfgAAAAH/////wAeB/ggAAAAAAAAAAAPgAAA" +
  "AH/////QAcAfg4AAAAAAAAAAABj/AAAD/////wAMAXh4AAAAAAAAAAAB//AAAB/////wAOAS" +
  "CcAAAAAAAAAAAAX/gAAA/////gAGAYCcAAAAAAAAAAAAH/8AAAfv///AAABsHAAAAAAAAAAA" +
  "AAH/+AAAAD///AAAA8OAAAAAAAAAAAAAP/+AAAAD//8AAAAc/+AAAAAAAAAAAAf//wAAAD//" +
  "4AAAAM/xgAAAAAAAAAAAf//+AAAB//4AAAAOfn/GAAAAAAAAAAf///AAAB//wAAAAHBw/vAA" +
  "AAAAAAAAf///gAAA//wAAAAB4AH4gAAAAAAAAAP///gAAA//wAAAAAf8HYYAAAAAAAAAH///" +
  "AAAA//4AAAAAAAxIAAAAAAAAAAH//+AAAA//4gAAAAAF7AAAAAAAAAAAD//+AAAA//5wAAAA" +
  "AP7gBAAAAAAAAAB//+AAAB//zgAAAAAf/gABAAAAAAAAA//+AAAA//DgAAAAA//wAAAAAAAA" +
  "AAA//8AAAA//HAAAAAH//4CAAAAAAAAAA//4AAAAf/HAAAAAP//8BAAAAAAAAAA//gAAAAf/" +
  "DAAAAAP//+AAAAAAAAAAA//AAAAAf+AAAAAAH//+AAAAAAAAAAA//AAAAAP8AAAAAAH//+AA" +
  "AAAAAAAAA/+AAAAAH8AAAAAAH//+AAAAAAAAAAA/8AAAAAHwAAAAAAH8/8AAAAAAAAAAA/4A" +
  "AAAAGAAAAAAADAP8AIAAAAAAAAB/wAAAAAAAAAAAAAAAH4AGAAAAAAAAB/gAAAAAAAAAAAAA" +
  "AADwAGAAAAAAAAB+AAAAAAAAAAAAAAAAA4AOAAAAAAAAD8AAAAAAAAAAAAAAAAAQA4AAAAAA" +
  "AAD8AAAAAAAAAAAAAAAAAABwAAAAAAAAD4AAAAAAAAAAAAAAAAAABgAAAAAAAAD4AAAAAAAA" +
  "AACAAAAAAAAAAAAAAAAADxgAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAA" +
  "AAAAAA/////////////////////////////////////////////////x///73///////////" +
  "///3////////8AD8AAAAAP///////////5//////T4AAHgAAAAAAP//////////x////AAAA" +
  "AADAAAAAAAA//////38AAP///8AAAAAAAAAAAAAAD///+AAAAAH////gAAAAAAAAAAAAAAH/" +
  "//+AAAAAH///4AAAAAAAAAAAAAAAP///+AAAAAD///8AAAAAAAAAAAAAAAP///4AAAAAAB8A" +
  "AAAAAAAAAAAAAAAAH/8//gAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

export function unitPoint(lat, lon) {
  var phi = lat * RAD;
  var lam = lon * RAD;
  var cosPhi = Math.cos(phi);
  return {
    x: cosPhi * Math.sin(lam),
    y: Math.sin(phi),
    z: cosPhi * Math.cos(lam)
  };
}

function decodeMask() {
  var binary = window.atob(LAND_B64);
  var bytes = new Uint8Array(binary.length);
  for (var i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function isLand(mask, lat, lon) {
  var ix = Math.floor(((lon + 180) / 360) * GRID_W);
  var iy = Math.floor(((90 - lat) / 180) * GRID_H);

  ix = clamp(ix, 0, GRID_W - 1);
  iy = clamp(iy, 0, GRID_H - 1);

  var index = iy * GRID_W + ix;
  return (mask[index >> 3] >> (7 - (index & 7))) & 1;
}

function makeRandom(seed) {
  var state = seed >>> 0;
  return function () {
    state = (state + 0x6d2b79f5) >>> 0;
    var value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

// Seeded, uniformly scattered points on the sphere, kept where the land mask
// is set. Scattering rather than a regular lattice avoids the ring patterns
// a dot grid produces near the poles.
function buildLandPoints() {
  var mask = decodeMask();
  var random = makeRandom(20261101);
  var total = window.innerWidth < 700 ? 20000 : 36000;
  var points = [];
  var i;
  var y;
  var ring;
  var theta;
  var x;
  var z;
  var lon;

  for (i = 0; i < total; i += 1) {
    y = random() * 2 - 1;
    theta = random() * TAU;
    ring = Math.sqrt(1 - y * y);
    x = Math.cos(theta) * ring;
    z = Math.sin(theta) * ring;
    lon = (Math.atan2(x, z) * 180) / Math.PI;

    if (isLand(mask, (Math.asin(y) * 180) / Math.PI, lon)) {
      points.push(x, y, z);
    }
  }

  return new Float32Array(points);
}

function buildGraticule() {
  var lines = [];
  var lat;
  var lon;
  var i;
  var n;
  var point;
  var line;

  for (lat = -60; lat <= 60; lat += 30) {
    n = 120;
    line = new Float32Array(n * 3);
    for (i = 0; i < n; i += 1) {
      point = unitPoint(lat, -180 + (360 * i) / (n - 1));
      line[i * 3] = point.x;
      line[i * 3 + 1] = point.y;
      line[i * 3 + 2] = point.z;
    }
    lines.push(line);
  }

  for (lon = -180; lon < 180; lon += 30) {
    n = 72;
    line = new Float32Array(n * 3);
    for (i = 0; i < n; i += 1) {
      point = unitPoint(-88 + (176 * i) / (n - 1), lon);
      line[i * 3] = point.x;
      line[i * 3 + 1] = point.y;
      line[i * 3 + 2] = point.z;
    }
    lines.push(line);
  }

  return lines;
}

export var LAND_POINTS = buildLandPoints();
export var GRID_LINES = buildGraticule();

export function haversine(lat1, lon1, lat2, lon2) {
  var dLat = (lat2 - lat1) * RAD;
  var dLon = (lon2 - lon1) * RAD;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
