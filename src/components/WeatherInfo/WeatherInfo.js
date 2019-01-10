// @flow
/**
 * @file Weather information container React component, also performs all the network calls.
 * Contains all the pieces needed for displaying city weather to the user
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import cityTimezones from 'city-timezones';
import './WeatherInfo.css';
import { WeatherServerRequests } from '../../lib/WeatherServerRequests';
import {
  NotFoundDataAccessError,
  UnauthenticatedDataAccessError,
} from "../../lib/NetworkUtilities";
import CurrentWeather from '../CurrentWeather/CurrentWeather';
import Forecast from '../Forecast/Forecast';
import { convertKelvinToCelsius } from '../../lib/UnitUtilities';

// Flow type definitions for injected props
type WeatherInfoInjectedPropsType = {
  match: any,
}

// Flow type definitions for connected props
type WeatherInfoConnectedPropsType = {
}

// Flow type definitions for bound props
type WeatherInfoBoundPropsType = {
}

type WeatherInfoPropsType = WeatherInfoInjectedPropsType &
  WeatherInfoBoundPropsType & WeatherInfoConnectedPropsType;

/**
 * The state declaration for the weather info state
 */
type WeatherInfoStateType = {
  isFetching: boolean,
  error: string,
  currentWeatherData: any,
  forecastData: any,
}

const ErrorMessages = {
  NOT_FOUND_MESSAGE: 'Weather information was not found for this city',
  UNAUTHENTICATED_MESSAGE: 'You are not authorized to retrieve weather information',
  SERVER_FAILED: 'Open Weather servers are currently offline, please try again later',
};

type ApiRequestFunctionType = (arg: any) => Promise<*>;

const MOMENT_DATE_TIME_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';

/**
 * Weather Info React Component class
 */
class WeatherInfoComponent extends
  React.PureComponent<WeatherInfoPropsType, WeatherInfoStateType> {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  constructor(props: WeatherInfoPropsType) {
    super(props);

    this.state = {
      isFetching: true,
      error: '',
      currentWeatherData: {},
      forecastData: {},
    }
  }

  state: WeatherInfoStateType;
  props: WeatherInfoPropsType;

  async componentDidMount() {
    const {city} = this.props.match.params;
    let currentWeatherData = {};
    let forecastData = {};

    await this.sendRequest(async () => {
      currentWeatherData = await WeatherServerRequests.currentWeather(city);
    });

    await this.sendRequest(async () => {
      forecastData = await WeatherServerRequests.forecast(city);
    });

    forecastData = this.adjustDataForTimezone(city, forecastData);
    let sortedForecastData = this.sortByDay(forecastData);

    this.setState({
      currentWeatherData,
      forecastData,
      sortedForecastData,
      isFetching: false,
    });
  }

  /**
   * Adjust date text data appropriate for that city's timezone if we can find it, otherwise
   * use our local timezone
   * @param cityName City name
   * @param forecastData Forecast data from API
   * @returns {any} Forecast data with modified dt_txt
   */
  adjustDataForTimezone(cityName: string, forecastData: any): any {
    const cityLookup = cityTimezones.lookupViaCity(cityName);

    if (cityLookup && cityLookup.length > 0) {
      console.log(`Found timezone for ${cityName}: ${cityLookup[0].timezone}`);
      moment.tz.setDefault(cityLookup[0].timezone);
    } else {
      console.log(`Could not find timezone for ${cityName}, sticking with local timezone`);
    }

    forecastData.list.forEach(entry => {
      entry.dt = entry.dt*1000;
      entry.dt_txt = moment(entry.dt).format(MOMENT_DATE_TIME_FORMAT);
    });
    return forecastData;
  }

  /**
   * Sort forecast data into a map of days
   * @param forecastData Forecast data
   */
  sortByDay(forecastData: any): Object {
    const fiveDayForecast = {};

    forecastData.list.forEach(entry =>{
      const day = moment(entry.dt).format('DD');
      if (!fiveDayForecast[day]) {
        fiveDayForecast[day] = {
          data: [],
          maxTemp: -Number.MAX_VALUE,
          minTemp: Number.MAX_VALUE,
        };
      }

      const dayForecast = fiveDayForecast[day];
      dayForecast.data.push(entry);
      dayForecast.maxTemp = Math.max(dayForecast.maxTemp, convertKelvinToCelsius(entry.main.temp));
      dayForecast.minTemp = Math.min(dayForecast.minTemp, convertKelvinToCelsius(entry.main.temp));
    });

    return fiveDayForecast;
  }

  /**
   * Higher order function to genericize request error handling for all requests made from this
   * component
   * @param requestHandler Request handling function to take inputs then send appropriate request
   * @returns {Promise<void>}
   */
  async sendRequest(requestHandler: ApiRequestFunctionType) {
    try {
      await requestHandler();
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundDataAccessError) {
        this.setState({
          error: ErrorMessages.NOT_FOUND_MESSAGE,
          isFetching: false,
        });
        return;
      }

      if (error instanceof UnauthenticatedDataAccessError) {
        this.setState({
          error: ErrorMessages.UNAUTHENTICATED_MESSAGE,
          isFetching: false,
        });
        return;
      }

      this.setState({
        error: ErrorMessages.SERVER_FAILED,
        isFetching: false,
      });
    }
  }



  /**
   * Render this React component.
   * @returns {XML}
   */
  render(): React.Node {
    if (this.state.isFetching) {
      return <div className="loader"/>
    }

    if (this.state.error) {
      return (
        <div className="error">
          {this.state.error}
        </div>
      );
    }

    return (
      <div className="weatherContainer">
        <div className="weatherPane">
          <CurrentWeather
            currentWeatherData={this.state.currentWeatherData}
          />
        </div>
        <div className="forecastPane">
          <Forecast
            sortedForecastData={this.state.sortedForecastData}
            forecastData={this.state.forecastData}
          />
        </div>
      </div>
    );
  }
}

const WeatherInfo = WeatherInfoComponent;
export default WeatherInfo;
