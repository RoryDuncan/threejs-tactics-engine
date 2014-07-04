###
    three-js Tactics Engine

###
console.log "_base"

utils = require("./_utils")
Stage = require("./_stage")
Clock = require("./_clock")

ThreeTacticsEngine = () ->


  ###
    @PRIVATES
  ###


  if self.THREE is undefined or self.$ is undefined
  then throw new Error "The engine is dependent on THREE.js and jQuery, which one of was not found, or not in the global scope."
  
  THREE = self.THREE
  configLoaded = false


  ###
    @PUBLICS
  ###
  

  # todo
  @load = () ->
    #
  
  @stage = new Stage()
    #
  @clock = new Clock()

  ### 
    Dynamically add event methods from the clock object (which has an event emitter built into it.)
    this array is the names of the methods that will be added to the events object 
  ###

  eventMethods = ["on", "off", "defer", "getEvents", "trigger", "remove"]
  @events = {}

  for name in eventMethods
    @events[ name ] = @clock[name]

  # a function to allow the display of 'loading' to the user
  @displayLoading = () ->
    #

  @init = (options) ->

    config = $.getJSON ( options or {} ).config or "json/config.json"

    that = @

    @displayLoading( config )

    config.complete ->
      
      try
        @config = $.parseJSON config.responseText

      catch e
        console.log e
        throw new Error "JSON was not parsed."

      configLoaded = true
      console.log "Configuration Loaded."
      that.displayLoading()
      that.start() if (options or {}).autostart is true


  @start = () ->
    return unless configLoaded

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

    renderer = new THREE.WebGLRenderer()
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )

    @renderer = renderer



  return @



self.Engine = new ThreeTacticsEngine()

Engine.init
  "autostart": true

console.log Engine




