// @flow
/**
 * @file Forecast container React component
 * Contains 5-day forecast information
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import './Forecast.css';
import DayWeather from '../DayWeather/DayWeather';
import TemperatureChart from '../TemperatureChart/TemperatureChart';
import { convertKelvinToCelsius } from '../../lib/UnitUtilities';
import { ForecastDisplayConstants } from '../../lib/DisplayConstants';

// Flow type definitions for injected props
type ForecastInjectedPropsType = {
  sortedForecastData: any,
  forecastData: any,
}

// Flow type definitions for connected props
type ForecastConnectedPropsType = {
}

// Flow type definitions for bound props
type ForecastBoundPropsType = {
}

type ForecastPropsType = ForecastInjectedPropsType &
  ForecastBoundPropsType & ForecastConnectedPropsType;

/**
 * The state declaration for the forecast state
 */
type ForecastStateType = {
  selectedDay: string,
  showWeek: boolean,
}

/**
 * Forecast React Component class
 */
class ForecastComponent extends
  React.PureComponent<ForecastPropsType, ForecastStateType> {
  static propTypes = {
    sortedForecastData: PropTypes.object.isRequired, // TODO create matching types to flow types and use shape here,
    forecastData: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  constructor(props: ForecastPropsType) {
    super(props);

    this.state = {
      selectedDay: "",
      showWeek: true,
    }
  }

  state: ForecastStateType;
  props: ForecastPropsType;

  async componentDidMount() {
    console.log('Forecast data');
    console.log(this.props.sortedForecastData);
    console.log(this.props.forecastData);
  }

  /**
   * Filters out daily 12pm forecasts from complete forecast data
   * @param sortedForecast 5-day sorted forecast data
   * @returns {Array} Array of 12pm forecast data for each day
   */
  getDailyForecastsOnly(sortedForecast: any): Array<Object> {
    let dailyForecastData = [];

    // find the closest entry to noon for the day
    // also rewrite min/max temps with proper high low temps
    Object.keys(sortedForecast).sort().forEach(key => {
      const day = sortedForecast[key];
      let minHoursFromNoon = Number.MAX_VALUE;
      let foundIndex = 0;

      for (let i = 0; i < day.data.length; i++) {
        let hoursFromNoon = moment(day.data[i].dt).format('HH');
        hoursFromNoon = Math.abs(hoursFromNoon - 12);

        if (hoursFromNoon < minHoursFromNoon) {
          foundIndex = i;
          minHoursFromNoon = hoursFromNoon;
        }
      }

      day.data[foundIndex].main.temp_min = day.minTemp;
      day.data[foundIndex].main.temp_max = day.maxTemp;
      dailyForecastData.push(day.data[foundIndex]);
    });

    return dailyForecastData;
  }

  /**
   * Generate temperature data from 5-day forecast data for LineChart
   * @param forecastDataArray 5-day forecast data
   * @returns {Array} Array of xy (time, temp) data for LineChart
   */
  generateTempData(forecastDataArray: any): any {
    let arr = [];

    if (forecastDataArray && forecastDataArray.length > 0) {
      return this.generateChartData(forecastDataArray, 'temp');
    }

    return arr;
  }

  /**
   * Helper function to generate chart temperature data
   * @param forecastDataArray 5-day forecast data
   * @param tempPropertyName Forecast data temperature property name to extract
   * @returns {Array} Array of chart compatible data
   */
  generateChartData(forecastDataArray: any, tempPropertyName: string): any {
    let tempData = [];

    forecastDataArray.forEach(day => {
      tempData.push({
        x: day.dt,
        temp: convertKelvinToCelsius(day.main[tempPropertyName]).toFixed(0),
      })
    });

    return tempData;
  }

  OnDayClicked = (day: string) => {
      this.setState({
        selectedDay: day,
        showWeek: false,
      })
  };

  /**
   * Generate JSX representing daily weather
   * @returns {Array} Array of React JSX representing daily weather
   */
  generateForecast() {
    if (this.props.sortedForecastData && Object.keys(this.props.sortedForecastData).length > 0) {
      let dailyForecastData = this.getDailyForecastsOnly(this.props.sortedForecastData);
      return dailyForecastData.map( dayForecast => (
        <React.Fragment key={dayForecast.dt}>
          <DayWeather
            weatherData={dayForecast}
            selected={moment(dayForecast.dt).format('DD') === this.state.selectedDay}
            clickHandler={this.OnDayClicked}
          />
        </React.Fragment>
      ));
    }
  }

  /**
   * Show week button clicked event handler.
   * @param event {SyntheticMouseEvent} Mouse click event.
   */
  showWeekHandler = (event: SyntheticMouseEvent<*>) => {
    this.setState({
      showWeek: !this.state.showWeek,
      selectedDay: '',
    })
  };

  /**
   * Validate user entered data
   * @param props React properties
   * @param state React state
   * @returns {boolean} True if all fields are valid, otherwise false
   */
  userDataValid = (props: ForecastPropsType, state: ForecastStateType): boolean => {
    return props.forecastData && props.forecastData.list &&
      props.forecastData.list.length > 0 && state.selectedDay !== '';
  };

  /**
   * Render this React component.
   * @returns {XML}
   */
  render(): React.Node {
    const dailyWeather = this.generateForecast();
    return (
      <div className="forecast">
        <div className="chartPane">
          <TemperatureChart
            data={this.generateTempData(this.state.showWeek ? this.props.forecastData.list : this.props.sortedForecastData[this.state.selectedDay].data)}
          />
        </div>
        <button
          className="showButton"
          onClick={this.showWeekHandler}
          disabled={!this.userDataValid(this.props, this.state)}
        >
          {ForecastDisplayConstants.SHOW_WEEK}
        </button>
        <div className="daily">
          {dailyWeather}
        </div>
      </div>
    );
  }
}

const Forecast = ForecastComponent;
export default Forecast;
