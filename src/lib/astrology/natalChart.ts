import * as Astronomy from "astronomy-engine"

const { DEG2RAD, RAD2DEG } = Astronomy

const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const

export const PLANET_BODIES = [
  Astronomy.Body.Sun,
  Astronomy.Body.Moon,
  Astronomy.Body.Mercury,
  Astronomy.Body.Venus,
  Astronomy.Body.Mars,
  Astronomy.Body.Jupiter,
  Astronomy.Body.Saturn,
  Astronomy.Body.Uranus,
  Astronomy.Body.Neptune,
  Astronomy.Body.Pluto,
] as const

const MAJOR_ASPECTS = [
  { type: "conjunction" as const, angle: 0, orb: 8 },
  { type: "sextile" as const, angle: 60, orb: 4 },
  { type: "square" as const, angle: 90, orb: 6 },
  { type: "trine" as const, angle: 120, orb: 6 },
  { type: "opposition" as const, angle: 180, orb: 6 },
]

type ZodiacSign = (typeof ZODIAC_SIGNS)[number]
type PlanetId = (typeof PLANET_BODIES)[number]
type ChartPointId = PlanetId | "Ascendant" | "Midheaven"

export type Gender = "male" | "female" | "other" | "unspecified"

export type HouseSystem = "equal" | "whole-sign"

export interface LocationInput {
  latitude?: number
  longitude?: number
  elevationMeters?: number
  city?: string
  countryCode?: string
}

export interface CoordinateResolution {
  latitude: number
  longitude: number
  elevationMeters?: number | null
  source?: "manual" | "resolver" | "dataset"
}

export interface CoordinateResolverQuery {
  city: string
  countryCode?: string
}

export interface NatalChartInput {
  name?: string
  gender?: Gender
  birthDate: string
  birthTime: string
  utcOffsetMinutes: number
  location: LocationInput
  notes?: string
}

export interface NatalChartOptions {
  coordinateResolver?: (
    query: CoordinateResolverQuery
  ) => Promise<CoordinateResolution | null> | CoordinateResolution | null
  houseSystem?: HouseSystem
}

export interface SignPlacement {
  sign: ZodiacSign
  positionInSign: number
  formatted: string
}

export interface PlanetPlacement {
  id: PlanetId
  longitude: number
  latitude: number
  rightAscension: number
  declination: number
  distanceAu: number
  house: number
  sign: SignPlacement
}

export interface ChartAngle {
  id: "Ascendant" | "Midheaven"
  longitude: number
  sign: SignPlacement
}

export interface HouseCusp {
  house: number
  startLongitude: number
  endLongitude: number
  signs: ZodiacSign[]
}

export interface Aspect {
  type: "conjunction" | "opposition" | "square" | "trine" | "sextile"
  points: [ChartPointId, ChartPointId]
  separation: number
  orb: number
  exactAngle: number
}

export interface ZodiacSegment {
  sign: ZodiacSign
  startLongitude: number
  endLongitude: number
}

export interface ChartWheelPayload {
  signs: ZodiacSegment[]
  houses: HouseCusp[]
  points: Array<{ id: ChartPointId; longitude: number }>
}

export interface NatalChart {
  input: NatalChartInput
  calculatedAt: string
  birthDateTimeUtc: string
  birthDateTimeLocal: string
  location: Required<CoordinateResolution> & { city?: string; countryCode?: string }
  houseSystem: HouseSystem
  ascendant: ChartAngle
  midheaven: ChartAngle
  houses: HouseCusp[]
  planets: PlanetPlacement[]
  aspects: Aspect[]
  zodiacWheel: ChartWheelPayload
}

interface ChartPoint {
  id: ChartPointId
  longitude: number
  isPlanet: boolean
}

interface ParsedBirthDateTime {
  dateUtc: Date
  isoLocal: string
}

function normalizeDegree(value: number): number {
  const mod = value % 360
  return mod < 0 ? mod + 360 : mod
}

function normalizeHour(value: number): number {
  const mod = value % 24
  return mod < 0 ? mod + 24 : mod
}

function toSignPlacement(longitude: number): SignPlacement {
  const normalized = normalizeDegree(longitude)
  const signIndex = Math.floor(normalized / 30)
  const sign = ZODIAC_SIGNS[signIndex] ?? ZODIAC_SIGNS[0]
  const positionInSign = normalized - signIndex * 30
  const degrees = Math.floor(positionInSign)
  const minutesFloat = (positionInSign - degrees) * 60
  const minutes = Math.floor(minutesFloat)
  const seconds = Math.round((minutesFloat - minutes) * 60)
  const formatted = `${sign} ${degrees}°${minutes.toString().padStart(2, "0")}'${seconds
    .toString()
    .padStart(2, "0")}"`
  return { sign, positionInSign, formatted }
}

