// @flow
/**
 * @file Find City Weather React component
 * Component that allows the user to search for city weather information
 */
import * as React from 'react';
import './FindCityWeather.css';
import { Textbox } from 'react-inputs-validation';
import { FindCityWeatherDisplayStringConstants } from '../../lib/DisplayConstants';

// Flow type definitions for injected props
type FindCityWeatherInjectedPropsType = {
}

// Flow type definitions for connected props
type FindCityWeatherConnectedPropsType = {
}

// Flow type definitions for bound props
type FindCityWeatherBoundPropsType = {
}

type FindCityWeatherPropsType = FindCityWeatherInjectedPropsType &
  FindCityWeatherBoundPropsType & FindCityWeatherConnectedPropsType;

/**
 * The state declaration for the find city weather component state
 */
type FindCityWeatherStateType = {
  cityName: string,
  validate: boolean,
}


/**
 * Find City Weather React Component class
 */
class FindCityWeatherComponent extends
  React.PureComponent<FindCityWeatherPropsType, FindCityWeatherStateType> {
  static propTypes = {
  };

  static defaultProps = {};

  constructor(props: FindCityWeatherPropsType) {
    super(props);

    this.state = {
      cityName: '',
      validate: false,
    }
  }

  state: FindCityWeatherStateType;
  props: FindCityWeatherPropsType;

  /**
   * Find city button clicked event handler.
   * @param event {SyntheticMouseEvent} Mouse click event.
   */
  findCityHandler = (event: SyntheticMouseEvent<*>) => {
    window.location = `/city/${this.state.cityName}`;
  };

  /**
   * Validate user entered data
   * @param props React properties
   * @param state React state
   * @returns {boolean} True if all fields are valid, otherwise false
   */
  userDataValid = (props: FindCityWeatherPropsType, state: FindCityWeatherStateType): boolean => {
    // TODO implement validation of city input
    return !!state.cityName;
  };

  /**
   * Render this React component.
   * @returns {XML}
   */
  // TODO: make city search a searchable dropdown of cities that convert to city codes
  render(): React.Node {
    const cityNameField = (
      <div className="inputField">
        <div className="label">{FindCityWeatherDisplayStringConstants.CITY_LABEL}</div>
        <div className="input">
          <Textbox
            tabIndex="1"
            id={'cityName'}
            name={FindCityWeatherDisplayStringConstants.CITY_LABEL}
            type="text"
            value={this.state.cityName}
            validate={this.state.validate}
            validationCallback={res => this.setState({ validate: false })}
            placeholder={FindCityWeatherDisplayStringConstants.CITY_HINT}
            onChange={text => this.setState({cityName: text})}
            onBlur={() => {}}
            validationOption={{
              name: FindCityWeatherDisplayStringConstants.CITY_LABEL,
              check: true,
              required: false
            }}
          />
        </div>
      </div>
    );

    const contents = (
      <div className="main">
        {cityNameField}
        <div className="findButtonPane">
          <button
            className="findButton"
            onClick={this.findCityHandler}
            disabled={!this.userDataValid(this.props, this.state)}
          >
            {FindCityWeatherDisplayStringConstants.LOAD_WEATHER}
          </button>
        </div>
      </div>
    );
    return (
      <div>
        {contents}
      </div>
    );
  }
}

const FindCityWeather = FindCityWeatherComponent;
export default FindCityWeather;
