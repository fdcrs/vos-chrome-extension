import request from 'superagent';
import _ from 'lodash';
import {browserAction} from '../components/Popup';

import conf from './config';

// Options with default values
var notify = false;
var notifyUnknown = false;
var selectedClansOnly = false;
var selectedClans = '';

// Default data from /reports/active
var active = conf.activeModel;

// State
var lastNotified = 0;
var lastTweetTimestamp = 0;

// EventSource
var eventSource = {};
var eventSourceOpen = false;
var lastEventReceived = Date.now();


// Populates options from localStorage if exists
var loadOptions = function() {
  if(localStorage.getItem('notify') === "true") 
    notify = true;

  if(localStorage.getItem('notifyUnknown') === "true") 
    notifyUnknown = true;

  if(localStorage.getItem('selectedClansOnly') === "true")
    selectedClansOnly = true;

  if(localStorage.getItem('selectedClans') !== null)
    selectedClans = localStorage.getItem('selectedClans');

  if(localStorage.getItem('lastNotified') !== null)
    lastNotified = Number(localStorage.getItem('lastNotified'));
}

// Promises current active VOS from api
var loadActive = function() {
  return new Promise(function(resolve, reject){
    request.get(`${conf.api}/tweets/findOne`)
    .query(`filter={"order": "timestamp_ms DESC"}`)
    .set('Accept', 'application/json')
    .end(function(err, res){
      if(err) {
        reject(res.body.error.message);
      } else {
        resolve(res.body);
      }
    });
  });
}

// Displays notification if needed
var notification = function() {
  var shouldNotify = (lastNotified < lastTweetTimestamp);
  if(active.clan1 == 'Unknown' && !notifyUnknown) shouldNotify = false;
  
  if(notify && shouldNotify) {
    if(!selectedClansOnly || selectedClans.includes(active.clan1 || active.clan2)) {
      let id = 'vos-notification-' + Date.now();
      let buttons = [];

      if(active.clan1 == 'Unknown') {
        buttons = [
          {
            title: `The current VOS is unknown.`, 
            iconUrl: `/images/clans/${active.clan1}.png`
          }
        ];
      } else {
        buttons = [
          {
            title: `The VOS is now active in the ${active.clan1} district.`, 
            iconUrl: `/images/clans/${active.clan1}.png`
          }, 
          {
            title: `The VOS is now active in the ${active.clan2} district.`, 
            iconUrl: `/images/clans/${active.clan2}.png`
          }
        ];
      }

      chrome.notifications.create(id, {
        type: 'basic',
        iconUrl: '/images/icons/notification-icon.png',
        appIconMaskUrl: '/images/icons/Mask.png',
        isClickable: true,
        title: 'Voice of Seren notification',
        message: 'Click here to dismiss',
        buttons: buttons
      });

      localStorage.setItem('lastNotified', Date.now());
    }
  }
}

// Sets icon to default in case of failure, then to current VOS icon
var setIcon = function() {
  let icon = `/images/icons/${active.clan1}-${active.clan2}.png`;
  if(typeof browserAction !== 'undefined') {
    browserAction.setIcon({path: icon});
    console.log('setIcon', icon);
  } else if(typeof chrome.browserAction !== 'undefined') {
    chrome.browserAction.setIcon({path: icon});
    console.log('setIcon2', icon);
  } else {
    console.log('No browser action');
  }
}

// Gets up to date data from server, sets icon based on it and notifies user
var update = function() {
  loadActive().then(function(data){
    active = getClansFromTweetText(data.text);
    lastTweetTimestamp = data.timestamp_ms;
    loadOptions();
    setIcon();
    notification();
  }, function(error){
    console.log('Error loading data', error);
  });
}

var listenForTweets = function() {
  if(!eventSourceOpen) {
    eventSource = new EventSource(`${conf.api}/${conf.changeStream}`);

    eventSource.addEventListener('open', function(msg){
      eventSourceOpen = true;
      console.log(new Date().getHours() + ':' + new Date().getMinutes(), 'Open', msg);
    });

    eventSource.addEventListener('error', function(msg){
      // On errors event source will be reopened automatically
      eventSourceOpen = true;
      console.log(new Date().getHours() + ':' + new Date().getMinutes(), 'Error', msg);
    });

    eventSource.addEventListener('data', function(msg){
      var change = JSON.parse(msg.data);
      lastEventReceived = Date.now();
      console.log(new Date().getHours() + ':' + new Date().getMinutes(), change.type);
      if(change.type == 'create' || (change.type == 'update' && change.data.timestamp_ms > lastTweetTimestamp)) {
        lastTweetTimestamp = change.data.timestamp_ms;
        active = getClansFromTweetText(change.data.text);
        loadOptions();
        setIcon();
        notification();
      }
    });
  } else {
    // There should be a keep-alive event every 30 seconds, so if there
    // haven't been any events for a minute declare the eventSource closed
    // and it will be reopened by background.js intervalling this function
    if(Date.now() - lastEventReceived > 1000 * 60) {
      eventSource.close();
      eventSourceOpen = false;
      lastEventReceived = Date.now();
    }
  }
}

var getClansFromTweetText = function(text) {
  var clans = ['Amlodd', 'Cadarn', 'Crwys', 'Hefin', 'Iorwerth', 'Ithell', 'Meilyr', 'Trahaearn', 'Unknown1', 'Unknown2'];
  var active = conf.activeModel;
  var split1 = text.split('in the ');
  var split2 = split1[1].split(' districts.');
  var split3 = split2[0].split(' and ');
  if(clans.toString().includes(split3[0] && split3[1])) {
    if(split3[0] == 'Unknown1') {
      active.clan1 = 'Unknown';
      active.clan2 = 'Unknown';
    } else {
      active.clan1 = split3[0];
      active.clan2 = split3[1];
    }
  } else {
    console.log('Invalid clans: ', split3[0], split3[1]);
  }
  
  return Object.assign({}, active);
}

export {
  update,
  listenForTweets,
  active,
  getClansFromTweetText
}