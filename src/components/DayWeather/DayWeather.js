// @flow
/**
 * @file Daily weather information container React component
 * Contains daily weather information
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import './DayWeather.css';
import { CurrentWeatherDisplayConstants } from '../../lib/DisplayConstants';
import { ICON_URL } from '../../lib/WeatherServerUrls';
import {
  convertKelvinToCelsius,
} from '../../lib/UnitUtilities';

// Flow type definitions for injected props
type DayWeatherInjectedPropsType = {
  weatherData: any,
}

// Flow type definitions for connected props
type DayWeatherConnectedPropsType = {
}

// Flow type definitions for bound props
type DayWeatherBoundPropsType = {
}

type DayWeatherPropsType = DayWeatherInjectedPropsType &
  DayWeatherBoundPropsType & DayWeatherConnectedPropsType;

/**
 * The state declaration for the current weather state
 */
type DayWeatherStateType = {
}

const DAYS_ABBREV = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/**
 * DayWeather Stats React Component class
 */
class DayWeatherComponent extends
  React.PureComponent<DayWeatherPropsType, DayWeatherStateType> {
  static propTypes = {
    weatherData: PropTypes.object, // TODO create matching types to flow types and use shape here
  };

  static defaultProps = {};

  constructor(props: DayWeatherPropsType) {
    super(props);

    this.state = {
    }
  }

  state: DayWeatherStateType;
  props: DayWeatherPropsType;

  componentDidMount() {
    console.log(this.props.weatherData);
  }

  /**
   * Get abbreviated day of the week given a timestamp
   * @param timestamp Unix timestamp
   * @returns {string} Abbreviated day of the week timestamp corresponds to
   */
  static getDayOfWeek(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return DAYS_ABBREV[date.getDay()];
  }

  /**
   * Render this React component.
   * @returns {XML}
   */
  render(): React.Node {
    if (this.props.weatherData) {
      return (
        <div className="dayWeather">
          <div className="day">
            {DayWeatherComponent.getDayOfWeek(this.props.weatherData.dt)}
          </div>
          <center><img src={`${ICON_URL}${this.props.weatherData.weather[0].icon}.png`} alt='Profile Icon'
                       className='profileIcon'/></center>
          <div className="smallDescription">
            {convertKelvinToCelsius(this.props.weatherData.main.temp_max).toFixed(0)}
            {CurrentWeatherDisplayConstants.TEMP_UNIT}&nbsp;
            {convertKelvinToCelsius(this.props.weatherData.main.temp_min).toFixed(0)}
            {CurrentWeatherDisplayConstants.TEMP_UNIT}
          </div>
        </div>
      );
    }

    return <div/>;
  }
}

const DayWeather = DayWeatherComponent;
export default DayWeather;
