import React, { Component, PropTypes } from 'react';
import ScrollArea from 'react-scrollbar';
import s from '../../styles/style';
import info from '../ext/info';

export default class ClanInfo extends Component {

  render() {
    return (
      <main>
        <div className={s.info}>
          <ScrollArea 
            className={s.scrollArea}
            horizontal={false} 
          >
            <h2>{this.props.params.clan}</h2>
            <ul>{info[this.props.params.clan].map(i => <li key={i}>{i}</li>)}</ul>
            <br />
            <h2>All clans</h2>
            <ul>{info['All'].map(i => <li key={i}>{i}</li>)}</ul>
          </ScrollArea>
        </div>
      </main>
    );
  }

}