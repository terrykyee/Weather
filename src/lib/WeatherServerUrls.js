//@flow
/** List of URL templates for open weather server endpoints. */
import urljoin from 'url-join';

export const Paths = {
  FIVE_DAY_FORECAST: '/data/2.5/forecast',
  CURRENT_WEATHER: '/data/2.5/weather',
  SIXTEEN_DAY_FORECAST: '/data/2.5/forecast/daily',
};

export const HOST_NAME = 'api.openweathermap.org';

export const ICON_URL = 'https://openweathermap.org/img/w/';

/**
 * Represents a protocol and its characteristics.
 */
export type WebProtocolType = {
  protocol: string,
  port: ?string,
};

/** List of web protocols used in communication */
export const WebProtocols = {
  http: {
    protocol: 'http',
    port: null,
  },
  https: {
    protocol: 'https',
    port: null,
  },
};

/**
 * Class providing methods to generate URLs to weather server endpoints.
 */
export class WeatherServerUrls {
  /**
   * Formats a url origin from a given hostname and protocol.
   * @param hostname - The hostname
   * @param protocol - the Protocol
   * @returns {string} - The url origin based on the given hostname, protocol and port
   */
  static formatOrigin(hostname: string, protocol: WebProtocolType): string {
    let origin = `${encodeURIComponent(protocol.protocol)}://${encodeURIComponent(hostname)}`;

    if (protocol.port && protocol.port.length > 0) {
      origin = `${origin}:${encodeURIComponent(protocol.port)}`;
    }

    return origin;
  }

  /**
   * Gets the weather server origin for a given protocol and the current base domain.
   * @param protocol The protocol
   * @returns {string} The origin.
   */
  static getServerOrigin(protocol: WebProtocolType): string {
    return WeatherServerUrls.formatOrigin(HOST_NAME, protocol);
  }

  /**
   * Gets the endpoint to retrieve 5-day forecast for a city
   * @param city City name
   * @return {string} URL to the weather server to retrieve 5-day forecast
   */
  static forecast(city: string): string {
    const params = WeatherServerUrls.createQueryString({q: city, APPID: process.env.REACT_APP_API_KEY});
    return urljoin(WeatherServerUrls.getServerOrigin(WebProtocols.https),
      `${Paths.FIVE_DAY_FORECAST}?${params}`);
  }

  /**
   * Gets the endpoint to retrieve current weather data for a city
   * @param city City name
   * @return {string} URL to the weather server to retrieve current weather
   */
  static currentWeather(city: string): string {
    const params = WeatherServerUrls.createQueryString({q: city, APPID: process.env.REACT_APP_API_KEY});
    return urljoin(WeatherServerUrls.getServerOrigin(WebProtocols.https),
      `${Paths.CURRENT_WEATHER}?${params}`);
  }

  /**
   * Gets the endpoint to retrieve 5-day forecast for a city
   * @param city City name
   * @return {string} URL to the weather server to retrieve 5-day forecast
   */
  static longForecast(city: string): string {
    const params = WeatherServerUrls.createQueryString({q: city, APPID: process.env.REACT_APP_API_KEY});
    return urljoin(WeatherServerUrls.getServerOrigin(WebProtocols.https),
      `${Paths.SIXTEEN_DAY_FORECAST}?${params}`);
  }

  /**
   * Creates a URL query string based on the properties of a given object.
   * @param {Object} params - The object whose parameters will be used to
   * construct the query string.
   * @return {string} The query string.
   */
  static createQueryString(
    params: Object,
  ): string {
    return Object.keys(params)
      .map((key: string): string => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
      })
      .join('&');
  }
}
