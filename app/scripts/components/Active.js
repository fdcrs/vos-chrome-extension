import React, { Component, PropTypes } from 'react';
import request from 'superagent';
//import { Link, browserHistory } from 'react-router';

import { getClansFromTweetText } from '../ext/tasks';
import conf from '../ext/config';
import ClanIcon from './ClanIcon';
import Loading from './Loading';
import HourBar from './HourBar';

import s from '../../styles/style';

export default class Active extends Component {
  static propTypes = {
    noDataYet: PropTypes.bool,
    data: PropTypes.object,
  };

  static defaultProps = {
    noDataYet: true,
    data: conf.activeModel,
  };

  constructor(props) {
    super(props);
    let query = props.params; //browserHistory.getCurrentQuery();
    this.state = {
      noDataYet: query.data ? false : true,
      data: query.data ? JSON.parse(query.data) : conf.activeModel,
      error: query.error,
      optionsBtnDisabled: true,
    };

    this._fetchData();
  }

  componentDidMount() {
    this.eventSource = new EventSource(`${conf.api}/${conf.changeStream}`);
    this.eventSource.addEventListener('data', (msg) => {
      var change = JSON.parse(msg.data);
      if(change.type == 'create') {
        this.setState({
          noDataYet: false,
          data: getClansFromTweetText(change.data.text),
        });
      }
    });

    if(this.state.error) {
      console.log(this.state.error);
    }
  }

  componentWillUnmount() {
    this.eventSource.close();
  }

  render() {
    if(this.state.noDataYet) {
      return (
        <main>
          <Loading />
        </main>
      );
    }

    let active = '';
    if(this.state.data.reportCount > 0) {
      active = (
        <div className={s.activeList}>
          <ClanIcon name={this.state.data.clan1} clickable />
          <ClanIcon name={this.state.data.clan2} clickable />
        </div>
      );
    }

    return (
      <main>
        {active}
        <HourBar />
      </main>
    );
  }

  _fetchData = () => {
    request.get(`${conf.api}/tweets/findOne`)
    .query(`filter={"order": "timestamp_ms DESC"}`)
    .set('Accept', 'application/json')
    .end((err, res) => {
      if(err) {
        console.log('Error getting most recent tweet', err);
      }
      else if(res.ok) {
        this.setState({
          noDataYet: false,
          data: getClansFromTweetText(res.body.text)
        });
      }
    });
  };

}