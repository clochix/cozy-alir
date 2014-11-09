//jshint node: true
/*exported ActivityOptions, ActivityRequestHandler, ActivityHandlerDescription */
//////
//
// Server Activity Polyfill
//
/////
var platform = {};
var handlers = {};
var queue    = {};
function Request(options) {
  "use strict";
  var self = this;
  self.readyState = 'pending';
  self.result = null;
  self.error  = null;
  function done (err, res) {
    self.readyState = 'done';
    if (err) {
      if (typeof self.onerror === 'function') {
          self.error = err;
          self.onerror.call(self);
      }
    } else {
      if (typeof self.onsuccess === 'function') {
        self.result = res;
        self.onsuccess.call(self);
      }
    }
  }
  setTimeout(done, 100);
}
function ActivityOptions(name, data) {
  "use strict";
  this.name = name;
  this.data = data;
}
function ActivityRequestHandler(source, postResult, postError) {
  "use strict";
  this.source     = source;
  this.postResult = postResult;
  this.postError  = postError;
}
function ActivityHandlerDescription(name, href, disposition, returnValue, filters) {
  "use strict";
  this.name        = name;
  this.href        = href;
  this.disposition = disposition;
  this.returnValue = returnValue;
  this.filters     = filters;
}
platform.setMessageHandler = function (type, handler) {
  "use strict";
  if (typeof handlers[type] === 'undefined') {
    handlers[type] = [];
  }
  handlers[type].push(handler);
  if (platform.hasPendingMessage(type)) {
    queue[type].forEach(function (message) {
      // Message is an ActivityRequestHandler
      handler(message);
    });
  }
};
platform.hasPendingMessage = function (type) {
  "use strict";
  if (typeof queue[type] === 'undefined') {
    queue[type] = [];
  }
  return queue[type].length > 0;
};
platform.registerActivityHandler = function (description) {
  "use strict";
  return new Request();
};
platform.unregisterActivityHandler   = function (description) {};
platform.isActivityHandlerRegistered = function (handler) {};

// Test code
platform.setMessageHandler('share', function (a) {
  "use strict";
  a.postResult(a.source);
});

module.exports.handleActivity = function (body, res) {
  "use strict";
  var arh, activity, onsuccess, onerror;
  if (typeof handlers[body.name] !== 'undefined') {
    onsuccess = function (result) {
      res.send(JSON.stringify(this));
    };
    onerror = function (result) {
      res.send(JSON.stringify(this));
    };
    arh = new ActivityRequestHandler(body, onsuccess, onerror);
    handlers[body.name].forEach(function (handler) {
      handler(arh);
    });
  } else {
    activity = new Request(body);
    activity.onsuccess = function (result) {
      res.send(JSON.stringify(this));
    };
    activity.onerror = function (result) {
      res.send(JSON.stringify(this));
    };
  }
};
