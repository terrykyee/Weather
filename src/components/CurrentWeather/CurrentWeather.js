// @flow
/**
 * @file Current weather information container React component
 * Contains current weather information
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import './CurrentWeather.css';
import { CurrentWeatherDisplayConstants } from '../../lib/DisplayConstants';
import { ICON_URL } from '../../lib/WeatherServerUrls';
import {
  convertKelvinToCelsius,
  degToCompass,
  metersPerSecondToKmPerHour
} from '../../lib/UnitUtilities';
import { capitalizeFirstLetter } from '../../lib/StringUtilities';

// Flow type definitions for injected props
type CurrentWeatherInjectedPropsType = {
  currentWeatherData: any,
}

// Flow type definitions for connected props
type CurrentWeatherConnectedPropsType = {
}

// Flow type definitions for bound props
type CurrentWeatherBoundPropsType = {
}

type CurrentWeatherPropsType = CurrentWeatherInjectedPropsType &
  CurrentWeatherBoundPropsType & CurrentWeatherConnectedPropsType;

/**
 * The state declaration for the current weather state
 */
type CurrentWeatherStateType = {
}

/**
 * CurrentWeather Stats React Component class
 */
class CurrentWeatherComponent extends
  React.PureComponent<CurrentWeatherPropsType, CurrentWeatherStateType> {
  static propTypes = {
    currentWeatherData: PropTypes.object, // TODO create matching types to flow types and use shape here
  };

  static defaultProps = {};

  constructor(props: CurrentWeatherPropsType) {
    super(props);

    this.state = {
    }
  }

  state: CurrentWeatherStateType;
  props: CurrentWeatherPropsType;

  componentDidMount() {
    console.log(this.props.currentWeatherData);
  }

  /**
   * Render this React component.
   * @returns {XML}
   */
  render(): React.Node {
    if (this.props.currentWeatherData) {
      return (
        <div className="currentWeather">
          <div className="cityName">
            {this.props.currentWeatherData.name} :&nbsp;
            {convertKelvinToCelsius(this.props.currentWeatherData.main.temp).toFixed(0)}
            {CurrentWeatherDisplayConstants.TEMP_UNIT}
          </div>
          <center><img src={`${ICON_URL}${this.props.currentWeatherData.weather[0].icon}.png`} alt='Profile Icon'
                       className='profileIcon'/></center>
          <div className="description">
            {capitalizeFirstLetter(this.props.currentWeatherData.weather[0].description)}
          </div>
          <div className="description">
            {CurrentWeatherDisplayConstants.HIGH_LABEL}:&nbsp;
            {convertKelvinToCelsius(this.props.currentWeatherData.main.temp_max).toFixed(0)}
            {CurrentWeatherDisplayConstants.TEMP_UNIT}&nbsp;
            {CurrentWeatherDisplayConstants.LOW_LABEL}:&nbsp;
            {convertKelvinToCelsius(this.props.currentWeatherData.main.temp_min).toFixed(0)}
            {CurrentWeatherDisplayConstants.TEMP_UNIT}
          </div>
          <div className="smallDescription">
            {CurrentWeatherDisplayConstants.WIND_LABEL}:&nbsp;
            {metersPerSecondToKmPerHour(this.props.currentWeatherData.wind.speed).toFixed(2)}
            {CurrentWeatherDisplayConstants.VELOCITY_UNIT},&nbsp;
            {degToCompass(this.props.currentWeatherData.wind.deg)}

          </div>
        </div>
      );
    }

    return <div/>;
  }
}

const CurrentWeather = CurrentWeatherComponent;
export default CurrentWeather;
