
###
      utilities
###

module.exports.log = (msg) ->
  @logs.unshift msg
  return unless @debug
  prefix = "Engine :: "
  if typeof msg is "string" then console.log prefix + msg
  else console.log msg
  return

module.exports.extend = (objs...) ->
  return objs[0] if objs.length < 2

  extended = objs[0]

  for obj in objs
      
    base = obj

    for key of base
      extended[key] = base[key]

  return extended

module.exports.isArray = Array.isArray or (thing) ->
  Object.prototype.toString.call thing is "[object Array]"

module.exports.pythag = (A, B, hypotenuse) ->
  return unless arguments.length >= 2

  if B is null
    result = (Math.pow hypotenuse, 2 ) - Math.pow A, 2
    result = Math.sqrt( result )
    return result
  else
    a2 = Math.pow(A, 2)
    b2 = Math.pow(B, 2)
    result = Math.sqrt( a2 + b2 )
    return result

module.exports.getJSON = (url, callbacks) ->
    options = callbacks or {}
    data = undefined
    ajax = $.getJSON url
    ajax.complete ->

      try
        data = $.parseJSON ajax.responseText
      catch e
        options.error.call options.scope or null, e, ajax
        return
      options.success.call(options.scope or null, data, ajax)
      return

module.exports.getMousePosition = ($e) ->
  return unless $e.type is "click" or $e.type is "mousemove"

  x = $e.clientX
  y = $e.clientY
  normalized =
    "x": ( x / window.innerWidth )    * 2 - 1,
    "y": - ( y / window.innerHeight ) * 2 + 1

  return {x, y, normalized}

module.exports.EventEmitter = class EventEmitter

  constructor: () ->
    #

  events: {}

  on: (name, fn) ->
    @events[name] = fn
    return @

  off: (name) ->
    delete @events[name]
    return @

  get: (name) ->
    return @events[name]

  trigger: (name) ->
    fn = @get name
    return unless fn isnt undefined

    fn.call()

    return @








