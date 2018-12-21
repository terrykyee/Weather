//@flow
/**
 * @file Main application
 */
import React from 'react';
import jstz from 'jstz';
import moment from 'moment-timezone';
import './App.css';
import FindCityWeather from './components/FindCityWeather/FindCityWeather';

// Flow type definitions for injected props
type AppInjectedPropsType = {
}

// Flow type definitions for connected props
type AppConnectedPropsType = {
}

// Flow type definitions for bound props
type AppBoundPropsType = {
}

type AppPropsType = AppInjectedPropsType &
  AppBoundPropsType & AppConnectedPropsType;

/**
 * The state declaration for the App state
 */
type AppStateType = {
}

/**
 * Main application page
 */
class App extends React.Component<AppPropsType, AppStateType> {
  static propTypes = {};

  static defaultProps = {};

  constructor(props: AppPropsType) {
    super(props);

    this.state = {
    }
  }

  state: AppStateType;
  props: AppPropsType;

  componentDidMount() {
    App.setTimeZone();
  }

  static setTimeZone() {
    const timezone = jstz.determine();
    console.log(`Local timezone: ${timezone.name()}`);
    moment.tz.setDefault(timezone.name());
  }

  /**
   * Render this React component.
   * @returns {XML}
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-title">
            <div className="App-icon">
            </div>
            <h1>Open Weather Map</h1>
          </div>
          <div className="search">
            <FindCityWeather />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
