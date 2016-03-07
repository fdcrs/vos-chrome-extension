let config = {
  // API url
  //api: `http://localhost:3000/api`,
  api: `https://fdcvos.herokuapp.com/api`,

  // data model for /reports/active
  activeModel: {
    clan1: 'Unknown', 
    clan2: 'Unknown', 
    reportCount: 1, // 1 by default since reporting is deprecated
  },

  // URL for server sent events
  changeStream: `Tweets/change-stream?_format=event-stream`,

  // How long to display toast messages like
  // "Thanks for reporting" / errors for
  toastDuration: 5 * 1000,

  // How often data is fetched in the background
  // to update the icon and provide notifications
  backgroundUpdateInterval: 60 * 1000, // deprecated

  // How often data is fetched while the extension
  // browser action window is open
  fetchDataInterval: 10 * 1000, // deprecated
  
};

export default config;