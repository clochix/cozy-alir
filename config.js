//jshint browser: true
/*global Acthesis: true */
window.defaultConfig = {
  corsproxy: window.location.protocol + "//" + window.location.host + "/apps/alir/proxy/",
  rsLogin: "me@" + window.location.host,
  remoteActivity: true
};
var manifest, options;

// Init Activity polifill
if (typeof window.MozActivity === 'undefined') {
  manifest = {
    "activities": {
      "save-bookmark": {
        "filters": {
          "type": "url",
          "url": {
            "required": true,
            "regexp": "/^https?:/"
          }
        },
        "disposition": "inline",
        "href": "/index.html",
        "returnValue": true
      },
      "share": {
        "filters": {
          "type": "url"
        },
        "disposition": "inline",
        "href": null,
        "returnValue": true
      }
    }
  };
  options = {
    postMethod: "socket"
  };
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    options.server = 'http://localhost:9250';
  } else {
    options.server =  window.location.protocol + "//" + window.location.hostname + "/apps/acthesis";
  }
  new Acthesis(options, manifest);
}
