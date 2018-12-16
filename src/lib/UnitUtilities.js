// @flow
/**
 * @file Utilities for converting data between different units/displays
 */

const KELVIN_OFFSET = -273.15;
const MPS_KMPH_CONVERSION_FACTOR = 3.6;

export function convertKelvinToCelsius(temp: number): number {
  return temp + KELVIN_OFFSET;
}

export function metersPerSecondToKmPerHour(velocity: number): number {
  return velocity * MPS_KMPH_CONVERSION_FACTOR;
}

export function degToCompass(deg: number): string {
  const val = Math.floor((deg / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[(val % 16)];
}

export function formatDate(timestamp: number): string {
  let date = new Date(timestamp * 1000);
  return `${date.getDate()+1}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}
