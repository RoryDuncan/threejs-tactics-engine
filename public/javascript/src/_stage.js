
/*

  Stages is an object to manage, well, stages.
  which a stage is the equivalent to the game concept of a 'level.'
  but someone could use multiple stages in one level, so I don't want to be pushy and call it a 'level' manager
*/


(function() {
  var Cube, SelectionGrid, Stage, StageManager, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require("./_utils");

  Cube = require("./_objects").Cube;

  SelectionGrid = (function() {

    function SelectionGrid(data, engine, stage) {
      var centerIndex, hm, x, x0, y, y0;
      this.engine = engine;
      this.stage = stage;
      this.width = data.width;
      this.height = data.length;
      this.x = data.x;
      this.y = data.y;
      x0 = Math.floor(data.x / 2);
      y0 = Math.floor(data.y / 2);
      centerIndex = null;
      x = -1 * x0;
      y = -1 * y0;
      hm = data.heightmap.map(function(el, index, arr) {
        var node;
        node = {
          "z": el,
          "x": x,
          "y": y
        };
        if (x === 0 && y === 0) {
          node.center = true;
          centerIndex = index;
        }
        x++;
        if (x === x0) {
          x = -1 * x0;
          y++;
        }
        return node;
      });
      this.centerIndex = centerIndex;
      this.data = hm;
      console.log(this);
      this.createGrid();
    }

    SelectionGrid.prototype.createGrid = function() {
      var datum, h, margin, padding, w, x, y, _i, _len, _ref, _results;
      if (this.data === void 0) {
        return;
      }
      margin = 2;
      this.objects = [];
      x = 0;
      y = 0;
      w = this.width;
      h = this.height;
      padding = 2;
      _ref = this.data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        datum = _ref[_i];
        _results.push(this.objects.push(new Cube({
          x: w,
          y: 1 * w,
          z: 1
        }, {
          x: datum.x * (w + padding),
          y: datum.y * (w + padding),
          z: datum.z * (h + padding)
        }, null, this.stage.scene)));
      }
      return _results;
    };

    SelectionGrid.prototype.filterData = function(vec3) {
      /*
        argument 'vec3' can be an object or a THREE.Vector3 instance
        ! Vector3 instances don't allow you to have 'undefined' as a value, so using '*' is used
        ie:   filterData( new THREE.Vector3(0, "*", "*") );
      
        Plain objects do allow undefined though, so you can pass in an object with all the values you want
        ie:   filterData({ x: 2});
      */
      console.log(vec3);
      if (!vec3) {
        return;
      }
      return this.data.filter(function(el, i, arr) {
        if (el.x === vec3.x || vec3.x === "*" || vec3.x === void 0) {
          if (el.y === vec3.y || vec3.y === "*" || vec3.y === void 0) {
            if (el.z === vec3.z || vec3.z === "*" || vec3.z === void 0) {
              return el;
            }
          }
        }
      });
    };

    return SelectionGrid;

  })();

  Stage = (function(_super) {

    __extends(Stage, _super);

    function Stage(parent, name, options) {
      var callbacks, camera, that;
      this.parent = parent;
      this.name = name.toLowerCase();
      this.scene = options.scene;
      camera = options.camera;
      this.camera = camera;
      that = this;
      that.on("load", that.onload.bind(that));
      callbacks = {
        scope: that,
        success: function(responseText) {
          that.data = responseText;
          console.log("Engine :: '" + name + "' ajax'd. ");
          that.data.grid = that.grid = new SelectionGrid(that.data.grid, that.parent, that);
          return that.trigger("load");
        },
        error: function() {
          throw new Error("Error retrieving data for Stage");
        }
      };
      if (options.url !== void 0) {
        utils.getJSON(options.url, callbacks);
      }
    }

    Stage.prototype.onload = function() {
      this.render();
    };

    Stage.prototype.lookAt = function(point) {
      return this.camera.lookAt(point || this.scene);
    };

    Stage.prototype.setCameraToIsometric = function() {
      var amt, h, w, x, y;
      if (!this.grid) {
        return;
      }
      w = this.grid.width;
      h = this.grid.height;
      x = this.grid.x;
      y = this.grid.y;
      amt = Math.pow(w * x / 2, 1.35);
      this.camera.position.z = amt / 2;
      this.camera.position.y = -1 * amt * 1.1;
      this.camera.position.x = amt;
      this.camera.rotation.x = 1.2;
      this.camera.rotation.y = 0.75;
      return this.camera.rotation.z = 0.25;
    };

    Stage.prototype.render = function() {
      var L, cube, geometry, material;
      geometry = new THREE.BoxGeometry(2, 2, 20);
      material = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });
      cube = new THREE.Mesh(geometry, material);
      this.scene.add(cube);
      this.setCameraToIsometric();
      this.parent.renderer.render(this.scene, this.camera);
      L = this.parent.clock.loop("render", function() {
        return this.parent.renderer.render(this.scene, this.camera);
      }, null, this);
      L["for"]({
        interval: 17
      });
      return this.parent.clock.start();
    };

    Stage.prototype.destroy = function() {
      return this.parent.destroy(this.name);
    };

    return Stage;

  })(utils.EventEmitter);

  StageManager = function(engine) {
    /* @PRIVATES
    */

    var list, parent;
    parent = engine;
    /* @PUBLICS
    */

    list = {};
    this.list = [];
    this.create = function(name, options) {
      var o, stage;
      if (!name) {
        return;
      }
      o = options || {};
      stage = new Stage(parent, name, o);
      this.list.push(name);
      list[name.toLowerCase()] = stage;
      return list[name.toLowerCase()];
    };
    this.current = void 0;
    this.destroy = function(name) {
      return delete list[name];
    };
    this.load = function(name, transition) {};
    return this;
  };

  module.exports = StageManager;

}).call(this);

// Generated by CoffeeScript 1.5.0-pre
