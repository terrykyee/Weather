//@flow
/**
 * @file Open Weather API server requests
 */
import { checkHttpStatusCode } from './FetchUtilities';
import { WeatherServerUrls } from './WeatherServerUrls';

const WeatherRequestsErrorMessages = {
  REQUEST_ERROR: 'Error obtaining data from the Open Weather server',
};

/**
 * Implementations of all weather server requests
 */
export class WeatherServerRequests {
  static async request(url: string): Promise<*> {
    const response = await fetch(url);

    checkHttpStatusCode(response, response.status, WeatherRequestsErrorMessages.REQUEST_ERROR);
    const responseJson = await response.json();
    checkHttpStatusCode(response, responseJson.statusCode, WeatherRequestsErrorMessages.REQUEST_ERROR);
    return responseJson;
  }

  static forecast(city: string): Promise<*> {
    const url = WeatherServerUrls.forecast(city);
    return WeatherServerRequests.request(url);
  }

  static currentWeather(city: string): Promise<*> {
    const url = WeatherServerUrls.currentWeather(city);
    return WeatherServerRequests.request(url);
  }

  static longForecast(city: string): Promise<*> {
    const url = WeatherServerUrls.longForecast(city);
    return WeatherServerRequests.request(url);
  }
}
