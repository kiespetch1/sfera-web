import { describe, expect, it, vi } from 'vitest';

import {
  computeNatalChart,
  NatalChartOptions,
  PLANET_BODIES,
} from '../natalChart';

describe('computeNatalChart', () => {
  it('calculates sign, house, and aspect data for a known birth moment', async () => {
    const chart = await computeNatalChart({
      name: 'Reference Person',
      birthDate: '1990-06-15',
      birthTime: '08:45',
      utcOffsetMinutes: -240,
      location: {
        latitude: 40.7128,
        longitude: -74.006,
        city: 'New York',
        countryCode: 'US',
      },
    });

    expect(chart.ascendant.sign.sign).toBe('Leo');
    expect(chart.midheaven.sign.sign).toBe('Aries');

    const sun = chart.planets.find((p) => p.id === 'Sun');
    const moon = chart.planets.find((p) => p.id === 'Moon');
    const jupiter = chart.planets.find((p) => p.id === 'Jupiter');

    expect(sun).toBeDefined();
    expect(sun?.sign.sign).toBe('Gemini');
    expect(sun?.house).toBe(11);

    expect(moon).toBeDefined();
    expect(moon?.sign.sign).toBe('Pisces');
    expect(moon?.house).toBe(8);

    expect(jupiter).toBeDefined();
    expect(jupiter?.sign.sign).toBe('Cancer');

    const moonTrineJupiter = chart.aspects.find(
      (aspect) =>
        aspect.type === 'trine' &&
        aspect.points.includes('Moon') &&
        aspect.points.includes('Jupiter')
    );
    expect(moonTrineJupiter).toBeDefined();
    expect(moonTrineJupiter?.orb).toBeLessThan(0.2);

    expect(chart.houses[0]?.signs).toEqual(['Leo', 'Virgo']);
    expect(chart.zodiacWheel.points).toHaveLength(
      PLANET_BODIES.length + 2
    );
  });

  it('falls back to coordinate resolver when only city is provided', async () => {
    const resolver = vi.fn<Required<NatalChartOptions>['coordinateResolver']>();

    resolver.mockResolvedValue({
      latitude: 55.7558,
      longitude: 37.6176,
      elevationMeters: 150,
      source: 'dataset',
    });

    const chart = await computeNatalChart(
      {
        birthDate: '1984-10-26',
        birthTime: '18:30',
        utcOffsetMinutes: 180,
        location: {
          city: 'Moscow',
          countryCode: 'RU',
        },
      },
      { coordinateResolver: resolver }
    );

    expect(resolver).toHaveBeenCalledOnce();
    expect(chart.location.city).toBe('Moscow');
    expect(chart.location.source).toBe('dataset');
    expect(chart.location.latitude).toBeCloseTo(55.7558);
    expect(chart.location.longitude).toBeCloseTo(37.6176);
    expect(chart.ascendant.sign.sign).toBeTruthy();
  });
});
