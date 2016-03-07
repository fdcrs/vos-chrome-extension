import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Popup from '../components/Popup';
import Active from '../components/Active';
import History from '../components/History';
import ClanInfo from '../components/ClanInfo';

render(
  <Router history={browserHistory}>
    <Route path="/popup.html" component={Popup}>
      <IndexRoute component={Active} />
      <Route path="history" component={History} />
      <Route path="info/:clan" component={ClanInfo} />
      {/*<Route path="*" component={PageNotFound} />*/}
    </Route>
  </Router>
, document.getElementById('root'));