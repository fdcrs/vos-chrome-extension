import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import AppBar from 'react-toolbox/lib/app_bar';
import { Tab, Tabs } from 'react-toolbox';

import { OptionsButton } from './Options';

import s from '../../styles/style';

// Exporting to use in background.js
var browserAction = chrome.browserAction;

class Popup extends Component {
  state = {
    index: 0
  };

  handleTabChange = (index) => {
    switch(index) {
      case 1: browserHistory.push('/popup.html/history');
      break;
      default: 
        browserHistory.push('/popup.html')
        index = 0;
    }

    this.setState({index});
    
    setTimeout(() => {
      this.refs.tabs.updatePointer(index);
    }, 100);
  };

  componentDidUpdate() {
    if(this.props.params.clan) {
      if(this.state.index != 2) {
        this.setState({index: 2});
      }
    }
  }

  render() {
    let thirdTab = this.props.params.clan ? <Tab label='Info' /> : '';

    return (
      <div className={s.app}>
        <AppBar className={s.header}>Voice of Seren</AppBar>
        <Tabs ref='tabs' index={this.state.index} onChange={this.handleTabChange}>
          <Tab label='Active' />
          <Tab label='History' />
          {thirdTab}
        </Tabs>
        {this.props.children}
        <OptionsButton />
      </div>
    );
  }
}

export {
  Popup as default,
  browserAction
};
