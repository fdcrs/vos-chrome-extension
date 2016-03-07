import React, { Component, PropTypes } from 'react';
import request from 'superagent';
import { Link, browserHistory } from 'react-router';
import { Button } from 'react-toolbox';

import { getClansFromTweetText } from '../ext/tasks';
import conf from '../ext/config';

import ClanIcon from './ClanIcon';
import Loading from './Loading';

import s from '../../styles/style';

export default class History extends Component {
  state = {
    noDataYet: true,
    current: conf.activeModel,
    previous: conf.activeModel,
    error: false,
  };

  componentWillMount() {
    this._fetchData();
  }

  componentDidMount() {
    this.eventSource = new EventSource(`${conf.api}/${conf.changeStream}`);
    this.eventSource.addEventListener('data', (msg) => {
      var change = JSON.parse(msg.data);
      if(change.type == 'create') {
        this._fetchData();
      }
    });
  }

  componentWillUnmount() {
    this.eventSource.close();
  }

  render() {
    if(this.state.error != false) {
      return (
        <main>
          <h1>Error</h1>
          <div style={{color: 'red'}}>{this.state.error.message}</div>
          <br />
          <Button 
            raised
            primary
            accent
            icon='refresh' 
            label='Try again' 
            onClick={this._fetchData}
          />
        </main>
      );
    }

    if(this.state.noDataYet) {
      return (
        <main>
          <Loading />
        </main>
      );
    }

    let previous = (
      <div className={s.activeList}>
        <ClanIcon name={this.state.previous.clan1} clickable />
        <ClanIcon name={this.state.previous.clan2} clickable />
      </div>
    );

    return (
      <main className={s.history}>
        <h2>Upcoming</h2>
        {this.renderUpcoming()}
        <h2>Previous</h2>
        {previous}
      </main>
    );
  }

  renderUpcoming() {
    let history = [this.state.current.clan1, this.state.current.clan2, this.state.previous.clan1, this.state.previous.clan2];
    if(history.indexOf('Unknown') == -1) {
      let clans = ['Amlodd', 'Cadarn', 'Crwys', 'Hefin', 'Iorwerth', 'Ithell', 'Meilyr', 'Trahaearn'];
      let upcoming = [];
      _.each(clans, clan => {
        if(history.indexOf(clan) == -1) {
          upcoming.push(clan);
        }
      });
      return (
        <div className={s.activeList}>
          {upcoming.map(clan => <ClanIcon key={clan} name={clan} clickable />)}
        </div>
      );
    } else {
      return (
        <div>
          <br />
          Not enough data to get a decent estimate.
        </div>
      );
    }
  }

  _fetchData = () => {
    this.setState({
      noDataYet: true,
      error: false,
    });

    request.get(`${conf.api}/tweets/history`)
    .set('Accept', 'application/json')
    .end((err, res) => {
      if(err) {
        console.log('Error getting history', err);
        this.setState({
          error: err
        });
      }
      else if(res.ok) {
        let history = res.body.history;
        let current = getClansFromTweetText(history[0].text);
        let previous = getClansFromTweetText(history[1].text);
        this.setState({
          error: false,
          noDataYet: false,
          current: current,
          previous: previous,
        });
      }
    });
  };

}
