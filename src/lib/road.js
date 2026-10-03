// Geometry for the journey "winding road": a smooth path through a list of
// points, plus a lookup table so a scroll position can be turned into "how
// much of the road is travelled".

const SAMPLES_PER_SEGMENT = 64

const round = (n) => Math.round(n * 10) / 10

const cubic = (p0, p1, p2, p3, t) => {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

// Joins each pair of points with a cubic whose handles are vertical, so the
// road enters and leaves every point heading straight down. That makes the
// whole path smooth (no corners at the points) and means y only ever
// increases along it — which is what lets `roadAt` look positions up by y.
//
// `handle` (0–1) is how far the handles reach as a share of the vertical gap:
// higher values hold the road vertical for longer and cross over more sharply.
//
// Returns the SVG path data and a sampled table of the road:
//   xs/ys  sample positions, ls  distance travelled at each sample.
export function buildRoad(rawPoints, handle = 0.5) {
  const points = rawPoints
    .map((p) => ({ x: round(p.x), y: round(p.y) }))
    // Guard against points that don't move down the page: they would break
    // the "y always increases" guarantee.
    .filter((p, i, all) => i === 0 || p.y > all[i - 1].y)

  const xs = [points[0].x]
  const ys = [points[0].y]
  const ls = [0]
  let d = `M${points[0].x} ${points[0].y}`
  let total = 0

  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const reach = round((b.y - a.y) * handle)
    d += ` C${a.x} ${round(a.y + reach)} ${b.x} ${round(b.y - reach)} ${b.x} ${b.y}`

    for (let s = 1; s <= SAMPLES_PER_SEGMENT; s++) {
      const t = s / SAMPLES_PER_SEGMENT
      const x = cubic(a.x, a.x, b.x, b.x, t)
      const y = cubic(a.y, a.y + reach, b.y - reach, b.y, t)
      total += Math.hypot(x - xs[xs.length - 1], y - ys[ys.length - 1])
      xs.push(x)
      ys.push(y)
      ls.push(total)
    }
  }

  return { d, xs, ys, ls, total, yStart: ys[0], yEnd: ys[ys.length - 1] }
}

// The point on the road at height `y`: its x position and how far along the
// road it is. Clamped to the road's two ends.
export function roadAt(road, y) {
  const { xs, ys, ls } = road
  const last = ys.length - 1
  if (y <= ys[0]) return { x: xs[0], y: ys[0], length: 0 }
  if (y >= ys[last]) return { x: xs[last], y: ys[last], length: ls[last] }

  let lo = 0
  let hi = last
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (ys[mid] <= y) lo = mid
    else hi = mid
  }
  const f = (y - ys[lo]) / (ys[hi] - ys[lo] || 1)
  return { x: xs[lo] + (xs[hi] - xs[lo]) * f, y, length: ls[lo] + (ls[hi] - ls[lo]) * f }
}
