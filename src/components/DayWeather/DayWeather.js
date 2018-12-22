// @flow
/**
 * @file Daily weather information container React component
 * Contains daily weather information
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import './DayWeather.css';
import { CurrentWeatherDisplayConstants } from '../../lib/DisplayConstants';
import { ICON_URL } from '../../lib/WeatherServerUrls';
import { capitalizeFirstLetter } from '../../lib/StringUtilities';

// Flow type definitions for injected props
type DayWeatherInjectedPropsType = {
  weatherData: any,
  clickHandler: () => void,
  selected: boolean,
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

/**
 * DayWeather Stats React Component class
 */
class DayWeatherComponent extends
  React.PureComponent<DayWeatherPropsType, DayWeatherStateType> {
  static propTypes = {
    weatherData: PropTypes.object, // TODO create matching types to flow types and use shape here
    clickHandler: PropTypes.func,
    selected: PropTypes.bool,
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
    console.log('DayWeather');
    console.log(this.props.weatherData);
  }

  OnClickHandler = (event: SyntheticMouseEvent<*>) => {
    this.props.clickHandler(moment(this.props.weatherData.dt * 1000).format('DD'));
  };

  /**
   * Render this React component.
   * @returns {XML}
   */
  render(): React.Node {
    if (this.props.weatherData) {
      return (
        <div
          className={this.props.selected ? 'dayWeatherSelected' : 'dayWeather'}
          onClick={this.OnClickHandler}
        >
          <div className="day">
            {moment(this.props.weatherData.dt*1000).format('ddd')}
          </div>
          <center><img src={`${ICON_URL}${this.props.weatherData.weather[0].icon}.png`} alt='Profile Icon'
                       className='profileIcon'/></center>
          <div className="smallerDescription">
            {capitalizeFirstLetter(this.props.weatherData.weather[0].description)}
          </div>
          <div className="smallDescription">
            {this.props.weatherData.main.temp_max.toFixed(0)}
            {CurrentWeatherDisplayConstants.TEMP_UNIT}&nbsp;
            {this.props.weatherData.main.temp_min.toFixed(0)}
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