function angularSeparation(a: number, b: number): number {
  const diff = Math.abs(normalizeDegree(a) - normalizeDegree(b))
  return diff > 180 ? 360 - diff : diff
}

function isAngleBetween(start: number, end: number, value: number): boolean {
  const normStart = normalizeDegree(start)
  const normEnd = normalizeDegree(end)
  const normValue = normalizeDegree(value)
  if (normStart < normEnd) {
    return normValue >= normStart && normValue < normEnd
  }
  return normValue >= normStart || normValue < normEnd
}

function parseBirthDateTime(
  birthDate: string,
  birthTime: string,
  utcOffsetMinutes: number
): ParsedBirthDateTime {
  const [year, month, day] = birthDate.split("-").map(Number)
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new Error("birthDate must follow ISO format YYYY-MM-DD.")
  }

  const timeParts = birthTime.split(":").map(Number)
  const [hours = 0, minutes = 0, seconds = 0] = timeParts
  if (
    timeParts.length < 2 ||
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    !Number.isInteger(seconds)
  ) {
    throw new Error("birthTime must follow HH:mm or HH:mm:ss format.")
  }

  const localIso = `${birthDate}T${[hours, minutes, seconds]
    .map(value => value.toString().padStart(2, "0"))
    .join(":")}`
  const utcMillis =
    Date.UTC(year, month - 1, day, hours, minutes, seconds) - utcOffsetMinutes * 60 * 1000

  return { dateUtc: new Date(utcMillis), isoLocal: localIso }
}

async function resolveCoordinates(
  location: LocationInput,
  options: NatalChartOptions
): Promise<CoordinateResolution> {
  let latitude = typeof location.latitude === "number" ? location.latitude : null
  let longitude = typeof location.longitude === "number" ? location.longitude : null
  let elevationMeters = typeof location.elevationMeters === "number" ? location.elevationMeters : 0
  let source: CoordinateResolution["source"] = "manual"

  if (latitude === null || longitude === null) {
    if (location.city && options.coordinateResolver) {
      const resolved = await options.coordinateResolver({
        city: location.city,
        countryCode: location.countryCode,
      })
      if (resolved) {
        latitude = resolved.latitude
        longitude = resolved.longitude
        elevationMeters =
          typeof resolved.elevationMeters === "number" ? resolved.elevationMeters : elevationMeters
        source = resolved.source ?? "resolver"
      }
    }
  }

  if (latitude === null || longitude === null) {
    throw new Error(
      "Latitude and longitude are required to calculate a natal chart. Provide coordinates directly or supply a coordinateResolver."
    )
  }

  return { latitude, longitude, elevationMeters: elevationMeters ?? 0, source: source ?? "manual" }
}

function eclipticToEquatorial(lambda: number, time: Astronomy.AstroTime) {
  const tilt = Astronomy.e_tilt(time)
  const eps = tilt.tobl * DEG2RAD
  const sinLambda = Math.sin(lambda)
  const cosLambda = Math.cos(lambda)
  const ra = Math.atan2(sinLambda * Math.cos(eps), cosLambda)
  const dec = Math.asin(Math.sin(lambda) * Math.sin(eps))
  return { ra: normalizeDegree(ra * RAD2DEG), dec: dec * RAD2DEG }
}

function altitudeForLambda(
  lambda: number,
  observer: Astronomy.Observer,
  time: Astronomy.AstroTime
): number {
  const { ra, dec } = eclipticToEquatorial(lambda, time)
  const lstHours = Astronomy.SiderealTime(time) + observer.longitude / 15
  const lstRad = normalizeDegree(normalizeHour(lstHours) * 15) * DEG2RAD
  const raRad = ra * DEG2RAD
  const ha = ((lstRad - raRad + Math.PI) % (2 * Math.PI)) - Math.PI
  const latRad = observer.latitude * DEG2RAD
  const decRad = dec * DEG2RAD
  const sinAlt =
    Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(ha)
  return Math.asin(sinAlt)
}

