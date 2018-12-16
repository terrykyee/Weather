// @flow
/**
 * @file Utilities for converting data between different units/displays
 */

const KELVIN_OFFSET = -273.15;
const MPS_KMPH_CONVERSION_FACTOR = 3.6;

export function convertKelvinToCelsius(temp: number): number {
  return temp + KELVIN_OFFSET;
}

export function convertKelvinToFahrenheit(temp: number): number {
  return ((temp + KELVIN_OFFSET) * 9/5) + 32;
}

export function convertFahrenheitToCelsius(temp: number): number {
  return (temp - 32) * 5/9;
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

/**
 * Feels like (heat index) temperature
 * @param temp Temperature in F
 * @param relHumidity Relative humidity
 * @returns {number} Feels like temperature in C
 */
export function heatIndex(temp: number, relHumidity: number): number {
  let heatIndex;

  if (temp < 80) {
    heatIndex = 0.5 * (temp + 61.0 + ((temp - 68.0) * 1.2) + (relHumidity * 0.094));
  } else {
    heatIndex = -42.379 + 2.04901523 * temp + 10.14333127 * relHumidity - .22475541 * temp * relHumidity - .00683783 * temp * temp - .05481717 * relHumidity * relHumidity + .00122874 * temp * temp * relHumidity + .00085282 * temp * relHumidity * relHumidity - .00000199 * temp * temp * relHumidity * relHumidity

    if (relHumidity < 13 && (temp > 80 && temp < 120)) {
      heatIndex -= ((13 - relHumidity) / 4) * Math.sqrt((17 - Math.abs(temp - 95)) / 17);
    }

    if (relHumidity > 85 && (temp > 80 && temp < 87)) {
      heatIndex += ((relHumidity - 85) / 10) * ((87 - temp) / 5);
    }
  }

  return convertFahrenheitToCelsius(heatIndex);
}

/**
 * Wind chill calculation
 * @param temp Temperature in C
 * @param windSpeed wind speed in km/h
 * @returns {number} wind chill
 */
export function windChill(temp: number, windSpeed: number): number {
  const windSpeedPow = Math.pow(windSpeed, 0.16);
  return 13.12 + 0.6215 * temp - 11.37 * windSpeedPow + 0.3965 * temp * windSpeedPow;
}
