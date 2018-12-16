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
import { WeatherInfoDisplayConstants } from '../../lib/DisplayConstants';
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
  showRange: boolean,
  averageTemp: number,
}

const ErrorMessages = {
  NOT_FOUND_MESSAGE: 'Weather information was not found for this city',
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
      currentWeatherData: {},
      forecastData: {},
      showRange: false,
      averageTemp: 0,
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

    const averageTemp = WeatherInfoComponent.findTempAverage(forecastData);

    this.setState({
      currentWeatherData,
      forecastData,
      isFetching: false,
      averageTemp,
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

    if (forecastData && forecastData.list && forecastData.list.length > 0) {
      arr.push(this.generateChartData(forecastData, 'temp'));

      if (this.state.showRange) {
        arr.push(this.generateChartData(forecastData, 'temp_min'));
        arr.push(this.generateChartData(forecastData, 'temp_max'));
      }
    }



    return arr;
  }

  /**
   * Helper function to generate chart temperature data
   * @param forecastData 5-day forecast data
   * @param tempPropertyName Forecast data temperature property name to extract
   * @returns {Array} Array of chart compatible data
   */
  generateChartData(forecastData: any, tempPropertyName: string) {
    let tempData = [];

    forecastData.list.forEach(day => {
      tempData.push({
        x: day.dt_txt,
        y: convertKelvinToCelsius(day.main[tempPropertyName]),
      })
    });

    return tempData;
  }

  /**
   * Find the average temperature from a 5-day forecast
   * @param forecastData 5-day forecast data
   * @returns {number} Average temperature over the 5 days of data
   */
  static findTempAverage(forecastData: any): number {
    if (forecastData && forecastData.list && forecastData.list.length > 0) {
      return forecastData.list.reduce((sum, day) => {
        return sum + convertKelvinToCelsius(day.main.temp);
      }, 0) / forecastData.list.length;
    }

    return 1;
  }

  /**
   * Show temperature range button clicked event handler.
   * @param event {SyntheticMouseEvent} Mouse click event.
   */
  tempRangeHandler = (event: SyntheticMouseEvent<*>) => {
    this.setState({
      showRange: !this.state.showRange,
    })
  };

  /**
   * Validate user entered data
   * @param props React properties
   * @param state React state
   * @returns {boolean} True if all fields are valid, otherwise false
   */
  userDataValid = (props: WeatherInfoPropsType, state: WeatherInfoStateType): boolean => {
    return state.forecastData && state.forecastData.list && state.forecastData.list.length > 0;
  };

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

    let tempColorName = 'midnightblue';

    if (this.state.averageTemp > 0) {
      tempColorName = 'darkgoldenrod'
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
            datePattern={'%Y-%m-%d %H:%M:%S'}
            axes
            width={700}
            height={200}
            lineColors={[tempColorName, 'steelblue', 'indianred']}
            interpolate={'cardinal'}
            data={this.generatTempData(this.state.forecastData)}
          />
        </div>
        <button
          className="rangeButton"
          onClick={this.tempRangeHandler}
          disabled={!this.userDataValid(this.props, this.state)}
        >
          {this.state.showRange ? WeatherInfoDisplayConstants.TEMP_RANGE_OFF :
          WeatherInfoDisplayConstants.TEMP_RANGE}
        </button>
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
