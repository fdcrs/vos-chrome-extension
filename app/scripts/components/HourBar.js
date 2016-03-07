import React, { Component, PropTypes } from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Link from 'react-toolbox/lib/link';
import Tooltip from 'react-toolbox/lib/tooltip';
import s from '../../styles/style';

const TooltipLink = Tooltip(Link);

export default class HourBar extends Component {
  static propTypes = {
    progress: PropTypes.number,
  };

  static defaultProps = {
    progress: 0,
  };

  state = {
    progress: this.props.progress,
    timeLeft: 0,
  };

  componentDidMount() {
    this._updateBar();
    this.updateBarInterval = setInterval(() => this._updateBar(), 60 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updateBarInterval);
  }

  render() {
    return (
      <div className={s.hourBarContainer}>
        <TooltipLink tooltip={this.state.timeLeft + 'min left'}>
          <ProgressBar 
            type="linear" 
            mode="determinate" 
            value={this.state.progress}
          />
        </TooltipLink>
      </div>
    );
  }

  _updateBar = () => {
    let mins = new Date().getMinutes();
    this.setState({
      progress: 100 * mins / 60,
      timeLeft: 60 - mins,
    });
  };

}
