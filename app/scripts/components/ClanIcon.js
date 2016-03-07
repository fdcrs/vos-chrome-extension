import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Ripple from 'react-toolbox/lib/ripple';
import s from '../../styles/style';

const RippleContainer = (props) => <div {...props} className={s.clanIconRipple}></div>;
const ImgRipple = Ripple()(RippleContainer);

export default class ClanIcon extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    selectable: PropTypes.bool,
    selected: PropTypes.bool,
    clickable: PropTypes.bool,
  };

  static defaultProps = {
    selectable: false,
    selected: false,
    clickable: false,
  };

  state = {
    selected: this.props.selected,
  };

  render() {
    let className = this.state.selected ? `${s.clanIcon} ${s.selected}` : s.clanIcon;
    return (
      <div className={className}>
        <ImgRipple onClick={this._handleClick} />
        {this.renderIcon()}
      </div>
    );
  }

  renderIcon() {
    if(this.props.name == 'Unknown') {
      return <h1>?</h1>;
    }

    let url = `${chrome.extension.getURL('')}images/clans/${this.props.name}.png`;
    return <img src={url} />;
  }

  _handleClick = () => {
    if(this.props.selectable) {
      this.setState({selected: !this.state.selected});
    }
    if(this.props.clickable) {
      browserHistory.push(`/popup.html/info/${this.props.name}`);
    }
  };
}