function findAscendantLongitude(observer: Astronomy.Observer, time: Astronomy.AstroTime): number {
  let lower = 0
  let upper = 360
  const target = 0

  for (let i = 0; i < 60; i += 1) {
    const mid = (lower + upper) / 2
    const altMid = altitudeForLambda(mid * DEG2RAD, observer, time)
    if (Math.abs(altMid - target) < 1e-12) {
      return normalizeDegree(mid)
    }
    const altLower = altitudeForLambda(lower * DEG2RAD, observer, time)
    if ((altLower - target) * (altMid - target) <= 0) {
      upper = mid
    } else {
      lower = mid
    }
  }

  return normalizeDegree((lower + upper) / 2)
}

function findMidheavenLongitude(observer: Astronomy.Observer, time: Astronomy.AstroTime): number {
  const lstHours = Astronomy.SiderealTime(time) + observer.longitude / 15
  const lstRad = normalizeDegree(normalizeHour(lstHours) * 15) * DEG2RAD
  let lambda = lstRad

  for (let i = 0; i < 20; i += 1) {
    const { ra } = eclipticToEquatorial(lambda, time)
    const diffRad = normalizeDegree(ra) * DEG2RAD - lstRad
    const boundedDiff = ((diffRad + Math.PI) % (2 * Math.PI)) - Math.PI

    if (Math.abs(boundedDiff) < 1e-12) {
      return normalizeDegree(lambda * RAD2DEG)
    }

    const delta = 1e-5
    const { ra: ra2 } = eclipticToEquatorial(lambda + delta, time)
    const diffRa = ((ra2 - ra + 540) % 360) - 180
    const derivative = (diffRa * DEG2RAD) / delta
    lambda -= boundedDiff / derivative
  }

  return normalizeDegree(lambda * RAD2DEG)
}

function buildHouseCusps(ascendant: number, system: HouseSystem): HouseCusp[] {
  if (system === "equal") {
    return Array.from({ length: 12 }, (_, index) => {
      const startLongitude = normalizeDegree(ascendant + index * 30)
      const endLongitude = normalizeDegree(ascendant + (index + 1) * 30)
      return {
        house: index + 1,
        startLongitude,
        endLongitude,
        signs: deriveSignsForSegment(startLongitude, endLongitude),
      }
    })
  }

  const ascSignIndex = Math.floor(ascendant / 30)
  const ascSignStart = ascSignIndex * 30

  return Array.from({ length: 12 }, (_, index) => {
    const startLongitude = normalizeDegree(ascSignStart + index * 30)
    const endLongitude = normalizeDegree(ascSignStart + (index + 1) * 30)
    return {
      house: index + 1,
      startLongitude,
      endLongitude,
      signs: deriveSignsForSegment(startLongitude, endLongitude),
    }
  })
}

function deriveSignsForSegment(start: number, end: number): ZodiacSign[] {
  const segments: ZodiacSign[] = []
  for (let i = 0; i < ZODIAC_SIGNS.length; i += 1) {
    const signStart = i * 30
    const signEnd = signStart + 30
    if (segmentsIntersect(start, end, signStart, signEnd)) {
      segments.push(ZODIAC_SIGNS[i])
    }
  }
  return segments
}

function segmentsIntersect(startA: number, endA: number, startB: number, endB: number): boolean {
  const normStartA = normalizeDegree(startA)
  const normEndA = normalizeDegree(endA)
  const normStartB = normalizeDegree(startB)
  const normEndB = normalizeDegree(endB)

  const intervalA = expandInterval(normStartA, normEndA)
  const intervalB = expandInterval(normStartB, normEndB)

  return intervalA.some(segmentA =>
    intervalB.some(segmentB => segmentA.start < segmentB.end && segmentB.start < segmentA.end)
  )
}

function expandInterval(start: number, end: number) {
  if (start < end) {
    return [{ start, end }]
  }
  return [
    { start, end: 360 },
    { start: 0, end },
  ]
}

function findHouse(longitude: number, houses: HouseCusp[]): number {
  const normalized = normalizeDegree(longitude)
  for (let i = 0; i < houses.length; i += 1) {
    const house = houses[i]
    if (isAngleBetween(house.startLongitude, house.endLongitude, normalized)) {
      return house.house
    }
  }
  return 12
}

