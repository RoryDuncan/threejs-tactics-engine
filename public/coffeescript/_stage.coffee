###

  Stages is an object to manage, well, stages.
  which a stage is the equivalent to the game concept of a 'level.'
  but someone could use multiple stages in one level, so I don't want to be pushy and call it a 'level' manager

###

utils = require("./_utils")
Cube = require("./_objects").Cube

class SelectionGrid
  constructor: (data, engine, stage) ->
    
    @engine = engine
    @stage = stage
    @width = data.width
    @height = data.length

    @x = data.x
    @y = data.y


    x0 = (Math.floor(data.x / 2))
    y0 = (Math.floor(data.y / 2))
    centerIndex = null
    x = -1 * x0
    y = -1 * y0

    hm = data.heightmap.map (el, index, arr) ->


      node = {
        "z": el,
        "x": x,
        "y": y
      }

      if x is 0 and y is 0
        node.center = true
        centerIndex = index

      x++

      if x is x0
        x = (-1 * x0) 
        y++



      return node

    @centerIndex = centerIndex
    @data = hm
    console.log @
    @createGrid()

  

  createGrid: ->
    return if @data is undefined
    margin = 2
    @objects = [] # a cache of the meshes

    x = 0 # My biggest qualm with coffeescript
    y = 0 # is keeping track of iterators during for loops..
    w = @width
    h = @height
    padding = 2

    for datum in @data

      @objects.push new Cube(
        {x: w, y: 1 * w, z: 1},
        {x: datum.x * (w + padding), y: datum.y * (w + padding), z: datum.z * (h + padding)},
        null, # no material passed in
        @stage.scene) # instantly add to the scene

  filterData: (vec3) ->
    ###
      argument 'vec3' can be an object or a THREE.Vector3 instance
      ! Vector3 instances don't allow you to have 'undefined' as a value, so using '*' is used
      ie:   filterData( new THREE.Vector3(0, "*", "*") );

      Plain objects do allow undefined though, so you can pass in an object with all the values you want
      ie:   filterData({ x: 2});
    
    ###
    console.log vec3
    return unless vec3

    @data.filter (el, i, arr) ->
      if el.x is vec3.x or vec3.x is "*" or vec3.x is undefined
        if el.y is vec3.y or vec3.y is "*" or vec3.y is undefined
          if el.z is vec3.z or vec3.z is "*" or vec3.z is undefined
            return el







class Stage extends utils.EventEmitter

  constructor: (parent, name, options) ->
    
    @parent = parent
    @name = name.toLowerCase()
    @scene = options.scene
    camera = options.camera
    @camera = camera

    that = @

    that.on "load", that.onload.bind(that)

    callbacks =

      scope: that,

      success: (responseText) ->

        that.data = responseText
        console.log "Engine :: '" + name + "' ajax'd. "
        that.data.grid = that.grid = new SelectionGrid that.data.grid, that.parent, that

        that.trigger "load"

      error: () ->
        throw new Error "Error retrieving data for Stage"


    unless options.url is undefined then utils.getJSON options.url, callbacks

  onload: () ->
    @render()
    return

  lookAt: (point) ->
    @camera.lookAt point or @scene

  setCameraToIsometric: ->
    return unless @grid

    w = @grid.width
    h = @grid.height
    x = @grid.x
    y = @grid.y

    amt = Math.pow(w * x / 2, 1.35)
    #amt = 240
    # have this adjust relative to the size of the map
    @camera.position.z = amt / 2
    @camera.position.y = -1 * amt * 1.1
    @camera.position.x = amt

    @camera.rotation.x = 1.2
    @camera.rotation.y = 0.75
    @camera.rotation.z = 0.25

  render: ->
    # origin cube
    geometry = new THREE.BoxGeometry(2,2,20)
    material = new THREE.MeshBasicMaterial( { color: 0xffffff, } )
    cube = new THREE.Mesh( geometry, material )
    @scene.add cube 
    @setCameraToIsometric()


    
    #@.lookAt new THREE.Vector3 0,0,0


    @parent.renderer.render @scene, @camera

    L = @parent.clock.loop "render", ->


      @parent.renderer.render @scene, @camera
    , null, @
   
    L.for({interval: 17})

    @parent.clock.start()


  destroy: () ->
      @parent.destroy @name




StageManager = (engine) ->

  ### @PRIVATES ###

  parent = engine


  ### @PUBLICS###


  list = {}
  @list = []

  @create = (name, options) ->
    return unless name

    o = options or {}

    stage = new Stage parent, name, o
    @list.push name
    list[name.toLowerCase()] = stage
    return list[name.toLowerCase()]

  @current = undefined

  @destroy = (name) ->
    # this destroy method might not be sufficient, depending on how THREE references internally
    # so, TODO

    delete list[name] # will return a bool response upon deleting

  @load = (name, transition) ->
    # todo: change from one stage (scene and camera) to another


  return @

module.exports = StageManager