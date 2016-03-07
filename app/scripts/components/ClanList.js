import React, { Component, PropTypes } from 'react';

import ClanIcon from './ClanIcon';

import s from '../../styles/style';

class ClanList extends Component {
  static propTypes = {
    selectedClans: PropTypes.string,
  };

  static defaultProps = {
    selectedClans: '',
  };

  render() {
    return (
      <div className={s.clanList}>
        <ClanIcon name="Amlodd" ref="Amlodd" selectable selected={this._getSelected('Amlodd')} />
        <ClanIcon name="Cadarn" ref="Cadarn" selectable selected={this._getSelected('Cadarn')} />
        <ClanIcon name="Crwys" ref="Crwys" selectable selected={this._getSelected('Crwys')} />
        <ClanIcon name="Hefin" ref="Hefin" selectable selected={this._getSelected('Hefin')} />
        <ClanIcon name="Iorwerth" ref="Iorwerth" selectable selected={this._getSelected('Iorwerth')} />
        <ClanIcon name="Ithell" ref="Ithell" selectable selected={this._getSelected('Ithell')} />
        <ClanIcon name="Meilyr" ref="Meilyr" selectable selected={this._getSelected('Meilyr')} />
        <ClanIcon name="Trahaearn" ref="Trahaearn" selectable selected={this._getSelected('Trahaearn')} />
      </div>
    );
  }

  _getSelected(clan) {
    return _.includes(this.props.selectedClans, clan);
  }
}

export default ClanList;
