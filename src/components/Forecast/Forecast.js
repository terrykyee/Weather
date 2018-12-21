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
import { convertKelvinToCelsius } from '../../lib/UnitUtilities';

// Flow type definitions for injected props
type ForecastInjectedPropsType = {
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
}

/**
 * Forecast React Component class
 */
class ForecastComponent extends
  React.PureComponent<ForecastPropsType, ForecastStateType> {
  static propTypes = {
    forecastData: PropTypes.object.isRequired, // TODO create matching types to flow types and use shape here,
  };

  static defaultProps = {};

  constructor(props: ForecastPropsType) {
    super(props);

    this.state = {
    }
  }

  state: ForecastStateType;
  props: ForecastPropsType;

  async componentDidMount() {
    console.log(this.props.forecastData);
  }

  /**
   * Filters out daily 12pm forecasts from complete forecast data
   * @param forecastData 5-day forecast data
   * @returns {Array} Array of 12pm forecast data for each day
   */
  getDailyForecastsOnly(forecastData: any): Array<Object> {
    let dailyForecastData = [];
    const sortedForecast = this.sortByDay(forecastData);

    // find the closest entry to noon for the day
    // also rewrite min/max temps with proper high low temps
    Object.keys(sortedForecast).forEach(key => {
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

  sortByDay(forecastData: any): Object {
    const fiveDayForecast = {};

    forecastData.list.forEach(entry =>{
      const day = moment(entry.dt * 1000).format('DD');
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
   * Generate JSX representing daily weather
   * @returns {Array} Array of React JSX representing daily weather
   */
  generateForecast() {
    if (this.props.forecastData && this.props.forecastData.list &&
      this.props.forecastData.list.length > 0) {
      let dailyForecastData = this.getDailyForecastsOnly(this.props.forecastData);
      return dailyForecastData.map( dayForecast => (
        <React.Fragment key={dayForecast.dt}>
          <DayWeather weatherData={dayForecast} />
        </React.Fragment>
      ));
    }
  }

  /**
   * Render this React component.
   * @returns {XML}
   */
  render(): React.Node {
    const dailyWeather = this.generateForecast();
    return (
      <div className="daily">
        {dailyWeather}
      </div>
    );
  }
}

const Forecast = ForecastComponent;
export default Forecast;
