import React, { Component } from 'react';
import s from '../../styles/style';
import ProgressBar from 'react-toolbox/lib/progress_bar';

export default class Loading extends Component {
  render() {
    return (
      <ProgressBar 
        className={s.loading}
        type="circular" 
        mode="indeterminate" 
      />
    );
  }
}
