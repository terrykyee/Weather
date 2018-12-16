// @flow
/**
 * @file Forecast container React component
 * Contains 5-day forecast information
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import './Forecast.css';
import DayWeather from '../DayWeather/DayWeather';

// Flow type definitions for injected props
type ForecastInjectedPropsType = {
  matches: any,
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
    forecastData: PropTypes.object, // TODO create matching types to flow types and use shape here,
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
    forecastData.list.map(day => {
      if (day.dt_txt.includes('12:00:00')) {
        dailyForecastData.push(day);
      }
    });

    return dailyForecastData;
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
    const matches = this.generateForecast();
    return (
      <div className="matches">
        {matches}
      </div>
    );
  }
}

const Forecast = ForecastComponent;
export default Forecast;
