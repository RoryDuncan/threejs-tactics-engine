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
  scene = false
  that = @
  @debug = true
  @logs = []

  log = ((msg) ->
    utils.log.call @, msg, @logs
  ).bind(@)
  @log = log

  ###
    @PUBLICS
  ###
  

  # todo
  @load = () ->
    #

  @renderQueue = []

  
  @stage = new Stage(@)
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


  @init = (options) ->

    config = $.getJSON ( options or {} ).config

    return if typeof config is undefined

    that = @

    config.complete ->
      
      try
        that.config = $.parseJSON config.responseText

      catch e
        log e
        throw new Error "JSON was not parsed."

      configLoaded = true
      log "Configuration Loaded."

      renderer = new THREE.WebGLRenderer({antialias: true})
      renderer.setSize( window.innerWidth, window.innerHeight )
      document.body.appendChild( renderer.domElement )
      that.renderer = renderer

      log "Initialized."

      that.start() if (options or {}).autostart is true

  @start = () ->
    return unless configLoaded

    stage = @stage.create "test",
        "url" : "json/test.json",
        "camera": new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000),
        "scene": new THREE.Scene()


  return @



self.Engine = new ThreeTacticsEngine()

Engine.init
  "config": "json/config.json"
  "autostart": true

console.log Engine




