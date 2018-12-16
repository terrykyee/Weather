// @flow
/**
 * @file Weather information container React component, also performs all the network calls.
 * Contains all the pieces needed for displaying city weather to the user
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { LineChart } from 'react-easy-chart';
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
  currentWeatherData: ?any,
  forecastData: ?any,
}

const ErrorMessages = {
  NOT_FOUND_MESSAGE: 'Current weather was not found',
  UNAUTHENTICATED_MESSAGE: 'You are not authorized to retrieve weather information',
  SERVER_FAILED: 'Open Weather servers are currently offline, please try again later',
};

type ApiRequestFunctionType = (arg: any) => Promise<*>;

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
      currentWeatherData: null,
      forecastData: null,
    }
  }

  state: WeatherInfoStateType;
  props: WeatherInfoPropsType;

  async componentDidMount() {
    const {city} = this.props.match.params;
    let currentWeatherData;
    let forecastData;

    await this.sendRequest(async () => {
      currentWeatherData = await WeatherServerRequests.currentWeather(city);
    });

    await this.sendRequest(async () => {
      forecastData = await WeatherServerRequests.forecast(city);
    });

    this.setState({
      currentWeatherData,
      forecastData,
      isFetching: false,
    });
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
   * Generate temperature data from 5-day forecast data for LineChart
   * @param forecastData 5-day forecast data
   * @returns {Array} Array of xy (time, temp) data for LineChart
   */
  generatTempData(forecastData: any): any {
    let arr = [];
    let tempData = [];

    forecastData.list.map(day =>{
      let date = new Date(day.dt * 1000);
      let dateString =
        `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
      tempData.push({
        x: dateString,
        y: convertKelvinToCelsius(day.main.temp),
      })
    });

    arr.push(tempData);
    return arr;
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
        <div className="tempChart">
          <LineChart
            xType={'time'}
            datePattern={'%d-%m-%Y %H:%M'}
            axes
            width={600}
            height={250}
            lineColors={['darkgoldenrod']}
            interpolate={'cardinal'}
            data={this.generatTempData(this.state.forecastData)}
          />
        </div>
        <div className="forecastPane">
          <Forecast
            forecastData={this.state.forecastData}
          />
        </div>
      </div>
    );
  }
}

const WeatherInfo = WeatherInfoComponent;
export default WeatherInfo;
