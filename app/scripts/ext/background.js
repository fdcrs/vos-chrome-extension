import {update, listenForTweets} from './tasks';
import conf from './config';

chrome.notifications.onClicked.addListener(id => chrome.notifications.clear(id));
chrome.notifications.onButtonClicked.addListener((id, i) => chrome.notifications.clear(id));

update();

setInterval(function(){
  listenForTweets();
}, 1000 * 60);