
/*
    three-js Tactics Engine
*/


(function() {
  var Clock, Stage, ThreeTacticsEngine, utils;

  console.log("_base");

  utils = require("./_utils");

  Stage = require("./_stage");

  Clock = require("./_clock");

  ThreeTacticsEngine = function() {
    /*
      @PRIVATES
    */

    var THREE, configLoaded, eventMethods, log, name, scene, that, _i, _len;
    if (self.THREE === void 0 || self.$ === void 0) {
      throw new Error("The engine is dependent on THREE.js and jQuery, which one of was not found, or not in the global scope.");
    }
    THREE = self.THREE;
    configLoaded = false;
    scene = false;
    that = this;
    this.debug = true;
    this.logs = [];
    log = (function(msg) {
      return utils.log.call(this, msg, this.logs);
    }).bind(this);
    this.log = log;
    /*
      @PUBLICS
    */

    this.load = function() {};
    this.renderQueue = [];
    this.stage = new Stage(this);
    this.clock = new Clock();
    /* 
      Dynamically add event methods from the clock object (which has an event emitter built into it.)
      this array is the names of the methods that will be added to the events object
    */

    eventMethods = ["on", "off", "defer", "getEvents", "trigger", "remove"];
    this.events = {};
    for (_i = 0, _len = eventMethods.length; _i < _len; _i++) {
      name = eventMethods[_i];
      this.events[name] = this.clock[name];
    }
    this.init = function(options) {
      var config;
      config = $.getJSON((options || {}).config);
      if (typeof config === void 0) {
        return;
      }
      that = this;
      return config.complete(function() {
        var renderer;
        try {
          that.config = $.parseJSON(config.responseText);
        } catch (e) {
          log(e);
          throw new Error("JSON was not parsed.");
        }
        configLoaded = true;
        log("Configuration Loaded.");
        renderer = new THREE.WebGLRenderer({
          antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        that.renderer = renderer;
        log("Initialized.");
        if ((options || {}).autostart === true) {
          return that.start();
        }
      });
    };
    this.start = function() {
      var stage;
      if (!configLoaded) {
        return;
      }
      return stage = this.stage.create("test", {
        "url": "json/test.json",
        "camera": new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000),
        "scene": new THREE.Scene()
      });
    };
    return this;
  };

  self.Engine = new ThreeTacticsEngine();

  Engine.init({
    "config": "json/config.json",
    "autostart": true
  });

  console.log(Engine);

}).call(this);

// Generated by CoffeeScript 1.5.0-pre
