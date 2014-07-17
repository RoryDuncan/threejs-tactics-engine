
/*
# @InputInterface
#
*/


(function() {
  var utils;

  utils = require("./_utils");

  module.exports.Interface = function(canvas, parent, engine) {
    var $el, bound, handler, key, mousemoveHandler, scope;
    if (!$) {
      return;
    }
    if (arguments.length === 3) {
      $el = $(canvas);
      this.parent = parent;
      this.engine = engine;
      scope = engine;
    } else {
      $el = $(parent.renderer.domElement);
      this.parent = canvas;
      this.engine = parent;
      scope = parent;
    }
    key = {
      "leftClick": 1,
      "scrollwheel": 2,
      "rightClick": 3,
      'backspace': 8,
      'tab': 9,
      'enter': 13,
      'shift': 16,
      'ctrl': 17,
      'alt': 18,
      'pause': 19,
      'capslock': 20,
      'esc': 27,
      'pageup': 33,
      'pagedown': 34,
      'end': 35,
      'home': 36,
      'left': 37,
      'up': 38,
      'right': 39,
      'down': 40,
      'insert': 45,
      'delete': 46,
      '0': 48,
      '1': 49,
      '2': 50,
      '3': 51,
      '4': 52,
      '5': 53,
      '6': 54,
      '7': 55,
      '8': 56,
      '9': 57,
      'a': 65,
      'b': 66,
      'c': 67,
      'd': 68,
      'e': 69,
      'f': 70,
      'g': 71,
      'h': 72,
      'i': 73,
      'j': 74,
      'k': 75,
      'l': 76,
      'm': 77,
      'n': 78,
      'o': 79,
      'p': 80,
      'q': 81,
      'r': 82,
      's': 83,
      't': 84,
      'u': 85,
      'v': 86,
      'w': 87,
      'x': 88,
      'y': 89,
      'z': 90,
      'numpad0': 96,
      'numpad1': 97,
      'numpad2': 98,
      'numpad3': 99,
      'numpad4': 100,
      'numpad5': 101,
      'numpad6': 102,
      'numpad7': 103,
      'numpad8': 104,
      'numpad9': 105,
      'multiply': 106,
      'plus': 107,
      'minut': 109,
      'dot': 110,
      'slash1': 111,
      'F1': 112,
      'F2': 113,
      'F3': 114,
      'F4': 115,
      'F5': 116,
      'F6': 117,
      'F7': 118,
      'F8': 119,
      'F9': 120,
      'F10': 121,
      'F11': 122,
      'F12': 123,
      'equal': 187,
      'coma': 188,
      'slash': 191,
      'backslash': 220
    };
    bound = {};
    handler = function(e) {
      var b, keyname;
      e.preventDefault();
      b = bound[e.type];
      if (!b) {
        return;
      }
      for (keyname in b) {
        if (key[keyname] === e.which) {
          b[keyname].callback.call(b[keyname], b[keyname].data);
          return;
        }
      }
    };
    mousemoveHandler = function(e) {
      var b, data, mouse, normalized, x, y;
      e.preventDefault();
      x = e.clientX;
      y = e.clientY;
      normalized = {
        "x": (x / window.innerWidth) * 2 - 1,
        "y": -(y / window.innerHeight) * 2 + 1
      };
      b = bound["mousemove"];
      data = b.data || {};
      mouse = {
        x: x,
        y: y,
        normalized: normalized
      };
      b.callback.call(parent, mouse, data, e);
    };
    this.bind = this.on = function(events, keyname, callback, data) {
      var b, eventType, _events, _i, _len;
      if (!(arguments.length >= 2)) {
        return;
      }
      _events = events.split(" ");
      if (_events[0] === "mousemove") {
        bound["mousemove"] = {
          "callback": keyname,
          "data": callback
        };
        $el.on("mousemove", mousemoveHandler);
      }
      for (_i = 0, _len = _events.length; _i < _len; _i++) {
        eventType = _events[_i];
        b = bound[eventType] = bound[eventType] || {};
        b[keyname] = {
          callback: callback,
          data: data
        };
        $el.on(eventType, handler);
      }
      return this;
    };
    this.unbind = this.off = function(events, keyname) {
      var eventType, _events, _i, _len;
      _events = events.split(" ");
      for (_i = 0, _len = _events.length; _i < _len; _i++) {
        eventType = _events[_i];
        $el.off(eventType, handler);
        delete bound[eventType][keyname];
      }
      return this;
    };
    this.trigger = function(event) {
      $el.trigger(event);
      return bound[event];
    };
    return this;
  };

  module.exports.MouseDetection = function(parent, engine) {
    var camera, enabled, handler, input, lastIntersection, projector, stage, that;
    enabled = false;
    stage = parent;
    input = parent.Input;
    camera = parent.camera;
    projector = new THREE.Projector();
    this.intersections = null;
    lastIntersection = null;
    that = this;
    handler = function(mouse, camera) {
      var direction, intersect, raycaster, vector;
      vector = new THREE.Vector3(mouse.normalized.x, mouse.normalized.y, 1);
      projector.unprojectVector(vector, camera);
      direction = vector.sub(camera.position).normalize();
      raycaster = new THREE.Raycaster(camera.position, direction);
      that.intersections = raycaster.intersectObjects(stage.meshes);
      if (!that.intersections.length) {
        return;
      }
      intersect = that.intersections[0].object;
      intersect.dispatchEvent({
        type: "hover"
      });
      if (lastIntersection === null) {
        return lastIntersection = intersect;
      } else if (lastIntersection !== intersect) {
        lastIntersection.dispatchEvent({
          type: "leave"
        });
        return lastIntersection = intersect;
      }
    };
    this.detect = function(eventType) {};
    this.toggle = function() {
      if (enabled) {
        return this.disable();
      } else {
        return this.enable();
      }
    };
    this.disable = function() {
      if (enabled) {
        enabled = false;
        input.off("mousemove", handler, camera);
      }
    };
    this.enable = function() {
      if (!enabled) {
        enabled = true;
        return input.on("mousemove", handler, camera);
      }
    };
    this.enable();
    return this;
  };

}).call(this);

// Generated by CoffeeScript 1.5.0-pre
