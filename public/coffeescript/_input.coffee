

###
# @InputInterface
#
###

utils = require("./_utils")

module.exports.Interface = (canvas, parent, engine) ->
  return unless $

  if arguments.length is 3
    $el = $(canvas)
    @parent = parent
    @engine = engine
    scope = engine
  else
    $el = $(parent.renderer.domElement)
    @parent = canvas
    @engine = parent
    scope = parent


  # the relevent e.which keys, hashed
  key =

    #   mouse clicks

    "leftClick": 1,
    "scrollwheel": 2,
    "rightClick": 3,

    #   keys

    'backspace': 8,
    'tab': 9,
    'enter': 13,
    'shift': 16,
    'ctrl': 17,
    'alt': 18,
    'pause': 19,
    'capslock': 20,
    'esc': 27,
    'pageup': 33,
    'pagedown': 34,
    'end': 35,
    'home': 36,
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    'insert': 45,
    'delete': 46,
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    'a': 65,
    'b': 66,
    'c': 67,
    'd': 68,
    'e': 69,
    'f': 70,
    'g': 71,
    'h': 72,
    'i': 73,
    'j': 74,
    'k': 75,
    'l': 76,
    'm': 77,
    'n': 78,
    'o': 79,
    'p': 80,
    'q': 81,
    'r': 82,
    's': 83,
    't': 84,
    'u': 85,
    'v': 86,
    'w': 87,
    'x': 88,
    'y': 89,
    'z': 90,
    'numpad0': 96,
    'numpad1': 97,
    'numpad2': 98,
    'numpad3': 99,
    'numpad4': 100,
    'numpad5': 101,
    'numpad6': 102,
    'numpad7': 103,
    'numpad8': 104,
    'numpad9': 105,
    'multiply': 106,
    'plus': 107,
    'minut': 109,
    'dot': 110,
    'slash1': 111,
    'F1': 112,
    'F2': 113,
    'F3': 114,
    'F4': 115,
    'F5': 116,
    'F6': 117,
    'F7': 118,
    'F8': 119,
    'F9': 120,
    'F10': 121,
    'F11': 122,
    'F12': 123,
    'equal': 187,
    'coma': 188,
    'slash': 191,
    'backslash': 220

  bound = {}


  handler = (e) ->

    e.preventDefault()
    e.position = utils.getMousePosition(e)

    b = bound[e.type]
    
    return unless b

    for keyname of b
      if key[keyname] is e.which
        b[keyname].callback.call( b[keyname], e, b[keyname].data )
        return

  # mouse movement is a special case
  mousemoveHandler = (e) ->

    e.preventDefault()
    e.position = utils.getMousePosition(e)

    b = bound["mousemove"]
    data = b.data or {}
    b.callback.call parent, e, data
    return

  @bind =
  @on = (events, keyname, callback, data) ->
    return unless arguments.length >= 2
    _events = events.split(" ")

    if _events[0] is "mousemove"
      # There is no keyname for mousemove,
      # so 'keyname' is actually callback, and 'callback' is data
      bound["mousemove"] = { "callback": keyname, "data": callback }
      $el.on "mousemove", mousemoveHandler

    for eventType in _events
      b = bound[eventType] = bound[eventType] or {}
      b[keyname] = { callback, data }

      $el.on eventType, handler
    return @

  @unbind =
  @off = (events, keyname) ->

    _events = events.split(" ")

    for eventType in _events
      $el.off eventType, handler
      delete bound[eventType][keyname]
    return @

  @trigger = (event) ->
    $el.trigger event
    return bound[event]

  return @


module.exports.MouseDetection = (parent, engine, multiselect = true, clearAfterEmptySelection = true) ->

  enabled = false
  stage = parent
  input = parent.Input
  camera = parent.camera
  projector = new THREE.Projector()
  @intersections = null
  lastHoverIntersect = null
  lastClickIntersect = null
  selectedObjects = []
  that = @

  @mousemove = true
  @click = true

  @multiselect = multiselect
  @clearAfterEmptySelection = clearAfterEmptySelection

  # function
  # Use a raycaster to retrieve any intersections
  getIntersections = (mouse, camera) ->

    vector = new THREE.Vector3 mouse.normalized.x, mouse.normalized.y, 1
    
    projector.unprojectVector( vector, camera )

    direction = vector.sub( camera.position ).normalize()
    raycaster = new THREE.Raycaster camera.position, direction

    intersections = raycaster.intersectObjects( stage.meshes )
    return intersections

  # the handler called when a mouse click occurs within the canvas
  handler = (e, camera) ->

    # our Input Interface's handler automatically assigns 'position' to any jquery click or mousemove event
    mouse = e.position
    intersections = getIntersections(mouse, camera)

    if e.type is "mousemove"

      return unless that.mousemove is true
      mousemoveHandler intersections, mouse, camera, e

    else if e.type is "click"

      return unless that.click is true
      clickHandler intersections, mouse, camera, e

    return e

  mousemoveHandler = (intersections, mouse, camera, e) ->

    if intersections.length is 0
      if lastHoverIntersect is null
        return
      lastHoverIntersect.dispatchEvent({type:"leave"})
      lastHoverIntersect = null
      return

    intersect = intersections[0].object
    intersect.dispatchEvent({type:"hover"})

    if lastHoverIntersect is null

      lastHoverIntersect = intersect
    else if lastHoverIntersect isnt intersect

      lastHoverIntersect.dispatchEvent({type:"leave"})
      lastHoverIntersect = intersect

  clickHandler = (intersections, mouse, camera, e) ->

    ### deal with things that weren't selected ###

    if intersections.length is 0    # no current selections
      if lastClickIntersect is null # no previous selections
        return

      return unless that.clearAfterEmptySelection is true
      return unless that.multiselect is true
      selectedObjects.forEach (el) ->
        el.dispatchEvent {type:"clear"}
      selectedObjects = []
      return

    intersect = intersections[0].object
    intersect.dispatchEvent({type:"click"})
    
    if lastClickIntersect is null

      lastClickIntersect = intersect
      return unless that.multiselect is true
      selectedObjects.push intersect

    else if lastClickIntersect isnt intersect

      lastClickIntersect.dispatchEvent({type:"leave"})
      lastClickIntersect = intersect
      return unless that.multiselect is true
      selectedObjects.push intersect

    return

  @toggle = ->
    if enabled
      @disable()
    else @enable()

  @off = ->
    if enabled
      enabled = false
      input.off "mousemove", handler, camera
      input.off "click", handler, camera

    return

  @on = ->
    if not enabled
      enabled = true
      input.on "mousemove", handler, camera
      input.on "click", "leftClick", handler, camera

    return

  @on()

  return @
