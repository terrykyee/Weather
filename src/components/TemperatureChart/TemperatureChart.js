// @flow
/**
 * @file Temperature chart container React component
 * Displays Time vs. Temperature data
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea
} from 'recharts';
import './TemperatureChart.css';

// Flow type definitions for injected props
type TemperatureChartInjectedPropsType = {
  data: Array<any>,
  daySections: ?Array<any>,
}

// Flow type definitions for connected props
type TemperatureChartConnectedPropsType = {
}

// Flow type definitions for bound props
type TemperatureChartBoundPropsType = {
}

type TemperatureChartPropsType = TemperatureChartInjectedPropsType &
  TemperatureChartBoundPropsType & TemperatureChartConnectedPropsType;

/**
 * The state declaration for the temperature chart state
 */
type TemperatureChartStateType = {
}

/**
 * Temperature Chart React Component class
 */
class TemperatureChartComponent extends
  React.PureComponent<TemperatureChartPropsType, TemperatureChartStateType> {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    daySections: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {};

  constructor(props: TemperatureChartPropsType) {
    super(props);

    this.state = {
    }
  }

  state: TemperatureChartStateType;
  props: TemperatureChartPropsType;

  async componentDidMount() {
  }

  /**
   * Find the average temperature from chart data
   * @param data Chart data
   * @returns {number} Average temperature over the provided data
   */
  findTempAverage(data: any): number {
    if (data && data.length > 0) {
      return data.reduce((sum, point) => {
        return sum + point.temp;
      }, 0) / data.length;
    }

    return 1;
  }

  /**
   * Generate shaded reference areas in the chart highlighting day sections
   * @param daySections Day section data
   * @returns {*}
   */
  generateDaySections(daySections: any): React.Node {
    if (daySections) {
      return daySections.map( section => (
          <ReferenceArea x1={section.x1} x2={section.x2} />
      ));
    }

    return null;
  }

  /**
   * Render this React component.
   * @returns {XML}
   */
  render(): React.Node {
    let tempColorName = 'midnightblue';

    if (this.findTempAverage(this.props.data) > 0) {
      tempColorName = 'darkgoldenrod'
    }

    return (
      <LineChart
        width={700}
        height={200}
        data={this.props.data}
      >
        {this.generateDaySections(this.props.daySections)}
        <XAxis
          dataKey="x"
          domain={['auto', 'auto']}
          name="Time"
          fontFamily="sans-serif"
          fontSize="12px"
        />
        <CartesianGrid strokeDasharray="3 3"/>
        <YAxis
          fontFamily="sans-serif"
          fontSize="12px"
        />
        <Tooltip wrapperStyle={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', backgroundColor: '#ccc' }} />
        <Line type="monotone" dataKey="temp" stroke={tempColorName} activeDot={{r: 8}}/>
      </LineChart>
    );
  }
}

const TemperatureChart = TemperatureChartComponent;
export default TemperatureChart;
