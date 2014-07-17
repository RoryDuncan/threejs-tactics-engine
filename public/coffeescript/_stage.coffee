###

  Stages is an object to manage, well, stages.
  which a stage is the equivalent to the game concept of a 'level.'
  but someone could use multiple stages in one level, so I don't want to be pushy and call it a 'level' manager

###

utils = require("./_utils")
Input = require("./_input")
Cube = require("./_objects").Cube


###
    SelectionGrid Class
    Helper class for selecting objects / entities from a grid
    Should be automatically created when 
###

class SelectionGrid

  constructor: (data, engine, stage) ->

    # everything for the selectiongrid should be passed in initially
    @meshes = []
    @engine = engine
    @stage = stage
    @width = data.width
    @height = data.length
    @padding = data.padding or 2
    @x = data.x
    @y = data.y
    # helper fn to test if a number is an integer (no trailing decimal values)
    isInt = (num) ->
      return true if (num / Math.floor(num) is 1 or num / Math.floor(num) is -1)
      return false

    ### Convert the data into a normalized grid data  ###

    evenOffset = isInt(data.x / 2) ? 0 : 1 # even numbers wont have a perfect grid at 0,0; this fixes that
    x0 = ~~(data.x / 2)   # the boundery x value in the normalized grid
    y0 = ~~(data.y / 2)   # the first y value in the normalized grid
    centerIndex = null    # may be useful to know where the center is, store for later
    x = -1 * x0           # starting x value before iteration
    y = -1 * y0           # starting y value before iteration

    # This fancy assignment makes it where you can just make heightmap a single integer value,
    # and the whole heightmap will be generated at that height
    hm =  if utils.isArray(data.heightmap) then data.heightmap else (o - o for o in [0...(data.x*data.y)])

    # loop through all the data, making a internal form of data (nodes),
    # that will be used in @createGrid to make threejs objects
    data = hm.map (el, index, arr) ->

      node = {
        "z": el,
        "x": x,
        "y": y
      }

      if x is 0 and y is 0
        node.center = true # mark that node
        centerIndex = index # keep a reference, as well

      if x is (x0 - evenOffset)
        x = (-1 * x0) 
        y++
      else x++
      return node

    @centerIndex = centerIndex
    @data = data
    @createGrid()

  createGrid: () -> # creates the THREEjs objects based on the data loaded

    return if @data is undefined
    @objects = [] # a cache of the meshes

    x = 0
    y = 0
    w = @width
    h = @height
    padding = @padding or 2

    # this iteration should be refactored into
    #   x, y for x, y in [0..@data.length]
    # or something
    for datum in @data 

      # fancy maths to place the cube correctly in a grid
      size = {x: w, y: w, z: 0}
      position = {x: datum.x * (w + padding), y: datum.y * (w + padding), z: datum.z * (h + padding)}
      material = @material # override material
      scene = @stage.scene

      cube = new Cube({size, position, material}, scene)

      @objects.push cube
      @stage.meshes.push cube.mesh

  filterData: (vec3) -> # helper for getting / filtering, rows, columns, or specific grid nodes.

    ###
      argument 'vec3' can be an object or a THREE.Vector3 instance
      ! Vector3 instances don't allow you to have 'undefined' as a value, so using '*' is used
      ie:   filterData( new THREE.Vector3(0, "*", "*") );

      Plain objects do allow undefined though, so you can pass in an object with all the values you want
      ie:   filterData({ x: 2});
    
    ###
    return unless vec3

    @data.filter (el, i, arr) ->
      if el.x is vec3.x or vec3.x is "*" or vec3.x is undefined
        if el.y is vec3.y or vec3.y is "*" or vec3.y is undefined
          if el.z is vec3.z or vec3.z is "*" or vec3.z is undefined
            return el



class Stage extends utils.EventEmitter

  constructor: (parent, name, options) ->
    
    @parent = parent
    @renderer = parent.renderer
    @name = name.toLowerCase()
    @scene = options.scene
    camera = options.camera
    @camera = camera
    @meshes = []

    beforeLoaded = () -> # small items to run before the @onload() fn is called
      @render()
      @Input = new Input.Interface(@, parent)
      # mouse detector needs to be ran after the data has been added to the scene
      @MouseDetector = new Input.MouseDetection(@, parent)
      @onload.call(@)

    that = @

    that.on "load", beforeLoaded.bind(that)

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

  load: (urlToJson) ->
    ###
      incase wasn't originally passed in
    ###
    that = @
    callbacks = 
      scope: that,
      success: (responseText) ->
        that.data = responseText
        console.log "Engine :: '" + name + "' ajax'd. "
        that.data.grid = that.grid = new SelectionGrid that.data.grid, that.parent, that
        that.trigger "load"
      error: () ->
        throw new Error "Error retrieving data for Stage"

    unless urlToJson is undefined then utils.getJSON urlToJson, callbacks

  onload: () ->
    ###
      meant to be overwritten by the user
      alternative is: 
      | @on "load", fn
      which will be triggered on loading

    ###
    return @

  lookAt: (point) ->
    @camera.up = new THREE.Vector3 0, 0, 1
    @camera.lookAt point or @scene

  setCameraToIsometric: ->
    return unless @grid
    # resource:
    # http://en.wikipedia.org/wiki/Isometric_projection
    #
    w = @grid.width
    h = @grid.height
    x = @grid.x
    y = @grid.y

    distanceFromCenterofGridToEdge = utils.pythag(w*x, h*y)
    zDistance = distanceFromCenterofGridToEdge / 2 #utils.pythag(w*x, h*y)
    yDistance = (w + (@grid.padding or 2)) * x
    xDistance = (w + (@grid.padding or 2)) * x

    @camera.position.setZ zDistance
    @camera.position.setY yDistance
    @camera.position.setX xDistance
    @camera.up = new THREE.Vector3 0, 0, 1
    @camera.lookAt new THREE.Vector3 0,0,0
    return @
    ###
    
    
    @camera.rotation.z = 0.25
    ###
  render: ->

    # axis lines, to be removed later
    geometry = new THREE.Geometry()
    extent = 5000
    geometry.vertices.push new THREE.Vector3( 0, 0, -extent )
    geometry.vertices.push new THREE.Vector3( 0, 0, extent )


    geometry.vertices.push new THREE.Vector3( -extent, 0, 0 )
    geometry.vertices.push new THREE.Vector3( extent, 0, 0 )
  

    geometry.vertices.push new THREE.Vector3( 0, -extent, 0 )
    geometry.vertices.push new THREE.Vector3( 0, extent, 0 )

    material = new THREE.LineBasicMaterial( { color: 0x555555 } )
    line = new THREE.Line( geometry, material )
    @scene.add line



    @setCameraToIsometric()
    #@camera.position.setZ(250)
    #@camera.updateMatrix()

    @parent.renderer.render @scene, @camera

    L = @parent.clock.loop "render", ->

      #camera.position.y += 1
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