(function() {
  var BackgroundPlane, LowPolyTerrain, Selector, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require("./_utils");

  module.exports.Selector = Selector = (function(_super) {

    __extends(Selector, _super);

    function Selector(options, scene) {
      var number, that;
      this.scene = scene;
      if (!(options.size && options.position)) {
        return;
      }
      if (typeof options.size === "number") {
        number = options.size;
      }
      this.parent = options.parent;
      this.position = new THREE.Vector3(options.position.x, options.position.y, options.position.z);
      this.geometry = new THREE.BoxGeometry(options.size.x, options.size.y, options.size.z);
      this.isSelected = false;
      this.disableHover = false;
      /*
      
        eventMaterials is a hash of the different states, named based on the event triggered
      */

      this.currentState = "default";
      this.mesh = new THREE.Mesh(this.geometry, this.eventMaterials["default"]);
      this.mesh.position = this.position;
      this.mesh.wrapper = this;
      that = this;
      this.mesh.addEventListener("hover", that._hover);
      this.mesh.addEventListener("leave", that._leave);
      this.mesh.addEventListener("click", that._click);
      this.mesh.addEventListener("clear", that._clear);
      if (this.scene !== void 0) {
        this.addToScene(this.scene);
      }
    }

    Selector.prototype.eventMaterials = {
      "default": new THREE.MeshBasicMaterial({
        opacity: 1,
        transparent: true,
        color: 0x444455,
        wireframe: false
      }),
      "hover": new THREE.MeshBasicMaterial({
        opacity: 0.45,
        transparent: true
      }),
      "click": new THREE.MeshBasicMaterial({
        color: 0xcccccc
      }),
      "leave": new THREE.MeshBasicMaterial({
        color: 0x00cc99
      }),
      "range": new THREE.MeshBasicMaterial({
        color: 0x0033aa
      }),
      "range-hover": new THREE.MeshBasicMaterial({
        color: 0xaa4444
      })
    };

    Selector.prototype.addToScene = function(scene) {
      this.scene = scene;
      return scene.add(this.mesh);
    };

    /*  The method to propogate events upwards to the SelectionGrid
    */


    Selector.prototype.callSuperEvent = function(name, args) {
      return this.parent.trigger(name, args);
    };

    /* use changeMaterialState to change the material appearance
    */


    Selector.prototype.changeMaterialState = function(name, disableHover) {
      if (disableHover == null) {
        disableHover = false;
      }
      this.mesh.disableHover = disableHover;
      this.mesh.isSelected = false;
      this.currentState = name;
      return this.mesh.material = this.eventMaterials[name] || this.eventMaterials["default"];
    };

    Selector.prototype.resetMaterial = function() {
      this.disableHover = false;
      return this.changeMaterialState("default");
    };

    /* specific event responses
    */


    Selector.prototype._hover = function(e) {
      if (this.wrapper.currentState === "range") {
        this.material = this.wrapper.eventMaterials["range-hover"];
      }
      if (this.disableHover) {
        return;
      }
      this.wrapper.trigger(e.type);
      this.wrapper.callSuperEvent.call(this.wrapper, e.type, [this.wrapper]);
      if (this.isSelected === true) {
        return;
      }
      this.material = this.wrapper.eventMaterials.hover;
      return this.wrapper.currentState = e.type;
    };

    Selector.prototype._leave = function(e) {
      this.wrapper.trigger(e.type);
      this.wrapper.callSuperEvent.call(this.wrapper, e.type, [this.wrapper]);
      if (this.wrapper.currentState === "range") {
        this.material = this.wrapper.eventMaterials["range"];
      }
      if (this.isSelected || this.disableHover || this.wrapper.currentState === "range") {

      } else {
        this.material = this.wrapper.eventMaterials["default"];
        return this.wrapper.currentState = e.type;
      }
    };

    Selector.prototype._click = function(e) {
      this.wrapper.trigger(e.type);
      this.wrapper.callSuperEvent.call(this.wrapper, e.type, [this.wrapper]);
      this.isSelected = !this.isSelected;
      if (this.isSelected) {
        this.material = this.wrapper.eventMaterials.click;
        return this.wrapper.currentState = e.type;
      } else {
        this.material = this.wrapper.eventMaterials.hover;
        return this.wrapper.currentState = "hover";
      }
    };

    Selector.prototype._clear = function(e) {
      this.wrapper.trigger(e.type);
      this.wrapper.callSuperEvent.call(this.wrapper, e.type, [this.wrapper]);
      if (this.wrapper.currentState = "range") {
        return;
      } else {
        this.material = this.wrapper.eventMaterials["default"];
        this.wrapper.currentState = "default";
      }
      return this.isSelected = false;
    };

    return Selector;

  })(utils.EventEmitter);

  module.exports.Skybox = BackgroundPlane = (function() {

    function BackgroundPlane() {
      console.log("wow");
    }

    return BackgroundPlane;

  })();

  module.exports.LowPolyTerrain = LowPolyTerrain = (function() {

    function LowPolyTerrain() {
      console.log("wow");
    }

    return LowPolyTerrain;

  })();

}).call(this);

// Generated by CoffeeScript 1.5.0-pre