function buildPlanets(
  time: Astronomy.AstroTime,
  observer: Astronomy.Observer,
  houses: HouseCusp[],
  system: HouseSystem
): { placements: PlanetPlacement[]; points: ChartPoint[] } {
  const placements: PlanetPlacement[] = []
  const points: ChartPoint[] = []

  PLANET_BODIES.forEach(body => {
    const vector = Astronomy.GeoVector(body, time, true)
    const ecliptic = Astronomy.Ecliptic(vector)
    const longitude = normalizeDegree(ecliptic.elon)
    const eq = Astronomy.Equator(body, time, observer, true, true)
    const rightAscension = normalizeDegree(eq.ra * 15)
    const declination = eq.dec
    const distanceAu = eq.dist
    const house =
      system === "equal"
        ? Math.floor(((longitude - houses[0].startLongitude + 360) % 360) / 30) + 1
        : findHouse(longitude, houses)

    const placement: PlanetPlacement = {
      id: body,
      longitude,
      latitude: ecliptic.elat,
      rightAscension,
      declination,
      distanceAu,
      house: house > 12 ? ((house - 1) % 12) + 1 : house,
      sign: toSignPlacement(longitude),
    }

    placements.push(placement)
    points.push({ id: body, longitude, isPlanet: true })
  })

  return { placements, points }
}

function buildAspects(points: ChartPoint[]): Aspect[] {
  const aspects: Aspect[] = []

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const pointA = points[i]
      const pointB = points[j]
      if (!pointA.isPlanet && !pointB.isPlanet) {
        continue
      }
      const separation = angularSeparation(pointA.longitude, pointB.longitude)
      for (const aspectDef of MAJOR_ASPECTS) {
        const diff = Math.abs(separation - aspectDef.angle)
        if (diff <= aspectDef.orb) {
          aspects.push({
            type: aspectDef.type,
            points: [pointA.id, pointB.id],
            separation,
            orb: diff,
            exactAngle: aspectDef.angle,
          })
          break
        }
      }
    }
  }

  return aspects
}

function buildWheel(houses: HouseCusp[], chartPoints: ChartPoint[]): ChartWheelPayload {
  const signs: ZodiacSegment[] = ZODIAC_SIGNS.map((sign, index) => ({
    sign,
    startLongitude: index * 30,
    endLongitude: index * 30 + 30,
  }))

  return {
    signs,
    houses,
    points: chartPoints.map(point => ({
      id: point.id,
      longitude: normalizeDegree(point.longitude),
    })),
  }
}

export async function computeNatalChart(
  input: NatalChartInput,
  options: NatalChartOptions = {}
): Promise<NatalChart> {
  const houseSystem = options.houseSystem ?? "equal"
  const coordinates = await resolveCoordinates(input.location, options)
  const { dateUtc, isoLocal } = parseBirthDateTime(
    input.birthDate,
    input.birthTime,
    input.utcOffsetMinutes
  )
  const astroTime = Astronomy.MakeTime(dateUtc)
  const observer = new Astronomy.Observer(
    coordinates.latitude,
    coordinates.longitude,
    coordinates.elevationMeters ?? 0
  )

  const ascendantLongitude = findAscendantLongitude(observer, astroTime)
  const midheavenLongitude = findMidheavenLongitude(observer, astroTime)

  const houses = buildHouseCusps(ascendantLongitude, houseSystem)

  const { placements: planets, points } = buildPlanets(astroTime, observer, houses, houseSystem)

  const ascendantPoint: ChartPoint = {
    id: "Ascendant",
    longitude: ascendantLongitude,
    isPlanet: false,
  }

  const midheavenPoint: ChartPoint = {
    id: "Midheaven",
    longitude: midheavenLongitude,
    isPlanet: false,
  }

  const allPoints = [...points, ascendantPoint, midheavenPoint]
  const aspects = buildAspects(allPoints)

  return {
    input,
    calculatedAt: new Date().toISOString(),
    birthDateTimeUtc: dateUtc.toISOString(),
    birthDateTimeLocal: isoLocal,
    location: {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      elevationMeters: coordinates.elevationMeters ?? 0,
      source: coordinates.source ?? "manual",
      city: input.location.city,
      countryCode: input.location.countryCode,
    },
    houseSystem,
    ascendant: {
      id: "Ascendant",
      longitude: ascendantLongitude,
      sign: toSignPlacement(ascendantLongitude),
    },
    midheaven: {
      id: "Midheaven",
      longitude: midheavenLongitude,
      sign: toSignPlacement(midheavenLongitude),
    },
    houses,
    planets,
    aspects,
    zodiacWheel: buildWheel(houses, allPoints),
  }
}

export const NatalChartUtils = {
  ZODIAC_SIGNS,
  PLANET_BODIES,
  MAJOR_ASPECTS,
  normalizeDegree,
  toSignPlacement,
}
