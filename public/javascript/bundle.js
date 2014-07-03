(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
    three-js Tactics Engine
*/


(function() {
  var StageLoader, ThreeTacticsEngine;

  console.log("_base");

  StageLoader = require("./_stageloader");

  ThreeTacticsEngine = function() {
    /*
      @PRIVATES
    */

    var THREE, configLoaded;
    if (self.THREE === void 0 || self.$ === void 0) {
      throw new Error("The engine is dependent on THREE.js and jQuery, which one of was not found, or not in the global scope.");
    }
    THREE = self.THREE;
    configLoaded = false;
    /*
      @PUBLICS
    */

    this.THREE = THREE;
    this.load = function() {};
    this.stageLoader = new StageLoader();
    this.loading = function() {};
    this.init = function(options) {
      var config;
      config = $.getJSON((options || {}).config || "json/config.json");
      return config.complete(function() {
        try {
          this.config = $.parseJSON(config.responseText);
        } catch (e) {
          console.log(e);
          throw new Error("JSON was not parsed.");
        }
        return configLoaded = true;
      });
    };
    this.start = function() {};
    return this;
  };

  self.Engine = new ThreeTacticsEngine();

  Engine.init();

  console.log(Engine);

}).call(this);

// Generated by CoffeeScript 1.5.0-pre

},{"./_stageloader":2}],2:[function(require,module,exports){
(function() {
  var StageLoader;

  StageLoader = function() {
    return console.log("_stageloader");
  };

  module.exports = StageLoader;

}).call(this);

// Generated by CoffeeScript 1.5.0-pre

},{}],3:[function(require,module,exports){
(function() {

  require("./_base");

  require("./main");

}).call(this);

// Generated by CoffeeScript 1.5.0-pre

},{"./_base":1,"./main":4}],4:[function(require,module,exports){
(function() {

  console.log("-- main --");

}).call(this);

// Generated by CoffeeScript 1.5.0-pre

},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJjOlxcVXNlcnNcXFJvYXItWWF3blxcc2FuZGJveFxcdGhyZWVqcy10YWN0aWNzLWVuZ2luZVxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJjOi9Vc2Vycy9Sb2FyLVlhd24vc2FuZGJveC90aHJlZWpzLXRhY3RpY3MtZW5naW5lL3B1YmxpYy9qYXZhc2NyaXB0L2dhbWUvX2Jhc2UuanMiLCJjOi9Vc2Vycy9Sb2FyLVlhd24vc2FuZGJveC90aHJlZWpzLXRhY3RpY3MtZW5naW5lL3B1YmxpYy9qYXZhc2NyaXB0L2dhbWUvX3N0YWdlbG9hZGVyLmpzIiwiYzovVXNlcnMvUm9hci1ZYXduL3NhbmRib3gvdGhyZWVqcy10YWN0aWNzLWVuZ2luZS9wdWJsaWMvamF2YXNjcmlwdC9nYW1lL2Jyb3dzZXIuanMiLCJjOi9Vc2Vycy9Sb2FyLVlhd24vc2FuZGJveC90aHJlZWpzLXRhY3RpY3MtZW5naW5lL3B1YmxpYy9qYXZhc2NyaXB0L2dhbWUvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLypcbiAgICB0aHJlZS1qcyBUYWN0aWNzIEVuZ2luZVxuKi9cblxuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBTdGFnZUxvYWRlciwgVGhyZWVUYWN0aWNzRW5naW5lO1xuXG4gIGNvbnNvbGUubG9nKFwiX2Jhc2VcIik7XG5cbiAgU3RhZ2VMb2FkZXIgPSByZXF1aXJlKFwiLi9fc3RhZ2Vsb2FkZXJcIik7XG5cbiAgVGhyZWVUYWN0aWNzRW5naW5lID0gZnVuY3Rpb24oKSB7XG4gICAgLypcbiAgICAgIEBQUklWQVRFU1xuICAgICovXG5cbiAgICB2YXIgVEhSRUUsIGNvbmZpZ0xvYWRlZDtcbiAgICBpZiAoc2VsZi5USFJFRSA9PT0gdm9pZCAwIHx8IHNlbGYuJCA9PT0gdm9pZCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgZW5naW5lIGlzIGRlcGVuZGVudCBvbiBUSFJFRS5qcyBhbmQgalF1ZXJ5LCB3aGljaCBvbmUgb2Ygd2FzIG5vdCBmb3VuZCwgb3Igbm90IGluIHRoZSBnbG9iYWwgc2NvcGUuXCIpO1xuICAgIH1cbiAgICBUSFJFRSA9IHNlbGYuVEhSRUU7XG4gICAgY29uZmlnTG9hZGVkID0gZmFsc2U7XG4gICAgLypcbiAgICAgIEBQVUJMSUNTXG4gICAgKi9cblxuICAgIHRoaXMuVEhSRUUgPSBUSFJFRTtcbiAgICB0aGlzLmxvYWQgPSBmdW5jdGlvbigpIHt9O1xuICAgIHRoaXMuc3RhZ2VMb2FkZXIgPSBuZXcgU3RhZ2VMb2FkZXIoKTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmdW5jdGlvbigpIHt9O1xuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHZhciBjb25maWc7XG4gICAgICBjb25maWcgPSAkLmdldEpTT04oKG9wdGlvbnMgfHwge30pLmNvbmZpZyB8fCBcImpzb24vY29uZmlnLmpzb25cIik7XG4gICAgICByZXR1cm4gY29uZmlnLmNvbXBsZXRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuY29uZmlnID0gJC5wYXJzZUpTT04oY29uZmlnLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJKU09OIHdhcyBub3QgcGFyc2VkLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uZmlnTG9hZGVkID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uKCkge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgc2VsZi5FbmdpbmUgPSBuZXcgVGhyZWVUYWN0aWNzRW5naW5lKCk7XG5cbiAgRW5naW5lLmluaXQoKTtcblxuICBjb25zb2xlLmxvZyhFbmdpbmUpO1xuXG59KS5jYWxsKHRoaXMpO1xuXG4vLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuNS4wLXByZVxuIiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgU3RhZ2VMb2FkZXI7XG5cbiAgU3RhZ2VMb2FkZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY29uc29sZS5sb2coXCJfc3RhZ2Vsb2FkZXJcIik7XG4gIH07XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBTdGFnZUxvYWRlcjtcblxufSkuY2FsbCh0aGlzKTtcblxuLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjUuMC1wcmVcbiIsIihmdW5jdGlvbigpIHtcblxuICByZXF1aXJlKFwiLi9fYmFzZVwiKTtcblxuICByZXF1aXJlKFwiLi9tYWluXCIpO1xuXG59KS5jYWxsKHRoaXMpO1xuXG4vLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuNS4wLXByZVxuIiwiKGZ1bmN0aW9uKCkge1xuXG4gIGNvbnNvbGUubG9nKFwiLS0gbWFpbiAtLVwiKTtcblxufSkuY2FsbCh0aGlzKTtcblxuLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjUuMC1wcmVcbiJdfQ==
