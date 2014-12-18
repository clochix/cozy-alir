//jshint browser: true
/*global Acthesis: true */
window.defaultConfig = {
  corsproxy: window.location.protocol + "//" + window.location.host + "/apps/alir/proxy/",
  rsLogin: "me@" + window.location.host,
  remoteActivity: true
};

// Init Activity polifill
if (typeof window.MozActivity === 'undefined') {
  var manifest = {
    "activities": {
      "save-bookmark": {
        "filters": {
          "type": "url",
          "url": {
            "required": true,
            "regexp":"/^https?:/"
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
  var options = {
    postMethod: "socket"
  };
  new Acthesis(options, manifest);
}
