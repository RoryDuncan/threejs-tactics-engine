
/*

  Stages is an object to manage, well, stages.
  which a stage is the equivalent to the game concept of a 'level.'
  but someone could use multiple stages in one level, so I don't want to be pushy and call it a 'level' manager
*/


(function() {
  var Input, SelectionGrid, Selector, Stage, StageManager, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require("./_utils");

  Input = require("./_input");

  Selector = require("./_objects").Selector;

  /*
      SelectionGrid Class
      Helper class for selecting objects / entities from a grid
      Should be automatically created when
  */


  SelectionGrid = (function(_super) {

    __extends(SelectionGrid, _super);

    function SelectionGrid(data, engine, stage) {
      var centerIndex, evenOffset, hm, o, x, x0, z, z0, _ref;
      this.engine = engine;
      this.stage = stage;
      this.width = data.width;
      this.height = data.length;
      this.padding = data.padding || 2;
      this.x = data.x;
      this.z = data.z;
      this.on("click", function(selector) {
        return this.displayRange(selector, 5);
      }, this);
      /* Convert the data into a normalized grid data
      */

      evenOffset = (_ref = utils.isInt(data.x / 2)) != null ? _ref : {
        0: 1
      };
      x0 = ~~(data.x / 2);
      z0 = ~~(data.z / 2);
      centerIndex = null;
      x = -1 * x0;
      z = -1 * z0;
      hm = utils.isArray(data.heightmap) ? data.heightmap : (function() {
        var _i, _ref1, _results;
        _results = [];
        for (o = _i = 1, _ref1 = data.x * data.z; 1 <= _ref1 ? _i <= _ref1 : _i >= _ref1; o = 1 <= _ref1 ? ++_i : --_i) {
          _results.push(data.heightmap);
        }
        return _results;
      })();
      data = hm.map(function(el, index, arr) {
        var node;
        node = {
          "z": z,
          "x": x,
          "y": el,
          "id": index
        };
        if (x === 0 && z === 0) {
          node.center = true;
          centerIndex = index;
        }
        if (x === (x0 - evenOffset)) {
          x = -1 * x0;
          z += 1;
        } else {
          x++;
        }
        return node;
      });
      this.centerIndex = centerIndex;
      this.data = data;
      this.createGrid();
    }

    SelectionGrid.prototype.createGrid = function(showHelper) {
      var datum, h, material, padding, parent, position, scene, selector, size, w, _i, _len, _ref;
      if (showHelper == null) {
        showHelper = true;
      }
      if (this.data === void 0) {
        return;
      }
      this.selectors = [];
      w = this.width;
      h = this.height;
      padding = this.padding || 2;
      parent = this;
      _ref = this.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        datum = _ref[_i];
        size = {
          x: w,
          y: 0,
          z: w
        };
        position = {
          x: datum.x * (w + padding),
          y: datum.y * (h + padding),
          z: datum.z * (w + padding)
        };
        material = this.material;
        scene = this.stage.scene;
        selector = new Selector({
          parent: parent,
          size: size,
          position: position,
          material: material
        }, scene);
        datum.selector = selector;
        selector.datum = datum;
        this.selectors.push(selector);
        this.stage.meshes.push(selector.mesh);
      }
      return this.helper.grid.call(this, showHelper);
    };

    SelectionGrid.prototype.filterData = function(vec3) {
      /*
        argument 'vec3' can be an object or a THREE.Vector3 instance
        ! Vector3 instances don't allow you to have 'undefined' as a value, so using '*' is used
        ie:   filterData( new THREE.Vector3(0, "*", "*") );
      
        Plain objects do allow undefined though, so you can pass in an object with all the values you want
        ie:   filterData({ x: 2});
      */

      var results;
      if (!vec3) {
        return;
      }
      results = [];
      results = results.concat(this.data.filter(function(el, i, arr) {
        if (el.x === vec3.x || vec3.x === "*" || vec3.x === void 0) {
          if (el.y === vec3.y || vec3.y === "*" || vec3.y === void 0) {
            if (el.z === vec3.z || vec3.z === "*" || vec3.z === void 0) {
              return el;
            }
          }
        }
      }));
      return results;
    };

    SelectionGrid.prototype.getRange = function(vec3, steps) {
      var count, getStepCount, results, x, _i, _len, _ref;
      if (steps == null) {
        steps = 4;
      }
      getStepCount = utils.steps;
      results = [];
      _ref = this.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        count = getStepCount(vec3, x);
        if (count < steps + 1) {
          results.push(x);
        }
      }
      return results;
    };

    SelectionGrid.prototype.getRangeFromSelector = function(selector, steps) {
      if (!(selector instanceof Selector)) {
        return;
      }
      return this.getRange(selector.datum, steps);
    };

    SelectionGrid.prototype.displayRange = function(selector, steps, clearOtherRanges) {
      var selectors;
      if (clearOtherRanges == null) {
        clearOtherRanges = true;
      }
      if (!(selector instanceof Selector)) {
        return;
      }
      if (clearOtherRanges) {
        this.clearAllRanges();
      }
      selectors = this.getRangeFromSelector(selector, steps);
      return selectors.forEach(function(el) {
        return el.selector.changeMaterialState.call(el.selector, "range", true);
      });
    };

    SelectionGrid.prototype.clearAllRanges = function() {
      var type;
      type = "default";
      return this.selectors.forEach(function(el) {
        return el.resetMaterial.call(el, type);
      });
    };

    SelectionGrid.prototype.helper = {
      grid: function(remove) {
        var grid, padding, size, step, width;
        if (remove == null) {
          remove = false;
        }
        console.log(this);
        padding = this.padding;
        width = this.width;
        size = ((width + padding) * this.x) / 2;
        step = (size * 2) / (width + (padding / 2));
        grid = new THREE.GridHelper(size, step);
        this._helpergrid = grid;
        grid.setColors("#224", "#224");
        this.stage.scene.add(grid);
        return grid;
      },
      range: function() {}
    };

    return SelectionGrid;

  })(utils.EventEmitter);

  Stage = (function(_super) {

    __extends(Stage, _super);

    function Stage(parent, name, options) {
      var beforeLoaded, callbacks, camera, that;
      this.parent = parent;
      this.renderer = parent.renderer;
      this.name = name.toLowerCase();
      this.scene = options.scene;
      camera = options.camera;
      this.camera = camera;
      this.meshes = [];
      beforeLoaded = function() {
        this.render();
        this.Input = new Input.Interface(this, parent);
        this.MouseDetector = new Input.MouseDetection(this, parent);
        return this.onload.call(this);
      };
      that = this;
      that.on("load", beforeLoaded.bind(that));
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

    Stage.prototype.load = function(urlToJson) {
      /*
        incase wasn't originally passed in
      */

      var callbacks, that;
      that = this;
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
      if (urlToJson !== void 0) {
        return utils.getJSON(urlToJson, callbacks);
      }
    };

    Stage.prototype.onload = function() {
      /*
        meant to be overwritten by the user
        alternative is: 
        | @on "load", fn
        which will be triggered on loading
      */
      return this;
    };

    Stage.prototype.lookAt = function(point) {
      this.camera.up = new THREE.Vector3(0, 0, 1);
      return this.camera.lookAt(point || this.scene);
    };

    Stage.prototype.setCameraToIsometric = function() {
      var distanceFromCenterofGridToEdge, h, w, x, xDistance, yDistance, z, zDistance;
      if (!this.grid) {
        return;
      }
      w = this.grid.width;
      h = this.grid.height;
      x = this.grid.x;
      z = this.grid.z;
      distanceFromCenterofGridToEdge = utils.pythag(w * x, h * z);
      yDistance = distanceFromCenterofGridToEdge / 2;
      zDistance = (w + (this.grid.padding || 2)) * z;
      xDistance = (w + (this.grid.padding || 2)) * x;
      this.camera.position.setZ(zDistance);
      this.camera.position.setY(yDistance);
      this.camera.position.setX(xDistance);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      return this;
      /*
      
      
      @camera.rotation.z = 0.25
      */

    };

    Stage.prototype.render = function() {
      var L, extent, geometry, line, material;
      geometry = new THREE.Geometry();
      extent = 5000;
      geometry.vertices.push(new THREE.Vector3(0, 0, -extent));
      geometry.vertices.push(new THREE.Vector3(0, 0, extent));
      geometry.vertices.push(new THREE.Vector3(-extent, 0, 0));
      geometry.vertices.push(new THREE.Vector3(extent, 0, 0));
      geometry.vertices.push(new THREE.Vector3(0, -extent, 0));
      geometry.vertices.push(new THREE.Vector3(0, extent, 0));
      material = new THREE.LineBasicMaterial({
        color: 0x555555
      });
      line = new THREE.Line(geometry, material);
      this.scene.add(line);
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
