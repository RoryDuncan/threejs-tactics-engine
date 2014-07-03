###
    three-js Tactics Engine

###
console.log "_base"


StageLoader = require("./_stageloader")


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

  @THREE = THREE
  
  # todo
  @load = () ->
    #
  
  @stageLoader = new StageLoader()
    #
  
  # a function to allow the display of 'loading' to the user
  @loading = ->
    #

  @init = (options) ->

    config = $.getJSON ( options or {} ).config or "json/config.json"

    config.complete ->
      
      try
        @config = $.parseJSON config.responseText


      catch e
        console.log e
        throw new Error "JSON was not parsed."

      configLoaded = true


  @start = () ->
    




  return @

self.Engine = new ThreeTacticsEngine()
Engine.init()

console.log Engine




