import React, { Component, PropTypes } from 'react';
import { Button, Checkbox } from 'react-toolbox';
import s from '../../styles/style';
import _ from 'lodash';
import ClanList from './ClanList';

class Options extends Component {
  static propTypes = {
    notify: PropTypes.bool,
    notifyUnknown: PropTypes.bool,
    selectedClansOnly: PropTypes.bool,
    selectedClans: PropTypes.string,
  };

  static defaultProps = {
    notify: true,
    notifyUnknown: false,
    selectedClansOnly: false,
    selectedClans: "",
  };

  state = {
    notify: this._getBool('notify'),
    notifyUnknown: this._getBool('notifyUnknown'),
    selectedClansOnly: this._getBool('selectedClansOnly'),
    selectedClans: this._getString('selectedClans'),
  };

  // get boolean from localStorage
  _getBool(key) {
    // is true
    if(localStorage.getItem(key) === "true") {
      return true
    }
    // not set, return default
    if(localStorage.getItem(key) === null) {
      localStorage.setItem(key, this.props[key]);
      return this.props[key];
    }
    // is false
    return false;
  }

  // get string from localStorage
  _getString(key) {
    // not set, return default
    if(localStorage.getItem(key) === null) {
      localStorage.setItem(key, this.props[key]);
      return this.props[key];
    }
    return localStorage.getItem(key);
  }

  componentDidUpdate() {
    _.each(this.state, (v, k) => localStorage.setItem(k, v));
  }

  render() {
    return (
      <div className={s.optionsContainer}>
        <h1>Options</h1>
        <div style={{float:'left'}}>
          <Checkbox
            label='Notify when VOS changes'
            checked={this.state.notify}
            onChange={this.handleCheckboxChange.bind(this, 'notify')}
          />
        </div>
        <div style={{float:'right'}}>
          <Checkbox
            label='Notify if VOS is unknown'
            disabled={!this.state.notify}
            checked={this.state.notify && this.state.notifyUnknown}
            onChange={this.handleCheckboxChange.bind(this, 'notifyUnknown')}
          />
        </div>
        <div style={{clear:'both'}}>
          <Checkbox
            label='Only notify for selected clans'
            disabled={!this.state.notify}
            checked={this.state.notify && this.state.selectedClansOnly}
            onChange={this.handleCheckboxChange.bind(this, 'selectedClansOnly')}
          />
        </div>
        <div onMouseLeave={() => this.updateSelectedClans()}>
          <ClanList 
            ref='clans' 
            selectedClans={this.state.selectedClans} 
          />
        </div>
      </div>
    );
  }

  updateSelectedClans = () => {
    let active = [];

    _.forEach(this.refs.clans.refs, (ref) => {
      if(ref.state.selected) {
        active.push(ref.props.name);
      }
    });

    this.setState({
      selectedClans: active.toString()
    });
  };

  handleCheckboxChange = (field, value) => {
    this.setState({...this.state, [field]: value});
  };


}

const OptionsButton = () => (
  <Button 
    className={s.optionsButton}
    icon='settings' 
    label='Options' 
    flat 
    primary 
    onClick={() => chrome.runtime.openOptionsPage()}
  />
);

export {
  Options as default,
  OptionsButton
};
