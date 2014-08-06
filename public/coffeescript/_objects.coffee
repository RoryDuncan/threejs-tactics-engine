

utils = require("./_utils")

module.exports.Selector = class Selector extends utils.EventEmitter

  constructor: (options, @scene) ->

    return unless options.size and options.position
    number = options.size if typeof options.size is "number"
    @parent = options.parent
    @position = new THREE.Vector3 options.position.x, options.position.y, options.position.z
    @geometry = new THREE.BoxGeometry(options.size.x, options.size.y, options.size.z)
    @isSelected = false
    @disableHover = false

    ###

      eventMaterials is a hash of the different states, named based on the event triggered

    ###
    
    @currentState = "default"
    @mesh = new THREE.Mesh @geometry, @eventMaterials.default
    @mesh.position = @position
    @mesh.wrapper = @
    that = @

    # use THREE.js's internal EventEmitter
    @mesh.addEventListener "hover", that._hover
    @mesh.addEventListener "leave", that._leave
    @mesh.addEventListener "click", that._click
    @mesh.addEventListener "clear", that._clear

    unless @scene is undefined then @addToScene @scene

  eventMaterials: {
      "default": new THREE.MeshBasicMaterial({opacity: 1, transparent: true, color: 0x444455, wireframe: false}),
      "hover": new THREE.MeshBasicMaterial({opacity: 0.45, transparent: true}),
      "click": new THREE.MeshBasicMaterial({color: 0xcccccc}),
      "leave": new THREE.MeshBasicMaterial({color: 0x00cc99}),
      "range": new THREE.MeshBasicMaterial({color: 0x0033aa}),
      "range-hover": new THREE.MeshBasicMaterial({color: 0xaa4444})
    }

  addToScene: (scene) ->
    @scene = scene
    scene.add @mesh

  ###  The method to propogate events upwards to the SelectionGrid ###

  callSuperEvent: (name, args) ->
    @parent.trigger name, args

  ### use changeMaterialState to change the material appearance ###
  changeMaterialState: (name, disableHover = false) ->
    @mesh.disableHover = disableHover
    @mesh.isSelected = false
    @currentState = name
    @mesh.material = @eventMaterials[name] or @eventMaterials["default"]

  resetMaterial: () ->
    @disableHover = false
    @changeMaterialState("default")

  ### specific event responses ###
  _hover: (e) ->
    
    if @wrapper.currentState is "range"
      @material = @wrapper.eventMaterials["range-hover"]
    return if @disableHover
    @wrapper.trigger e.type
    @wrapper.callSuperEvent.call @wrapper, e.type, [@wrapper]

    return if @isSelected is true

    @material = @wrapper.eventMaterials.hover
    @wrapper.currentState = e.type

  _leave: (e) ->

    @wrapper.trigger e.type
    @wrapper.callSuperEvent.call @wrapper, e.type, [@wrapper]
    if @wrapper.currentState is "range"
      @material = @wrapper.eventMaterials["range"]
    if @isSelected or @disableHover or @wrapper.currentState is "range"
      return
    else
      @material = @wrapper.eventMaterials.default
      @wrapper.currentState = e.type

  _click: (e) ->

    @wrapper.trigger e.type
    @wrapper.callSuperEvent.call @wrapper, e.type, [@wrapper]
    @isSelected = not @isSelected
    if @isSelected
      @material = @wrapper.eventMaterials.click
      @wrapper.currentState = e.type
    else
      @material = @wrapper.eventMaterials.hover
      @wrapper.currentState = "hover"

  _clear: (e) ->
    @wrapper.trigger e.type
    @wrapper.callSuperEvent.call @wrapper, e.type, [@wrapper]
    
    # make sure that the leave event doesn't remove the range state
    if @wrapper.currentState = "range"
      return

    # normal click-leave event
    else
      @material = @wrapper.eventMaterials.default
      @wrapper.currentState = "default"
    @isSelected = false

module.exports.Skybox = class BackgroundPlane
  constructor: () ->
    console.log "wow"
    


module.exports.LowPolyTerrain = class LowPolyTerrain
  constructor: () ->
    console.log "wow"






   
